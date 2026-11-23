// Shared by the /business form (client) and lib/org-inquiry.ts (server), so
// both sides apply the same rules. The rules mirror the CHECK constraints on
// public.org_inquiries.

export const ORG_TYPES = [
  { value: "university", label: "대학교·대학 센터" },
  { value: "academy", label: "학원·교육기관" },
  { value: "company", label: "기업" },
  { value: "public", label: "공공기관" },
  { value: "other", label: "기타" },
] as const;

export type OrgType = (typeof ORG_TYPES)[number]["value"];

export const LIMITS = {
  orgName: 100,
  contactName: 50,
  email: 254,
  purpose: 2000,
  source: 100,
} as const;

// Same pattern as the DB check (case-insensitive there; it has no letters, so
// the flag makes no difference).
export const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const DEFAULT_SOURCE = "direct";

// Postgres char_length counts code points; JS .length counts UTF-16 units.
export function charLength(value: string): number {
  return [...value].length;
}

export function isOrgType(value: unknown): value is OrgType {
  return ORG_TYPES.some((t) => t.value === value);
}

export function normalizeSource(raw: unknown): string {
  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) return DEFAULT_SOURCE;
  return [...value].slice(0, LIMITS.source).join("");
}

export type InquiryFields = {
  orgName: string;
  orgType: string;
  contactName: string;
  email: string;
  purpose: string;
  consent: boolean;
};

export type FieldError = "required" | "email";
export type FieldErrors = Partial<Record<keyof InquiryFields, FieldError>>;

function requiredText(value: string, max: number): FieldError | null {
  const length = charLength(value.trim());
  return length < 1 || length > max ? "required" : null;
}

export function validateInquiry(fields: InquiryFields): FieldErrors {
  const errors: FieldErrors = {};

  const orgName = requiredText(fields.orgName, LIMITS.orgName);
  if (orgName) errors.orgName = orgName;

  if (!isOrgType(fields.orgType)) errors.orgType = "required";

  const contactName = requiredText(fields.contactName, LIMITS.contactName);
  if (contactName) errors.contactName = contactName;

  const email = fields.email.trim();
  if (!email) {
    errors.email = "required";
  } else if (charLength(email) > LIMITS.email || !EMAIL_PATTERN.test(email)) {
    errors.email = "email";
  }

  if (charLength(fields.purpose.trim()) > LIMITS.purpose) errors.purpose = "required";

  if (fields.consent !== true) errors.consent = "required";

  return errors;
}
