import './globals.css';

export const metadata = {
  title: 'BeachBox — Il bar arriva sotto l’ombrellone',
  description: 'Il bar arriva sotto l’ombrellone. Scansiona il QR, scegli e ordina con BeachBox.',
  icons: { icon: '/assets/beachbox-brand/svg/beachbox-favicon.svg' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fff9f1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="stylesheet" href="/assets/fonts/fonts.css" />
      </head>
      <body className="premium">
        <svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style={{ position: 'absolute', overflow: 'hidden' }} aria-hidden="true">
          <symbol id="business-arrow" viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></symbol>
          <symbol id="business-check" viewBox="0 0 24 24"><path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></symbol>
        </svg>
        {children}
        <noscript>
          <p style={{ padding: '24px', textAlign: 'center' }}>
            Per vedere tutti i passaggi abilita JavaScript. Puoi comunque <a href="/menu-demo?ombrellone=24">aprire il menu demo</a>.
          </p>
        </noscript>
      </body>
    </html>
  );
}
