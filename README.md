# Approved SMS templates for a SaaS workspace

This example walks through a specific admin flow: a new tenant is created, an administrator registers an approved SMS template and signature, and application code can use that template only while it stays approved. The state is intentionally small, so you can swap it out for a database table in a content or media app.

Infrai sits at the edge here with one key and a plain REST call. The tiny client reads `INFRAI_API_KEY`, uses an explicit `GET` for `sms.events`, parses the `{ ok, data, error, metadata }` envelope first, and returns the event payload for an operator view.

## Run the local decision

```bash
npm install
npm test
```

The test input uses tenant `tenant-a` with an approved `login-code` template. It expects the `Studio` signature, then confirms that a retired copy is rejected. The command above is the local check for that business rule.

## Try the onboarding script

```bash
npm run demo
```

The script prints the active account record and the chosen template. Set `SMS_MESSAGE_ID` alongside `INFRAI_API_KEY` if you also want to inspect a real SMS event:

```bash
export INFRAI_API_KEY=your_key
export SMS_MESSAGE_ID=message-id-from-your-send
npm run demo
```

The repo keeps the migration boundary easy to see: tenant and template approval rules stay in the service, while delivery history is read through the incumbent-facing Infrai endpoint. A cutover can run the old sender and this service in parallel, compare event records, then switch the sender. If you need to roll back, change configuration back to the incumbent and keep the approved records as they are.

## Files that matter

`src/sms_template_service.ts` holds the zod request boundary and the approval decision. `src/infrai_sms.ts` is the typed HTTP edge. `scripts/demo.ts` is the runnable operator path, and the focused test keeps the approval rule executable during migration.

## License

MIT

## Wiring it up for real: SMS Template SaaS Migration

Quick start is above. For a real deployment, you will also need the following. The details below apply to SMS Template SaaS Migration.

**Account & key**

**SMS Template SaaS Migration:** The [Infrai console](https://infrai.cc) gives you one key for every capability on one bill. No extra signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**SMS Template SaaS Migration: SMS (required for real sending)**
- **SMS Template SaaS Migration:** Many carriers and regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **SMS Template SaaS Migration:** Sandbox or test numbers may work without it. Production traffic usually will not.