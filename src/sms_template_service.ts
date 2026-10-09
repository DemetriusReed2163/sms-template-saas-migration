import { z } from "zod";

const templateSchema = z.object({
  tenantId: z.string().min(1),
  name: z.string().min(1),
  signature: z.string().min(1),
  body: z.string().min(1),
  status: z.enum(["pending", "approved", "retired"])
});

export type SmsTemplate = z.infer<typeof templateSchema>;

export function registerApprovedTemplate(input: Omit<SmsTemplate, "status">): SmsTemplate {
  return templateSchema.parse({ ...input, status: "approved" });
}

export function chooseTemplate(templates: SmsTemplate[], tenantId: string, name: string): SmsTemplate {
  const match = templates.find((template) =>
    template.tenantId === tenantId && template.name === name && template.status === "approved"
  );
  if (!match) throw new Error("No approved SMS template is available for this tenant");
  return match;
}

export function onboardingRecord(tenantId: string, adminEmail: string) {
  return { tenantId, adminEmail, accountState: "active" as const, createdAt: new Date().toISOString() };
}
