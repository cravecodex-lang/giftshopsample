import mongoose from 'mongoose';
import { contactSubjects } from '../../src/data/contactSubjects.js';

const contactEnquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      match: /^[0-9+()\s-]{7,20}$/,
    },
    subject: {
      type: String,
      required: true,
      enum: contactSubjects,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
  },
  { timestamps: true, versionKey: false },
);

const ContactEnquiry = mongoose.models.ContactEnquiry
  || mongoose.model('ContactEnquiry', contactEnquirySchema);

export default ContactEnquiry;
