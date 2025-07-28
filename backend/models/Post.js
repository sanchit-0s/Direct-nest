
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  bedroom: {
    type: Number,
    required: true
  },
  bathroom: {
    type: Number,
    required: true
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['buy', 'rent'],
    required: true
  },
  property: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'land'],
    required: true
  },
  utilities: {
    type: String,
    required: true
  },
  pet: {
    type: String,
    enum: ['allowed', 'not-allowed'],
    required: true
  },
  income: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  school: {
    type: Number,
    required: true
  },
  bus: {
    type: Number,
    required: true
  },
  restaurant: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);