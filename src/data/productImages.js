const publicProductImages = {
  'luxury-hamper': '/gift-box-3d.png',
  'photo-frame': '/Golden%20Happy%20Married%20Life%20Plaque.png',
  'name-gift': '/Golden%20Happy%20Married%20Life%20Plaque.png',
  'chocolate-box': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80',
  'teddy-bear': 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=900&q=80',
  'candle-set': '/Romantic%20Crescent%20Moon%20LED%20Lamp.png',
  'birthday-box': '/gift-box-3d.png',
};

export const getProductImage = (product) =>
  publicProductImages[product.id] ?? product.image;
