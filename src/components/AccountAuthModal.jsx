import { useState } from 'react';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

function AccountAuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signup');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const password = form.elements.password.value;
    const confirmation = form.elements.confirmPassword?.value;

    if (mode === 'signup' && password !== confirmation) {
      setMessage('The passwords do not match. Please check and try again.');
      return;
    }

    setMessage('Account sign-in is not connected yet. Your details were not sent or saved.');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#071B2D]/75 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-auth-title"
        className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-[430px] overflow-y-auto rounded-[28px] border border-white/60 bg-[#F7FAFD] px-5 py-7 shadow-[0_32px_100px_rgba(2,18,34,0.42)] sm:max-h-[calc(100dvh-2.5rem)] sm:px-9 sm:py-8"
      >
        <div className="pointer-events-none absolute left-3 top-3 h-8 w-8 border-l border-t border-[#87CEEB]/70 sm:left-4 sm:top-4" />
        <div className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 border-b border-r border-[#87CEEB]/70 sm:bottom-4 sm:right-4" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close account dialog"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#45627A] transition hover:bg-[#E8F2FA] hover:text-[#153B60]"
        >
          <X size={19} />
        </button>

        <div className="relative mx-auto mt-3 flex w-fit rounded-lg border border-[#AFC2D1] bg-white p-0.5">
          <button
            type="button"
            onClick={() => handleModeChange('signup')}
            aria-pressed={mode === 'signup'}
            className={`rounded-md px-5 py-2 text-sm font-semibold transition ${mode === 'signup' ? 'bg-[#153B60] text-white shadow-sm' : 'text-[#45627A] hover:bg-[#EAF2F8]'}`}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            aria-pressed={mode === 'login'}
            className={`rounded-md px-5 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-[#153B60] text-white shadow-sm' : 'text-[#45627A] hover:bg-[#EAF2F8]'}`}
          >
            Login
          </button>
        </div>

        <h2 id="account-auth-title" className="mt-7 font-display text-[clamp(1.7rem,7vw,2.1rem)] leading-tight text-[#153B60]">
          {mode === 'signup' ? 'Create your account.' : 'Welcome back.'}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#59758B]">
          {mode === 'signup' ? 'Sign up to keep your favourite gifts close.' : 'Log in to continue to your account.'}
        </p>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <label className="sr-only" htmlFor="account-first-name">First name</label>
              <input
                id="account-first-name"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="First name"
                required
                className="min-w-0 rounded-lg border border-[#BFCED9] bg-white px-3 py-3 text-sm text-[#173B5B] outline-none placeholder:text-[#8A9AA8] focus:border-[#3B82B9] focus:ring-2 focus:ring-[#3B82B9]/15"
              />
              <label className="sr-only" htmlFor="account-last-name">Last name</label>
              <input
                id="account-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last name"
                required
                className="min-w-0 rounded-lg border border-[#BFCED9] bg-white px-3 py-3 text-sm text-[#173B5B] outline-none placeholder:text-[#8A9AA8] focus:border-[#3B82B9] focus:ring-2 focus:ring-[#3B82B9]/15"
              />
            </div>
          )}
          <label className="sr-only" htmlFor="account-email">Email address</label>
          <input
            id="account-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Email address"
            required
            className="w-full rounded-lg border border-[#BFCED9] bg-white px-3 py-3 text-sm text-[#173B5B] outline-none placeholder:text-[#8A9AA8] focus:border-[#3B82B9] focus:ring-2 focus:ring-[#3B82B9]/15"
          />
          <label className="sr-only" htmlFor="account-password">Password</label>
          <input
            id="account-password"
            name="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="Password"
            minLength={8}
            required
            className="w-full rounded-lg border border-[#BFCED9] bg-white px-3 py-3 text-sm text-[#173B5B] outline-none placeholder:text-[#8A9AA8] focus:border-[#3B82B9] focus:ring-2 focus:ring-[#3B82B9]/15"
          />
          {mode === 'signup' && (
            <>
              <label className="sr-only" htmlFor="account-confirm-password">Re-enter password</label>
              <input
                id="account-confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter password"
                minLength={8}
                required
                className="w-full rounded-lg border border-[#BFCED9] bg-white px-3 py-3 text-sm text-[#173B5B] outline-none placeholder:text-[#8A9AA8] focus:border-[#3B82B9] focus:ring-2 focus:ring-[#3B82B9]/15"
              />
            </>
          )}

          {message && (
            <p role="status" className="rounded-lg bg-[#E8F2FA] px-3 py-2 text-xs leading-5 text-[#153B60]">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="mx-auto flex min-h-11 w-full max-w-[180px] items-center justify-center rounded-full bg-[#153B60] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(21,59,96,0.2)] transition hover:bg-[#214D73] focus-visible:outline-offset-4"
          >
            {mode === 'signup' ? 'Sign in' : 'Login'}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-xs font-medium text-[#71869A]">
          <span className="h-px flex-1 bg-[#D7E1E9]" />
          or
          <span className="h-px flex-1 bg-[#D7E1E9]" />
        </div>

        <button
          type="button"
          onClick={() => setMessage('Google sign-in is not configured yet.')}
          className="mx-auto flex items-center justify-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#294A67] transition hover:bg-[#E8F2FA]"
        >
          <img src="/google-icon.svg" alt="" className="h-[18px] w-[18px]" />
          Continue with Google
        </button>
      </section>
    </div>,
    document.body,
  );
}

export default AccountAuthModal;
