#!/usr/bin/env python3
"""
Generates a compact session brief so Claude reads 1 file instead of 7.
Run at the start of every session.

Usage: python3 session_brief.py [character]
"""

import os
import sys
import json
from datetime import datetime

TODAY = datetime.now().strftime("%Y-%m-%d")
BASE = os.path.dirname(os.path.abspath(__file__))
BRIEF_FILE = os.path.join(BASE, "brain/memory/session_brief.md")
HISTORY_FILE = os.path.join(BASE, "brain/scheduling/history.json")


def read(path):
    if os.path.exists(path):
        with open(path) as f:
            return f.read()
    return ""


def approved_count():
    count = {"leah": 0, "catalina": 0, "isabella": 0}
    edited = os.path.join(BASE, "prompts", TODAY, "edited")
    if not os.path.exists(edited):
        return count
    for f in os.listdir(edited):
        if "approved" in f:
            for char in count:
                if f.startswith(char):
                    count[char] += 1
    return count


def todays_schedule():
    if not os.path.exists(HISTORY_FILE):
        return "No schedule yet — run scheduler.py first."
    with open(HISTORY_FILE) as f:
        history = json.load(f)
    today = history.get(TODAY, {})
    if not today:
        return "No schedule for today — run scheduler.py first."
    lines = []
    for model, slots in today.items():
        for slot, data in slots.items():
            approved = "✅" if data.get("approved") else "⬜"
            lines.append(f"  {approved} {model.capitalize():10} {slot:12} {data['id']} — {data['label']}")
    return "\n".join(lines)


def trend_status():
    current = read(os.path.join(BASE, "brain/trends/current.md"))
    for line in current.splitlines():
        if "Last Updated" in line:
            if TODAY in line:
                return "✅ Trends up to date"
            else:
                return f"⚠️  TRENDS OUTDATED — update brain/trends/current.md before generating"
    return "⚠️  Could not verify trend date"


def character_summary(char):
    path = os.path.join(BASE, f"brain/characters/{char}.md")
    return read(path).strip()


def run():
    character = sys.argv[1].lower() if len(sys.argv) > 1 else None
    counts = approved_count()
    total = sum(counts.values())

    lines = [
        f"# Session Brief — {TODAY}",
        "",
        "## Status",
        f"- {trend_status()}",
        f"- Approved total: {total} | Leah: {counts['leah']} | Catalina: {counts['catalina']} | Isabella: {counts['isabella']}",
        f"- Goal: 9/day (3 per model)",
        "",
        "## Today's Schedule",
        todays_schedule(),
        "",
        "## Rules (always apply)",
        read(os.path.join(BASE, "brain/rules/universal.md")).strip(),
        "",
        "## Active Reminders",
        read(os.path.join(BASE, "brain/memory/reminders.md")).strip(),
    ]

    if character:
        lines += [
            "",
            f"## {character.capitalize()} — Character File",
            character_summary(character),
            "",
            f"## {character.capitalize()} — Tracker",
            read(os.path.join(BASE, f"brain/memory/tracker_{character}.md")).strip(),
        ]

    brief = "\n".join(lines)
    with open(BRIEF_FILE, "w") as f:
        f.write(brief)

    print(brief)
    print(f"\n✅ Brief saved to brain/memory/session_brief.md\n")


if __name__ == "__main__":
    run()
