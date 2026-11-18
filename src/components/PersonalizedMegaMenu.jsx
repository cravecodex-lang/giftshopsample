import { useState } from 'react';
import { ChevronDown, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { personalizedMenuItems } from '../data/personalizedData';

const allGiftsHref = '/personalized';
const categoryHref = (categoryId) => `/personalized?category=${encodeURIComponent(categoryId)}`;

function PersonalizedMegaMenu({ mobile = false, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  if (mobile) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="flex w-full items-center justify-between py-1 text-base font-medium text-white"
        >
          Personalized
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="mt-2 grid grid-cols-2 gap-2 border-l border-white/20 pl-3">
            <Link to={allGiftsHref} onClick={onNavigate} className="col-span-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white">
              All Personalized Gifts
            </Link>
            {personalizedMenuItems.map((item) => (
              <Link
                key={item.id}
                to={categoryHref(item.id)}
                onClick={onNavigate}
                className="flex min-w-0 items-center gap-2 rounded-xl px-2 py-2 text-xs text-[#EAF7FC] transition hover:bg-white/10"
              >
                <img src={item.image} alt="" className="h-8 w-8 shrink-0 rounded-lg object-cover" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        onFocus={() => setIsOpen(true)}
        aria-expanded={isOpen}
        className="group relative inline-flex items-center gap-1 text-sm font-medium tracking-[0.02em] text-white transition hover:text-[#87CEEB]"
      >
        Personalized
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-[#87CEEB] transition-transform duration-300 group-hover:scale-x-100" />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 top-full z-[70] w-[min(860px,calc(100vw-2rem))] -translate-x-1/2 pt-4">
          <div className="overflow-hidden rounded-[26px] border border-[#DCE8F1] bg-white p-4 text-[#153B60] shadow-[0_28px_80px_rgba(9,34,54,0.24)] sm:p-5">
            <Link
              to={allGiftsHref}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between gap-4 rounded-2xl bg-[linear-gradient(110deg,#102D44,#1D5278)] p-4 text-white transition hover:brightness-110"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-[#B9D9F5]"><Gift size={20} /></span>
                <span>
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B9D9F5]">Thoughtful by design</span>
                  <span className="mt-1 block font-display text-xl">All Personalized Gifts</span>
                </span>
              </span>
              <span className="text-sm font-semibold">Explore →</span>
            </Link>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {personalizedMenuItems.map((item) => (
                <Link
                  key={item.id}
                  to={categoryHref(item.id)}
                  onClick={() => setIsOpen(false)}
                  className="group flex min-w-0 items-center gap-3 rounded-2xl border border-transparent p-2 transition hover:border-[#D9E7EF] hover:bg-[#F4F9FC]"
                >
                  <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm transition group-hover:scale-105" />
                  <span className="text-sm font-medium text-[#234B6B]">{item.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonalizedMegaMenu;
