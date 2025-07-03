import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  address: {
    type: String,
    trim: true,
    default: ''
  },
  queries: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const contactModel = mongoose.models.contact || mongoose.model('contact', contactSchema);

export default contactModel;