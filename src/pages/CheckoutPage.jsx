import { useState } from 'react';
import { ArrowLeft, Check, LockKeyhole, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`;

function CheckoutPage({ items, onOrderPlaced }) {
  const navigate = useNavigate();
  const [orderItems, setOrderItems] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Cash on delivery');
  const subtotal = (orderPlaced ? orderItems : items).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const displayedItems = orderPlaced ? orderItems : items;

  const handleSubmit = (event) => {
    event.preventDefault();
    setOrderItems(items);
    setOrderPlaced(true);
    onOrderPlaced();
  };

  if (orderPlaced) {
    return (
      <main className="min-h-screen bg-[#F5F9FC] px-4 py-10 text-[#183B56] sm:py-16">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-[#E3EDF4] bg-white p-8 text-center shadow-[0_30px_80px_rgba(24,59,86,0.09)] sm:p-12">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF7FC] text-[#087CC1]">
            <Check size={30} />
          </div>
          <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#6a8194]">Thank you for choosing us</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">Your order is ready.</h1>
          <p className="mt-4 leading-7 text-[#5d7383]">
            Your order details have been collected in this demo. No payment was processed and no order was sent to a store.
          </p>
          <div className="mt-8 rounded-[24px] bg-[#F5F9FC] p-5 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-[#5d7383]">Order total</span>
              <span className="text-xl font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-2 text-sm text-[#5d7383]">Payment preference: {paymentMethod}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#183B56] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#234d72]"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F9FC] px-4 text-center text-[#183B56]">
        <div className="max-w-md rounded-[32px] border border-[#E3EDF4] bg-white p-8 shadow-[0_30px_80px_rgba(24,59,86,0.09)]">
          <ShoppingBag size={30} className="mx-auto text-[#5d7383]" />
          <h1 className="mt-5 font-display text-4xl">Your bag is empty</h1>
          <p className="mt-3 text-sm leading-6 text-[#5d7383]">Add a thoughtful gift before you head to checkout.</p>
          <button type="button" onClick={() => navigate('/')} className="mt-7 rounded-full bg-[#183B56] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white">
            Back to shop
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F5F9FC] px-4 py-6 text-[#183B56] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E3EDF4] pb-5">
          <Logo />
          <button type="button" onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-sm font-medium text-[#5d7383] transition hover:text-[#183B56]">
            <ArrowLeft size={16} />
            Back to shop
          </button>
        </header>

        <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6a8194]">
          <span className="text-[#183B56]">01 Bag</span>
          <span className="h-px w-8 bg-[#D9E7EF]" />
          <span className="text-[#183B56]">02 Delivery</span>
          <span className="h-px w-8 bg-[#D9E7EF]" />
          <span>03 Confirmation</span>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-[28px] border border-[#E3EDF4] bg-white p-6 shadow-[0_18px_50px_rgba(24,59,86,0.05)] sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a8194]">Delivery details</p>
              <h1 className="mt-2 font-display text-4xl">Where should we send it?</h1>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-[#183B56]">
                  Full name
                  <input required name="fullName" autoComplete="name" className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="Your name" />
                </label>
                <label className="text-sm font-medium text-[#183B56]">
                  Phone number
                  <input required name="phone" type="tel" autoComplete="tel" pattern="[0-9+\-\s()]{10,15}" className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="+91 98765 43210" />
                </label>
                <label className="text-sm font-medium text-[#183B56] sm:col-span-2">
                  Email address
                  <input required name="email" type="email" autoComplete="email" className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="you@example.com" />
                </label>
                <label className="text-sm font-medium text-[#183B56] sm:col-span-2">
                  Address
                  <textarea required name="address" autoComplete="street-address" rows="3" className="mt-2 w-full resize-y rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="House number, street, area" />
                </label>
                <label className="text-sm font-medium text-[#183B56]">
                  City
                  <input required name="city" autoComplete="address-level2" className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="City" />
                </label>
                <label className="text-sm font-medium text-[#183B56]">
                  PIN code
                  <input required name="postalCode" autoComplete="postal-code" inputMode="numeric" pattern="[0-9]{6}" className="mt-2 w-full rounded-2xl border border-[#D9E7EF] bg-[#FBFDFF] px-4 py-3 outline-none transition focus:border-[#87CEEB]" placeholder="6-digit PIN code" />
                </label>
              </div>
            </section>

            <section className="rounded-[28px] border border-[#E3EDF4] bg-white p-6 shadow-[0_18px_50px_rgba(24,59,86,0.05)] sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a8194]">Payment preference</p>
              <h2 className="mt-2 font-display text-3xl">Choose how you&apos;d like to pay</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {['Cash on delivery', 'UPI on delivery'].map((method) => (
                  <label key={method} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm font-medium transition ${paymentMethod === method ? 'border-[#183B56] bg-[#F2F8FC]' : 'border-[#D9E7EF] bg-white'}`}>
                    <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={(event) => setPaymentMethod(event.target.value)} />
                    {method}
                  </label>
                ))}
              </div>
            </section>

            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#183B56] px-6 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_40px_rgba(24,59,86,0.18)] transition hover:bg-[#234d72]">
              Place order · {formatPrice(subtotal)}
            </button>
            <p className="flex items-center justify-center gap-2 text-center text-xs text-[#6a8194]">
              <LockKeyhole size={14} />
              Demo checkout — no payment details are collected or processed.
            </p>
          </form>

          <aside className="rounded-[28px] border border-[#E3EDF4] bg-white p-6 shadow-[0_18px_50px_rgba(24,59,86,0.05)] sm:p-8 lg:sticky lg:top-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#6a8194]">Your selection</p>
                <h2 className="mt-2 font-display text-3xl">Order summary</h2>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7FC] text-[#183B56]">
                <ShoppingBag size={18} />
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {displayedItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-[#EEF2F5] pb-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="h-20 w-16 rounded-xl object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-[#183B56] px-1 text-xs font-semibold text-white">{item.quantity}</span>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#183B56]">{item.name}</p>
                    <p className="shrink-0 text-sm font-semibold">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between text-[#5d7383]"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-[#5d7383]"><span>Delivery</span><span className="font-medium text-[#087CC1]">Complimentary</span></div>
              <div className="flex justify-between border-t border-[#E3EDF4] pt-4 text-base font-semibold text-[#183B56]"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
            </div>
            <p className="mt-5 rounded-2xl bg-[#F2F8FC] p-4 text-xs leading-5 text-[#5d7383]">Every order is carefully packed with a little extra joy.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
