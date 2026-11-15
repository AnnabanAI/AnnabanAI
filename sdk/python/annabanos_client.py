"""Small synchronous client for the AnnabanOS API."""
from __future__ import annotations

from typing import Any

import httpx


class AnnabanOSError(RuntimeError):
    """Raised when the AnnabanOS API returns an error."""


class AnnabanOSClient:
    def __init__(self, base_url: str, api_key: str, *, timeout: float = 20.0) -> None:
        self.base_url = base_url.rstrip("/")
        self._client = httpx.Client(
            timeout=timeout,
            headers={"X-Annaban-API-Key": api_key},
        )

    def close(self) -> None:
        self._client.close()

    def __enter__(self) -> "AnnabanOSClient":
        return self

    def __exit__(self, exc_type: Any, exc: Any, tb: Any) -> None:
        self.close()

    def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        response = self._client.request(method, f"{self.base_url}{path}", **kwargs)
        if not response.is_success:
            raise AnnabanOSError(
                f"AnnabanOS API returned HTTP {response.status_code}: "
                f"{response.text[:300]}"
            )
        return response.json()

    def health(self) -> dict[str, Any]:
        """Check API process health; this does not probe external providers."""
        return self._request("GET", "/health")

    def defaults(self) -> dict[str, Any]:
        return self._request("GET", "/defaults")

    def build_startup_plan(
        self,
        goal: str = "Create a concise, practical startup execution plan for AnnabanOS.",
        *,
        context: dict[str, Any] | None = None,
        model: str = "gpt-4.1-mini",
    ) -> dict[str, Any]:
        return self._request(
            "POST",
            "/startup/build",
            json={"goal": goal, "context": context or {}, "model": model},
        )

    def check_space_stream(self) -> dict[str, Any]:
        return self._request("GET", "/v1/streams/space")

    def stream_status(self) -> dict[str, Any]:
        return self._request("GET", "/v1/streams/status")
