import { useState } from 'react';
import { ArrowRight, Camera, Clock3, Mail, MapPin, MessageCircle, Phone, Send, Sparkles } from 'lucide-react';
import { contactConfig, contactFAQs, contactSubjects } from '../data/contactConfig';

const safeMapEmbedUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['google.com', 'www.google.com'].includes(url.hostname) && url.pathname.startsWith('/maps/embed')
      ? url.toString()
      : '';
  } catch {
    return '';
  }
};

const safeInstagramUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && ['instagram.com', 'www.instagram.com'].includes(url.hostname)
      ? url.toString()
      : '';
  } catch {
    return '';
  }
};

const displayPhone = contactConfig.phone || 'Business phone not configured';
const displayEmail = contactConfig.email || 'Business email not configured';
const displayAddress = contactConfig.address || 'Shop address not configured';
const displayHours = contactConfig.workingHours || 'Please message us for current hours';
const mapEmbedUrl = safeMapEmbedUrl(contactConfig.mapsEmbedUrl);
const instagramUrl = safeInstagramUrl(contactConfig.instagramUrl);
const phoneHref = contactConfig.phone ? `tel:${contactConfig.phone.replace(/[^\d+]/g, '')}` : '';
const emailHref = contactConfig.email ? `mailto:${contactConfig.email}` : '';
const whatsappHref = contactConfig.whatsapp
  ? `https://wa.me/${contactConfig.whatsapp}?text=${encodeURIComponent('Hello, I would like help with a gift enquiry.')}`
  : '';

function ContactInfoCard({ icon: Icon, label, value, href }) {
  const content = (
    <>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3F8] text-[#183B56]">
        <Icon size={20} strokeWidth={1.7} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A793F]">{label}</span>
        <span className="mt-2 block break-words font-display text-lg leading-snug text-[#183B56]">{value}</span>
      </span>
    </>
  );

  return href ? (
    <a href={href} className="flex min-h-32 items-start gap-4 rounded-[22px] border border-[#E6E9E8] bg-white p-5 shadow-[0_14px_38px_rgba(24,59,86,0.05)] transition hover:-translate-y-1 hover:border-[#D9C69F] hover:shadow-[0_18px_42px_rgba(24,59,86,0.09)]">
      {content}
    </a>
  ) : (
    <div className="flex min-h-32 items-start gap-4 rounded-[22px] border border-[#E6E9E8] bg-white p-5 shadow-[0_14px_38px_rgba(24,59,86,0.05)]">
      {content}
    </div>
  );
}

function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [formMessage, setFormMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const enquiry = Object.fromEntries(formData.entries());

    setIsSubmitting(true);
    setFormStatus('idle');
    setFormMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });
      const result = await response.json();

      if (!response.ok) {
        setFormStatus('error');
        setFormMessage(result.error || 'We could not send your message. Please try again.');
        return;
      }

      form.reset();
      setFormStatus('success');
      setFormMessage(result.message || 'Thank you. Your message has been received.');
    } catch (error) {
      console.error('Contact enquiry submission failed.', error);
      setFormStatus('error');
      setFormMessage('We could not reach the contact service. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FBFAF7] text-[#183B56]">
      <section className="mx-auto max-w-7xl px-4 pb-10 pt-7 sm:px-6 sm:pb-14 sm:pt-12 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[30px] bg-[linear-gradient(115deg,#102D44_0%,#183B56_58%,#2B607B_100%)] px-6 py-12 text-white shadow-[0_28px_75px_rgba(24,59,86,0.18)] sm:rounded-[38px] sm:px-12 sm:py-16 lg:px-16">
          <div className="absolute -right-12 -top-20 -z-0 h-72 w-72 rounded-full border border-white/10 bg-white/[0.03] sm:right-12 sm:top-1/2 sm:-translate-y-1/2" />
          <div className="absolute right-10 top-12 -z-0 hidden h-36 w-36 rounded-full border border-[#D8C49B]/30 sm:block" />
          <div className="relative z-10 max-w-2xl">
            <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E4D4B5] sm:text-xs">
              <Sparkles size={14} />
              Here for every thoughtful detail
            </p>
            <h1 className="mt-5 font-display text-[clamp(2.7rem,8vw,5.2rem)] leading-[1.02]">Let&apos;s Get in Touch</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#E4EDF2] sm:text-lg">
              We&apos;re here to make your gifting experience special.
            </p>
          </div>
          <div className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-[#F4EBDD] sm:absolute sm:bottom-12 sm:right-12 sm:mt-0">
            Thoughtful help, from our team to you <ArrowRight size={14} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <div className="mb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A793F]">We&apos;re just a message away</p>
          <h2 className="mt-2 font-display text-3xl text-[#183B56] sm:text-4xl">Contact information</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <ContactInfoCard icon={Phone} label="Phone number" value={displayPhone} href={phoneHref} />
          <ContactInfoCard icon={Mail} label="Email address" value={displayEmail} href={emailHref} />
          <ContactInfoCard icon={MapPin} label="Shop address" value={displayAddress} />
          <ContactInfoCard icon={Clock3} label="Business hours" value={displayHours} />
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8">
          <div className="rounded-[28px] border border-[#E7EAE8] bg-[#FFFEFC] p-5 shadow-[0_22px_60px_rgba(24,59,86,0.06)] sm:p-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A793F]">We&apos;d love to hear from you</p>
            <h2 className="mt-2 font-display text-3xl text-[#183B56] sm:text-4xl">Send us a message</h2>
            <p className="mt-3 text-sm leading-6 text-[#657A89]">Share a few details and our team will be happy to help.</p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#234B6B]">
                  Full name
                  <input required name="fullName" minLength={2} maxLength={100} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#D7E1E7] bg-white px-4 py-3 outline-none transition focus:border-[#9A793F] focus:ring-2 focus:ring-[#9A793F]/10" placeholder="Your name" />
                </label>
                <label className="text-sm font-medium text-[#234B6B]">
                  Email address
                  <input required name="email" type="email" maxLength={254} autoComplete="email" className="mt-2 w-full rounded-xl border border-[#D7E1E7] bg-white px-4 py-3 outline-none transition focus:border-[#9A793F] focus:ring-2 focus:ring-[#9A793F]/10" placeholder="you@example.com" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#234B6B]">
                  Phone number
                  <input required name="phone" type="tel" maxLength={20} autoComplete="tel" className="mt-2 w-full rounded-xl border border-[#D7E1E7] bg-white px-4 py-3 outline-none transition focus:border-[#9A793F] focus:ring-2 focus:ring-[#9A793F]/10" placeholder="Your phone number" />
                </label>
                <label className="text-sm font-medium text-[#234B6B]">
                  Subject
                  <select required name="subject" defaultValue="" className="mt-2 w-full rounded-xl border border-[#D7E1E7] bg-white px-4 py-3 outline-none transition focus:border-[#9A793F] focus:ring-2 focus:ring-[#9A793F]/10">
                    <option value="" disabled>Choose a subject</option>
                    {contactSubjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                  </select>
                </label>
              </div>
              <label className="block text-sm font-medium text-[#234B6B]">
                Message
                <textarea required name="message" minLength={10} maxLength={2000} rows={5} className="mt-2 w-full resize-y rounded-xl border border-[#D7E1E7] bg-white px-4 py-3 outline-none transition focus:border-[#9A793F] focus:ring-2 focus:ring-[#9A793F]/10" placeholder="Tell us how we can help..." />
              </label>
              {formStatus !== 'idle' && (
                <p role={formStatus === 'error' ? 'alert' : 'status'} className={`rounded-xl px-4 py-3 text-sm leading-6 ${formStatus === 'error' ? 'bg-[#FFF0EF] text-[#9C3D35]' : 'bg-[#EDF7F0] text-[#286344]'}`}>
                  {formMessage}
                </p>
              )}
              <button type="submit" disabled={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#183B56] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(24,59,86,0.15)] transition hover:bg-[#234D72] disabled:cursor-wait disabled:opacity-65 sm:w-auto">
                <Send size={16} />
                {isSubmitting ? 'Sending message...' : 'Submit Message'}
              </button>
            </form>
          </div>

          <aside className="flex flex-col gap-5">
            <div className="rounded-[28px] bg-[#F4F1EA] p-5 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A793F]">Prefer a quick hello?</p>
              <h3 className="mt-2 font-display text-3xl text-[#183B56]">Let&apos;s talk gifts</h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {whatsappHref ? (
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#E6F3E9] px-4 py-3 text-sm font-semibold text-[#176B45] transition hover:bg-[#D8EBDD]">
                    <MessageCircle size={17} /> WhatsApp Us
                  </a>
                ) : (
                  <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-3 text-sm font-medium text-[#7C8C96]"><MessageCircle size={17} /> WhatsApp not configured</span>
                )}
                {phoneHref ? (
                  <a href={phoneHref} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#183B56] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#234D72]">
                    <Phone size={17} /> Call Now
                  </a>
                ) : (
                  <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white/70 px-4 py-3 text-sm font-medium text-[#7C8C96]"><Phone size={17} /> Call number not configured</span>
                )}
                {instagramUrl ? (
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#DCCFB8] bg-white px-4 py-3 text-sm font-semibold text-[#183B56] transition hover:bg-[#FCFAF5] sm:col-span-2">
                    <Camera size={17} /> Follow us on Instagram
                  </a>
                ) : (
                  <span className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#E2DDD2] bg-white/70 px-4 py-3 text-sm font-medium text-[#7C8C96] sm:col-span-2">
                    <Camera size={17} /> Instagram link not configured
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs leading-5 text-[#6D7F89]">Contact links are enabled when the business details are added to the environment configuration.</p>
            </div>

            <div className="min-h-64 flex-1 overflow-hidden rounded-[28px] border border-[#E3E8E9] bg-[#EAF1F4]">
              {mapEmbedUrl ? (
                <iframe title="Mr & Mrs Gifts shop location" src={mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full min-h-64 w-full border-0" />
              ) : (
                <div className="flex min-h-64 h-full flex-col items-center justify-center px-6 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#9A793F] shadow-sm"><MapPin size={24} /></span>
                  <h3 className="mt-4 font-display text-2xl text-[#183B56]">Find our shop</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#657A89]">The map will appear here once a Google Maps embed URL is configured.</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A793F]">A few helpful answers</p>
          <h2 className="mt-2 font-display text-3xl text-[#183B56] sm:text-4xl">Frequently asked questions</h2>
        </div>
        <div className="mt-8 divide-y divide-[#E6E9E8] rounded-[26px] border border-[#E6E9E8] bg-white px-5 shadow-[0_18px_48px_rgba(24,59,86,0.05)] sm:px-7">
          {contactFAQs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg text-[#183B56] marker:hidden">
                {faq.question}
                <span className="text-xl text-[#9A793F] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#657A89]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
