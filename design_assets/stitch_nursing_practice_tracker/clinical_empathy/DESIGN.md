---
name: Clinical Empathy
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3d4947'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d7a77'
  outline-variant: '#bcc9c6'
  surface-tint: '#006a61'
  primary: '#00685f'
  on-primary: '#ffffff'
  primary-container: '#008378'
  on-primary-container: '#f4fffc'
  inverse-primary: '#6bd8cb'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89f5e7'
  primary-fixed-dim: '#6bd8cb'
  on-primary-fixed: '#00201d'
  on-primary-fixed-variant: '#005049'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system targets nursing students, clinical preceptors, and vocational healthcare learners navigating high-stress clinical environments. The interface balances high-efficiency clinical utility with warm, reassuring empathy. The emotional tone must alleviate clinical anxiety, foster confidence, and present complex procedures clearly under hospital lighting conditions.

The visual style blends **Modern Clinical Precision** with **Warm Humanist Softness**:
- **Pristine surfaces**: Clean, sanitary off-white backgrounds that reduce visual noise without the harsh sterility of stark pure white.
- **Supportive clarity**: High-legibility status feedback and glanceable progress indicators, engineered for one-handed mobile interactions between clinical rounds.
- **Calm authority**: Balanced, rounded container architecture paired with crisp medical teals and purposeful tri-status state colors.

## Colors

The palette uses functional medical coding to anchor student progress and clinical certainty:

- **Primary (`#0D9488` - Deep Teal)**: Drives core navigational anchors, active tab icons, primary actions, and validated procedure steps. Evokes clinical competence, safety, and hygiene.
- **Secondary (`#10B981` - Mint Emerald)**: Dedicated status color for "Dominado" (Mastered). Conveys completed competencies, preceptor sign-offs, and verified milestones.
- **Tertiary (`#F59E0B` - Warm Amber)**: Dedicated status color for "En práctica" (In Progress). Delivers actionable attention for skills currently being practiced or awaiting preceptor counter-signature.
- **Neutral (`#64748B` - Slate Blue-Gray)**: Status color for "Por practicar" (Pending / Not Started), as well as supporting metadata, secondary icons, and structural divider lines.
- **Canvas & Surface System**:
  - `surface-canvas`: `#F8FAFC` (Cool Off-White background that prevents eye fatigue).
  - `surface-card`: `#FFFFFF` (Pure white containers creating visual contrast against the canvas).
  - `surface-subtle`: `#F1F5F9` (Subtle inset fills for search fields and inactive segments).
- **Text & Content**:
  - `text-primary`: `#0F172A` (Deep Slate for maximum contrast and clinical legibility).
  - `text-secondary`: `#475569` (Muted Slate for context, clinical notes, and timestamps).
  - `text-tertiary`: `#94A3B8` (Placeholder text, borders, and inactive states).

## Typography

The type system is powered entirely by **Plus Jakarta Sans**, chosen for its crisp geometric legibility, approachable warmth, and open counters that remain sharp on high-density mobile screens under variable hospital lighting.

- **Headlines (`headline-xl` to `headline-sm`)**: Used for procedure titles, competency modules, shift summaries, and category headers. Renders with tight, controlled line heights to maximize visible clinical content above the fold.
- **Body (`body-lg` to `body-sm`)**: Used for clinical instructions, observation notes, preceptor feedback, and protocol descriptions. High x-height ensures immediate recognition of medical terminology and dosage measurements.
- **Labels (`label-lg` to `label-sm`)**: Used for the status badge system ("Dominado", "En práctica", "Por practicar"), tab bars, metric numbers, and micro-actions. Letter spacing is kept neutral to prevent legibility breakdown in all-caps or small badge contexts.

## Layout & Spacing

This design system follows a strictly **mobile-first, single-column fluid layout** calibrated for rapid single-handed clinical use:

- **Mobile Canvas**: Outer page margin is fixed at `margin` (`1rem` / 16px). Cards, module headers, and list rows maintain standard 16px spacing from screen bounds to prevent accidental edge taps.
- **Component Rhythm**:
  - `space-xs` (4px): In-badge icon gaps, status dots, and indicator offsets.
  - `space-sm` (8px): Stacked label-to-input distance, pill chip padding, and compact procedure sub-steps.
  - `space-md` (16px): Internal card padding, standard vertical list separation, and input field heights.
  - `space-lg` (24px): Section divides between competency domains (e.g., "Farmacología" vs. "Vía Aérea").
  - `space-xl` (32px): Primary bottom-sheet offset and sticky action button clearing.
- **Responsive Adaptation**: On tablet views (e.g., bedside tablets, preceptor review screens), columns lock into a 2-column or 3-column structured grid with `1.5rem` gutters, preventing clinical checklists from over-stretching horizontally.

## Elevation & Depth

Visual hierarchy uses a refined combination of **tonal surface separation** and **ambient medical shadows**:

- **Level 0 (Canvas Base)**: `#F8FAFC`. Un-elevated base container where all non-interactive background rests.
- **Level 1 (Cards & Clinical Rows)**: `#FFFFFF` surface backed by a soft, diffused ambient drop shadow:
  - `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 4px 12px 0 rgba(15, 23, 42, 0.03);`
  - Subtle, low-contrast ghost border: `1px solid #E2E8F0`. This ensures clear container edges even on low-cost ward tablets or under direct fluorescent lighting.
- **Level 2 (Active Cards & Floating Menus)**: Applied when a procedure card is expanded or tapped:
  - `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 10px 20px -2px rgba(15, 23, 42, 0.05);`
- **Level 3 (Modal Sheets & Preceptor Signature Modals)**: Bottom sheets sliding up for clinical evaluations:
  - `box-shadow: 0 -4px 24px 0 rgba(15, 23, 42, 0.12);`
  - Paired with a backdrop scrim of `#0F172A` at 40% opacity.

## Shapes

The design system implements a **Rounded (Level 2)** shape standard to convey accessibility, safety, and modern software polish:

- **Containers & Procedure Cards**: `rounded-lg` (16px / 1rem). Softens large surface boundaries and avoids the clinical severity of sharp boxes.
- **Buttons & Input Fields**: `rounded-md` (10px - 12px). Provides clear tap affordances tailored to finger pads.
- **Status Badges & Category Chips**: Fully rounded pill shapes (`rounded-full` / 9999px). Instantly identifies tags and clinical badges as non-interactive status or filter tokens.
- **Bottom Sheets & Modal Modifiers**: `rounded-t-2xl` (24px) for fluid drawer transitions on mobile devices.

## Components

### 1. Status Badges (Core Identity Component)
Badges communicate clinical proficiency at a glance. Always styled as pills with a tinted container and matching high-contrast label:
- **Dominado (Mastered)**:
  - Container: `#ECFDF5` (Mint-50)
  - Text & Icon: `#047857` (Emerald-700)
  - Border: `1px solid #A7F3D0` (Emerald-200)
  - Content: Checked circle icon + text "Dominado".
- **En práctica (In Progress)**:
  - Container: `#FFFBEB` (Amber-50)
  - Text & Icon: `#B45309` (Amber-700)
  - Border: `1px solid #FDE68A` (Amber-200)
  - Content: Clock/pulse icon + text "En práctica".
- **Por practicar (Pending / To Practice)**:
  - Container: `#F1F5F9` (Slate-100)
  - Text & Icon: `#475569` (Slate-600)
  - Border: `1px solid #CBD5E1` (Slate-300)
  - Content: Dot or bookmark icon + text "Por practicar".

### 2. Buttons
- **Primary Button**: `#0D9488` fill, `#FFFFFF` text, `rounded-md`, 48px minimum touch height. Active state scales to 0.98 for tactile feedback.
- **Secondary / Outline Button**: Transparent fill, `1.5px solid #0D9488` border, `#0D9488` text.
- **Tertiary / Ghost Button**: Transparent fill, `#475569` text, used for dismissive actions or secondary navigation.
- **Clinical Quick-Log FAB**: Floating Action Button anchored at bottom-right (`#0D9488`, 56x56px, circular, elevated with Level 2 shadow, plus icon) to quickly log an observed or performed skill.

### 3. Procedure & Skill Cards
- Crisp `#FFFFFF` surface, `rounded-lg` corners, subtle Level 1 shadow, and a 1px border (`#E2E8F0`).
- Internal layout:
  - **Top Row**: Clinical category tag (e.g., "Venopunción") on the left; Status Badge ("Dominado" / "En práctica" / "Por practicar") pinned to the right.
  - **Middle Row**: Procedure Title (`headline-sm`, `#0F172A`) followed by a concise 1-line description (`body-md`, `#475569`).
  - **Bottom Row**: Progress bar (teal-filled track against `#E2E8F0`) showing required repetitions completed (e.g., "3/5 realizadas") alongside a small timestamp of the last logged session.

### 4. Interactive Lists & Checklists
- Each item uses an 8px vertical gap. Checklist items for clinical steps feature a minimum tap target of 44x44px.
- Checked items shift text to `text-secondary` with a soft strikethrough and change check icon color from `#CBD5E1` to `#0D9488`.

### 5. Input Fields
- Background: `#F8FAFC` (resting), transitions to `#FFFFFF` on focus.
- Border: `1.5px solid #CBD5E1`, transitioning to `#0D9488` with a 3px soft focus ring (`rgba(13, 148, 136, 0.15)`) on focus.
- Height: 48px to support reliable thumb input during ward shifts.

### 6. Preceptor Verification Pin / Signature Pad Card
- Inset container with `#F0FDFA` (Teal tint) background, dotted border `#5EEAD4`, containing an area for clinical mentor verification sign-off and registration number validation.