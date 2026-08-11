# Charity photos

Drop one image per charity in this folder using these exact filenames (matches
each charity's `id` in [`lib/charities.ts`](../../lib/charities.ts)):

- `steady-ground.jpg` — Steady Ground Housing Fund
- `baobab-relief.jpg` — Baobab Relief Fund
- `wellspring-water.jpg` — Wellspring Water Alliance
- `rootline-reforestation.jpg` — Rootline Reforestation Fund
- `chalkline-education.jpg` — Chalkline Education Fund

**Format:** `.jpg`, roughly 3:2 or 4:3 landscape, at least 800px wide (the
banner is small, so it'll get downscaled — no need for huge files).

**A note on picking photos:** prefer a *scene* over people where you can (a
bowl of food, a well, a stack of books, a row of tents) rather than
photos of identifiable people — since these are fictional charities, a photo
of real people reads as implying they're connected to a cause that doesn't
exist, which a generic scene photo avoids entirely.

Once files are in here, tell me and I'll wire up `CauseCard` to show them
(with the current icon as a fallback if a file's missing).
