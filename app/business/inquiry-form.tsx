"use client";

import { useState, type FormEvent } from "react";
import {
  LIMITS,
  ORG_TYPES,
  validateInquiry,
  type FieldError,
  type FieldErrors,
  type InquiryFields,
} from "@/lib/org-inquiry-fields";

const MESSAGES: Record<FieldError, string> = {
  required: "필수 항목을 입력해 주세요.",
  email: "이메일 형식을 확인해 주세요.",
};

const INPUT_CLASS =
  "rounded-xl border border-black/15 bg-white px-4 py-3 text-base outline-none focus:border-black aria-[invalid=true]:border-red-600";
const LABEL_CLASS = "text-sm font-medium text-black/80";

const EMPTY: InquiryFields = {
  orgName: "",
  orgType: "",
  contactName: "",
  email: "",
  purpose: "",
  consent: false,
};

type Props = { source: string; renderedAt: number };

export function InquiryForm({ source, renderedAt }: Props) {
  const [fields, setFields] = useState<InquiryFields>(EMPTY);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);

  function update<K extends keyof InquiryFields>(key: K, value: InquiryFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    setFailed(false);

    const nextErrors = validateInquiry(fields);
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      document.getElementById(`inquiry-${firstInvalid}`)?.focus();
      return;
    }

    setSending(true);
    try {
      const res = await fetch("/api/business-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, source, website, renderedAt }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: unknown } | null;
      if (res.ok && body?.ok === true) {
        setSent(true);
      } else {
        setFailed(true);
      }
    } catch {
      setFailed(true);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <p role="status" className="rounded-2xl bg-canvas px-6 py-8 text-center text-black/70">
        문의가 접수됐어요. 확인 후 이메일로 연락드릴게요.
      </p>
    );
  }

  function fieldError(key: keyof InquiryFields) {
    const error = errors[key];
    if (!error) return null;
    return (
      <p id={`inquiry-${key}-error`} className="text-sm text-red-600">
        {MESSAGES[error]}
      </p>
    );
  }

  function a11y(key: keyof InquiryFields) {
    return {
      id: `inquiry-${key}`,
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `inquiry-${key}-error` : undefined,
    };
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-orgName" className={LABEL_CLASS}>
          기관명 (필수)
        </label>
        <input
          {...a11y("orgName")}
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.orgName}
          value={fields.orgName}
          onChange={(e) => update("orgName", e.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError("orgName")}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-orgType" className={LABEL_CLASS}>
          기관 유형 (필수)
        </label>
        <select
          {...a11y("orgType")}
          value={fields.orgType}
          onChange={(e) => update("orgType", e.target.value)}
          className={INPUT_CLASS}
        >
          <option value="" disabled />
          {ORG_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        {fieldError("orgType")}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-contactName" className={LABEL_CLASS}>
          담당자 이름 (필수)
        </label>
        <input
          {...a11y("contactName")}
          type="text"
          autoComplete="name"
          maxLength={LIMITS.contactName}
          value={fields.contactName}
          onChange={(e) => update("contactName", e.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError("contactName")}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-email" className={LABEL_CLASS}>
          이메일 (필수)
        </label>
        <input
          {...a11y("email")}
          type="email"
          autoComplete="email"
          maxLength={LIMITS.email}
          value={fields.email}
          onChange={(e) => update("email", e.target.value)}
          className={INPUT_CLASS}
        />
        {fieldError("email")}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="inquiry-purpose" className={LABEL_CLASS}>
          어떻게 사용하고 싶으신가요? (선택)
        </label>
        <textarea
          {...a11y("purpose")}
          rows={5}
          maxLength={LIMITS.purpose}
          placeholder="대상, 예상 인원, 사용 목적 등을 자유롭게 적어 주세요."
          value={fields.purpose}
          onChange={(e) => update("purpose", e.target.value)}
          className={`${INPUT_CLASS} resize-y placeholder:text-black/35`}
        />
        {fieldError("purpose")}
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            {...a11y("consent")}
            type="checkbox"
            checked={fields.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="h-4 w-4 shrink-0 accent-black"
          />
          <span className="text-sm font-medium text-black/80">
            [필수] 개인정보 수집·이용에 동의합니다.
          </span>
        </label>
        <p className="pl-7 text-xs sm:text-sm text-black/55 leading-relaxed">
          수집 항목: 담당자 이름, 이메일 / 이용 목적: 기관 도입 문의 응대 / 보유 기간: 문의 처리 완료 후 1년
        </p>
        {errors.consent && (
          <p id="inquiry-consent-error" className="pl-7 text-sm text-red-600">
            {MESSAGES[errors.consent]}
          </p>
        )}
      </div>

      {failed && (
        <p role="alert" className="text-sm text-red-600">
          전송하지 못했어요. 잠시 후 다시 시도해 주세요.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition-opacity disabled:opacity-40"
      >
        {sending ? "보내는 중…" : "문의 보내기"}
      </button>
    </form>
  );
}
