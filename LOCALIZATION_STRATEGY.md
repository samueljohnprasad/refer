# App Store Localization Strategy & Free Keyword Multiplier

> Executed following the [appeeky/aso-skills](https://github.com/appeeky/aso-skills) localization workflow.  
> Target: Apple App Store Connect -> Localizations

---

## 1. The "Cross-Localization" Mechanism Explained

In the Apple App Store, **Apple indexes secondary languages in primary storefronts**:
- In the **United States (US) Storefront**, Apple indexes BOTH **English (U.S.)** and **Spanish (Mexico)** (`es-MX`).
- Because millions of US iPhone users have Spanish or multilingual device settings, Apple combines the keyword indexes of both languages for US searches!
- **The Free Keyword Multiplier:** By setting up Spanish (Mexico) in App Store Connect, you get an **additional 30 chars of Title, 30 chars of Subtitle, and 100 chars of Keywords** that index for US English App Store searches.
- You do **not** repeat words from English (US). Every character is used for *new* high-intent search terms (like `depression`, `meditation`, `sleep`, `gratitude`, `breathe`, `panic`, `adhd`).

---

## 2. Package 1: The US Keyword Multiplier (Paste into `Spanish (Mexico)`)

Use these English keywords in the `Spanish (Mexico)` localization tab. Apple's US search algorithm indexes them directly for US searches.

- **Title (25 / 30 chars):**
  ```text
  Happy: Meditation & Sleep
  ```
  *New words indexed in US:* `meditation`, `sleep`

- **Subtitle (25 / 30 chars):**
  ```text
  Overthinking & Panic Care
  ```
  *New words indexed in US:* `overthinking`, `panic`, `care`

- **Keyword Field (Exact 100 / 100 chars, zero duplicate words):**
  ```text
  depression,gratitude,breathe,counseling,zen,positivity,affirmation,planner,ptsd,adhd,focus,peace,joy
  ```

### Combined US Keyword Reach (English US + Spanish Mexico):
Across both listings, Happy now ranks for:
`happy`, `cbt`, `courses`, `journal`, `mood`, `tracker`, `life`, `insights`, `therapy`, `anxiety`, `relief`, `voice`, `reflection`, `habit`, `mindfulness`, `stress`, `selfcare`, `diary`, `wellness`, `mental`, `calm`, `meditation`, `sleep`, `overthinking`, `panic`, `care`, `depression`, `gratitude`, `breathe`, `counseling`, `zen`, `positivity`, `affirmation`, `planner`, `ptsd`, `adhd`, `focus`, `peace`, `joy`.

*39 total high-intent keywords indexed in the US store with zero character waste!*

---

## 3. Package 2: Native Spanish (For Mexico, Spain & Latin America)

If you prefer to capture native Spanish-speaking users across Mexico, Latin America, and Spain:

- **Title (28 / 30 chars):**
  ```text
  Happy: Diario TCC y Ansiedad
  ```
  *(CBT Journal & Anxiety)*

- **Subtitle (27 / 30 chars):**
  ```text
  Rastreador de Animo y Calma
  ```
  *(Mood Tracker & Calm)*

- **Keyword Field (92 / 100 chars):**
  ```text
  terapia,estres,mente,salud,dormir,depresion,habitos,respiracion,bienestar,panico,voz,emocion
  ```

- **Promotional Text (147 / 170 chars):**
  ```text
  Cursos interactivos de TCC, diario de voz y seguimiento de emociones para calmar la mente y reducir la ansiedad. Empieza tu bienestar diario hoy.
  ```

- **Short Description Hook:**
  ```text
  Supera la ansiedad, comprende tus pensamientos y construye resiliencia emocional con Happy: la app gamificada que hace que la terapia cognitivo-conductual (TCC) sea simple y motivadora como un juego.
  ```

---

## 4. Package 3: Tier 1 English Markets (UK, Canada, Australia)

Apple has dedicated storefronts for `en-GB`, `en-CA`, and `en-AU`. You can add them with one click:

| Storefront | Recommended Title | Recommended Subtitle | Notes |
|:---|:---|:---|:---|
| **English (UK)** | `Happy: CBT Courses & Journal` | `Mood Tracker & Life Insights` | Supports British English search terms (`behavioural`, `wellbeing`) |
| **English (Canada)**| `Happy: CBT Courses & Journal` | `Mood Tracker & Life Insights` | Captures Canada English search traffic |
| **English (Australia)**| `Happy: CBT Courses & Journal` | `Mood Tracker & Life Insights` | Captures Australia/NZ search traffic |

---

## 5. Step-by-Step Guide in App Store Connect

1. Go to **[App Store Connect](https://appstoreconnect.apple.com)** -> **Apps** -> **Happy**.
2. Go to **App Store** -> **Prepare for Submission** (or active version).
3. In the top-right corner of the version page, look for the **Language Dropdown** (currently shows `English (U.S.)`).
4. Click the dropdown and select **Add Language...** (or click the `+` icon).
5. Choose **Spanish (Mexico)** (for the US keyword multiplier) or **English (UK)**.
6. Paste the Title, Subtitle, Keywords, Description, and Promo text from Section 2 above.
7. Click **Save** in the top right.
