---
name: Velocity Split
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#4a4455'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#7b7487'
  outline-variant: '#ccc3d8'
  surface-tint: '#732ee4'
  primary: '#630ed4'
  on-primary: '#ffffff'
  primary-container: '#7c3aed'
  on-primary-container: '#ede0ff'
  inverse-primary: '#d2bbff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#6e4600'
  on-tertiary: '#ffffff'
  tertiary-container: '#8e5c00'
  on-tertiary-container: '#ffe1bd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bbff'
  on-primary-fixed: '#25005a'
  on-primary-fixed-variant: '#5a00c6'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#ffb955'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
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
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for a high-performance athletic booking environment. It balances the precision of fintech with the energy of sports culture. The visual language is **Corporate Modern** with a lean towards **Minimalism**, utilizing ample negative space and high-contrast typography to ensure split-second readability during active use. 

The aesthetic is "Athletic Premium"—avoiding clunky textures in favor of crisp edges, vibrant accents, and fluid transitions. It evokes a sense of fairness, speed, and reliability, ensuring users feel confident when managing financial transactions within a social, active context.

## Colors
The palette centers on a high-energy "Split Accent Purple" that signifies action and premium features. 

- **Primary (#7C3AED):** Used for main CTAs, active states, and progress indicators.
- **Success (#10B981):** Reserved for "Paid" statuses and successful transaction confirmations.
- **Pending (#F5A623):** Utilized for "Awaiting Payment" states and mid-flow warnings.
- **Surface Strategy:** In light mode, surfaces are pure white against a light gray foundation to create clear card-based containment. In dark mode, the depth is achieved through a subtle shift from `#121212` backgrounds to `#1E1E1E` elevated surfaces.

## Typography
The design system utilizes **Plus Jakarta Sans** exclusively to maintain a friendly yet geometric and modern appearance. 

- **Headlines:** Use heavy weights (Bold/ExtraBold) with slight negative letter-spacing to create a "locked-in" athletic feel.
- **Numerical Data:** For split amounts and currencies, use `headline-md` or `headline-sm` to ensure the financial data is the primary focal point of the screen.
- **Labels:** Use semibold weights for micro-copy and status tags to maintain legibility at small sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on mobile-first interaction, as users typically manage split payments on-site at the turf.

- **System:** 8px base grid.
- **Container:** Elements should be grouped in 16px (md) padded containers.
- **Rhythm:** Vertical stack spacing is primarily 12px or 16px to keep related group members (e.g., list of friends in a split) feeling connected but distinct.
- **Breakpoints:** 
  - Mobile: 4 columns, 16px margins.
  - Tablet/Desktop: 12 columns, max-width 1200px, 32px margins.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and extremely soft **Ambient Shadows**.

- **Level 0 (Base):** Background color (`#F3F4F6` or `#121212`).
- **Level 1 (Cards):** Surface color (`#FFFFFF` or `#1E1E1E`). No shadow in light mode; use a 1px subtle stroke (`#E5E7EB`) instead to maintain the "clean" aesthetic.
- **Level 2 (Interactive):** Elements like active input fields or floating action buttons use a soft, diffused shadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`.
- **Modals:** Use a Backdrop Blur (20px) to maintain context of the booking behind the payment screen.

## Shapes
In alignment with the "ROUND_SIXTEEN" requirement, the shape language is consistently soft and modern. 

- **Primary Containers:** 16px corner radius for cards and main UI blocks.
- **Interactive Elements:** Buttons and Input fields also inherit the 16px radius to create a unified, friendly silhouette.
- **Small Elements:** Chips and status tags use a 100px (Pill) radius to differentiate them from functional containers.

## Components

- **Buttons:** Large (56px height for mobile tap targets), 16px radius. Primary buttons use white text on `#7C3AED`. Secondary buttons use `#7C3AED` text on a subtle purple tint or transparent background.
- **Payment Chips:** Used for "Quick Split" amounts (e.g., "Equally", "By %, "Custom"). Use 16px radius, `body-sm` semibold text.
- **User List Items:** 64px height. Features a circular avatar (40px) on the left, name/amount in the center, and a status indicator (Checkbox or Paid/Pending tag) on the right.
- **Input Fields:** 1px border (`#D1D5DB`). On focus, the border transitions to 2px `#7C3AED` with a soft purple outer glow.
- **Status Tags:** Small badges with 10% opacity of the status color for the background and 100% opacity for the text (e.g., Success tag is Light Green bg with Dark Green text).
- **Progress Bar:** A slim 4px bar at the top of split payment screens showing "Amount Collected" vs "Total Due" using the Primary Purple color.