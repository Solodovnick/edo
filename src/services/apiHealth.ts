export type ApiDbStatus = "loading" | "online" | "offline";

export type HealthResponse =
  | { ok: true; database: string; db?: string; postgres?: string }
  | { ok: false; database: string; error?: string };

export async function fetchApiHealth(): Promise<{
  status: ApiDbStatus;
  body?: HealthResponse;
}> {
  try {
    const res = await fetch("/api/health");
    const body = (await res.json()) as HealthResponse;
    if (res.ok && body.ok) {
      return { status: "online", body };
    }
    return { status: "offline", body };
  } catch {
    return { status: "offline" };
  }
}
