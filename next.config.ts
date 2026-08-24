import type { NextConfig } from "next";

const CANONICAL_ORIGIN = "https://malmijal.kr";
const DUPLICATE_HOSTS = [
  "www\\.malmijal\\.kr",
  "malmijal-web-v2\\.vercel\\.app",
] as const;

const ARCHIVED_REDIRECTS: { from: string; to: string }[] = [
  // → /blog/one-minute-self-introduction
  ...([
    "answer-too-long-habit",
    "interview-answer-how-to-7-ways",
    "interview-answer-memorization",
    "interview-answer-structure",
    "interview-answer-structure-5-templates",
    "interview-speaking-tangled",
    "interview-study-feedback-limits",
    "interview-stutter-recovery",
    "unexpected-interview-question",
    "one-minute-self-introduction-speech-5-steps",
  ].map((s) => ({ from: s, to: "/blog/one-minute-self-introduction" }))),
  // → /blog/how-to-speak-up-in-meetings
  ...([
    "meeting-speaking-6-ways",
    "meeting-three-sentence-answer",
  ].map((s) => ({ from: s, to: "/blog/how-to-speak-up-in-meetings" }))),
  // → /blog/how-to-speak-persuasively
  ...([
    "logical-speaking-5-ways",
    "presentation-how-to-8-ways",
  ].map((s) => ({ from: s, to: "/blog/how-to-speak-persuasively" }))),
  // → /blog/how-to-practice-speaking-alone
  ...([
    "filler-words-reduce",
    "fluency-vs-structure",
    "one-minute-speech-practice-6-ways",
    "presentation-fast-speaking",
    "presentation-script-reading",
    "sixty-second-speaking-practice",
    "speak-well-7-habits",
    "speaking-recording-practice",
  ].map((s) => ({ from: s, to: "/blog/how-to-practice-speaking-alone" }))),
  // re-pointed individual redirects
  { from: "ai-interview-prep-app", to: "/blog/speech-app-selection" },
  { from: "speech-pattern-not-score", to: "/blog/malmijal-index-methodology" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...DUPLICATE_HOSTS.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: `${CANONICAL_ORIGIN}/:path*`,
        permanent: true,
      })),
      ...ARCHIVED_REDIRECTS.map(({ from, to }) => ({
        source: `/blog/${from}`,
        destination: to,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
