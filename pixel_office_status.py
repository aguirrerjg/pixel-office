"""
Shared status writer for Pixel Office.
Both bots import this to report agent state to the live dashboard.
Status file: ~/playgrounds/api/status.json
"""

import json
import os
import time
import threading

STATUS_FILE = os.path.expanduser("~/playgrounds/api/status.json")
_lock = threading.Lock()
_MAX_LOGS = 50
_MAX_ALERTS = 20


def _read_status() -> dict:
    try:
        with open(STATUS_FILE) as f:
            data = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        data = {}
    data.setdefault("miles", {})
    data.setdefault("pmo", {})
    data.setdefault("_health", {})
    data.setdefault("_logs", [])
    data.setdefault("_alerts", [])
    return data


def _write_status(data: dict):
    # Ensure keys exist
    data.setdefault("_health", {})
    data.setdefault("_logs", [])
    data.setdefault("_alerts", [])
    tmp = STATUS_FILE + ".tmp"
    with open(tmp, "w") as f:
        json.dump(data, f, ensure_ascii=False)
    os.replace(tmp, STATUS_FILE)
    os.chmod(STATUS_FILE, 0o644)


def set_agent_status(team: str, agent_id: str, state: str, activity: str = ""):
    """Update an agent's status. team='miles'|'pmo', state='idle'|'working'|'thinking'."""
    with _lock:
        data = _read_status()
        if team not in data:
            data[team] = {}
        data[team][agent_id] = {
            "state": state,
            "activity": activity,
            "since": time.strftime("%H:%M:%S"),
        }
        _write_status(data)


def set_team_idle(team: str, agents: list[str]):
    """Set all agents in a team to idle."""
    with _lock:
        data = _read_status()
        if team not in data:
            data[team] = {}
        now = time.strftime("%H:%M:%S")
        for agent_id in agents:
            data[team][agent_id] = {"state": "idle", "activity": "", "since": now}
        _write_status(data)


def set_bot_health(team: str, connected: bool, last_event_ts: float = None):
    """Update bot health status. Called from main loop / health check."""
    with _lock:
        data = _read_status()
        health = data["_health"].get(team, {})
        health["connected"] = connected
        health["last_check"] = time.strftime("%H:%M:%S")
        if connected and "uptime_since" not in health:
            health["uptime_since"] = time.strftime("%Y-%m-%dT%H:%M:%S")
        if not connected:
            health.pop("uptime_since", None)
        if last_event_ts:
            health["last_event"] = time.strftime("%H:%M:%S", time.localtime(last_event_ts))
        data["_health"][team] = health
        _write_status(data)


def add_log(team: str, level: str, msg: str):
    """Add a log entry. level='info'|'warn'|'error'."""
    with _lock:
        data = _read_status()
        data["_logs"].append({
            "ts": time.strftime("%H:%M:%S"),
            "team": team,
            "level": level,
            "msg": msg[:200],
        })
        data["_logs"] = data["_logs"][-_MAX_LOGS:]
        _write_status(data)


def add_alert(team: str, msg: str, level: str = "error"):
    """Add an alert (errors, crashes, reconnects)."""
    with _lock:
        data = _read_status()
        data["_alerts"].append({
            "ts": time.strftime("%H:%M:%S"),
            "date": time.strftime("%Y-%m-%d"),
            "team": team,
            "level": level,
            "msg": msg[:200],
        })
        data["_alerts"] = data["_alerts"][-_MAX_ALERTS:]
        _write_status(data)


def clear_alerts(team: str = None):
    """Clear alerts, optionally for a specific team."""
    with _lock:
        data = _read_status()
        if team:
            data["_alerts"] = [a for a in data["_alerts"] if a.get("team") != team]
        else:
            data["_alerts"] = []
        _write_status(data)
