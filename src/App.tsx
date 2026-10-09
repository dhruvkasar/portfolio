/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Portfolio from './components/portfolio';
import NoInternet from './components/ui/no-internet';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Global click sound
    const clickAudio = new Audio('/click.mp3');
    const handleClick = () => {
      const audioClone = clickAudio.cloneNode() as HTMLAudioElement;
      audioClone.play().catch(e => console.log('Audio play failed:', e));
    };
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  if (!isOnline) {
    return <NoInternet />;
  }

  return <Portfolio />;
}
