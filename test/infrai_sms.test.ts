import assert from "node:assert/strict";
import { getSmsEvent } from "../src/infrai_sms.js";

const originalFetch = globalThis.fetch;
try {
  globalThis.fetch = async (_input, init) => {
    assert.equal(init?.method, "GET");
    return new Response(JSON.stringify({ ok: true, data: { status: "delivered" }, metadata: { requestId: "test" } }));
  };
  assert.deepEqual(await getSmsEvent("test-message"), { status: "delivered" });
} finally {
  globalThis.fetch = originalFetch;
}
