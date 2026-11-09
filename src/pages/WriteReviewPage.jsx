import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Check, ImagePlus, MessageCircleHeart, ShieldCheck, Star, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './WriteReviewPage.css';

const REVIEW_STORAGE_KEY = 'inbas-mr-mrs-gifts-reviews';
const MAX_IMAGE_SIZE = 1024 * 1024;

const readImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('We could not read that image. Please try another file.'));
    reader.readAsDataURL(file);
  });

function WriteReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      event.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError('Please choose an image smaller than 1 MB.');
      event.target.value = '';
      return;
    }

    setError('');
    setImage(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!rating) {
      setError('Please select a star rating before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData(event.currentTarget);
      const storedReviews = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) ?? '[]');
      if (!Array.isArray(storedReviews)) {
        throw new Error('Saved review data is not in the expected format.');
      }

      const review = {
        id: crypto.randomUUID(),
        customerName: formData.get('customerName').trim(),
        email: formData.get('email').trim(),
        productName: formData.get('productName').trim(),
        rating,
        title: formData.get('title').trim(),
        description: formData.get('description').trim(),
        image: image ? await readImage(image) : null,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };

      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify([...storedReviews, review]));
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof SyntaxError
          ? 'Saved review data could not be read. Please contact us before trying again.'
          : submissionError.message || 'Your review could not be saved. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const animationProps = prefersReducedMotion
    ? {}
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45 } };

  return (
    <main className="review-page">
      <div className="review-page__glow review-page__glow--one" aria-hidden="true" />
      <div className="review-page__glow review-page__glow--two" aria-hidden="true" />

      <header className="review-page__header">
        <Link to="/" className="review-page__brand" aria-label="Inba's Mr & Mrs Gifts home">
          <span className="review-page__brand-mark"><MessageCircleHeart size={20} /></span>
          <span>INBA&apos;S <span>MR &amp; MRS GIFTS</span></span>
        </Link>
        <Link to="/#customer-reviews" className="review-page__back">
          <ArrowLeft size={16} />
          <span>Back to reviews</span>
        </Link>
      </header>

      <section className="review-page__content">
        <motion.div className="review-page__intro" {...animationProps}>
          <span className="review-page__eyebrow"><span /> A NOTE FROM YOU, A MEMORY FOR US <span /></span>
          <h1>Every little story <em>matters.</em></h1>
          <p>Tell us about the moment, the details, and the gift that made it special.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.section
              key="success"
              className="review-success"
              {...animationProps}
              role="status"
              aria-live="polite"
            >
              <span className="review-success__icon"><Check size={30} /></span>
              <p className="review-page__eyebrow">THANK YOU FOR SHARING</p>
              <h2>Your words are in good hands.</h2>
              <p className="review-success__copy">
                Your review has been saved on this device and is awaiting approval. It won&apos;t appear publicly unless it is approved.
              </p>
              <Link to="/" className="review-page__submit">Back to Inba&apos;s</Link>
            </motion.section>
          ) : (
            <motion.form
              key="form"
              className="review-form"
              onSubmit={handleSubmit}
              {...animationProps}
            >
              <div className="review-form__top">
                <div>
                  <p className="review-form__kicker">YOUR EXPERIENCE</p>
                  <h2>Write a review</h2>
                </div>
                <div className="review-form__secure"><ShieldCheck size={16} /> Private &amp; thoughtful</div>
              </div>

              <div className="review-form__grid">
                <label className="review-field">
                  <span>Your name <b>*</b></span>
                  <input name="customerName" type="text" autoComplete="name" placeholder="How should we address you?" minLength={2} maxLength={80} required />
                </label>
                <label className="review-field">
                  <span>Email address <b>*</b></span>
                  <input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required />
                  <small>Your email is only used to follow up about your review.</small>
                </label>
                <label className="review-field review-field--full">
                  <span>Product name <small>Optional</small></span>
                  <input name="productName" type="text" placeholder="What did you gift or receive?" maxLength={120} />
                </label>
              </div>

              <fieldset className="review-rating">
                <legend>Your rating <b>*</b></legend>
                <div className="review-rating__stars" onMouseLeave={() => setHoveredRating(0)}>
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isActive = value <= (hoveredRating || rating);
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        className={`review-rating__star${isActive ? ' is-active' : ''}`}
                        onMouseEnter={() => setHoveredRating(value)}
                        onFocus={() => setHoveredRating(value)}
                        onBlur={() => setHoveredRating(0)}
                        onClick={() => { setRating(value); setError(''); }}
                        whileHover={prefersReducedMotion ? undefined : { scale: 1.18, rotate: value % 2 ? -7 : 7 }}
                        whileTap={prefersReducedMotion ? undefined : { scale: 0.9 }}
                        aria-label={`${value} ${value === 1 ? 'star' : 'stars'}`}
                        aria-pressed={rating === value}
                      >
                        <Star size={30} fill={isActive ? 'currentColor' : 'none'} />
                      </motion.button>
                    );
                  })}
                  <span className="review-rating__hint">{rating ? `${rating} out of 5` : 'Tap to rate'}</span>
                </div>
              </fieldset>

              <label className="review-field review-field--full">
                <span>Give your review a title <b>*</b></span>
                <input name="title" type="text" placeholder="Sum up your experience" minLength={3} maxLength={100} required />
              </label>

              <label className="review-field review-field--full">
                <span>Your review <b>*</b></span>
                <textarea name="description" rows="5" placeholder="What did you love? How did your gift make the occasion feel?" minLength={20} maxLength={2000} required />
                <small>A little detail helps other gift-givers choose with confidence.</small>
              </label>

              <div className="review-upload">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  aria-label="Upload an optional review photo"
                />
                <div className="review-upload__copy">
                  <span className="review-upload__icon"><ImagePlus size={19} /></span>
                  <span><strong>Add a photo</strong><small>Optional · JPG, PNG or WebP · up to 1 MB</small></span>
                </div>
                <button type="button" className="review-upload__button" onClick={() => fileInputRef.current?.click()}>
                  {image ? 'Change photo' : 'Choose photo'}
                </button>
                {image && (
                  <div className="review-upload__selected">
                    <span>{image.name}</span>
                    <button type="button" onClick={() => { setImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} aria-label="Remove selected photo">
                      <X size={15} />
                    </button>
                  </div>
                )}
              </div>

              {error && <p className="review-form__error" role="alert">{error}</p>}

              <div className="review-form__footer">
                <p><ShieldCheck size={16} /> Reviews are checked before they can be shown publicly.</p>
                <button type="submit" className="review-page__submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving your review…' : 'Submit review'}
                  {!isSubmitting && <ArrowLeft size={16} className="review-page__submit-arrow" />}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="review-page__footnote">Thank you for helping make every gift a little more meaningful.</p>
      </section>
    </main>
  );
}

export default WriteReviewPage;
