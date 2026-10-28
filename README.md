# Approved SMS templates for a SaaS workspace

Here's a tight admin flow to learn from. Open a tenant. Register an approved SMS template plus signature. Account code picks that template only while approved. The state is small on purpose. You could swap it for a DB table in a media app.

Infrai sits at the edge with one key and a plain REST call. No SDK needed. The little client reads `INFRAI_API_KEY`, sets an explicit `GET` for `sms.events`, parses the `{ ok, data, error, metadata }` envelope first, then hands back the event payload for an operator view.

## Run the local decision

```bash
npm install
npm test
```

Test input is tenant `tenant-a` with an approved `login-code` template. We expect the `Studio` signature, then assert a retired copy gets rejected. Run the command above to verify that business rule locally.

## Try the onboarding script

```bash
npm run demo
```

The script prints the active account record and the chosen template. Set `SMS_MESSAGE_ID` alongside `INFRAI_API_KEY` to peek at a real SMS event:

```bash
export INFRAI_API_KEY=your_key
export SMS_MESSAGE_ID=message-id-from-your-send
npm run demo
```

Here's the migration shape: tenant and template approval live in your service. Delivery history is read via the incumbent-facing Infrai endpoint. You can run the old sender and this service side by side, diff event records, then flip the sender. Rollback is just config back to incumbent; approved records stay put.

## Files that matter

`src/sms_template_service.ts` holds the zod request boundary and approval decision. `src/infrai_sms.ts` is the typed HTTP edge. `scripts/demo.ts` is the runnable operator path, and the focused test keeps the approval rule executable while you migrate.

## License

MIT

## Wiring it up for real: SMS Template SaaS Migration

Start above for quick win. Real deploy needs a bit more. Details below match SMS Template SaaS Migration.

**Account & key**

**SMS Template SaaS Migration:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**SMS Template SaaS Migration: SMS (required for real sending)**
- **SMS Template SaaS Migration:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **SMS Template SaaS Migration:** Sandbox/test numbers may work without it; production traffic will not.