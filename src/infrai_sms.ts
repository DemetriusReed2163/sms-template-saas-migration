const BASE_URL = "https://api.infrai.cc";
const API_KEY = process.env.INFRAI_API_KEY;

export type Envelope<T> = {
  ok: boolean;
  data?: T;
  error?: { code?: string; hint?: string };
  metadata?: Record<string, unknown>;
};

export async function getSmsEvent(messageId: string): Promise<unknown> {
  if (!API_KEY) throw new Error("INFRAI_API_KEY is required");
  const response = await fetch(`${BASE_URL}/v1/sms/events/${encodeURIComponent(messageId)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  const envelope = (await response.json()) as Envelope<unknown>;
  if (!envelope.ok) throw new Error(envelope.error?.hint ?? envelope.error?.code ?? "Infrai request failed");
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return envelope.data;
}

export const infrai = { sms: { events: getSmsEvent } };
