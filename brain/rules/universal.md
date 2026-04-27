# Universal Rules

## Workflow — Every Batch
1. Run `python3 outfit_gen.py <character> <category>` — always first, no exceptions
2. Scan ALL sources before writing — run in parallel every time:
   - Google search using character's Pinterest terms (character files)
   - Reddit (r/Instagrammers, r/femalefashionadvice, LA photo spot threads)
   - Who What Wear / Refinery29 / Nylon — pose and location articles
   - Google Images — real photo descriptions from indexed content
   - Any other accessible source (Tumblr, Snapchat Spotlight, Lemon8 if accessible)
3. Extract from scans: specific real locations, poses, lighting, what's actually behind subjects in real shots
4. Mash together best elements from 3-5 real references — this location, that pose, this light
5. Write prompt recreating a real shot — never imagined from scratch

## Model Usage
- **Haiku** → file reads, git ops, running scripts, logging
- **Sonnet/Opus** → prompt generation, research, creative work, memory updates

---

## The Aesthetic
Gen Z LA creator. 18-25. Candid. In the moment. NOT posed, NOT a photoshoot, NOT a fashion ad. Hot girl caught on camera — mid-laugh, adjusting her hair, looking away, not performing.

Reference: Sophie Rain, Addison Rae, Charli D'Amelio — real, in-the-moment, sex appeal without trying.

**Every prompt must feel like someone just caught the shot.** Candid language only: mid-laugh, looking to the side, caught off guard, adjusting her top, glancing down, turning when called.

---

## Backgrounds
Full list in `brain/scheduling/settings_pool.md` — 78 settings with IDs. Use scheduler.py to assign.

**AI works best with:** single dominant element close to subject — one wall, one light source, one texture. Tight framing, no depth required.

**Always avoid:**
- Wide street scenes → AI generates generic suburban plaza
- Beverly Hills / luxury storefronts → reads 2019
- Lakes, parks, pools → goes CGI
- Multiple architectural elements in same shot

---

## Outfits
Managed by `outfit_gen.py` — slot-based randomizer with 7-day cooldowns. Always run it. Never pick outfits manually.

**Avoid:** elaborate/busy pieces | muted colors on Catalina | wide-leg trousers on Isabella

---

## Poses — Show the body, never a mannequin
**Works:** mirror selfie (phone up, hand on waist, slight arch) | looking back over shoulder | crouching one leg forward | hip pop hand in hair | mid-stride toward camera

**Avoid:** standing straight shoulders square | hands in pockets | arms crossed | anything that hides the waist

---

## Non-Negotiables
- Full body shot
- Full face of makeup
- White nail polish, all five toes visible
- Indoors → barefoot | outdoors → strappy heeled sandals
- End every prompt: "The photo appears to be captured with a smartphone"
- HEX values every prompt: skin tone (3-4) + hair (2-3) + outfit + background + lighting — missing = washed out
- Single code block, no blank lines inside — mobile copy friendly
- Max one reflective surface — mirror counts, never add wet floor + mirror together
- Must read clearly early 20s
- Save only on explicit approval
