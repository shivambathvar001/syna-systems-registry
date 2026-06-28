# Syna Systems Design System Spec

## Spacing Scale
- 4px grid base.
- `p-1`: 4px | `p-2`: 8px | `p-3`: 12px | `p-4`: 16px | `p-6`: 24px | `p-8`: 32px | `p-12`: 48px | `p-16`: 64px.
- Horizontal layout grids use standard 24px (`gap-6`) or 32px (`gap-8`) spacing.

## Border Radius
- Reusable components utilize uniform rounded layouts.
- Cards: `rounded-3xl (24px)` for landing cards | `rounded-2xl (16px)` for content containers.
- Inputs / Buttons: `rounded-xl (12px)` for form elements and action buttons.
- Badges / Tags: `rounded-full (9999px)` for status pills.

## Shadows & Gradients
- Panel Borders: `border border-slate-900` with clean backdrop blur.
- Ambient Shadow: `shadow-[0_4px_30px_rgba(0,0,0,0.4)]`.
- Cyan Glow: `shadow-[0_0_20px_rgba(34,211,238,0.08)]` (used on active elements).
- Gradients:
  - Slate Gradient: `from-slate-950 to-slate-900` (primary background canvas).
  - Indigo-Cyan Brand Glow: `from-indigo-500/10 to-cyan-500/10` border styling.

## Micro-Animations
- Transition Speeds: Standard transition duration is `200ms` with `cubic-bezier(0.4, 0, 0.2, 1)` curves.
- Hovers: Subtle button scales `hover:scale-[1.02]` with border color transition.
- Scroll Fade: Scroll-driven render shifts use Framer Motion `initial={{ opacity: 0 }}` with `animate={{ opacity: 1 }}`.

## Dark Mode & Accessibility
- Canvas background must resolve to `#020617` (Slate-950) with `#030712` (Slate-980) panel cards.
- WCAG AA Contrast: Main text must use `#e2e8f0` (Slate-200) ensuring >4.5:1 ratio against backgrounds.
- Focus Indicators: All interactive controls must define a clear `focus-visible:ring-2 focus-visible:ring-cyan-500` outline.
