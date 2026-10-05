/* Real QR matrices. Local qrcode-generator runtime; four white modules on all sides. */
(() => {
  const target = new URL('beachbox-menu-demo.html?ombrellone=24', location.href);
  const fileMode = location.protocol === 'file:';
  const encoded = fileMode ? 'http://localhost:8765/beachbox-menu-demo.html?ombrellone=24' : target.href;
  const qr = qrcode(0, 'M');
  qr.addData(encoded);
  qr.make();
  const n = qr.getModuleCount(), size = n + 8;
  let path = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (qr.isDark(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="white"/><path d="${path}" fill="#0d2d4a"/></svg>`;
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  document.querySelectorAll('.qr-image').forEach(img => { img.src = src; img.dataset.target = encoded; });
  document.querySelectorAll('[data-demo-link]').forEach(a => { a.href = target.href; });
  document.querySelectorAll('[data-qr-address]').forEach(el => { el.textContent = fileMode ? 'Apri la pagina con il server locale per scansionare il QR.' : 'Il QR apre il menu dell’ombrellone 24.'; });
})();
