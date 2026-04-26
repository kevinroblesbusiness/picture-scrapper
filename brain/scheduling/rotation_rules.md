# Rotation Rules

## Core Rules
1. Each setting ID can be used MAX ONCE per day across ALL models
2. Each model cannot repeat the same setting within 7 days
3. No two models post the same setting on the same day
4. Rotate content categories daily: going out → home → active (morning/afternoon/night)
5. Post schedule: morning = home/active | afternoon = active/going out | night = going out

## Daily Assignment Logic
- Pull today's date
- Check which settings each model has used in last 7 days
- Check which settings are already claimed today by other models
- Assign remaining available settings ensuring category variety
- If pool runs low — expand settings_pool.md before assigning

## Scaling Guide
| Models | Posts/Day | Unique Settings Needed/Day | Pool Size Needed |
|--------|-----------|---------------------------|-----------------|
| 3 | 9 | 9 | 20+ |
| 10 | 30 | 30 | 60+ |
| 20 | 60 | 60 | 120+ |
| 50 | 150 | 150 | 300+ |

## When Adding New Models
1. Create model file in brain/models/[name].md using template
2. Create tracker file in brain/memory/tracker_[name].md
3. Add model to brain/scheduling/daily_schedule.md
4. Expand settings_pool.md if needed (add 3 new settings per new model)

## Category Balance Per Model Per Week
- Going out (night): 3x
- Going out (day/golden hour): 2x
- Home: 5x
- Active/gym: 3x
Total: ~13 posts/week per model (leaving buffer for approved-only saves)
