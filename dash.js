// Serves the page's figures to its charts and redraws them when the window resizes.
window.dash = (() => {
  const reg = {}, D = () => window.DASH_DATA || {};
  const run = (n) => document.querySelectorAll('[data-draw="' + n + '"]').forEach((el) => {
    if (!reg[n] || el.closest('[hidden]')) return;
    try { reg[n](el); } catch (e) { console.error('draw ' + n, e); }
  });
  const runAll = () => Object.keys(reg).forEach(run);
  let timer;
  window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(runAll, 150); });
  return {
    colors: ['#1d4e89', '#1b9aaa', '#d08a2e', '#7a4fb8', '#62b6e6', '#7fd1ae', '#7a8b99', '#d9c8a0'],
    data: (id) => ({status: D()[id] ? 'ok' : 'missing', data: D()[id] || []}),
    draw: (n, fn) => { if (fn) reg[n] = fn; else run(n); },
    onData() {}, calc() {}, setLink() {}, runAll,
  };
})();
