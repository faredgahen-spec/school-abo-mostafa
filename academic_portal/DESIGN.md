---
name: Academic Portal
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444651'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#006398'
  on-secondary: '#ffffff'
  secondary-container: '#5bb8fe'
  on-secondary-container: '#00476e'
  tertiary: '#00311f'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a31'
  on-tertiary-container: '#27c38a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#cce5ff'
  secondary-fixed-dim: '#93ccff'
  on-secondary-fixed: '#001d31'
  on-secondary-fixed-variant: '#004b73'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-hero:
    fontFamily: Cairo
    fontSize: 3rem
    fontWeight: '800'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Cairo
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: '1.3'
  headline-lg-mobile:
    fontFamily: Cairo
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: '1.35'
  headline-md:
    fontFamily: Cairo
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Cairo
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.45'
  title-md:
    fontFamily: Tajawal
    fontSize: 1.125rem
    fontWeight: '700'
    lineHeight: '1.5'
  body-lg:
    fontFamily: Tajawal
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Tajawal
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.65'
  body-sm:
    fontFamily: Tajawal
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Tajawal
    fontSize: 0.875rem
    fontWeight: '700'
    lineHeight: '1.4'
  label-md:
    fontFamily: Tajawal
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Tajawal
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: '1.3'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, reliable, and approachable digital ecosystem for 'مدرسة أبو مصطفى الثانوية المشتركة' (Abu Mostafa Co-educational High School). It bridges traditional academic prestige with contemporary, frictionless ed-tech accessibility. Designed specifically for Egyptian secondary stage students (Thanawya Amma), teachers, administrators, and parents, the interface prioritizes clarity, trust, and academic rigor.

The aesthetic direction synthesizes **Modern Institutionalism** with clean **Card-based SaaS Architecture**:
- **Right-to-Left (RTL) Native Orientation:** Symmetrical layouts, directional flows, and data reading paths are strictly constructed for Arabic script dynamics.
- **Academic Authority:** Dense yet breathable information delivery, establishing confidence and clarity for high-stakes grade dissemination, official notices, and student behavioral reports.
- **Optimized Cognitive Load:** Clear visual demarcations between academic subjects, GPA trackers, letter grading tiers, and assessment timelines.

## Colors

The color architecture is built to reinforce institutional trust, clarity in evaluation, and visual distinction across dense score sheets.

- **Primary (`#1E3A8A` - Deep Navy Blue):** Represents institutional heritage, structure, and formal authority. Applied to primary navigational headers, page titles, active navigation states, and primary action buttons.
- **Secondary (`#0284C7` - Royal Teal / Sky Accent):** Denotes secondary actions, interactive focus indicators, informational notices, and active tabs. Supports `#0EA5E9` for high-visibility highlights and interactive hover transitions.
- **Tertiary (`#10B981` - Emerald Success):** Reserved for passing thresholds, honor roll honors, high GPA marks, verified status chips, and positive performance deltas.
- **Neutral Canvas (`#F8FAFC` - Off-White Canvas):** Reduces screen glare during extended revision sessions. Surfaces stack against it using pure white (`#FFFFFF`) container panels bounded by subtle hairline borders (`#E2E8F0`).
- **Semantic Signals:**
  - **Academic Alert / Remedial (`#EF4444`):** Indicates failing grades, urgent disciplinary remarks, or missing assignments.
  - **Academic Warning (`#F59E0B`):** Identifies borderline outcomes, upcoming payment deadlines, and pending examination clearances.

## Typography

The typography pairs **Cairo** for structural headlines with **Tajawal** for extended body prose, tabular marks, and operational labels. Both fonts provide balanced letterforms, authentic calligraphic stems, and open counters suited to Arabic diacritics and numerical data.

- **Cairo (Headlines & Institutional Titles):** Provides crisp architectural presence and high horizontal stabilization in Arabic display contexts. Used for school designations, student roll headers, and primary metric overviews.
- **Tajawal (Body & Operational Metrics):** Provides neutral, highly legible curves for long prose, teacher assessments, grade transcript lines, and dense tabular columns.
- **Numerals:** The system defaults to standard Eastern Arabic numerals (١, ٢, ٣) for official Egyptian Ministry formatting or standard Latin digits (1, 2, 3) based on system localization, maintaining strict tabular monospace alignments across grade tables.
- **Line Heights:** Arabic typography requires expanded vertical leading relative to Latin scripts to eliminate ascender and descender collisions (especially with tashkeel and hamzas).

## Layout & Spacing

The portal uses a fluid, bounded 12-column grid configured strictly for RTL flow. Reading order, sidebar anchoring, column collapse, and back-to-front navigation originate from the top-right.

- **Breakpoints & Layout:**
  - **Desktop (≥ 1024px):** Fixed navigation sidebar pinned to the right edge (280px width). Main working area adapts fluidly up to a max-width container of 1440px with `margin-desktop` and a 12-column grid (`gutter-desktop`).
  - **Tablet (768px - 1023px):** 8-column layout. Sidebar collapses to a persistent docked icon column or a drawer overlay initiated from the top-right corner.
  - **Mobile (< 768px):** 4-column layout. Full-width stacked cards with a bottom navigation bar for high-frequency views (Grades, Schedule, Profile, Notices).
- **RTL Flow Rules:**
  - Paddings, iconography alignments, and trailing controls mirror standard LTR coordinates: primary text originates right; trailing icons, chevrons, and status pills pin to the left.
  - Grade progress meters and linear distribution charts fill from right to left.

## Elevation & Depth

Visual hierarchy uses a refined, low-elevation strategy tailored for institutional software. It avoids heavy, distracting skeuomorphism in favor of clear boundary definitions and soft ambient depth.

- **Surface Levels:**
  - **Level 0 (Canvas):** Tone `#F8FAFC`. Houses background content grids and structural page rails.
  - **Level 1 (Card & Module Foundation):** Solid `#FFFFFF` fills bounded by a crisp 1px structural stroke in `#E2E8F0`. Depth is conveyed via a subtle downward ambient wash: `0 1px 3px rgba(30, 58, 138, 0.04), 0 1px 2px rgba(30, 58, 138, 0.02)`.
  - **Level 2 (Interactive Floating States & Dropdowns):** Used for subject filter popovers, contextual grade breakdown menus, and student search selectors. Shadow: `0 10px 15px -3px rgba(30, 58, 138, 0.08), 0 4px 6px -4px rgba(30, 58, 138, 0.04)`.
  - **Level 3 (Modal Dialogs & Confirmation Overlays):** Used for grade revision requests, administrative overrides, and parent notification dialogs. Backdrop blur of `4px` with a tinted `#0F172A` overlay at 40% opacity; card shadow: `0 20px 25px -5px rgba(30, 58, 138, 0.12), 0 8px 10px -6px rgba(30, 58, 138, 0.06)`.

## Shapes

The interface uses standard roundedness (`roundedness: 2`, where base components feature `0.5rem` / 8px radii) to provide an approachable, modern feel while preserving structural discipline.

- **Base Controls (`0.5rem` / 8px):** Applied to form inputs, search fields, buttons, and alert strips.
- **Containers & Cards (`rounded-lg` / `1rem` / 16px):** Applied to grade summary tiles, subject breakdown scorecards, and semester overview widgets.
- **Hero & Modal Surfaces (`rounded-xl` / `1.5rem` / 24px):** Applied to primary administrative summaries and modal window containers.
- **Pills & Status Identifiers (`9999px`):** Used for academic ranking chips, attendance percentages, and term badges.

## Components

### Buttons
- **Primary:** Background `#1E3A8A`, text `#FFFFFF`, font `Tajawal` 700. On hover, shifts to `#172554` with subtle shadow elevation.
- **Secondary / Action:** Background `#0284C7`, text `#FFFFFF`. Used for portal-level interactions like exporting report cards (PDF) or printing certificates.
- **Ghost / Subtle:** Border 1px solid `#E2E8F0`, background `#FFFFFF`, text `#1E3A8A`. Hover brings a tinted fill `#F1F5F9`.
- **RTL Icon Anchoring:** Leading icons sit to the right of the Arabic label; directional indicators (forward arrows) point leftwards.

### Badges & Academic Chips
- **High Honors / Pass:** Background `#ECFDF5`, border 1px solid `#A7F3D0`, text `#065F46`.
- **Satisfactory / Warning:** Background `#FFFBEB`, border 1px solid `#FDE68A`, text `#92400E`.
- **Remedial / Under Review:** Background `#FEF2F2`, border 1px solid `#FECACA`, text `#991B1B`.
- **Subject Categorization:** Neutral slate background `#F1F5F9`, text `#334155`.

### Grade Cards & Tables
- **Scorecards:** Encased in pure white `#FFFFFF` with 16px border-radius and 1px `#E2E8F0` frame. Header groups contain the subject title (e.g., اللغة العربية, الكيمياء), teacher name in `body-sm`, and letter grade pill positioned on the far-left edge.
- **Tabular Marks:** Data grids feature alternate row shading (`#FFFFFF` to `#F8FAFC`). Score columns enforce monospace numerical alignments with Arabic percentage glyphs.

### Inputs & Selectors
- **Form Controls:** 44px minimum touch target height. 1px border `#CBD5E1`, background `#FFFFFF`, text `#0F172A`. Active focus ring triggers a 2px outer aura in `#0284C7` at 20% opacity with border shifting to `#0284C7`.
- **Arabic Alignment:** Placeholders and entered values align directly flush to the right edge with 16px horizontal internal padding.

### Checkboxes & Radios
- Rounded indicators (4px for checkboxes, full circle for radios) using `#1E3A8A` as the active checked state, displaying crisp white checkmarks. Unchecked borders set to `#CBD5E1`.

### Specialized Portal Modules
- **Academic Standing Gauge:** A semi-circular or linear bar filling right-to-left tracking overall Thanawya Amma cumulative percentage.
- **Term Timeline Component:** Segmented tracker illustrating current mid-term evaluations, final seat numbers (رقم الجلوس), and examination schedules.