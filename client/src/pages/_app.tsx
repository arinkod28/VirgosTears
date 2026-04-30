import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import '../styles/globals.css';

const PUBLIC_ROUTES = ['/login'];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const authed = localStorage.getItem('cmmc_authed') === 'true';
    const isPublic = PUBLIC_ROUTES.includes(router.pathname);

    if (authed && router.pathname === '/login') {
      router.replace('/');
      return;
    }
    if (!authed && !isPublic) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router.pathname]);

  if (!ready) return null;

  return <Component {...pageProps} />;
}
