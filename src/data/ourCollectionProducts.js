import { products as sampleProducts } from './mockData';

const imageDirectory = '/Webp%20image/Webp%20image';

const collectionItems = [
  {
    id: 'collection-crystal-photo',
    name: '3D Crystal Photo Engraving Gift',
    category: 'Personalized Keepsakes',
    image: '3d-crystal-photo-engraving-personalized-gift.webp',
    imageAlt: '3D laser engraved crystal photo gifts featuring personalized couple portraits, heart shaped crystal and rose engraving.',
    priceSourceId: 'photo-frame',
  },
  {
    id: 'collection-photo-frame',
    name: 'Customized Acrylic Photo Frame',
    category: 'Photo Gifts',
    image: 'customized-acrylic-photo-frame-personalized-picture.webp',
    imageAlt: 'Customized transparent acrylic photo frames displaying personalized family portraits, couple pictures and individual photos.',
    priceSourceId: 'photo-frame',
  },
  {
    id: 'collection-keychain',
    name: 'Personalized Acrylic Photo Keychain',
    category: 'Personalized Keepsakes',
    image: 'customized-acrylic-photo-keychain-personalized.webp',
    imageAlt: 'Customized acrylic photo keychains with personalized couple, baby and family pictures in multiple shapes.',
    priceSourceId: 'name-gift',
  },
  {
    id: 'collection-mobile-cover',
    name: 'Customized Photo Mobile Back Cover',
    category: 'Personalized Accessories',
    image: 'customized-photo-mobile-back-cover-personalized.webp',
    imageAlt: 'Customized mobile phone back covers featuring personalized couple photographs, name designs and cute Krishna artwork.',
    priceSourceId: 'name-gift',
  },
  {
    id: 'collection-crystal-led',
    name: 'Glass Crystal Engraving LED Light',
    category: 'Personalized Lamps',
    image: 'glass-crystal-engraving-led-light-personalized-gift.webp',
    imageAlt: 'Personalized glass crystal engraving gifts with LED illuminated photo plaques, couple portraits and decorative crystal designs.',
    priceSourceId: 'candle-set',
  },
  {
    id: 'collection-photo-clock',
    name: 'Personalized Acrylic Photo Clock',
    category: 'Photo Gifts',
    image: 'personalized-acrylic-photo-clock-custom-gift.webp',
    imageAlt: 'Customized acrylic photo clocks in round, heart and square shapes with personalized family and baby photos.',
    priceSourceId: 'photo-frame',
  },
  {
    id: 'collection-engraved-pen',
    name: 'Personalized Engraved Wooden Pen',
    category: 'Personalized Accessories',
    image: 'personalized-engraved-metal-wooden-pen-gift.webp',
    imageAlt: 'Personalized engraved metal and wooden ballpoint pens with custom names and premium gift presentation boxes.',
    priceSourceId: 'name-gift',
  },
  {
    id: 'collection-name-jewellery',
    name: 'Personalized Gold Name Necklace & Bracelet',
    category: 'Personalized Jewellery',
    image: 'personalized-gold-name-necklace-bracelet-gift.webp',
    imageAlt: 'Personalized gold name bar necklace and engraved name bracelet with custom lettering for birthday and anniversary gifts.',
    priceSourceId: 'name-gift',
  },
  {
    id: 'collection-led-photo-lamp',
    name: 'Personalized LED Photo Lamp',
    category: 'Personalized Lamps',
    image: 'personalized-led-photo-lamp-anniversary-gift.webp',
    imageAlt: 'Personalized LED photo lamp with romantic couple photo and glowing heart design for anniversary and Valentine\'s Day gift.',
    priceSourceId: 'candle-set',
  },
  {
    id: 'collection-moon-lamp',
    name: 'Personalized Moon Photo Lamp',
    category: 'Personalized Lamps',
    image: 'personalized-moon-lamp-photo-engraving-gift.webp',
    imageAlt: 'Personalized 3D moon lamps with engraved couple and baby photos, warm LED lighting and wooden display stands.',
    priceSourceId: 'candle-set',
  },
  {
    id: 'collection-photo-calendar',
    name: 'Personalized Photo Table Calendar',
    category: 'Photo Gifts',
    image: 'personalized-photo-table-calendar-customized-gift.webp',
    imageAlt: 'Personalized tabletop photo calendars featuring customized couple pictures, family photographs and decorative calendar designs.',
    priceSourceId: 'photo-frame',
  },
  {
    id: 'collection-engraved-bottle',
    name: 'Personalized Engraved Steel Water Bottle',
    category: 'Personalized Accessories',
    image: 'personalized-stainless-steel-water-bottle-engraving.webp',
    imageAlt: 'Personalized stainless steel water bottles with custom name engraving, black digital temperature display and stylish designs.',
    priceSourceId: 'name-gift',
  },
];

export const ourCollectionProducts = collectionItems.map((item) => {
  const priceSource = sampleProducts.find((product) => product.id === item.priceSourceId);
  const { priceSourceId: _priceSourceId, image, ...product } = item;

  return {
    ...product,
    price: priceSource.price,
    originalPrice: priceSource.originalPrice,
    image: `${imageDirectory}/${image}`,
  };
});
