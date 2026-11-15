# AnnabanOS API and SDK

**Project initiation:** Jacob Wayne Kinnaird  
**Implementation authorship:** ChatGPT-generated  
**Legal ownership:** not determined by this provenance statement.

## Components

- `annaban_startup_api.py`: FastAPI service with health/defaults, model-assisted startup planning, and a read-only Space Devs launch-data endpoint.
- `sdk/python/annabanos_client.py`: synchronous Python SDK.
- `sdk/README.md`: installation and usage.
- `tests/test_annaban_startup_api.py`: basic API contract tests.

## Run locally

```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\\Scripts\\activate
python -m pip install -r requirements.txt
export ANNABAN_API_KEY="replace-with-a-long-random-secret"
export OPENAI_API_KEY="configure-your-provider-key"
uvicorn annaban_startup_api:app --host 127.0.0.1 --port 8000
```

Then open `http://127.0.0.1:8000/docs`. Do not use placeholder secrets in production.

## Verify

```bash
curl -sS http://127.0.0.1:8000/health
curl -sS http://127.0.0.1:8000/defaults
curl -sS -H "X-Annaban-API-Key: $ANNABAN_API_KEY" \
  http://127.0.0.1:8000/v1/streams/status
```

The Space Devs endpoint is cached to reduce upstream requests. The NFL/Fox Sports overlay remains simulation-only: this implementation does not query an unverified Fox endpoint or claim a live broadcast feed. Health checks indicate process health only, not upstream availability.

## Environment variables

- `ANNABAN_API_KEY` — required to enable protected endpoints.
- `OPENAI_API_KEY` — required for `POST /startup/build`.
- `ANNABAN_CACHE_TTL_SECONDS` — optional cache lifetime, default 60 seconds.

All external data is read-only. No spacecraft control, broadcast control, or other external actuation is implemented.
