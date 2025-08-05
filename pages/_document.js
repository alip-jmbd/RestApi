import { Html, Head, Main, NextScript } from 'next/document'

const blockingSetInitialColorMode = `
  (function() {
    function getInitialColorMode() {
      const persistedColorPreference = window.localStorage.getItem('theme');
      const hasPersistedPreference = typeof persistedColorPreference === 'string';
      if (hasPersistedPreference) {
        return persistedColorPreference;
      }
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const hasMediaQueryPreference = typeof mql.matches === 'boolean';
      if (hasMediaQueryPreference) {
        return mql.matches ? 'dark' : 'light';
      }
      return 'light';
    }
    const colorMode = getInitialColorMode();
    document.body.dataset.theme = colorMode;
  })()
`;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: blockingSetInitialColorMode }} />
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
