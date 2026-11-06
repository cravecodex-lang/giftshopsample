import { useEffect, useState } from 'react';
import { useMotionValue } from 'framer-motion';
import GiftShower from './GiftShower';
import './GiftIntro.css';

function GiftIntro({ onReveal }) {
  const [visible, setVisible] = useState(true);
  const [blueScreen, setBlueScreen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const showerProgress = useMotionValue(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const logoHoldDuration = 2000;
    const blueScreenHoldDuration = prefersReducedMotion ? 0 : 300;
    const exitDuration = prefersReducedMotion ? 0 : 750;
    const blueScreenTimer = window.setTimeout(() => setBlueScreen(true), logoHoldDuration);
    const leaveTimer = window.setTimeout(
      () => setLeaving(true),
      logoHoldDuration + blueScreenHoldDuration,
    );
    const revealTimer = window.setTimeout(() => {
      onReveal(true);
      setVisible(false);
    }, logoHoldDuration + blueScreenHoldDuration + exitDuration);

    return () => {
      window.clearTimeout(blueScreenTimer);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(revealTimer);
    };
  }, [onReveal]);

  return (
    visible && (
      <div
        className={`gift-intro${blueScreen ? ' gift-intro--blue' : ''}${leaving ? ' gift-intro--leaving' : ''}`}
        role="status"
        aria-label="Welcome to Mr and Mrs Gifts"
      >
        {!blueScreen && (
          <>
            {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
              <GiftShower
                progress={showerProgress}
                className="gift-intro__shower"
                continuous
              />
            )}
            <div className="gift-intro__stage">
              <img
                className="gift-intro__logo"
                src="/Mr-and-Mrs-Gifts-logo.png"
                alt="Inba’s Mr & Mrs Gifts"
              />
            </div>
          </>
        )}
        {blueScreen && (
          <div className="gift-intro__blue-glow" aria-hidden="true" />
        )}
      </div>
    )
  );
}

export default GiftIntro;
