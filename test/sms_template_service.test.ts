import assert from "node:assert/strict";
import { chooseTemplate, registerApprovedTemplate } from "../src/sms_template_service.js";

const approved = registerApprovedTemplate({
  tenantId: "tenant-a",
  name: "login-code",
  signature: "Studio",
  body: "Your code is {{code}}"
});

assert.equal(chooseTemplate([approved], "tenant-a", "login-code").signature, "Studio");
assert.throws(() => chooseTemplate([{ ...approved, status: "retired" }], "tenant-a", "login-code"));
console.log("template decision test passed");
