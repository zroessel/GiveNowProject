# Charity photos

One banner photo per charity (filename matches the charity's `id` in
[`lib/charities.ts`](../../lib/charities.ts)):

- `steady-ground.jpg` — Steady Ground Housing Fund
- `baobab-relief.jpg` — Baobab Relief Fund
- `wellspring-water.jpg` — Wellspring Water Alliance
- `rootline-reforestation.jpg` — Rootline Reforestation Fund
- `chalkline-education.jpg` — Chalkline Education Fund

All free-license stock photos. `CauseCard` renders `charity.photo` when set
and falls back to the charity's icon otherwise, so a charity can drop back to
icon-only just by removing its `photo` field in `lib/charities.ts`.
