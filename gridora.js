// Gridora widget client. Add `<script src="../../gridora.js"></script>` to your widget page.
//
// Gridora runs your page in a sandboxed iframe and talks to it with postMessage:
//   Gridora.onState((state) => …)   state = { settings, size: { w, h }, isEditing, theme }
//   Gridora.updateSettings(patch)   shallow-merges into this widget's saved settings
//   Gridora.openSettings()          opens the settings drawer (handy for empty states)
//
// The theme is applied for you as CSS variables: --fg, --muted, --subtle, --line, --accent, --font.
;(() => {
  const listeners = []
  let state

  const style = document.createElement('style')
  style.textContent = `
    :root { color-scheme: normal; --fg: #fff; --muted: rgb(255 255 255 / .64); --subtle: rgb(255 255 255 / .09);
            --line: rgb(255 255 255 / .16); --accent: #ff7a6b; --font: system-ui, sans-serif; }
    html, body { margin: 0; height: 100%; background: transparent; color: var(--fg); font-family: var(--font); }
    *, *::before, *::after { box-sizing: border-box; }`
  document.head.prepend(style)

  window.addEventListener('message', (e) => {
    if (e.source !== window.parent || e.data?.type !== 'gridora:state') return
    state = e.data
    const root = document.documentElement.style
    for (const [key, value] of Object.entries(state.theme ?? {})) if (value) root.setProperty(`--${key}`, value)
    for (const listener of listeners) listener(state)
  })

  const send = (message) => window.parent.postMessage(message, '*')

  window.Gridora = {
    onState(listener) {
      listeners.push(listener)
      if (state) listener(state)
    },
    updateSettings: (patch) => send({ type: 'gridora:updateSettings', patch }),
    openSettings: () => send({ type: 'gridora:openSettings' }),
  }

  send({ type: 'gridora:ready' })
})()
