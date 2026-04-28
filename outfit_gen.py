#!/usr/bin/env python3
"""
Slot-based outfit generator with 7-day cooldowns.
Picks top + bottom + accessory randomly per character, tracks usage.

Usage:
  python3 outfit_gen.py <character> <category>
  python3 outfit_gen.py leah going_out
  python3 outfit_gen.py catalina home
  python3 outfit_gen.py isabella going_out

Categories: going_out | home | active
"""

import json
import os
import random
import sys
from datetime import datetime, timedelta

TODAY = datetime.now().strftime("%Y-%m-%d")
BASE = os.path.dirname(os.path.abspath(__file__))
HISTORY_FILE = os.path.join(BASE, "brain/scheduling/outfit_history.json")

# ── Outfit pools per character per slot ─────────────────────────────────────

OUTFITS = {
    "leah": {
        "going_out": {
            "tops":       ["black halter crop", "black strapless corset", "black mesh crop top",
                           "black lace bralette", "black deep-v crop", "black asymmetric one-shoulder crop",
                           "black draped wrap knot crop", "black ruched tube crop top", "black peplum crop top",
                           "black lace-hem fitted cami", "black zip-front moto crop", "black square-neck satin crop"],
            "bottoms":    ["black leather mini skirt", "black micro mini skirt", "black low-rise pants",
                           "black midi skirt with slit", "black biker shorts", "black wide-leg trousers",
                           "black satin wrap mini skirt", "black drop-waist micro skirt",
                           "black pleated micro mini skirt", "black bodycon mini skirt slit",
                           "black lace-trim mini skirt"],
            "accessories":["layered silver chains", "crystal drop earrings", "silver cuff bracelet",
                           "black mini bag", "silver body chain", "small silver hoops",
                           "black micro shoulder bag", "silver chunky hoop earrings"],
        },
        "home": {
            "tops":       ["black ribbed bralette", "black satin slip cami", "black oversized band tee",
                           "black lace crop top", "black fitted turtleneck crop", "black zip-up crop open",
                           "black sports bra", "black graphic tee", "black cropped crewneck sweatshirt",
                           "black fitted ribbed tank", "black cropped long-sleeve fitted tee"],
            "bottoms":    ["black biker shorts", "black micro mini skirt", "black sleep shorts",
                           "black leggings", "black tiny shorts", "black satin mini shorts",
                           "black ribbed lounge short"],
            "accessories":["silver rings", "thin silver chain", "none"],
        },
        "active": {
            "tops":       ["black sports bra", "black ribbed crop tank", "black fitted crop tee",
                           "black zip-up crop jacket open", "black fitted racerback crop",
                           "black open-back sports bra", "black ribbed scoop-neck tank"],
            "bottoms":    ["black biker shorts", "black high-waist leggings", "black athletic shorts",
                           "black high-waist flare legging", "black seamless fitted short"],
            "accessories":["silver stud earrings", "thin silver chain", "none"],
        },
    },

    "catalina": {
        "going_out": {
            "tops":       ["white ruched off-shoulder top", "rust orange crop top", "lace tie-front crop top",
                           "strapless bandeau top", "white fitted spaghetti strap", "coral off-shoulder top",
                           "champagne satin cami", "ivory fitted crop", "hot pink asymmetric one-shoulder crop",
                           "coral draped wrap knot top", "ivory peplum fitted crop", "orange ruched tube crop",
                           "cream square-neck satin crop", "coral lace-trim fitted cami",
                           "hot pink mesh sheer crop top", "terracotta zip-front crop top",
                           "warm white draped cowl-neck crop"],
            "bottoms":    ["white micro mini skirt", "rust orange mini skirt", "cream bodycon mini skirt",
                           "terracotta fitted mini", "ivory midi skirt with slit", "white cotton mini",
                           "coral satin wrap mini skirt", "hot pink bodycon micro mini",
                           "ivory low-rise drop-waist skirt", "orange lace-trim mini skirt",
                           "cream satin midi skirt slit", "camel fitted mini skirt"],
            "accessories":["gold hoop earrings", "pearl stud earrings", "gold pendant necklace",
                           "layered gold chains", "gold anklet", "coral micro shoulder bag",
                           "warm white woven mini tote", "gold thin cuff bracelet stack"],
        },
        "home": {
            "tops":       ["bright coral crop tee", "white fitted tank", "hot pink crop tee",
                           "orange oversized tee", "warm pink ribbed tank", "cream zip-up crop hoodie",
                           "white ribbed crop top", "warm fitted crop hoodie",
                           "hot pink cropped crewneck sweatshirt", "coral zip-up crop hoodie",
                           "cream fitted ribbed tank", "ivory oversized cropped tee",
                           "orange cropped long-sleeve fitted tee"],
            "bottoms":    ["white cotton shorts", "cream tiny shorts", "white biker shorts",
                           "ivory sleep shorts", "white micro mini", "cream ribbed lounge short",
                           "ivory cotton tiny shorts", "coral satin mini shorts", "camel ribbed biker shorts"],
            "accessories":["gold studs", "pearl earrings", "thin gold chain", "none"],
        },
        "active": {
            "tops":       ["terracotta sports bra", "rust orange crop tank", "warm pink sports bra",
                           "coral fitted crop", "white tie-front sports top", "coral fitted racerback crop",
                           "hot pink open-back sports bra", "cream ribbed scoop-neck tank",
                           "orange fitted seamless sports bra"],
            "bottoms":    ["terracotta biker shorts", "white high-waist shorts", "warm camel leggings",
                           "rust athletic shorts", "coral high-waist flare legging",
                           "hot pink seamless fitted short", "cream ribbed bike short"],
            "accessories":["gold hoop earrings", "thin gold chain", "none"],
        },
    },

    "isabella": {
        "going_out": {
            "tops":       ["black halter crop", "black off-shoulder fitted top", "black sheer crop + bralette",
                           "black fitted bandeau", "black spaghetti strap crop", "black cut-out crop",
                           "black graphic crop tee", "black zip-up crop open",
                           "black asymmetric one-shoulder crop", "black draped wrap knot crop",
                           "black ruched tube crop top", "black peplum crop top",
                           "black sheer mesh corset crop", "black lace-trim fitted cami",
                           "black square-neck fitted crop", "black open-back tied crop"],
            "bottoms":    ["black pleated mini skirt", "black leather mini skirt", "black micro mini skirt",
                           "black biker shorts", "black bodycon mini dress", "black midi skirt with slit",
                           "black satin wrap mini skirt", "black drop-waist micro mini",
                           "black lace-trim mini skirt", "black asymmetric hem mini",
                           "black satin mini skirt fitted", "black pleated tennis mini"],
            "accessories":["hot pink mini bag", "pink phone case + rings", "silver stacked rings",
                           "layered thin silver chains", "small silver hoops + pink lip gloss in hand",
                           "pink scrunchie on wrist + silver chain", "pink micro crossbody bag",
                           "silver + pink charm layered necklace", "pink rhinestone hoop earrings"],
        },
        "home": {
            "tops":       ["black oversized graphic tee", "black crop top", "black zip-up crop hoodie",
                           "black fitted crop tee", "black sports bra", "black satin cami",
                           "black ribbed crop tank", "black cropped crewneck sweatshirt",
                           "black fitted ribbed tank", "black long-sleeve fitted crop"],
            "bottoms":    ["black biker shorts", "black sleep shorts", "black tiny shorts",
                           "black leggings", "black star-print micro shorts", "black satin mini shorts",
                           "black ribbed lounge short", "black seamless fitted shorts"],
            "accessories":["pink phone case", "pink scrunchie", "silver rings", "silver chunky chain bracelet", "none"],
        },
        "active": {
            "tops":       ["black sports bra", "black fitted crop tank", "black ribbed crop",
                           "black zip-up jacket open", "black open-back sports bra",
                           "black fitted racerback crop", "black ribbed scoop-neck tank",
                           "black seamless longline bra"],
            "bottoms":    ["black biker shorts", "black high-waist leggings", "black athletic shorts",
                           "black high-waist flare legging", "black seamless fitted short"],
            "accessories":["pink water bottle", "silver stud earrings", "none"],
        },
    },
}

# ── History helpers ──────────────────────────────────────────────────────────

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE) as f:
            return json.load(f)
    return {}


def save_history(history):
    os.makedirs(os.path.dirname(HISTORY_FILE), exist_ok=True)
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)


def used_in_last_n_days(history, character, slot, n=7):
    cutoff = datetime.now() - timedelta(days=n)
    used = set()
    for date_str, data in history.items():
        try:
            date = datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            continue
        if date >= cutoff and character in data:
            item = data[character].get(slot)
            if item:
                used.add(item)
    return used


# ── Core picker ─────────────────────────────────────────────────────────────

def pick(character, category):
    if character not in OUTFITS:
        print(f"❌ Unknown character: {character}")
        sys.exit(1)
    if category not in OUTFITS[character]:
        print(f"❌ Unknown category: {category}. Use: going_out | home | active")
        sys.exit(1)

    history = load_history()
    pools = OUTFITS[character][category]
    result = {}

    for slot, items in pools.items():
        on_cooldown = used_in_last_n_days(history, character, slot)
        available = [i for i in items if i not in on_cooldown]

        # If everything is on cooldown, reset and use full pool
        if not available:
            available = items
            print(f"  ⚠️  All {slot} on cooldown — resetting pool")

        result[slot] = random.choice(available)

    # Save to history
    if TODAY not in history:
        history[TODAY] = {}
    if character not in history[TODAY]:
        history[TODAY][character] = {}
    history[TODAY][character].update(result)
    save_history(history)

    return result


# ── Output ───────────────────────────────────────────────────────────────────

def run():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    character = sys.argv[1].lower()
    category = sys.argv[2].lower()

    outfit = pick(character, category)

    combo = f"{outfit['tops']} + {outfit['bottoms']}"
    if outfit.get("accessories") and outfit["accessories"] != "none":
        combo += f" + {outfit['accessories']}"

    print(f"\n🎲 {character.capitalize()} — {category}")
    print(f"   {combo}\n")

    # Ready to paste into prompt
    print("Copy:")
    print(f"  {combo}")


if __name__ == "__main__":
    run()
