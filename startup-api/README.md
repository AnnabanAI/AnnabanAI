# AnnabanAI Startup Builder API

AI-generated implementation prompted by Jacob Wayne Kinnaird.

## Endpoints

- `GET /` — service overview
- `GET /health` — readiness and configuration status
- `GET /defaults` — built-in startup brief and default economics assumptions
- `POST /startup/build` — generate a startup plan and calculate economic scenarios
- `GET /docs` — interactive OpenAPI documentation

## Local run

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export OPENAI_API_KEY="your-own-key"
uvicorn main:app --host 127.0.0.1 --port 8000
```

Then open http://127.0.0.1:8000/docs.

## Example request

Omit the brief to use the built-in startup prompt:

```bash
curl -X POST http://127.0.0.1:8000/startup/build \
  -H "Content-Type: application/json" \
  -H 'X-Annaban-API-Key: your-annaban-api-key' \\
  -d '{"monthly_requests":100000,"baseline_cost_per_1000_usd":0.50,"governance_cost_per_1000_usd":0.65,"estimated_monthly_savings_usd":250}'
```

## Deployment configuration

Set `OPENAI_API_KEY` and `ANNABAN_API_KEY` as secrets in the hosting provider's environment settings. Do not commit real keys. The POST endpoint requires the `X-Annaban-API-Key` header and returns 401 for a missing or invalid key; it returns 503 until both required keys are configured.
Set `OPENAI_MODEL` to a model enabled for the account. Set token price variables from the current official model pricing to enable the per-response estimate.

## Important limitations

- The generated plan is an AI-generated draft, not independently verified business advice.
- The SHA-256 digest fingerprints one response; it is not a persistent append-only audit ledger.
- Scenario savings and per-1,000-request costs are caller-supplied assumptions.
- No customer traction, revenue, partnerships, or deployments are implied by generated output.
