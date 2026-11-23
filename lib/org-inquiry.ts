import "server-only";
import { normalizeSource, validateInquiry, type InquiryFields } from "./org-inquiry-fields";

const CONSENT_VERSION = "2026-11-14";
const MIN_FILL_MS = 3_000;

export type InquiryResult = { ok: true } | { ok: false; reason: "invalid" | "server" };

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

// Validates and stores a /business inquiry in public.org_inquiries via
// PostgREST. Spam (honeypot filled, or submitted too soon after render) is
// reported as success without inserting. The service role key never leaves
// this module.
export async function submitOrgInquiry(input: unknown): Promise<InquiryResult> {
  const data = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;

  if (str(data.website).trim() !== "") return { ok: true };

  // renderedAt is set by the server when /business renders, so there is no
  // client clock skew. A missing or future timestamp also counts as too fast.
  const renderedAt = typeof data.renderedAt === "number" ? data.renderedAt : NaN;
  const elapsed = Date.now() - renderedAt;
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return { ok: true };

  const fields: InquiryFields = {
    orgName: str(data.orgName),
    orgType: str(data.orgType),
    contactName: str(data.contactName),
    email: str(data.email),
    purpose: str(data.purpose),
    consent: data.consent === true,
  };
  if (Object.keys(validateInquiry(fields)).length > 0) {
    return { ok: false, reason: "invalid" };
  }

  const baseUrl = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!baseUrl || !key) {
    console.error("org-inquiry: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set");
    return { ok: false, reason: "server" };
  }

  const purpose = fields.purpose.trim();
  const row = {
    org_name: fields.orgName.trim(),
    org_type: fields.orgType,
    contact_name: fields.contactName.trim(),
    email: fields.email.trim(),
    purpose: purpose || null,
    source: normalizeSource(data.source),
    consent_version: CONSENT_VERSION,
    consented_at: new Date().toISOString(),
  };

  const headers: Record<string, string> = {
    apikey: key,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Legacy service_role keys are JWTs; the newer sb_secret_ keys must not be
  // sent as a bearer token.
  if (key.startsWith("eyJ")) headers.Authorization = `Bearer ${key}`;

  let res: Response;
  try {
    res = await fetch(`${baseUrl.replace(/\/+$/, "")}/rest/v1/org_inquiries`, {
      method: "POST",
      headers,
      body: JSON.stringify(row),
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("org-inquiry: insert request failed");
    return { ok: false, reason: "server" };
  }

  if (!res.ok) {
    // Log only the status and PostgREST error code; the message and details
    // can echo the submitted row.
    const body: unknown = await res.json().catch(() => null);
    const code =
      body && typeof body === "object" && typeof (body as { code?: unknown }).code === "string"
        ? (body as { code: string }).code
        : "unknown";
    console.error(`org-inquiry: insert failed (status ${res.status}, code ${code})`);
    return { ok: false, reason: "server" };
  }

  return { ok: true };
}
