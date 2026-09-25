// Listing-analysis prompts configured exclusively for Original Fine Art listings on eBay.de (100% German).
// v3: Signiert is always "Ja" (every piece is hand-signed) — fixed default.
// Herstellungsjahr, Breite, Höhe and Größe are intentionally never generated;
// the seller fills these in manually in eBay after the draft is created.
// Also fixes the earlier hardcoded year, corrects Rahmung values, and adds
// an explicit output schema.

export const ITEM_PROFILES = ["art"] as const;

export type ItemProfile = (typeof ITEM_PROFILES)[number];

export function normalizeItemProfile(
  _profile: string | null | undefined,
): ItemProfile {
  return "art";
}

// NOTE: with only one profile possible, this call is now a fixed round-trip —
// you can skip invoking it at all in your app code and just use "art"
// directly, saving one API call per batch. Left in place in case you add
// profiles back later.
export const PROFILE_ROUTER_PROMPT = `You are cataloging photos for an original fine art eBay listing.
The profile is strictly art. Return ONLY valid JSON:
{"profile": "art", "reason": "fine art item"}`;

export const PROFILE_PROMPT_ADDONS: Record<string, string> = {
  art: `\n\nPROFILE: FINE ART (GERMAN MARKETPLACE)
Analyze all photos for artist signatures, monograms, canvas backings, frame edges, brushwork, and palette knife impasto texture.
Determine:
1. Medium: Öl (Oil), Acryl (Acrylic), or Mischtechnik (Mixed Media).
2. Substrate: Leinwand auf Keilrahmen (Stretched Canvas), Malplatte / Canvas Board, Holzplatte (Wooden Panel), or Papier (Paper).
3. Framing & Edges: ready to hang / painted sides (Seiten bemalt / Hängefertig), requires frame (Rahmen erforderlich), or mat/passe-partout (Passepartout).
4. Signature: every artwork is hand-signed by the artist on front and/or back.
Target eBay.de Category 20125 ('Gemälde'). Do not invent artist details. Leave fields empty if no evidence exists.`,
};

export const ANALYSIS_PROMPT = `You are an expert art evaluator and listing creator for an independent artist selling original paintings on eBay.de.
Inspect the supplied photos of ONE physical artwork. All generated text (title, description, specifics) MUST BE 100% IN GERMAN.

--- TITEL-REGELN ---
Generate a concise, highly searchable German eBay title (MAXIMUM 80 CHARACTERS).
Formula: [Medium] [Stil] [Motiv/Thema] Original Gemälde [Maße/Untergrund]
Examples:
- "Ölgemälde Original Gemälde Stadt Lyon Impressionismus Leinwand 40x50 cm"
- "Acrylbild Original Gemälde Mohnblumen Impasto Spachteltechnik 30x40 cm"
- "Original Gemälde Seestück Landschaft Ölgemälde Malplatte 20x20 cm"
Dimensions are filled in manually by the seller after generation — never include cm measurements in the title, and omit that bracket from the formula. Leave substrate out of the title too if no clear evidence exists in the photos.

--- BESCHREIBUNGS-TEMPLATE ---
Generate the description field using the EXACT structure below. Fill in the dynamic bracketed fields [like this] based on your visual analysis of the photos. Do not leave placeholder brackets in the final text. Leave fields empty or omit optional bullet points if no evidence exists in the photos.

👨‍🎨 100% HANDGEMALTES KUNSTWERK. DIREKT AUS DEM ATELIER DES KÜNSTLERS!

[Write a vivid, SEO-optimized German paragraph, 3 to 5 sentences, in flowing evocative prose (not a bullet list). Base it ONLY on what is visible in the photos — do not invent a subject, object, scene, or setting that isn't shown. Cover, in this order: the motif/subject, the color palette (be specific — name the actual colors visible), the composition, the painting technique (e.g. Impasto, Spachteltechnik, sichtbare Pinselführung), and the mood/atmosphere the piece evokes. End with a short closing line in the spirit of "Ein ausdrucksstarkes Original-Kunstwerk direkt von der Staffelei." Example tone (translate the sensory, buyer-facing style, not this exact English wording): "This delicate yet expressive floral still life captures a graceful bouquet of wildflowers arranged in a sleek vase. Featuring soft white blossoms, gentle pink highlights, and slender stems of lavender, the floral composition blooms against an abstract pastel background of soft violet, teal, and gold. Painted with energetic impasto brushwork and subtle palette knife touches, the artwork radiates light, tranquility, and a poetic elegance."]

🎨 MEDIUM / TECHNIK:
[Include ONLY the single line that accurately describes the artwork]:
- Acryl auf Leinwand
- Öl auf Leinwand
- Acryl auf Holzplatte
- Öl auf Holzplatte
- Acryl auf Malplatte / Keilrahmenkarton
- Öl auf Malplatte / Keilrahmenkarton
- Mischtechnik auf Leinwand
- Mischtechnik auf Papier

⭐ EIGENSCHAFTEN:
- Hervorragender Zustand, 100% handgemaltes Unikat. Direkt von der Staffelei!
- Auf der Vorder- und/oder Rückseite handsigniert
[Include 1 to 2 bullet points that apply based on photos]:
- Galerie-Keilrahmen mit bemaltem Rand (kein zusätzlicher Rahmen erforderlich, fertig zum Aufhängen!)
- Fertig zum Aufhängen

📦 VERSAND:
- Ungerahmt
- Echtheitszertifikat liegt bei

📦➕📦 KOMBIVERSAND MÖGLICH!

Sie zahlen volles Porto für das 1. Bild. Für jedes weitere Bild im Paket nur 1,99 € Aufpreis!
Maximal 4 Bilder pro Paket (ab dem 5. Bild startet ein neues Paket).
Sie können bis zu 3 Tage ab dem ersten Auktionsgewinn sammeln, bevor alle Artikel zusammen bezahlt werden. Ich schicke Ihnen eine angepasste Rechnung in den Nachrichten!
(Hinweis für Sofort-Kaufen-Artikel: Zu viel gezahlte Versandkosten bei Mehrfachkäufen werden Ihnen umgehend erstattet.)

(Bitte beachten Sie: Alle Raumansichten / Mockups dienen lediglich der Veranschaulichung und sind nicht Teil des Kaufangebots.)

_____________

🔥 Möchten Sie ein individuelles, handgemaltes Wunschmotiv oder Auftragsgemälde anfragen? – Kontaktieren Sie mich gerne.

_____________

3 TAGE BEARBEITUNGSZEIT: Um die höchste Verpackungsqualität zu gewährleisten, werden alle Bestellungen innerhalb von maximal 3 Werktagen nach Zahlungseingang versendet.

STIL: Dieses einzigartige Originalkunstwerk wurde in einem gestischen, lockeren und impressionistischen Stil mit hochpigmentierten Farben geschaffen. Sichtbare Pinselstriche und Spachteltechniken verleihen dem Werk seine charakteristische Dynamik und Lebendigkeit.

Ich male alle meine Kunstwerke von Hand und garantiere Ihnen, dass Sie ein echtes Unikat erhalten, das es weltweit nur einmal gibt.

Ich habe dieses Kunstwerk persönlich geschaffen und hoffe, dass es Ihnen genauso viel Freude bereitet wie mir beim Malen.

Vielen Dank, dass Sie einen unabhängigen Künstler unterstützen!

_____________

💎 ÜBER DEN KÜNSTLER

Ion ist ein professioneller Künstler aus dem Rheinland, Deutschland.

Seine handgemalten Originalkunstwerke im impressionistischen und abstrakten Stil befinden sich in privaten Sammlungen weltweit.

Jedes Kunstwerk wird mit einem Echtheitszertifikat geliefert und ist ein einzigartiges Unikat.

Seine Gemälde zeichnen sich durch lebendige Farben und ausdrucksstarke Texturen aus, die durch dynamische Pinsel- und Spachteltechniken entstehen.

📌 FOLGEN SIE DIESEM SHOP für exklusive, hochwertige originale Kunstwerke!

--- END TEMPLATE ---

Broad category key MUST be set to 'art'.
category_hint should target 'Original Gemälde' or eBay Germany category 20125.

Dimensions (Breite, Höhe, Größe) and Herstellungsjahr are filled in manually by the seller after generation — never estimate or output them, even if a tape measure or ruler is visible in the photos.

Return search_terms: up to 8 short German search phrases (e.g., Ölgemälde, Acrylbild, Impressionismus, Spachteltechnik, Original Kunst, Wandbild, Unikat, Rheinland Künstler).

Return structured JSON. Specifics must be an array of {name, value, confidence}. confidence is 0-100. Fixed defaults below always get confidence 100. For dynamically extracted specifics, only include a field if confidence is 60 or higher; otherwise omit it entirely rather than guessing.

ALWAYS include the following exact German eBay Item Specifics with fixed defaults (confidence: 100):
- Künstler: "Ion Sheremet"
- Signiert: "Ja"
- Signiert von: "Ion Sheremet"
- Original/Lizenzierte Reproduktion: "Original"
- Herstellungszeitraum: "Ab 2020"
- Epoche: "Ultra Contemporary (2020 - Now)"
- Handgefertigt: "Ja"
- Rahmung: "Ungerahmt"
- Ursprungsland: "Deutschland"
- Herkunftsregion: "Deutschland"
- Produktart: "Gemälde"
- Verkaufseinheit: "Einzelwerk"
- Echtheitszertifikat: "Ja"
- Echtheitszertifikat ausgestellt von: "Ion Sheremet"

NEVER include these fields — the seller fills them in manually after generation, so omit them from the specifics array entirely even if visible in the photos:
- Herstellungsjahr
- Breite
- Höhe
- Größe

Extract DYNAMICALLY from photos and textures. Leave fields empty if no evidence exists:
- Motiv: (Select single best fit: e.g. "Stadtansicht", "Landschaft", "Seestück", "Blumen", "Mohnblumen", "Stillleben", "Porträt", "Tiere", "Abstract")
- Thema: (Select primary theme: e.g. "Kunst", "Städte & Reisen", "Natur", "Landschaften", "Garten", "Tiere")
- Herstellungsmethode: ("Ölgemälde", "Acrylgemälde" or "Mischtechnik")
- Material: ("Öl", "Acryl" or "Mischtechnik")
- Stil: ("Impressionismus", "Expressionismus", "Modern", "Abstrakt" or "Gegenstandslos")
- Besonderheiten: (Only if applicable, e.g. "100% Handgemalt | Impasto | Spachteltechnik | Galerie-Keilrahmen, Seiten bemalt")

Return ONLY valid JSON in exactly this shape, with no markdown fences and no commentary before or after it:
{
  "title": "string, <=80 chars, German",
  "description": "string, following the BESCHREIBUNGS-TEMPLATE above",
  "category": "art",
  "category_hint": "string, e.g. 'Original Gemälde' or eBay category 20125",
  "search_terms": ["string", "..."],
  "specifics": [
    {"name": "string", "value": "string", "confidence": 0}
  ]
}`;

export function buildProfiledAnalysisPrompt(profile: string): string {
  const addon = PROFILE_PROMPT_ADDONS.art;
  return ANALYSIS_PROMPT + addon;
}

// ── Sorting prompts ─────────────────────────────────────────────────────────

export function buildSortPrompt(
  nPhotos: number,
  labelStart: number,
  labelEnd: number,
  contextNote: string,
): string {
  return `You are organizing original artwork photos into separate eBay listings.

I will show you ${nPhotos} photos, numbered ${labelStart} through ${labelEnd}.${contextNote}

Your job: group these numbered photos by physical artwork piece. Each group = one eBay listing.

Rules:
- Photos of the SAME artwork go in the same group (full front view, signature close-up, brushwork/impasto detail, reverse side/hanging hardware, tape measure shot = same artwork)
- Each distinct painting or art piece = its own separate group
- Every numbered photo must go in exactly one group
- Use short descriptive folder names: subject + medium + style, all lowercase, hyphens only
  Examples: "stadtansicht-oel-gemaelde", "seestueck-acryl-landschaft", "mohnblumen-spachteltechnik"

Return ONLY valid JSON:
{
  "groups": [
    {"folder_name": "subject-medium-style", "photo_indices": [${labelStart}, ${labelStart + 1}]},
    {"folder_name": "subject-medium-style", "photo_indices": [${labelEnd}]}
  ]
}

No markdown. No explanation. JSON only.`;
}

export function buildVerifyGroupPrompt(n: number): string {
  return `Look carefully at these ${n} photos. They have been proposed as a single eBay artwork listing.

Do ALL of these photos show the SAME physical painting or artwork?
- Front view, close-ups of signatures, impasto/palette knife textures, reverse canvas side, and measurement shots of ONE painting → all the same item → valid
- A close-up view may show only a small section of paint texture or signature. Compare color palette, brushwork style, substrate, and frame across the full set; do not reject it merely because the entire painting is not visible.
- A completely different painting mixed in by mistake → invalid

If all photos are the SAME item:
{"valid": true}

If photos of DIFFERENT artworks are mixed together:
{"valid": false, "keep_indices": [1-based indices of the photos belonging to the MAIN artwork], "reason": "one sentence explanation"}

Return ONLY valid JSON. No markdown. No explanation.`;
}

export function buildVerifyMergePrompt(nA: number, nB: number): string {
  return `I have two groups of photos that were sorted as separate eBay listings.

Group A: ${nA} photo(s) shown first.
Group B: ${nB} photo(s) shown after.

Look carefully at ALL photos. Are ALL of them actually the SAME physical artwork piece that was accidentally split into two groups? (For example: full painting shot in Group A, signature detail and back of canvas in Group B.)

Same item — should be ONE listing:
{"merge": true}

Different items — keep as separate listings:
{"merge": false}

Return ONLY valid JSON. No markdown. No explanation.`;
}

export function slugifyFolderName(raw: string): string {
  const lowered = String(raw || "kunstwerk")
    .toLowerCase()
    .trim();
  const cleaned = lowered.replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  return cleaned.replace(/^-+|-+$/g, "") || "kunstwerk";
}
