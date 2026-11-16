try {
  const stored = localStorage.getItem('color-scheme')
  if (stored === 'light' || stored === 'dark') {
    const meta = document.querySelector('meta[name="color-scheme"]')
    if (meta) meta.content = stored
  }
} catch {
  // Ignora falhas de acesso ao localStorage (ex.: navegação restrita)
}
