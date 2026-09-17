# Design System

## Direction

A restrained engineering workbench: precise board geometry, literal status language, white surfaces, neutral structure, and honey-amber used only for active selection and workflow signals. The interface should feel inspected rather than decorated.

## Color

All authored colors use OKLCH.

- Background: `oklch(1 0 0)`
- Surface: `oklch(0.97 0.006 91)`
- Surface strong: `oklch(0.925 0.01 91)`
- Ink: `oklch(0.19 0.015 70)`
- Muted ink: `oklch(0.45 0.018 70)`
- Primary amber: `oklch(0.76 0.17 91)`
- Primary dark: `oklch(0.46 0.11 82)`
- Technical accent: `oklch(0.38 0.12 245)`
- Error: `oklch(0.52 0.19 28)`
- Success: `oklch(0.48 0.13 150)`

Use the restrained strategy. Amber and blue are state signals, not decoration. Filled mid-luminance controls use white text.

## Typography

Use one local system sans stack for performance and product familiarity: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`. Use a fixed rem scale: 0.75, 0.875, 1, 1.125, 1.5, and 2rem. Headings use 700; labels 650; body 400–500. Numeric cells use tabular figures.

## Spacing and Shape

Use a 4px-derived scale: 4, 8, 12, 16, 24, 32, 48, and 64px. Related controls group at 8–12px; major regions separate by 32–48px. Corners remain precise: 6px for cells and controls, 12px maximum for major panels. Touch targets are at least 44px.

## Components

- Sudoku cells are square, use strong box boundaries, visible focus, and text—not color alone—for invalid state.
- Buttons share one vocabulary: neutral outline for secondary actions, dark technical fill for primary actions, amber for active numeric selection only.
- Workflow evidence is presented as a compact ordered rail, not a dashboard of cards.
- Status feedback uses concise live-region copy.

## Motion

Only state motion is permitted: 150–200ms color, border, and small transform transitions. Respect `prefers-reduced-motion` and do not stage page-load animation.

## Responsive Layout

Use a single-column task flow on narrow screens. At wider widths, place the workflow explanation beside the game while keeping the board the visual and interaction anchor. The board scales to the available inline size without reducing touch targets below practical limits.
