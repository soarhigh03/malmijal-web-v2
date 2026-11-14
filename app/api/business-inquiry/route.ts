import { submitOrgInquiry } from "@/lib/org-inquiry";

// The form payload is a few KB at most.
const MAX_BODY_BYTES = 20_000;

function reply(ok: boolean, status: number) {
  return Response.json({ ok }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return reply(false, 413);
    payload = JSON.parse(text);
  } catch {
    return reply(false, 400);
  }

  const result = await submitOrgInquiry(payload);
  if (result.ok) return reply(true, 200);
  return reply(false, result.reason === "invalid" ? 400 : 500);
}
