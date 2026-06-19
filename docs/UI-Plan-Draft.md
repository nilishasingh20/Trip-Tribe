# UI Plan Draft

Goal: a UI that feels **energetic and travel-forward** for younger travelers, while staying **calm, scannable, and obvious for group decisions**.

## Design principles

| Principle | What it means for Trip Tribe |
|-----------|------------------------------|
| **Vibe, not clutter** | One strong accent color, soft backgrounds, plenty of whitespace. |
| **Status at a glance** | Pending / voting / locked readable in ~2 seconds (color + label + hint). |
| **Collaboration is visible** | Show who's in the trip, who added options, who voted. |
| **Mobile-first** | Cards stack, thumb-friendly taps, sticky actions. |
| **Progress feels rewarding** | Trip board shows decisions made (tiles locked). |

## Visual direction

- **Tone:** Friendly, optimistic, slightly playful — not corporate travel agency.
- **Primary:** Ocean teal (`ocean-600`) — travel, trust, modern.
- **Accent:** Coral (`coral-500`) for primary CTAs.
- **Neutrals:** Warm stone background, white cards, dark text.
- **Status:** Pending → rose ("Needs ideas"), Voting → amber ("Vote now"), Locked → sage ("Decided").

## Information architecture

```
Home (trips + create) → Trip board (6 tiles) → Tile detail (options + vote)
```

Future: trip header with members, invite link, activity strip.

## Screen plans

### Global shell
- Sticky top bar: logo + Trip Tribe, breadcrumbs on trip/tile pages.
- Soft page background (`stone-50`), content in `max-w-4xl`.

### Home
- Hero headline + value prop, primary CTA card, saved trips list (future).

### Trip board
- Trip header: name, member avatars, progress (N/6 decided).
- Tile grid: icon per tile, status badge, hint line (options count / decided title).

### Tile detail
- Clear header, icon votes, leading option badge, lock/finalize flow, locked celebration banner.

## Component system

- `Button`, `Card`, `Badge`, `PageHeader`, `Avatar`, `EmptyState`
- Centralize status in `lib/tile-status-ui.ts`

## Phased rollout

### Phase 1 — Foundation ✅ (in progress)
- Design tokens in Tailwind
- Global layout + header
- Shared UI components; refactor home + trip cards

### Phase 2 — Trip & tile polish
- Trip header polish, option cards, thumbs voting UI, toasts

### Phase 3 — Collaboration layer
- Avatars on votes, invite link UI, saved trips on home

### Phase 4 — Delight
- Micro-animations, hero gradient, optional dark mode

## Success checks

- New user understands 6 tiles in under 30 seconds?
- Mobile vote reflects immediately?
- Locked vs open obvious without reading paragraphs?
- Home feels fun; decision screens feel focused?
