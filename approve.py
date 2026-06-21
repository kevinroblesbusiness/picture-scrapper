#!/usr/bin/env python3
"""
Approve a prompt and log everything in one command.

Usage:
  python3 approve.py <character> <setting_id> <rating> <short_description>

Example:
  python3 approve.py leah ON01 8 "gas station, halter crop, leather mini"
"""

import os
import sys
import json
import subprocess
from datetime import datetime

TODAY = datetime.now().strftime("%Y-%m-%d")
BASE = os.path.dirname(os.path.abspath(__file__))
PROMPTS_DIR = os.path.join(BASE, f"prompts/{TODAY}/edited")
TRACKER_DIR = os.path.join(BASE, "brain/memory")
HISTORY_FILE = os.path.join(BASE, "brain/scheduling/history.json")


def get_next_filename(character):
    os.makedirs(PROMPTS_DIR, exist_ok=True)
    existing = [f for f in os.listdir(PROMPTS_DIR) if f.startswith(character)]
    n = len(existing) + 1
    return os.path.join(PROMPTS_DIR, f"{character}_{n:02d}_approved.txt")


def read_clipboard():
    """Read prompt text from clipboard if available, else ask for stdin."""
    try:
        result = subprocess.run(["pbpaste"], capture_output=True, text=True)
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except FileNotFoundError:
        pass
    print("Paste the prompt text, then press Enter twice:")
    lines = []
    while True:
        line = input()
        if line == "" and lines and lines[-1] == "":
            break
        lines.append(line)
    return "\n".join(lines).strip()


def save_prompt_file(character, prompt_text):
    filepath = get_next_filename(character)
    with open(filepath, "w") as f:
        f.write(prompt_text + "\n")
    return filepath


def update_character_file(character, filepath, setting_id, rating, description):
    char_file = os.path.join(BASE, f"brain/characters/{character}.md")
    if not os.path.exists(char_file):
        print(f"⚠️  Character file not found: {char_file}")
        return
    fname = os.path.basename(filepath)
    entry = f" | {fname} — {setting_id} — {description} ({rating}/10)"
    with open(char_file, "r") as f:
        content = f.read()
    if "**Approved:**" in content:
        content = content.replace(
            "**Approved:**",
            f"**Approved:**{entry}",
            1
        )
    else:
        content += f"\n**Approved:**{entry}\n"
    with open(char_file, "w") as f:
        f.write(content)


def update_tracker(character, setting_id):
    tracker_file = os.path.join(TRACKER_DIR, f"tracker_{character}.md")
    if not os.path.exists(tracker_file):
        print(f"⚠️  Tracker file not found: {tracker_file}")
        return
    with open(tracker_file, "r") as f:
        content = f.read()
    if f"| ⬜ | {setting_id}" not in content:
        print(f"⚠️  Setting {setting_id} not found in tracker — skipping tracker update")
        return
    content = content.replace(f"| ⬜ | {setting_id}", f"| ✅ | {setting_id}")
    with open(tracker_file, "w") as f:
        f.write(content)


def update_history(character, setting_id):
    if not os.path.exists(HISTORY_FILE):
        return
    with open(HISTORY_FILE) as f:
        history = json.load(f)
    # Mark approved in history
    if TODAY in history and character in history[TODAY]:
        for slot, data in history[TODAY][character].items():
            if data.get("id") == setting_id:
                history[TODAY][character][slot]["approved"] = True
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


def git_commit(filepath, character, rating, description):
    fname = os.path.basename(filepath)
    msg = f"Save approved {character} prompt ({rating}/10)\n\n{description}\n\nhttps://claude.ai/code/session_01FrR5Hqoe44TXYTaaNVcHSC"
    subprocess.run(["git", "add", "-A"], cwd=BASE)
    subprocess.run(["git", "commit", "-m", msg], cwd=BASE)
    branch = subprocess.run(["git", "branch", "--show-current"], capture_output=True, text=True, cwd=BASE).stdout.strip()
    subprocess.run(["git", "push", "-u", "origin", branch], cwd=BASE)


def run():
    if len(sys.argv) < 5:
        print(__doc__)
        sys.exit(1)

    character = sys.argv[1].lower()
    setting_id = sys.argv[2].upper()
    rating = sys.argv[3]
    description = " ".join(sys.argv[4:])

    print(f"\nApproving prompt for {character.upper()} | {setting_id} | {rating}/10")
    print("Reading prompt from clipboard...")
    prompt_text = read_clipboard()

    if not prompt_text:
        print("❌ No prompt text found.")
        sys.exit(1)

    filepath = save_prompt_file(character, prompt_text)
    print(f"✅ Saved: {filepath}")

    update_character_file(character, filepath, setting_id, rating, description)
    print(f"✅ Character file updated")

    update_tracker(character, setting_id)
    print(f"✅ Tracker updated")

    update_history(character, setting_id)
    print(f"✅ History updated")

    git_commit(filepath, character, rating, description)
    print(f"✅ Committed and pushed\n")
    print(f"Done. {character.capitalize()} {setting_id} ({rating}/10) logged.\n")


if __name__ == "__main__":
    run()
