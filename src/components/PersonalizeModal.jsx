import { X, Sparkles } from 'lucide-react';

const PersonalizeModal = ({ isOpen, nameInput, setNameInput, messageInput, setMessageInput, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#183B56]/45 p-3 backdrop-blur-sm sm:p-4">
      <div className="max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-[#FFFCF7] p-4 shadow-[0_32px_90px_rgba(17,39,59,0.22)] sm:max-h-[calc(100dvh-2rem)] sm:rounded-[30px] sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5d7383]">Personalise it</p>
            <h3 className="mt-2 font-display text-3xl leading-tight text-[#183B56] sm:text-4xl">Create Something Personal</h3>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-[#D9E7EF] p-2 text-[#183B56]">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#183B56]">
              Name or initials
              <input
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Aarav & Viya"
                className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#F9FCFE] px-4 py-3 text-base text-[#183B56] outline-none ring-0 transition focus:border-[#87CEEB]"
              />
            </label>
            <label className="block text-sm font-medium text-[#183B56]">
              Short message
              <textarea
                value={messageInput}
                onChange={(event) => setMessageInput(event.target.value)}
                rows="4"
                placeholder="For all the little moments we treasure"
                className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#F9FCFE] px-4 py-3 text-base text-[#183B56] outline-none transition focus:border-[#87CEEB]"
              />
            </label>
            <button type="button" onClick={onSave} className="inline-flex items-center gap-2 rounded-full bg-[#87CEEB] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#183B56]">
              <Sparkles size={16} />
              Preview gift
            </button>
          </div>

          <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,_rgba(135,206,235,0.2),_rgba(255,255,255,0.92)_55%)] p-5">
            <div className="overflow-hidden rounded-[24px] border border-[#D8ECF6] bg-white p-4 shadow-[0_20px_45px_rgba(24,59,86,0.08)]">
              <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5d7383]">
                <span>Custom keepsake</span>
                <span>Handmade</span>
              </div>
              <div className="mt-5 rounded-[22px] bg-[linear-gradient(180deg,#EAF7FC,#ffffff)] p-5">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#183B56] text-3xl font-display text-white shadow-[0_20px_50px_rgba(24,59,86,0.18)] sm:h-32 sm:w-32">
                  {nameInput ? nameInput.slice(0, 2).toUpperCase() : 'AM'}
                </div>
                <div className="mt-5 text-center">
                  <p className="font-display text-3xl text-[#183B56]">{nameInput || 'Ari & Sam'}</p>
                  <p className="mt-2 text-sm italic text-[#5d7383]">{messageInput || 'For all the little moments we treasure'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeModal;
