export const jod = (n: number | null | undefined) =>
  `${Number(n ?? 0).toFixed(2)} JOD`;

export const date = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—";

export const day = (s: string | null | undefined) =>
  s ? new Date(s).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "—";
