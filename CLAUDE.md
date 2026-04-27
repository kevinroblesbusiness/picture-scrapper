# Hicks Field AI — Master Index

## Every Session
1. `brain/trends/current.md` — date check, update if needed
2. Character file for whoever we're generating for
3. `brain/rules/universal.md` — always

## Every Generation Batch
1. Run `python3 outfit_gen.py <character> <category>` — always, every time, don't ask Kevin
2. Search Pinterest for real photo inspiration before writing prompts — required, no exceptions
3. Base every prompt on real photo energy pulled from actual influencer content

## Brain
| File | Contents |
|------|----------|
| `brain/rules/universal.md` | Rules for every prompt |
| `brain/characters/leah.md` | Leah — vibe, works, flopped, approved |
| `brain/characters/catalina.md` | Catalina — vibe, works, flopped, approved |
| `brain/characters/isabella.md` | Isabella — vibe, works, flopped, approved |
| `brain/trends/current.md` | Current aesthetics — update daily |
| `brain/trends/settings.md` | Locations — proven + untested |
| `brain/trends/outfits.md` | Outfits by category |
| `brain/trends/makeup.md` | Makeup combos — proven + trending |
| `brain/trends/accessories.md` | Accessories, shoes, poses |
| `brain/memory/patterns.md` | Approved combos + noticed patterns |
| `brain/memory/insights.md` | Captured from conversation |
| `brain/memory/reminders.md` | Check-in triggers |
| `brain/memory/tracker_global.md` | Opening lines, closing words, time-of-day balance |
| `brain/memory/tracker_leah.md` | Leah — settings, outfits, jewelry, makeup, hair, poses used |
| `brain/memory/tracker_catalina.md` | Catalina — settings, outfits, jewelry, makeup, hair, poses used |
| `brain/memory/tracker_isabella.md` | Isabella — settings, outfits, jewelry, makeup, hair, poses used |
| `brain/scheduling/settings_pool.md` | All settings with IDs — master pool, scalable to 50 models |
| `brain/scheduling/rotation_rules.md` | Rules for rotating settings across models and days |
| `brain/scheduling/daily_schedule.md` | Today's setting assignments — update each session |
| `brain/models/registry.md` | All active models + template for adding new ones |
| `brain/memory/sessions/` | Per-session logs |
| `brain/ideas/unused_prompts.md` | Ready-to-use ideas per character |

## Project
- Nail polish brand | 3 pics/model/day (9 total) | post morning+afternoon+night
- Workflow: reference image → Hicks Field prompt → edit → generate
- Save to: `prompts/YYYY-MM-DD/raw/` and `prompts/YYYY-MM-DD/edited/`
- Only save on explicit approval
