import { infrai } from "../src/infrai_sms.js";
import { onboardingRecord, registerApprovedTemplate, chooseTemplate } from "../src/sms_template_service.js";

const tenantId = process.env.DEMO_TENANT_ID ?? "creator-studio";
const adminEmail = process.env.DEMO_ADMIN_EMAIL ?? "admin@example.com";
const template = registerApprovedTemplate({
  tenantId,
  name: "account-welcome",
  signature: "Creator Studio",
  body: "Welcome {{name}}, your workspace is ready."
});
const account = onboardingRecord(tenantId, adminEmail);
const selected = chooseTemplate([template], tenantId, "account-welcome");
console.log({ account, selected });

const messageId = process.env.SMS_MESSAGE_ID;
if (messageId) console.log(await infrai.sms.events(messageId));
