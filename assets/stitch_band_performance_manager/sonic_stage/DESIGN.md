---
name: Sonic Stage
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbc9cf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859399'
  outline-variant: '#3c494e'
  surface-tint: '#4cd6ff'
  primary: '#a4e6ff'
  on-primary: '#003543'
  primary-container: '#00d1ff'
  on-primary-container: '#00566a'
  inverse-primary: '#00677f'
  secondary: '#ffb1c3'
  on-secondary: '#66002c'
  secondary-container: '#ff4b89'
  on-secondary-container: '#590026'
  tertiary: '#ffd59c'
  on-tertiary: '#442b00'
  tertiary-container: '#feb127'
  on-tertiary-container: '#6b4700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#b7eaff'
  primary-fixed-dim: '#4cd6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c3'
  on-secondary-fixed: '#3f0019'
  on-secondary-fixed-variant: '#8f0041'
  tertiary-fixed: '#ffddb1'
  tertiary-fixed-dim: '#ffba49'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 56px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1440px
---

## Brand & Style
The design system embodies the high-energy, immersive world of live music and digital performance. It targets an audience of creators, fans, and tech-savvy audiophiles who crave a sense of "being there." 

The style is a fusion of **Neon-Futurism** and **Minimalism**. It utilizes deep, dark surfaces to make vibrant, "glowing" accents feel more impactful. The aesthetic evokes the atmosphere of a darkened stadium or a premium recording studio, using sharp contrast and atmospheric depth to guide the user's attention toward content and interaction points.

## Colors
The palette is built on a foundation of "Midnight Black." The primary driver is **Electric Blue**, used for core actions, progress indicators, and primary branding elements. **Vivid Magenta** serves as the high-energy accent, reserved for secondary actions, notifications, and "live" status indicators. 

Neutral tones are strictly desaturated to maintain the purity of the neon accents. Backgrounds should use true black (#000000) to maximize OLED efficiency and contrast, while surfaces for cards and modals use a slightly lifted #0A0A0A.

## Typography
Montserrat provides a clean, geometric, and modern feel that scales well from massive hero headlines to small utility labels. 

- **Display & Headlines:** Use Bold or ExtraBold weights with tighter letter-spacing to create a sense of urgency and impact.
- **Body Text:** Use Regular weight with generous line height to ensure readability against the dark background.
- **Labels:** Small labels and captions should use Medium or SemiBold weights, often paired with uppercase styling for a technical, "instrument-panel" aesthetic.

## Layout & Spacing
The design system employs a **Fluid Grid** model with an 8px base unit. 

- **Desktop:** 12-column grid with 24px gutters. Margin scales from 48px upwards.
- **Tablet:** 8-column grid with 20px gutters. 32px margins.
- **Mobile:** 4-column grid with 16px gutters and 16px margins.

Spacing should be used to create clear groupings; use larger gaps (48px+) between distinct sections and tighter gaps (8px-16px) between related components like a title and its description.

## Elevation & Depth
In this dark-mode-first system, elevation is conveyed through **Tonal Layering** and **Subtle Glows** rather than traditional shadows.

1.  **Level 0 (Floor):** Pure black (#000000). Used for the main app canvas.
2.  **Level 1 (Card/Section):** Deep Charcoal (#0A0A0A). Used for primary containers.
3.  **Level 2 (Interaction):** Lighter Grey (#1A1A1A). Used for hover states or floating elements.

**Glow Effects:** Critical elements like active "Live" buttons or primary CTAs may use a soft outer glow (0px 0px 15px) utilizing the Primary or Secondary color at 20-30% opacity to simulate light emission.

## Shapes
The design system utilizes **Soft** geometry. This provides a professional and modern look without feeling overly "bubbly." 

- Small components (buttons, inputs): 0.25rem (4px).
- Medium components (cards, modals): 0.5rem (8px).
- Large components (hero sections, banners): 0.75rem (12px).

The tight corner radii maintain the technical, high-performance feel associated with music equipment and digital interfaces.

## Components

### Buttons
- **Primary:** Solid Electric Blue background with black text. High contrast for immediate visibility.
- **Secondary:** Transparent background with a 1px Electric Blue border. Blue text.
- **Tertiary/Ghost:** No background or border. Vivid Magenta text for high-energy calls to action (e.g., "Go Live").

### Input Fields
Darker than the surface (#050505) with a subtle 1px border (#1A1A1A). On focus, the border transitions to Electric Blue with a faint glow.

### Cards
Midnight Black (#0A0A0A) background. Use the Secondary (Magenta) color for small accents like "New" tags or "Live" badges.

### Chips & Tags
Small, 4px rounded rectangles. For categories, use a dark grey fill with white text. For status indicators (e.g., "Sale", "Streaming"), use a low-opacity Magenta fill with a Magenta text.

### Audio Visualizers (Special Component)
A custom component for this design system. Vertical bars using a gradient from Electric Blue at the base to Vivid Magenta at the peak, reflecting the high-energy brand personality.