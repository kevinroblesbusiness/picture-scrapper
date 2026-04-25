# Hicks Field AI — Prompt Generation Rules

## IMPORTANT: Read This Every Session
Before generating any prompt, scan this entire file. If the date under **Trend Research** does not match today's date, go to the sources listed and update the trends before generating anything.

---

## Characters

| Name | Description |
|------|-------------|
| Leah | young blonde Asian woman |
| Catalina | young Colombian Latina |
| Isabella | young black-haired Asian woman |

---

## Universal Rules (Apply to Every Prompt)

- **Full body shot** — always, no exceptions
- **Full face of makeup** — always specified in the prompt
- **White nail polish** — always on toes
- **5 toes visible on each foot** — specify "all five toes visible on each foot" to avoid AI errors
- **Footwear rule:**
  - Indoors / at home → **barefoot**
  - Outdoors / dressed up → **strappy heels, heeled sandals, or cute trendy sandals** (TikTok-style fluffy sandals, strappy flats, etc.)
- **Smartphone capture** — include "The photo appears to be captured with a smartphone" in every prompt
- **HEX VALUES** — always carry over from the raw prompt or generate a matching palette

---

## Workflow

1. User sends raw prompt from Hicks Field AI with a character name (Leah, Catalina, or Isabella)
2. Swap generic descriptor with the correct character description from the table above
3. Apply all universal rules
4. Fix footwear based on setting
5. Preserve everything else from the raw prompt
6. **Only save prompts the user approves** — never log unapproved outputs

---

## Prompt Generation (Original Prompts)

When generating an original prompt (not based on a reference image):
1. Check the Trend Research section below — update if outdated
2. Target age group: **18-25 (Gen Z)**
3. Aim for sex appeal appropriate for Instagram fashion/nail polish marketing
4. Apply all universal rules above
5. Include HEX VALUES that match the scene's color palette

---

## Trend Research
**Last Updated: 2026-04-25**
**Sources to check daily:**
- https://newengen.com/insights/instagram-trends/
- https://www.whowhatwear.com/fashion/trends/best-spring-microtrends-2026
- https://www.marieclaire.com/fashion/gen-z-fashion-trends-2026/
- https://www.printful.com/blog/gen-z-fashion
- https://aestheticbk.com/blogs/news/gen-z-fashion-trends

### Current Trends (April 2026) — Ages 18-25

**Outfits & Aesthetics**
- Y2K revival — low-rise light wash denim, spaghetti strap layering, pastel colorways
- Coquette — lace, bows, feminine details, soft colors
- Bootcut and slim-flare jeans replacing baggy fits
- Fitted satin or cut-out mini dresses for going-out looks
- Crop tops, ribbed tanks, halter tops showing midriff
- Low-rise leather or mini skirts
- Lace layered under blazers or denim jackets
- Chunky layered gold or silver jewelry, beaded necklaces
- Small vibrant or satin mini bags with chain straps
- Bug-eyed tinted sunglasses

**Settings & Locations**
- Late night gas stations (neon + fluorescent moody lighting — very trending)
- Rooftop bars at golden hour
- Pastel boutique storefronts
- Car hood / leaning against luxury cars
- Urban mural walls
- City sidewalks with strong natural light

**Photo Style**
- Smartphone captured, candid feel
- Moody, slightly underexposed with natural grain
- Lazy lean, one hand on hip, slight smize — confident poses
- Looking slightly off-camera or directly into lens with smoldering expression
- Raw and authentic over heavily edited

**Lighting**
- Golden hour warm glow
- Neon + fluorescent mix for night shots
- Bright natural spring daylight for daytime shots

---

## Approved Prompts Log
Approved prompts are saved in: `prompts/YYYY-MM-DD/edited/`
Raw inputs are saved in: `prompts/YYYY-MM-DD/raw/`
Only save after user confirms a prompt is good.

---

## Memory — Running Session Log
This section is updated continuously. Every session, read this first to pick up exactly where we left off.

### Project Context
- Business: nail polish brand using Hicks Field AI to generate model images
- Goal: 30 approved images per day
- Workflow: upload reference image → Hicks Field generates text prompt → we edit it → generate image
- Long-term goal: build a custom prompt generator trained on our input/output pairs

### What Works
- **Moody late night settings** hit hard — gas station neon/fluorescent mix was the first 8/10
- **Sex appeal sweet spot**: smoldering expression, fitted silhouette, skin showing at midriff — not overdone
- Specificity wins: "all five toes visible on each foot" prevents bad AI outputs
- "The photo appears to be captured with a smartphone" adds authenticity every time
- Targeting 18-25 Gen Z trends specifically outperforms generic fashion prompts

### What Flopped
- Generic rooftop/blazer combos felt too polished and safe — rated 5/10
- Overly editorial or high-fashion prompts don't match the brand's Instagram feel

### Approved Original Prompts (AI-Generated, Not From Reference)
| File | Character | Scene | Rating |
|------|-----------|-------|--------|
| leah_03_approved.txt | Leah | Late night gas station, black sports car, halter crop + leather mini skirt | 8/10 |

### Rules Added Over Time
- 2026-04-25: Added "full face of makeup" to all prompts
- 2026-04-25: Added "5 toes each foot" after AI was generating wrong toe counts
- 2026-04-25: Only save prompts user explicitly approves — never log on assumption

### Next Steps
- Keep building approved prompt library toward 30/day target
- After enough input/output pairs, build prompt generator using Claude API
- Each new day: update trend research before generating anything
