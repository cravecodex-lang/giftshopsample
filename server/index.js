import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import ContactEnquiry from './models/ContactEnquiry.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.disable('x-powered-by');
app.use(express.json({ limit: '10kb' }));

app.post('/api/contact', async (request, response) => {
  const body = request.body;

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return response.status(400).json({ error: 'Please submit a valid contact enquiry.' });
  }

  const enquiry = new ContactEnquiry({
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    subject: body.subject,
    message: body.message,
  });

  try {
    await enquiry.validate();
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({
        error: 'Please check the contact details and message, then try again.',
      });
    }
    console.error('Contact enquiry validation failed.', error);
    return response.status(500).json({ error: 'We could not validate your enquiry.' });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({
      error: 'The enquiry service is temporarily unavailable. Please try again later.',
    });
  }

  try {
    await enquiry.save();
    return response.status(201).json({ message: 'Thank you. Your message has been received.' });
  } catch (error) {
    console.error('Contact enquiry could not be saved.', error);
    return response.status(500).json({ error: 'We could not save your message. Please try again.' });
  }
});

app.use((error, request, response, _next) => {
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Your message is too large. Please shorten it and try again.' });
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return response.status(400).json({ error: 'Please submit valid JSON contact details.' });
  }
  console.error('Unexpected contact API error.', error);
  return response.status(500).json({ error: 'The contact service encountered an error.' });
});

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI).catch(() => {
    console.error('MongoDB connection failed. Contact enquiries cannot be stored until it is available.');
  });
} else {
  console.error('MONGODB_URI is not configured. Contact enquiries will return a service-unavailable response.');
}

app.listen(port, () => {
  console.log(`Contact API listening on port ${port}.`);
});
