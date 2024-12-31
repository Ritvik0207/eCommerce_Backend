const mongoose = require('mongoose');
const { CRAFT_TYPES } = require('../constants/constants');

const artisanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Artisan name is required'],
      trim: true,
    },
    profileImage: {
      url: String,
      altText: String,
    },
    contactDetails: {
      phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      whatsapp: String,
    },
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      state: {
        type: String,
        required: [true, 'State is required'],
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
      },
      country: {
        type: String,
        default: 'India',
      },
    },
    specialization: [
      {
        craftType: {
          type: String,
          enum: Object.values(CRAFT_TYPES),
          default: CRAFT_TYPES.OTHER,
        },
        experience: Number,
        description: String,
      },
    ],
    certifications: [
      {
        name: String,
        certificateNumber: String,
        issuedBy: String,
        validFrom: Date,
        validUntil: Date,
        documentUrl: String,
      },
    ],
    awards: [
      {
        title: String,
        year: Number,
        issuedBy: String,
        description: String,
      },
    ],
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shop',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'blocked'],
      default: 'active',
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
      branch: String,
    },
    identityProof: {
      type: {
        type: String,
        enum: ['Aadhar', 'PAN', 'Voter ID', 'Driving License'],
        required: true,
      },
      number: {
        type: String,
        required: true,
      },
      documentUrl: String,
    },
    bio: {
      type: String,
      trim: true,
    },
    languages: [
      {
        type: String,
      },
    ],
    ratings: {
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual populate for products created by this artisan
artisanSchema.virtual('products', {
  ref: 'product',
  foreignField: 'artisan',
  localField: '_id',
});

// Indexes for better query performance
artisanSchema.index({ name: 'text' });
artisanSchema.index({ 'specialization.craftType': 1 });
artisanSchema.index({ status: 1 });

const artisanModel = mongoose.model('artisan', artisanSchema);
module.exports = artisanModel;
