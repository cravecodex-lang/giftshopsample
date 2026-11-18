import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ImagePlus,
  MapPin,
  MessageCircle,
  Pencil,
  ShoppingBag,
  X,
} from 'lucide-react';
import { contactConfig } from '../data/contactConfig';

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;
const fontStyles = ['Elegant Serif', 'Modern Sans', 'Handwritten'];
const designStyles = ['Midnight Blue', 'Soft Sky', 'Warm Cream'];
const designColors = {
  'Midnight Blue': 'bg-[#153B60] text-white',
  'Soft Sky': 'bg-[#DCEFFA] text-[#153B60]',
  'Warm Cream': 'bg-[#F7F1E8] text-[#624F38]',
};

const getLocalDate = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

export function ProductPreview({ product, name, message, photo, fontStyle, designStyle, isHero = false }) {
  const [rotation, setRotation] = useState(-12);
  const dragStart = useRef(null);
  const isMug = product.categoryId === 'mugs';

  const handlePointerDown = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = { x: event.clientX, rotation };
  };

  const handlePointerMove = (event) => {
    if (!dragStart.current) return;
    const nextRotation = dragStart.current.rotation + (event.clientX - dragStart.current.x) * 0.65;
    setRotation(Math.max(-38, Math.min(38, nextRotation)));
  };

  const stopDragging = () => {
    dragStart.current = null;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') setRotation((current) => Math.max(-38, current - 8));
    if (event.key === 'ArrowRight') setRotation((current) => Math.min(38, current + 8));
  };

  return (
    <div className={isHero ? 'w-full' : 'mt-5'}>
      <div className={`flex items-center justify-center overflow-hidden rounded-[22px] bg-[#F0F1F1] ${isHero ? 'aspect-[4/3] w-full lg:aspect-[4/5]' : 'min-h-[300px] p-5'}`}>
        <div
          role="img"
          aria-label={`${product.name} 3D-style preview. Use left and right arrow keys or drag to rotate.`}
          tabIndex={0}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={handleKeyDown}
          className={`flex w-full cursor-grab touch-pan-y items-center justify-center outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-[#9A793F] ${isHero ? 'h-full' : ''}`}
          style={{ transform: `perspective(900px) rotateY(${rotation}deg) rotateX(2deg) scale(${isHero && isMug ? 1.2 : 1})` }}
        >
          {isMug ? (
            <div className="relative h-[270px] w-[275px]">
              <div className="absolute right-7 top-[72px] h-[125px] w-[78px] rounded-r-[52%] border-[13px] border-[#D5DDE1] bg-[#F0F1F1] shadow-[inset_-5px_0_8px_rgba(24,59,86,0.12)]" />
              <div className="absolute left-5 top-3 z-10 h-[245px] w-[198px] overflow-hidden rounded-[25%_25%_30%_30%] border border-[#D8DEE1] bg-[linear-gradient(110deg,#FFFFFF_0%,#F6F7F6_55%,#E2E6E7_100%)] shadow-[inset_-16px_0_22px_rgba(25,46,57,0.12),0_22px_25px_rgba(26,43,53,0.2)]">
                <div className="absolute inset-x-0 top-0 h-5 rounded-[50%] border-b border-[#C7D0D5] bg-[linear-gradient(180deg,#E7EAEB,#FFFFFF)]" />
                <div className={`absolute inset-x-5 bottom-6 top-8 flex flex-col items-center justify-center overflow-hidden rounded-[14px] px-3 py-4 text-center ${designColors[designStyle]}`}>
                  {photo && <img src={photo} alt="" className="mb-2 h-16 w-16 rounded-full border-2 border-white/80 object-cover shadow-md" />}
                  <span className={`max-w-full break-words font-display text-2xl leading-tight ${fontStyle === 'Modern Sans' ? 'font-sans' : ''} ${fontStyle === 'Handwritten' ? 'italic' : ''}`}>
                    {name || 'Your name'}
                  </span>
                  {message && <span className="mt-1 max-w-full break-words text-[10px] leading-4 opacity-85">{message}</span>}
                </div>
              </div>
            </div>
          ) : (
            <div className={`relative w-full overflow-hidden rounded-[24px] bg-white shadow-[0_22px_35px_rgba(26,43,53,0.2)] ${isHero ? 'h-full max-w-none' : 'h-[270px] max-w-[300px]'}`}>
              <img src={product.image} alt="" className="h-full w-full object-cover" />
              <div className={`absolute inset-x-3 bottom-3 flex items-center gap-3 rounded-xl p-3 shadow-md ${designColors[designStyle]}`}>
                {photo && <img src={photo} alt="" className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover" />}
                <span className="min-w-0 text-left">
                  <span className={`block break-words font-display text-lg leading-tight ${fontStyle === 'Modern Sans' ? 'font-sans' : ''} ${fontStyle === 'Handwritten' ? 'italic' : ''}`}>{name || product.name}</span>
                  {message && <span className="mt-1 block break-words text-[10px] leading-4 opacity-85">{message}</span>}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {!isHero && <p className="mt-3 text-center text-xs text-[#71869A]">Drag to rotate, or focus the preview and use the arrow keys.</p>}
    </div>
  );
}

function PersonalizedProductCustomization({ product, onAddToBag, onBuyNow, onSave }) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelStep, setPanelStep] = useState('edit');
  const [isSaved, setIsSaved] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [fontStyle, setFontStyle] = useState(fontStyles[0]);
  const [designStyle, setDesignStyle] = useState(designStyles[0]);
  const [photo, setPhoto] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('No preference');

  const options = product.customizationOptions;
  const photoInputId = `customization-photo-${product.id}`;
  const deliveryDateMin = getLocalDate();
  const canCustomize = !isSaved;
  const deliveryPreference = {
    location: deliveryLocation.trim(),
    date: deliveryDate,
    slot: deliverySlot === 'No preference' ? '' : deliverySlot,
  };

  const markEdited = () => setIsSaved(false);

  const openCustomizer = () => {
    setPanelStep('edit');
    setIsPanelOpen(true);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setPhotoError('Choose a JPG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => setPhotoError('We could not read that image. Please try another file.');
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhoto(reader.result);
        setPhotoError('');
        markEdited();
      } else {
        setPhotoError('We could not read that image. Please try another file.');
      }
    };
    reader.readAsDataURL(file);
  };

  const saveAndContinue = () => {
    onSave({
      name: options.includes('name') ? name.trim() : '',
      message: options.includes('message') ? message.trim() : '',
      fontStyle: options.includes('font') ? fontStyle : fontStyles[0],
      designStyle: options.includes('design') ? designStyle : designStyles[0],
      photo: options.includes('photo') ? photo : '',
    });
    setIsSaved(true);
    setIsPanelOpen(false);
  };

  const makeCartItem = () => {
    const uniqueId = globalThis.crypto?.randomUUID
      ? globalThis.crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    return {
      ...product,
      id: `${product.id}-${uniqueId}`,
      baseProductId: product.id,
      personalization: {
        name: options.includes('name') ? name.trim() : '',
        message: options.includes('message') ? message.trim() : '',
        fontStyle: options.includes('font') ? fontStyle : '',
        designStyle: options.includes('design') ? designStyle : '',
        photo: options.includes('photo') ? photo : '',
      },
      deliveryPreference,
    };
  };

  const whatsappMessage = [
    "Hi, I'd like to order this personalized gift:",
    `Product: ${product.name}`,
    `Price: ${formatPrice(product.price)}`,
    options.includes('name') && name.trim() && `Name: ${name.trim()}`,
    options.includes('message') && message.trim() && `Message: ${message.trim()}`,
    options.includes('font') && `Font style: ${fontStyle}`,
    options.includes('design') && `Design / color: ${designStyle}`,
    deliveryPreference.location && `Delivery location: ${deliveryPreference.location}`,
    deliveryPreference.date && `Preferred delivery date: ${deliveryPreference.date}`,
    deliveryPreference.slot && `Preferred delivery slot: ${deliveryPreference.slot}`,
    photo && 'I will attach my selected photo in this WhatsApp chat.',
  ].filter(Boolean).join('\n');
  const whatsappHref = contactConfig.whatsapp
    ? `https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`
    : '';

  const customizerPanel = isPanelOpen && createPortal(
    <div
      className="fixed inset-0 z-[90] bg-[#071B2D]/60 backdrop-blur-[2px]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setIsPanelOpen(false);
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="customization-panel-title" className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#FFFEFC] text-[#183B56] shadow-[-24px_0_70px_rgba(4,21,34,0.22)]">
        <header className="flex items-center justify-between border-b border-[#E8E9E6] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A793F]">Make it yours</p>
            <h2 id="customization-panel-title" className="mt-1 truncate font-display text-xl">
              {panelStep === 'preview' ? '3D Preview' : `Customize ${product.name}`}
            </h2>
          </div>
          <button type="button" onClick={() => setIsPanelOpen(false)} aria-label="Close customization" className="ml-3 rounded-full border border-[#DFE5E8] p-2 text-[#45627A] transition hover:bg-[#F1F6F8]">
            <X size={18} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {panelStep === 'edit' ? (
            <>
              <div className="relative h-40 overflow-hidden rounded-[18px] border border-[#E4E8E8] bg-[#EEF2F3]">
                <img src={photo || product.image} alt={photo ? 'Selected personalization photo' : product.name} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#071B2D]/80 to-transparent px-4 pb-3 pt-10 text-white">
                  <p className="font-display text-lg">{name || 'Your name or monogram'}</p>
                  {message && <p className="mt-0.5 line-clamp-1 text-xs text-white/85">{message}</p>}
                </div>
              </div>

              <div className="mt-5 space-y-5">
                {options.includes('photo') && (
                  <div>
                    <label htmlFor={photoInputId} className="block text-sm font-semibold text-[#234B6B]">Upload personalization image</label>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <label htmlFor={photoInputId} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-[#9BB6CA] bg-[#F6FAFD] px-4 py-3 text-sm font-medium text-[#234B6B] transition hover:bg-[#EDF5FA]">
                        <ImagePlus size={17} /> Choose JPG, PNG, or WebP
                      </label>
                      <input id={photoInputId} type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="sr-only" />
                      <span className="text-xs text-[#7C8F9D]">Up to 5 MB</span>
                    </div>
                    {photoError && <p role="alert" className="mt-2 text-xs font-medium text-[#A53F3F]">{photoError}</p>}
                    {photo && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={photo} alt="Selected image preview" className="h-12 w-12 rounded-lg object-cover" />
                        <button type="button" onClick={() => { setPhoto(''); setPhotoError(''); markEdited(); }} className="text-xs font-semibold text-[#45627A] underline">Remove image</button>
                      </div>
                    )}
                  </div>
                )}

                {options.includes('name') && (
                  <label className="block text-sm font-semibold text-[#234B6B]">
                    {product.categoryId === 'mugs' ? 'Enter a name or monogram' : 'Enter a name'}
                    <input value={name} onChange={(event) => { setName(event.target.value); markEdited(); }} maxLength={40} placeholder="Name or initials" className="mt-2 w-full rounded-xl border border-[#D4E0E9] bg-white px-4 py-3 text-sm font-normal text-[#153B60] outline-none transition focus:border-[#9A793F]" />
                    <span className="mt-1 block text-right text-[10px] font-normal text-[#8798A4]">{name.length}/40</span>
                  </label>
                )}

                {options.includes('message') && (
                  <label className="block text-sm font-semibold text-[#234B6B]">
                    Add a custom message
                    <textarea value={message} onChange={(event) => { setMessage(event.target.value); markEdited(); }} maxLength={120} rows={3} placeholder="Write a little note..." className="mt-2 w-full resize-y rounded-xl border border-[#D4E0E9] bg-white px-4 py-3 text-sm font-normal text-[#153B60] outline-none transition focus:border-[#9A793F]" />
                    <span className="mt-1 block text-right text-[10px] font-normal text-[#8798A4]">{message.length}/120</span>
                  </label>
                )}

                {(options.includes('font') || options.includes('design')) && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {options.includes('font') && (
                      <label className="block text-sm font-semibold text-[#234B6B]">
                        Font style
                        <select value={fontStyle} onChange={(event) => { setFontStyle(event.target.value); markEdited(); }} className="mt-2 w-full rounded-xl border border-[#D4E0E9] bg-white px-3 py-3 text-sm font-normal text-[#153B60] outline-none focus:border-[#9A793F]">
                          {fontStyles.map((font) => <option key={font}>{font}</option>)}
                        </select>
                      </label>
                    )}
                    {options.includes('design') && (
                      <label className="block text-sm font-semibold text-[#234B6B]">
                        Design / color
                        <select value={designStyle} onChange={(event) => { setDesignStyle(event.target.value); markEdited(); }} className="mt-2 w-full rounded-xl border border-[#D4E0E9] bg-white px-3 py-3 text-sm font-normal text-[#153B60] outline-none focus:border-[#9A793F]">
                          {designStyles.map((design) => <option key={design}>{design}</option>)}
                        </select>
                      </label>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9A793F]">
                <Check size={14} /> Preview your design
              </div>
              <ProductPreview product={product} name={name} message={message} photo={photo} fontStyle={fontStyle} designStyle={designStyle} />
            </>
          )}
        </div>

        <footer className="border-t border-[#E8E9E6] bg-white p-4">
          {panelStep === 'edit' ? (
            <button type="button" onClick={() => setPanelStep('preview')} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#183B56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#234D72]">
              3D Preview <ArrowRight size={16} />
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPanelStep('edit')} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D7E1E7] bg-white px-4 py-3 text-sm font-semibold text-[#183B56] transition hover:bg-[#F5F8F9]">
                <Pencil size={15} /> Edit
              </button>
              <button type="button" onClick={saveAndContinue} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#183B56] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#234D72]">
                Save &amp; Continue <ArrowRight size={15} />
              </button>
            </div>
          )}
        </footer>
      </section>
    </div>,
    document.body,
  );

  return (
    <section className="mt-8 space-y-5" id="customize-gift">
      <div className="rounded-[24px] border border-[#DDE7EE] bg-white p-5 shadow-[0_16px_40px_rgba(21,59,96,0.05)] sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A793F]">Make it personal</p>
            <h2 className="mt-2 font-display text-2xl text-[#153B60]">Your design, your way</h2>
            <p className="mt-2 text-sm leading-6 text-[#71869A]">Choose the options made for this gift, preview the design, then save to continue.</p>
          </div>
          <button type="button" onClick={openCustomizer} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#183B56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#234D72]">
            <Pencil size={15} /> {isSaved ? 'Edit personalization' : 'Personalize this gift'}
          </button>
        </div>

        {isSaved ? (
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-[#F1F7F3] p-4">
            {photo ? <img src={photo} alt="Saved design" className="h-12 w-12 rounded-lg object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#33734F]"><Check size={19} /></span>}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#286344]">Personalization saved</p>
              <p className="mt-1 truncate text-xs text-[#5D7868]">{name || message || 'Your selected design is ready.'}</p>
            </div>
          </div>
        ) : (
          <p className="mt-5 rounded-2xl bg-[#F5F8FA] p-4 text-sm leading-6 text-[#62798A]">Personalize and save your design to enable cart and checkout options.</p>
        )}
      </div>

      <div className="rounded-[24px] border border-[#E7E8E4] bg-[#FFFEFC] p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <MapPin size={17} className="text-[#9A793F]" />
          <h3 className="font-display text-2xl text-[#153B60]">Choose delivery preference</h3>
        </div>
        <p className="mt-2 text-xs leading-5 text-[#71869A]">We&apos;ll confirm availability for your location and selected date.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-[#234B6B] sm:col-span-2">
            Delivery location
            <input value={deliveryLocation} onChange={(event) => setDeliveryLocation(event.target.value)} maxLength={120} placeholder="City, area, or PIN code" className="mt-2 w-full rounded-xl border border-[#D4E0E9] bg-white px-4 py-3 text-sm font-normal text-[#153B60] outline-none focus:border-[#9A793F]" />
          </label>
          <label className="text-sm font-semibold text-[#234B6B]">
            Preferred delivery date
            <span className="relative mt-2 block">
              <CalendarDays size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71869A]" />
              <input type="date" min={deliveryDateMin} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} className="w-full rounded-xl border border-[#D4E0E9] bg-white py-3 pl-10 pr-3 text-sm font-normal text-[#153B60] outline-none focus:border-[#9A793F]" />
            </span>
          </label>
          <label className="text-sm font-semibold text-[#234B6B]">
            Preferred time
            <select value={deliverySlot} onChange={(event) => setDeliverySlot(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D4E0E9] bg-white px-3 py-3 text-sm font-normal text-[#153B60] outline-none focus:border-[#9A793F]">
              <option>No preference</option>
              <option>Morning</option>
              <option>Afternoon</option>
              <option>Evening</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" disabled={canCustomize} onClick={() => onAddToBag(makeCartItem())} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#183B56] bg-white px-5 py-3 text-sm font-semibold text-[#183B56] transition hover:bg-[#F2F7FA] disabled:cursor-not-allowed disabled:opacity-45">
            <ShoppingBag size={16} /> Add to Cart · {formatPrice(product.price)}
          </button>
          <button type="button" disabled={canCustomize} onClick={() => onBuyNow(makeCartItem())} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#183B56] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#234D72] disabled:cursor-not-allowed disabled:opacity-45">
            Buy Now <ArrowRight size={16} />
          </button>
          {isSaved && whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#B7D8C6] bg-[#ECF7F0] px-5 py-3 text-sm font-semibold text-[#176B45] transition hover:bg-[#DFF1E6] sm:col-span-2">
              <MessageCircle size={16} /> Order via WhatsApp
            </a>
          )}
        </div>
        {isSaved && <p role="status" className="mt-3 flex items-center justify-center gap-2 text-xs text-[#33734F]"><Check size={14} /> Your design is saved and ready to order.</p>}
      </div>

      {customizerPanel}
    </section>
  );
}

export default PersonalizedProductCustomization;
