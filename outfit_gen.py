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
            "tops":       ["black halter crop", "black strapless corset", "black cut-out satin cami",
                           "black mesh crop top", "black spaghetti strap crop", "black lace bralette",
                           "black fitted bandeau", "black deep-v crop", "black sheer overlay crop",
                           "black corset top", "black lace-trim cami", "black baby tee",
                           "black fitted blazer open + black bralette", "black ribbed halter"],
            "bottoms":    ["black leather mini skirt", "black micro mini skirt", "black low-rise pants",
                           "black midi skirt with slit", "black biker shorts", "black wide-leg trousers",
                           "black low-rise denim mini", "black barrel-leg jeans", "black pleated micro mini",
                           "black satin bias-cut mini skirt", "black straight-leg trousers"],
            "accessories":["layered silver chains", "crystal drop earrings", "silver cuff bracelet",
                           "black mini bag", "silver body chain", "small silver hoops",
                           "silver chain belt", "chunky silver rings", "black crossbody micro bag"],
        },
        "home": {
            "tops":       ["black ribbed bralette", "black satin slip cami", "black oversized band tee",
                           "black lace crop top", "black fitted turtleneck crop", "black zip-up crop open",
                           "black sports bra", "black graphic tee", "black mesh long-sleeve crop",
                           "black lace bralette under sheer tee", "black velvet bra crop", "black fitted tank"],
            "bottoms":    ["black biker shorts", "black micro mini skirt", "black sleep shorts",
                           "black leggings", "black tiny shorts", "black satin shorts", "black cargo shorts"],
            "accessories":["silver rings", "thin silver chain", "none"],
        },
        "active": {
            "tops":       ["black sports bra", "black ribbed crop tank", "black fitted crop tee",
                           "black zip-up crop jacket open", "black racerback sports bra", "black mesh tank top"],
            "bottoms":    ["black biker shorts", "black high-waist leggings", "black athletic shorts",
                           "black seamless shorts", "black workout leggings with straps"],
            "accessories":["silver stud earrings", "thin silver chain", "none"],
        },
    },

    "catalina": {
        "going_out": {
            "tops":       ["white ruched off-shoulder top", "rust orange crop top", "lace tie-front crop top",
                           "strapless bandeau top", "white fitted spaghetti strap", "coral off-shoulder top",
                           "champagne satin cami", "ivory fitted crop", "crochet halter top (warm tone)",
                           "warm pink lace-trim cami", "satin halter blouse (ivory)", "warm ribbed fitted tank",
                           "coral baby tee", "warm cream sheer blouse", "orange zip-up crop hoodie"],
            "bottoms":    ["white micro mini skirt", "rust orange mini skirt", "cream bodycon mini skirt",
                           "terracotta fitted mini", "ivory midi skirt with slit", "white cotton mini",
                           "cream satin bias-cut mini skirt", "light wash low-rise denim mini",
                           "warm camel wide-leg trousers", "ivory pleated micro mini", "denim micro shorts"],
            "accessories":["gold hoop earrings", "pearl stud earrings", "gold pendant necklace",
                           "layered gold chains", "gold anklet", "gold chain belt", "pearl bracelet",
                           "woven mini bag (warm tone)", "gold ear cuff"],
        },
        "home": {
            "tops":       ["bright coral crop tee", "white fitted tank", "hot pink crop tee",
                           "orange oversized tee", "warm pink ribbed tank", "cream zip-up crop hoodie",
                           "white ribbed crop top", "warm fitted crop hoodie", "terracotta crop tee",
                           "coral lace bralette under mesh", "peach satin cami", "ivory long-sleeve fitted crop"],
            "bottoms":    ["white cotton shorts", "cream tiny shorts", "white biker shorts",
                           "ivory sleep shorts", "white micro mini", "coral shorts", "terracotta shorts"],
            "accessories":["gold studs", "pearl earrings", "thin gold chain", "none"],
        },
        "active": {
            "tops":       ["terracotta sports bra", "rust orange crop tank", "warm pink sports bra",
                           "coral fitted crop", "white tie-front sports top", "peachy sports bra", "cream racerback"],
            "bottoms":    ["terracotta biker shorts", "white high-waist shorts", "warm camel leggings",
                           "rust athletic shorts", "coral seamless shorts", "cream workout leggings"],
            "accessories":["gold hoop earrings", "thin gold chain", "none"],
        },
    },

    "isabella": {
        "going_out": {
            "tops":       ["black halter crop", "black off-shoulder fitted top", "black sheer crop + bralette",
                           "black fitted bandeau", "black spaghetti strap crop", "black cut-out crop",
                           "black graphic crop tee", "black zip-up crop open", "black mesh overlay crop",
                           "black corset top", "black lace-trim cami", "black baby tee (graphic)",
                           "black ribbed halter", "black sheer blouse + black bralette"],
            "bottoms":    ["black pleated mini skirt", "black leather mini skirt", "black micro mini skirt",
                           "black biker shorts", "black bodycon mini dress", "black midi skirt with slit",
                           "black low-rise denim mini", "black barrel-leg jeans", "black satin mini skirt",
                           "dark wash denim micro shorts", "black straight-leg trousers"],
            "accessories":["hot pink mini bag", "pink phone case + rings", "silver stacked rings",
                           "layered thin silver chains", "small silver hoops + pink lip gloss in hand",
                           "pink scrunchie on wrist + silver chain", "pink crossbody micro bag",
                           "silver chain belt + pink rings", "hot pink hair clip + silver hoops"],
        },
        "home": {
            "tops":       ["black oversized graphic tee", "black crop top", "black zip-up crop hoodie",
                           "black fitted crop tee", "black sports bra", "black satin cami",
                           "black ribbed crop tank", "black mesh long-sleeve crop", "black lace bodysuit",
                           "black velvet bra crop", "black fitted tank with pink trim"],
            "bottoms":    ["black biker shorts", "black sleep shorts", "black tiny shorts",
                           "black leggings", "black star-print micro shorts", "black cargo shorts", "black satin shorts"],
            "accessories":["pink phone case", "pink scrunchie", "silver rings", "none"],
        },
        "active": {
            "tops":       ["black sports bra", "black fitted crop tank", "black ribbed crop",
                           "black zip-up jacket open", "black racerback sports bra", "black mesh tank"],
            "bottoms":    ["black biker shorts", "black high-waist leggings", "black athletic shorts",
                           "black seamless shorts", "black workout leggings with straps"],
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
