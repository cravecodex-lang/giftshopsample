import { motion, useTransform } from 'framer-motion';
import './GiftShower.css';

const fallingGifts = [
  { type: 'box', left: 3, size: 52, sway: 42, spin: 145, depth: 48, duration: 5.2 },
  { type: 'bear', left: 13, size: 42, sway: 28, spin: -95, depth: 8, duration: 6.4 },
  { type: 'heart', left: 22, size: 31, sway: 36, spin: 112, depth: 30, duration: 4.7 },
  { type: 'frame', left: 30, size: 45, sway: 32, spin: -130, depth: 18, duration: 5.8 },
  { type: 'keychain', left: 36, size: 34, sway: 25, spin: 155, depth: 40, duration: 6.8 },
  { type: 'box', left: 65, size: 43, sway: 36, spin: -125, depth: 14, duration: 5.5 },
  { type: 'doll', left: 71, size: 46, sway: 27, spin: 105, depth: 52, duration: 6.2 },
  { type: 'ribbon', left: 78, size: 50, sway: 45, spin: -115, depth: 24, duration: 5.1 },
  { type: 'sparkle', left: 86, size: 27, sway: 28, spin: 180, depth: 8, duration: 4.5 },
  { type: 'box', left: 94, size: 56, sway: 35, spin: 135, depth: 60, duration: 6.5 },
  { type: 'doll', left: 7, size: 38, sway: 33, spin: -112, depth: 28, duration: 5.9 },
  { type: 'ribbon', left: 18, size: 37, sway: 46, spin: 128, depth: 55, duration: 6.7 },
  { type: 'box', left: 26, size: 38, sway: 26, spin: -145, depth: 6, duration: 4.9 },
  { type: 'sparkle', left: 34, size: 31, sway: 30, spin: 160, depth: 32, duration: 5.6 },
  { type: 'bear', left: 67, size: 36, sway: 31, spin: -105, depth: 36, duration: 5.3 },
  { type: 'heart', left: 74, size: 35, sway: 40, spin: 120, depth: 12, duration: 6.1 },
  { type: 'frame', left: 82, size: 39, sway: 29, spin: -140, depth: 46, duration: 4.8 },
  { type: 'keychain', left: 91, size: 42, sway: 37, spin: 155, depth: 20, duration: 5.7 },
  { type: 'ribbon', left: 4, size: 42, sway: 40, spin: -130, depth: 42, duration: 6.3 },
  { type: 'frame', left: 16, size: 34, sway: 25, spin: 110, depth: 16, duration: 5.0 },
  { type: 'keychain', left: 28, size: 38, sway: 34, spin: -165, depth: 50, duration: 6.6 },
  { type: 'doll', left: 70, size: 40, sway: 29, spin: 130, depth: 10, duration: 5.4 },
  { type: 'box', left: 81, size: 45, sway: 38, spin: -118, depth: 34, duration: 6.0 },
  { type: 'bear', left: 96, size: 35, sway: 27, spin: 100, depth: 22, duration: 4.6 },
  { type: 'sparkle', left: 10, size: 25, sway: 32, spin: -170, depth: 58, duration: 5.5 },
  { type: 'heart', left: 25, size: 30, sway: 37, spin: 140, depth: 26, duration: 6.3 },
  { type: 'frame', left: 75, size: 42, sway: 30, spin: -150, depth: 44, duration: 5.2 },
  { type: 'keychain', left: 88, size: 32, sway: 41, spin: 175, depth: 4, duration: 5.9 },
];

function GiftShape({ type }) {
  if (type === 'box') {
    return (
      <span className="rain-gift__cube" aria-label="Blue gift box">
        <span className="rain-gift__cube-front"><i /></span>
        <span className="rain-gift__cube-side" />
        <span className="rain-gift__cube-top"><i /></span>
        <span className="rain-gift__cube-lid" />
        <span className="rain-gift__cube-bow"><i /><i /></span>
      </span>
    );
  }

  if (type === 'bear') {
    return (
      <span className="rain-gift__bear" aria-label="Teddy bear">
        <i className="rain-gift__bear-ear rain-gift__bear-ear--left" />
        <i className="rain-gift__bear-ear rain-gift__bear-ear--right" />
        <i className="rain-gift__bear-head"><b /></i>
        <i className="rain-gift__bear-body" />
        <i className="rain-gift__bear-arm rain-gift__bear-arm--left" />
        <i className="rain-gift__bear-arm rain-gift__bear-arm--right" />
        <i className="rain-gift__bear-leg rain-gift__bear-leg--left" />
        <i className="rain-gift__bear-leg rain-gift__bear-leg--right" />
        <i className="rain-gift__bear-muzzle" />
      </span>
    );
  }

  if (type === 'doll') {
    return (
      <span className="rain-gift__doll" aria-label="Keepsake doll">
        <i className="rain-gift__doll-hair" />
        <i className="rain-gift__doll-head"><b /></i>
        <i className="rain-gift__doll-body" />
        <i className="rain-gift__doll-arm rain-gift__doll-arm--left" />
        <i className="rain-gift__doll-arm rain-gift__doll-arm--right" />
        <i className="rain-gift__doll-dress" />
        <i className="rain-gift__doll-leg rain-gift__doll-leg--left" />
        <i className="rain-gift__doll-leg rain-gift__doll-leg--right" />
      </span>
    );
  }

  if (type === 'frame') {
    return (
      <span className="rain-gift__frame" aria-label="Mini photo frame">
        <i><b>♥</b></i>
        <i className="rain-gift__frame-stand" />
      </span>
    );
  }

  if (type === 'keychain') {
    return (
      <span className="rain-gift__keychain" aria-label="Heart keychain">
        <i className="rain-gift__keychain-ring" />
        <i className="rain-gift__keychain-link" />
        <i className="rain-gift__keychain-charm"><b>♥</b></i>
      </span>
    );
  }

  if (type === 'ribbon') {
    return (
      <span className="rain-gift__ribbon" aria-label="Blue ribbon">
        <i className="rain-gift__ribbon-loop rain-gift__ribbon-loop--left" />
        <i className="rain-gift__ribbon-loop rain-gift__ribbon-loop--right" />
        <i className="rain-gift__ribbon-knot" />
        <i className="rain-gift__ribbon-tail rain-gift__ribbon-tail--left" />
        <i className="rain-gift__ribbon-tail rain-gift__ribbon-tail--right" />
      </span>
    );
  }

  if (type === 'heart') {
    return <span className="rain-gift__heart" aria-label="Floating heart" />;
  }

  return <span className="rain-gift__sparkle" aria-label="Golden sparkle">✦</span>;
}

function Gift({ gift, index, progress, continuous }) {
  const start = index * 0.018;
  const end = start + gift.duration * 0.07;
  const y = useTransform(progress, [start, start + 0.045, end - 0.045, end], ['-14vh', '2vh', '91vh', '112vh']);
  const x = useTransform(progress, [start, start + gift.duration * 0.3, start + gift.duration * 0.65, end], [0, gift.sway, -gift.sway, gift.sway / 3]);
  const rotateX = useTransform(progress, [start, end], [0, gift.spin]);
  const rotateY = useTransform(progress, [start, end], [gift.spin / -2, gift.spin / 2]);
  const rotate = useTransform(progress, [start, end], [0, gift.spin * 1.5]);
  const opacity = useTransform(progress, [start, start + 0.025, end - 0.025, end], [0, 0.92, 0.92, 0]);
  const scale = useTransform(progress, [start, start + 0.055, end], [0.65, 1, 0.82]);
  const phase = (index * 0.381966) % 1;
  const initialY = -18 + phase * 130;
  const initialOpacity = phase < 0.06 ? phase / 0.06 : phase > 0.94 ? (1 - phase) / 0.06 : 0.92;

  return (
    <motion.div
      className={`rain-gift${index % 4 === 0 ? ' rain-gift--foreground' : ''}${gift.left > 36 && gift.left < 64 ? ' rain-gift--center' : ''}`}
      data-gift-type={gift.type}
      style={continuous
        ? {
            left: `${gift.left}%`,
            '--gift-size': `${gift.size}px`,
            z: gift.depth,
            scale: 0.78 + (gift.depth / 60) * 0.45,
          }
        : {
            left: `${gift.left}%`,
            '--gift-size': `${gift.size}px`,
            z: gift.depth,
            y,
            x,
            rotateX,
            rotateY,
            rotate,
            opacity,
            scale,
          }}
      initial={continuous
        ? { y: `${initialY}vh`, opacity: initialOpacity }
        : false}
      animate={continuous
        ? {
            y: ['-18vh', '5vh', '88vh', '112vh'],
            x: [0, gift.sway, -gift.sway * 0.8, 0],
            rotateX: [0, gift.spin, -gift.spin * 0.45, 0],
            rotateY: [gift.spin * -0.5, gift.spin * 0.4, -gift.spin * 0.3, gift.spin * 0.5],
            rotate: [0, gift.spin, -gift.spin, 0],
            opacity: [0, 0.92, 0.88, 0],
          }
        : undefined}
      transition={continuous
        ? {
            duration: gift.duration,
            delay: -phase * gift.duration,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.12, 0.84, 1],
          }
        : undefined}
      aria-hidden="true"
    >
      <GiftShape type={gift.type} />
    </motion.div>
  );
}

function GiftShower({ progress, className = '', continuous = false }) {
  return (
    <div className={`gift-rain ${className}`} aria-hidden="true">
      {fallingGifts.map((gift, index) => (
        <Gift
          key={`${gift.type}-${index}`}
          gift={gift}
          index={index}
          progress={progress}
          continuous={continuous}
        />
      ))}
    </div>
  );
}

export default GiftShower;
