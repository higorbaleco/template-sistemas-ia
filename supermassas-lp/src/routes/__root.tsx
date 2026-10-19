import { RootRoute, Outlet } from '@tanstack/react-router'
import { useEffect } from 'react'

export const rootRoute = new RootRoute({
  component: RootLayout,
})

function RootLayout() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://app.gptmaker.ai/widget/3F9B4A656BA55330D8AE72B5AF3F6A41/float.js';
      document.body.appendChild(script);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Teste interativo de IA comercial para SuperMassas" />
        <title>SuperMassas - Teste Sua IA</title>
        <link rel="stylesheet" href="/index.css" />
      </head>
      <body>
        <Outlet />
      </body>
    </html>
  );
}
