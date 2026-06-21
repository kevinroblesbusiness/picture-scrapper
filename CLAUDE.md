# Hicks Field AI — Master Index

## Every Session
1. `brain/trends/current.md` — date check, update if needed
2. Character file for whoever we're generating for
3. `brain/rules/universal.md` — always

## Every Generation Batch
1. Run `python3 outfit_gen.py <character> <category>` — always first, never skip
2. Search Pinterest based on the character's specific vibe (search terms in each character file)
3. Pull 3-5 real photo references — extract setting, light, pose, mood
4. Write prompts that recreate real photo energy, not imagined scenes

## Brain
| File | Contents |
|------|----------|
| `brain/rules/universal.md` | Rules, workflow, non-negotiables |
| `brain/characters/leah.md` | Leah — vibe, works, flopped, Pinterest search, approved |
| `brain/characters/catalina.md` | Catalina — vibe, works, flopped, Pinterest search, approved |
| `brain/characters/isabella.md` | Isabella — vibe, works, flopped, Pinterest search, approved |
| `brain/scheduling/settings_pool.md` | All 78 settings with IDs |
| `brain/scheduling/history.json` | Settings usage history |
| `brain/scheduling/outfit_history.json` | Outfit usage + 7-day cooldowns |
| `brain/memory/patterns.md` | Approved combos + patterns |
| `brain/memory/insights.md` | Captured from conversation |

## Project
- Nail polish brand | 3 pics/model/day (9 total) | post morning + afternoon + night
- Workflow: outfit_gen → Pinterest research → Hicks Field prompt → edit → generate
- Save to: `prompts/YYYY-MM-DD/raw/` and `prompts/YYYY-MM-DD/edited/`
- Only save on explicit approval
