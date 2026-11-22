(function(){
  /* traduz o texto da página quando o idioma é inglês */
  const T = window.RB_T; if (window.RB_LANG !== 'en' || !T) return;
  const skip = new Set(['SCRIPT', 'STYLE', 'svg', 'SVG', 'CODE', 'KBD']);
  const walk = (node: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) { const t = node.nodeValue || ''; if (t.trim()) { const n = T(t); if (n !== t) node.nodeValue = n; } return; }
    if (!(node instanceof Element) || skip.has(node.nodeName) || node.classList.contains('term-out') || node.classList.contains('letters') || node.id === 'phrase') return;
    for (const a of ['aria-label', 'alt', 'title', 'data-file']) { const v = node.getAttribute(a); if (v) { const n = T(v); if (n !== v) node.setAttribute(a, n); } }
    node.childNodes.forEach(walk);
  };
  walk(document.body);
  document.querySelectorAll('.card .flip, .card .case').forEach((el) => {
    const v = el.getAttribute('aria-label') || '';
    el.setAttribute('aria-label', v.replace('Ver estudo de caso: ', 'See case study: ').replace('Voltar para a frente: ', 'Back to front: ').replace('Estudo de caso: ', 'Case study: ').replace('Plataforma de Investimentos XP', 'XP Investment Platform').replace('Jornada do Paciente', 'Patient Journey'));
  });
})();
(function(){
  /* volta pra mesma posição depois de trocar o idioma */
  let y = null; try { y = sessionStorage.getItem('rb-scroll'); sessionStorage.removeItem('rb-scroll'); } catch (e) {}
  if (y !== null) window.addEventListener('load', () => setTimeout(() => window.scrollTo(0, +y), 60));
})();
