import { contactSubjects } from './contactSubjects';

const cleanPhoneNumber = (value) => value.replace(/\D/g, '');

export const contactConfig = {
  phone: import.meta.env.VITE_CONTACT_PHONE?.trim() || '',
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || '',
  address: import.meta.env.VITE_CONTACT_ADDRESS?.trim() || '',
  workingHours: import.meta.env.VITE_CONTACT_HOURS?.trim() || '',
  whatsapp: cleanPhoneNumber(import.meta.env.VITE_CONTACT_WHATSAPP?.trim() || ''),
  instagramUrl: import.meta.env.VITE_CONTACT_INSTAGRAM_URL?.trim() || '',
  mapsEmbedUrl: import.meta.env.VITE_CONTACT_MAPS_EMBED_URL?.trim() || '',
};

export { contactSubjects };

export const contactFAQs = [
  {
    question: 'How can I customize my gift?',
    answer: 'Choose a personalized product, add the name, message, design, or photo requested on its page, then contact us if you need help with your design.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery timing depends on the item, customization, and destination. Contact us with your order details and we can help check the expected timeline.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes. Contact us with your order number and the email or phone used at checkout, and we can help with an order update.',
  },
  {
    question: 'Can I cancel an order?',
    answer: 'Please contact us as soon as possible. Personalized orders may already be in preparation, so cancellation depends on the order status.',
  },
  {
    question: 'Do you offer bulk gifting?',
    answer: 'Send us a message with the quantity, occasion, and preferred delivery date. We can discuss the available options with you.',
  },
];
