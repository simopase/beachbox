'use client';

/* QR reale generato localmente (qrcode-generator, MIT). Codifica l'URL del menu demo. */
import { useEffect, useState } from 'react';
import qrcode from '@/lib/qrcode';

export default function QrImage({ className, alt, width, height }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    const target = new URL('/menu-demo?ombrellone=24', location.origin);
    const encoded = target.href;
    const qr = qrcode(0, 'M');
    qr.addData(encoded);
    qr.make();
    const n = qr.getModuleCount(), size = n + 8;
    let path = '';
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (qr.isDark(y, x)) path += `M${x + 4} ${y + 4}h1v1h-1z`;
      }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="white"/><path d="${path}" fill="#0d2d4a"/></svg>`;
    setSrc('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
  }, []);

  if (!src) return <img className={className} alt={alt} width={width} height={height} aria-hidden="true" />;
  return <img className={className} src={src} alt={alt} width={width} height={height} />;
}
