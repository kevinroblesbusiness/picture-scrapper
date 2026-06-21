#!/usr/bin/env python3
"""
Daily prompt scheduler — assigns settings to models with no repeats.
Run at the start of each session to get today's assignments.
"""

import json
import os
from datetime import datetime, timedelta

TODAY = datetime.now().strftime("%Y-%m-%d")
BASE = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE, "brain/scheduling/history.json")
SCHEDULE_FILE = os.path.join(BASE, "brain/scheduling/daily_schedule.md")

# ── Settings pool (ID → label) ──────────────────────────────────────────────
SETTINGS = {
    # Home - Bedroom
    "HB01": "Dark bedroom, charcoal walls, single dim lamp",
    "HB02": "Light bedroom, white walls, platform bed, cool LED",
    "HB03": "Bedroom, ring light setup, mirror selfie",
    "HB04": "Bedroom, purple/pink LED strips behind headboard",
    "HB05": "Bedroom, natural window light, morning",
    "HB06": "Bedroom, neon sign on wall",
    "HB07": "Bedroom, fairy lights strung on wall",
    "HB08": "Bedroom, floor mirror leaning against wall",
    "HB09": "Walk-in closet, hanging garments behind, single warm overhead spot",
    "HB10": "Hollywood-bulb vanity mirror, warm yellow bulb glow",
    "HB11": "Bed under crumpled white linen sheets, sun stripe through blinds",
    # Home - Bathroom
    "HTH01": "Black + white modern bathroom, frameless mirror, vanity light",
    "HTH02": "All-white bathroom, bright natural light",
    "HTH03": "Bathroom, steam/shower background blurred",
    "HTH04": "Double sink modern bathroom, marble countertop",
    "HTH05": "Pastel pink shower tile wall, frosted window light",
    # Home - Kitchen
    "HK01": "Matte black kitchen, under-cabinet LED, dark aesthetic",
    "HK02": "All-white kitchen, bright natural light",
    "HK03": "Modern kitchen, island counter, hanging pendant lights",
    "HK04": "Kitchen, large window, golden morning light",
    "HK05": "Walk-in pantry, organized acrylic-jar shelf wall, soft daylight",
    "HK06": "Kitchen sink at single window, subway tile, morning light",
    # Home - Living Room
    "HL01": "Dark living room, LED strips behind TV, night",
    "HL02": "Light minimalist living room, white sofa, natural day",
    "HL03": "Living room, floor-to-ceiling windows, city view",
    "HL04": "Living room, cozy rug, warm lamp light",
    # Active - Gym
    "AG01": "Gym mirror, fluorescent overhead, equipment blurred behind",
    "AG02": "Yoga mat, natural window light, morning",
    "AG03": "Gym, cable machines visible behind, dark aesthetic",
    "AG04": "Studio mirror, pilates vibe, clean white",
    "AG05": "Outdoor yoga mat, natural setting",
    "AG06": "Reformer Pilates machine close-up, springs and straps, neutral wall",
    "AG07": "Sauna cedar plank wall, warm amber low light",
    "AG08": "Cold plunge stainless tub edge, cool blue spa light, dark wall",
    "AG09": "Boxing ring corner, red corner pad, ropes, single industrial overhead",
    "AG10": "Spin studio bike, dark room, single saturated neon wash on wall",
    "AG11": "Locker room mirror, blue lockers as repeating background, fluorescent",
    # Going Out - Night
    "ON01": "Late night gas station, neon + fluorescent",
    "ON02": "Rooftop restaurant, Edison string lights, city skyline",
    "ON03": "Cobblestone alley, string lights, warm stone walls",
    "ON04": "Rain-slicked city crosswalk, neon reflections",
    "ON05": "City sidewalk at night, storefront windows glowing behind",
    "ON06": "Modern boutique hotel corridor, warm sconces",
    "ON07": "Rooftop bar, city lights below, dark sky",
    "ON08": "Candlelit restaurant exterior, lanterns, warm amber",
    "ON09": "Mall interior, bright store lights, corridor",
    "ON10": "Boba shop interior, warm pastel interior",
    "ON11": "Convenience store interior, fluorescent, bright",
    "ON12": "Parking structure, fluorescent, geometric concrete",
    "ON13": "Nightclub/lounge entrance, velvet rope, ambient glow",
    "ON14": "Photobooth interior, magenta tube lighting, velvet curtain backdrop",
    "ON15": "Omakase sushi counter, single warm pendant overhead, dark wood",
    "ON16": "Karaoke booth, velvet bench, TV screen glow, mirrored wall, disco ball",
    "ON17": "Dive bar bathroom, sticker-covered mirror, harsh single bulb, graffiti wall",
    "ON18": "Lounge interior, deep red velvet curtain wall, single red gel light",
    "ON19": "Warehouse rave, dense fog, single laser beam slicing through",
    "ON20": "Airport gate window seat at night, dark tarmac with runway light bokeh",
    "ON21": "Speakeasy tufted leather booth, single candle, dark wood paneling",
    "ON22": "Rooftop hot tub at night, heavy steam, distant city light bokeh",
    # Going Out - Day / Golden Hour
    "OD01": "European cobblestone alley, golden hour",
    "OD02": "Beach boardwalk, sunset",
    "OD03": "Spring flower market, natural daylight",
    "OD04": "Pastel boutique storefront, bright day",
    "OD05": "City sidewalk/crosswalk, strong natural light",
    "OD06": "Luxury hotel lobby, golden hour through tall windows",
    "OD07": "Rooftop pool, golden hour, turquoise water",
    "OD08": "Cafe window seat, morning light",
    "OD09": "Urban mural wall, bright daylight",
    "OD10": "Forest trail, dappled natural light",
    "OD11": "Car exterior, golden hour street",
    "OD12": "Convertible passenger seat, reclined, sky and wind-blown hair, leather interior",
    "OD13": "Drive-thru window, leaning out car, paper bag in hand, golden hour side light",
    "OD14": "Tennis court chain-link fence close-up, racket over shoulder, late afternoon light",
    "OD15": "Pickleball court, blue/green court paint, paddle in hand, hard top-down sun",
    "OD16": "Tall manicured green hedge wall, hard noon light",
    "OD17": "Pink/peach LA stucco wall, single palm-frond shadow",
    "OD18": "Farmers market produce stand, dense fruit/flower wall, dappled light",
    "OD19": "Coffee shop espresso bar, cup in hand, blurred barista equipment, single pendant",
}

# Post slots per model per day: morning / afternoon / night
POST_SLOTS = ["morning", "afternoon", "night"]

# Preferred category per slot (soft rule)
SLOT_CATEGORIES = {
    "morning":   ["HB", "HL", "HK", "HTH", "AG"],   # home / active
    "afternoon": ["AG", "OD", "ON"],                  # active / going out
    "night":     ["ON", "OD"],                          # going out
}

# Active models
MODELS = ["leah", "catalina", "isabella"]


def load_history():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE) as f:
            return json.load(f)
    return {}


def save_history(history):
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)
    with open(LOG_FILE, "w") as f:
        json.dump(history, f, indent=2)


def used_in_last_n_days(history, model, n=7):
    """Return setting IDs used by this model in the last n days."""
    cutoff = datetime.now() - timedelta(days=n)
    used = set()
    for date_str, assignments in history.items():
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue
        if date >= cutoff and model in assignments:
            for slot in assignments[model].values():
                used.add(slot["id"])
    return used


def used_today(history):
    """Return setting IDs already claimed today across all models."""
    today_data = history.get(TODAY, {})
    used = set()
    for model_slots in today_data.values():
        for slot in model_slots.values():
            used.add(slot["id"])
    return used


def preferred(setting_id, slot):
    prefixes = SLOT_CATEGORIES.get(slot, [])
    return any(setting_id.startswith(p) for p in prefixes)


def assign(model, slot, blocked_today, blocked_model):
    """Pick the best available setting for this model + slot."""
    candidates = [
        sid for sid in SETTINGS
        if sid not in blocked_today and sid not in blocked_model
    ]
    # prefer category match
    preferred_candidates = [s for s in candidates if preferred(s, slot)]
    pool = preferred_candidates if preferred_candidates else candidates
    return pool[0] if pool else None


def run():
    history = load_history()
    today_used = used_today(history)
    assignments = history.get(TODAY, {})

    print(f"\n{'='*55}")
    print(f"  DAILY SCHEDULE — {TODAY}")
    print(f"{'='*55}\n")

    for model in MODELS:
        if model not in assignments:
            assignments[model] = {}
        model_used_7d = used_in_last_n_days(history, model)

        for slot in POST_SLOTS:
            if slot in assignments[model]:
                sid = assignments[model][slot]["id"]
                print(f"  [{model.upper():10}] {slot:12} → {sid}: {SETTINGS[sid]} (already set)")
                continue

            sid = assign(model, slot, today_used, model_used_7d)
            if sid:
                assignments[model][slot] = {"id": sid, "label": SETTINGS[sid]}
                today_used.add(sid)
                model_used_7d.add(sid)
                print(f"  [{model.upper():10}] {slot:12} → {sid}: {SETTINGS[sid]}")
            else:
                print(f"  [{model.upper():10}] {slot:12} → ⚠️  NO AVAILABLE SETTING — expand pool")

    history[TODAY] = assignments
    save_history(history)
    write_schedule_md(assignments)
    print(f"\n✅ Schedule saved to history.json + daily_schedule.md\n")


def write_schedule_md(assignments):
    lines = [
        f"# Daily Schedule — {TODAY}\n",
        "| Model | Post | Setting ID | Setting | Status |",
        "|-------|------|-----------|---------|--------|",
    ]
    for model, slots in assignments.items():
        for slot, data in slots.items():
            lines.append(f"| {model.capitalize()} | {slot} | {data['id']} | {data['label']} | ⬜ pending |")

    lines += [
        "",
        "## Settings Claimed Today",
        ", ".join(data["id"] for slots in assignments.values() for data in slots.values()),
    ]
    with open(SCHEDULE_FILE, "w") as f:
        f.write("\n".join(lines))


if __name__ == "__main__":
    run()
