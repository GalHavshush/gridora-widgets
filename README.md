# Gridora Widgets

Community widgets for [Gridora](https://github.com/GalHavshush/gridora). Anything merged here shows up in the **Marketplace** section of Gridora's widget library.

Each widget is a small web page. Gridora runs it in a sandboxed iframe (no `allow-same-origin`), so it can't read the user's dashboard, storage or other widgets. It only gets its own settings and the current theme.

## Add a widget

1. Create `widgets/<id>/`. The folder name is the widget id: lowercase letters, digits and dashes. **Never rename it after release**, because it's stored in people's dashboards.
2. Add `manifest.json`:

   ```json
   {
     "id": "countdown",
     "name": "Countdown",
     "description": "Days left until a date that matters.",
     "version": "1.0.0",
     "entry": "index.html",
     "defaultSize": { "w": 3, "h": 2 },
     "minSize": { "w": 2, "h": 2 },
     "settings": [{ "key": "title", "label": "Title", "type": "text", "default": "Countdown" }]
   }
   ```

   `settings` uses the same schema as built-in widgets: `text`, `url`, `number`, `toggle`, `select` and `list`. Gridora renders the settings drawer for you.
3. Add `index.html` and include the client:

   ```html
   <script src="../../gridora.js"></script>
   <script>
     Gridora.onState(({ settings, size, isEditing, theme }) => render(settings))
     // Gridora.updateSettings({ count: 3 })  saves settings from inside the widget
     // Gridora.openSettings()                opens the settings drawer
   </script>
   ```

   Style with the theme variables `--fg`, `--muted`, `--subtle`, `--line`, `--accent` and `--font`. The page background stays transparent, so the card shows through.

See [`widgets/countdown`](widgets/countdown) for a complete example.

## Test locally

```bash
node scripts/build-catalog.mjs
npx serve -l 4000 --cors
```

Then either:

- in Gridora, open **Add widget → Install from a manifest URL** and enter `http://localhost:4000/widgets/<id>/manifest.json`, or
- run Gridora with `VITE_WIDGET_CATALOG_URL=http://localhost:4000/catalog.json npm run dev` to see the local catalog in the Marketplace.

## Review checklist

- Works at `minSize` and grows gracefully. The iframe is the widget's size, so `vw`/`vh`/`vmin` units work.
- Uses the theme variables, not hard-coded colors.
- Has an empty state that calls `Gridora.openSettings()`.
- No secrets, trackers or analytics. Network calls go only to what the widget needs.
- Links open in a new tab (`target="_blank" rel="noopener"`).
- Bumps `version` when behavior changes.

Merges to `main` are published to GitHub Pages, and `catalog.json` is generated during the deploy.
