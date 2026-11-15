"""
AnnabanAI Startup Builder API
AI-generated implementation prompted by Jacob Wayne Kinnaird.

This is a serverless-friendly prototype. It returns a per-response integrity hash,
not a persistent or independently verified audit ledger.
"""

from __future__ import annotations

import hashlib
import json
import os
import time
import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI, HTTPException
from openai import OpenAI
from pydantic import BaseModel, Field

APP_VERSION = "0.1.0"
MODEL = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")

DEFAULT_STARTUP_BRIEF = """
Develop a commercially practical first version of AnnabanAI, an AI governance
gateway for businesses using AI in operational or compliance-sensitive workflows.

Founder and project originator: Jacob Wayne Kinnaird.

Initial product concept:
- Route requests to configured AI model providers.
- Apply explicit schema and policy validation.
- Record request IDs, model identifiers, token usage, and provenance metadata.
- Produce tamper-evident audit metadata.
- Measure incremental cost, latency, and measurable customer value.
- Require human authorization before consequential external actions.

Produce a realistic startup brief, MVP scope, first 30-day plan, risks, customer
discovery plan, and measurable validation tests. Prefer the smallest useful
product and a credible route to paid customers. Distinguish facts, assumptions,
and recommendations. Do not invent customers, revenue, partnerships,
certifications, market validation, or completed tests.
""".strip()

GOVERNANCE_INSTRUCTIONS = """
You are the AnnabanAI startup development engine.
Return a practical, commercially grounded startup plan.
Separate known inputs, assumptions, and recommendations.
Never claim a test, deployment, partnership, customer, or validation occurred
unless the supplied evidence establishes it.
Keep Jacob Wayne Kinnaird's role as project originator distinct from AI-generated
content. Project attribution does not by itself determine legal ownership.
Return a valid JSON object with these keys:
startup_name, executive_summary, target_customer, customer_problem,
value_proposition, mvp_features, 30_day_plan, validation_tests, risks,
pricing_hypotheses, next_three_actions, assumptions.
Use arrays for list fields. Make actions specific and testable.
""".strip()

app = FastAPI(
    title="AnnabanAI Startup Builder API",
    version=APP_VERSION,
    description=(
        "Generate a startup plan, model economics, and return a per-response "
        "provenance integrity hash. Generated plans are not independently verified."
    ),
)


class StartupBuildRequest(BaseModel):
    brief: str = Field(
        default=DEFAULT_STARTUP_BRIEF,
        min_length=1,
        max_length=20000,
        description="Optional startup brief. Omit it to use the built-in default.",
    )
    monthly_requests: int = Field(default=100_000, ge=0, le=100_000_000)
    input_tokens_per_request: int = Field(default=2_000, ge=0, le=10_000_000)
    output_tokens_per_request: int = Field(default=500, ge=0, le=10_000_000)
    baseline_cost_per_1000_usd: float = Field(default=0.0, ge=0)
    governance_cost_per_1000_usd: float = Field(default=0.0, ge=0)
    estimated_monthly_savings_usd: float = Field(default=0.0, ge=0)


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def canonical_json(value: Any) -> str:
    return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def calculate_economics(
    request: StartupBuildRequest,
    actual_input_tokens: int,
    actual_output_tokens: int,
) -> dict[str, Any]:
    input_rate = float(os.getenv("OPENAI_INPUT_USD_PER_MILLION", "0"))
    output_rate = float(os.getenv("OPENAI_OUTPUT_USD_PER_MILLION", "0"))
    rates_configured = input_rate > 0 or output_rate > 0

    estimated_api_cost = None
    if rates_configured:
        estimated_api_cost = round(
            (
                actual_input_tokens * input_rate
                + actual_output_tokens * output_rate
            )
            / 1_000_000,
            8,
        )

    baseline_monthly = (
        request.monthly_requests / 1000
    ) * request.baseline_cost_per_1000_usd
    governed_monthly = (
        request.monthly_requests / 1000
    ) * request.governance_cost_per_1000_usd
    incremental_cost = governed_monthly - baseline_monthly
    net_benefit = request.estimated_monthly_savings_usd - incremental_cost

    return {
        "currency": "USD",
        "monthly_request_volume": request.monthly_requests,
        "actual_generation_usage": {
            "input_tokens": actual_input_tokens,
            "output_tokens": actual_output_tokens,
        },
        "api_cost": {
            "input_usd_per_million_tokens": input_rate if rates_configured else None,
            "output_usd_per_million_tokens": output_rate if rates_configured else None,
            "estimated_generation_cost_usd": estimated_api_cost,
            "rates_configured": rates_configured,
            "note": (
                "Estimate based on configured token rates."
                if rates_configured
                else "Set OPENAI_INPUT_USD_PER_MILLION and "
                     "OPENAI_OUTPUT_USD_PER_MILLION to current verified rates. "
                     "Null means unknown, not free."
            ),
        },
        "scenario": {
            "baseline_cost_per_1000_requests_usd": request.baseline_cost_per_1000_usd,
            "governance_cost_per_1000_requests_usd": request.governance_cost_per_1000_usd,
            "baseline_monthly_cost_usd": round(baseline_monthly, 4),
            "governed_monthly_cost_usd": round(governed_monthly, 4),
            "incremental_governance_cost_usd": round(incremental_cost, 4),
            "estimated_monthly_savings_usd": request.estimated_monthly_savings_usd,
            "estimated_net_benefit_usd": round(net_benefit, 4),
            "break_even_under_supplied_assumptions": net_benefit >= 0,
            "note": "Scenario inputs are caller-supplied assumptions, not measured savings.",
        },
    }


def parse_plan(output_text: str) -> tuple[dict[str, Any] | None, str | None]:
    cleaned = output_text.strip()
    fence = chr(96) * 3
    if cleaned.startswith(fence):
        lines = cleaned.splitlines()
        if lines and lines[0].startswith(fence):
            lines = lines[1:]
        if lines and lines[-1].startswith(fence):
            lines = lines[:-1]
        cleaned = "\n".join(lines).strip()
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].lstrip()
    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, dict):
            return parsed, None
        return None, "Model output JSON was not an object."
    except json.JSONDecodeError:
        return None, "Model output was not valid JSON; raw text is returned instead."


@app.get("/")
def root() -> dict[str, Any]:
    return {
        "service": "AnnabanAI Startup Builder API",
        "version": APP_VERSION,
        "health": "/health",
        "defaults": "/defaults",
        "build": "POST /startup/build",
        "docs": "/docs",
    }


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ready",
        "service": "AnnabanAI Startup Builder API",
        "version": APP_VERSION,
        "model": MODEL,
        "openai_api_key_configured": bool(os.getenv("OPENAI_API_KEY")),
        "note": "Readiness is not proof that a live OpenAI request has succeeded.",
    }


@app.get("/defaults")
def defaults() -> dict[str, Any]:
    return {
        "default_brief": DEFAULT_STARTUP_BRIEF,
        "default_model": MODEL,
        "default_economics": {
            "monthly_requests": 100_000,
            "input_tokens_per_request": 2_000,
            "output_tokens_per_request": 500,
        },
    }


@app.post("/startup/build")
def build_startup(request: StartupBuildRequest) -> dict[str, Any]:
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(
            status_code=503,
            detail="OPENAI_API_KEY is not configured for this deployment.",
        )

    brief = request.brief.strip() or DEFAULT_STARTUP_BRIEF
    run_id = f"annaban-{uuid.uuid4().hex}"
    started = time.perf_counter()

    try:
        client = OpenAI()
        response = client.responses.create(
            model=MODEL,
            instructions=GOVERNANCE_INSTRUCTIONS,
            input=brief,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "OpenAI request failed. Check deployment configuration and server logs.",
                "run_id": run_id,
                "error_type": type(exc).__name__,
            },
        ) from exc

    elapsed_ms = round((time.perf_counter() - started) * 1000, 2)
    output_text = response.output_text
    plan, parse_warning = parse_plan(output_text)
    usage = getattr(response, "usage", None)
    input_tokens = int(getattr(usage, "input_tokens", 0) or 0)
    output_tokens = int(getattr(usage, "output_tokens", 0) or 0)

    economics = calculate_economics(request, input_tokens, output_tokens)
    event = {
        "event_id": run_id,
        "timestamp": utc_now(),
        "model": MODEL,
        "response_id": getattr(response, "id", None),
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "latency_ms": elapsed_ms,
        "plan_hash": sha256_text(canonical_json(plan)) if plan is not None else None,
        "output_hash": sha256_text(output_text),
        "economics_hash": sha256_text(canonical_json(economics)),
        "attribution": "AI-generated output prompted by Jacob Wayne Kinnaird",
        "status": "generated_draft_not_independently_verified",
    }
    record_hash = sha256_text(canonical_json(event))

    return {
        "status": "generated_draft_not_independently_verified",
        "metadata": {
            **event,
            "record_hash": record_hash,
            "latency_ms": elapsed_ms,
        },
        "startup_plan": plan,
        "output_text": output_text if plan is None else None,
        "parse_warning": parse_warning,
        "economics": economics,
        "audit_note": (
            "The returned SHA-256 digest fingerprints this response metadata. "
            "It is not a persistent append-only ledger; configure durable storage "
            "and independent verification before relying on audit retention."
        ),
    }
