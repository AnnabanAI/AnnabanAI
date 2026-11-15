# AnnabanOS Python SDK

Project initiation: Jacob Wayne Kinnaird. Implementation authorship: ChatGPT-generated. This attribution does not determine legal ownership.

## Install

Install the repository dependencies:

```bash
python -m pip install -r requirements.txt
```

## Configure and use

Set `ANNABAN_API_URL` to the deployed API base URL and `ANNABAN_API_KEY` to the key configured by the API operator. Never commit real keys.

```python
import os
from annabanos_client import AnnabanOSClient

with AnnabanOSClient(
    os.environ["ANNABAN_API_URL"],
    os.environ["ANNABAN_API_KEY"],
) as client:
    print(client.health())
    print(client.defaults())
    print(client.check_space_stream())
    print(client.stream_status())
```

For startup-plan generation, the API deployment also needs `OPENAI_API_KEY` configured server-side:

```python
plan = client.build_startup_plan(
    goal="Create a first-customer plan for AnnabanOS",
    context={"budget_usd": 500, "mode": "advisory_only"},
)
print(plan["output"])
```

## Endpoints

- `GET /health` — process health only; does not probe external dependencies.
- `GET /defaults` — public API defaults and safety boundaries.
- `POST /startup/build` — authenticated model-assisted startup plan.
- `GET /v1/streams/space` — authenticated, cached read-only request to The Space Devs.
- `GET /v1/streams/status` — per-stream status; NFL overlay is explicitly simulation-only.

Authentication uses the `X-Annaban-API-Key` header for protected routes. The Space Devs stream is read-only. The API does not connect to spacecraft, control launch operations, or access a verified live Fox Sports feed.
