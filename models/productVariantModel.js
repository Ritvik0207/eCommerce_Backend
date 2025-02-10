const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const productVariantSchema = new mongoose.Schema(
  {
    // images
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Color and design variations
    color: {
      name: {
        type: String,
        required: [true, 'Color name is required'],
      },
      code: String, // Hex or RGB code
      description: String,
    },
    pattern: {
      name: String,
      description: String,
    },

    // Size variations
    size: {
      value: {
        type: String,
        required: [true, 'Size value is required'],
      },
      measurements: {
        length: {
          value: Number,
          unit: {
            type: String,
            enum: ['cm', 'inches', 'meters'],
            default: 'cm',
          },
        },
        width: {
          value: Number,
          unit: {
            type: String,
            enum: ['cm', 'inches', 'meters'],
            default: 'cm',
          },
        },
      },
      sizeChart: String, // URL to size chart image
    },

    // Pricing and stock
    price: {
      basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Price cannot be negative'],
      },
      markup: {
        type: Number,
        default: 15,
        min: [0, 'Markup cannot be negative'],
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
        max: [100, 'Discount cannot exceed 100%'],
      },
      markedUpPrice: {
        type: Number,
        default: 0,
      },
      discountedPrice: {
        type: Number,
        default: 0,
      },
    },

    stock: {
      quantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: 0,
      },
      status: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'low_stock'],
        default: 'in_stock',
      },
    },

    // Reference to parent product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'review',
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    showInCarousel: {
      type: Boolean,
      default: false,
    },

    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'artisan',
    },

    // Certifications and authenticity
    certifications: [
      {
        name: String,
        certificateNumber: String,
        issuedBy: String,
        validUntil: Date,
      },
    ],

    // Geographic indication
    geographicIndication: {
      region: String, // Example: "Kanchipuram"
      state: String, // Example: "Tamil Nadu"
      isGICertified: Boolean, // Example: true - indicates product has GI certification
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Pre-save middleware to calculate prices
productVariantSchema.pre('save', function (next) {
  // Calculate markedUpPrice
  let markedUpPrice = Math.floor(
    this.price.basePrice * (1 + this.price.markup / 100)
  );
  if (markedUpPrice > 50 && markedUpPrice % 10 === 0) {
    markedUpPrice = markedUpPrice - 1;
  }
  this.price.markedUpPrice = markedUpPrice;

  // Calculate discountedPrice
  let discountedPrice = Math.floor(
    markedUpPrice * (1 - this.price.discount / 100)
  );
  if (discountedPrice > 50 && discountedPrice % 10 === 0) {
    discountedPrice = discountedPrice - 1;
  }
  this.price.discountedPrice = discountedPrice;

  next();
});

// Pre-find middleware to ensure prices are calculated
productVariantSchema.pre(
  ['find', 'findOne', 'findOneAndUpdate', 'findById'],
  function () {
    this.lean(false); // Ensure we get Mongoose documents
  }
);

// Post-find middleware to calculate prices for all results
productVariantSchema.post(
  ['find', 'findOne', 'findOneAndUpdate', 'findById'],
  // biome-ignore lint/complexity/useArrowFunction: <explanation>
  function (docs) {
    if (!docs) return;

    // Handle both single doc and array of docs
    const documents = Array.isArray(docs) ? docs : [docs];

    for (const doc of documents) {
      if (!doc || !doc.price) return;

      // Calculate markedUpPrice
      let markedUpPrice = Math.floor(
        doc.price.basePrice * (1 + doc.price.markup / 100)
      );
      if (markedUpPrice > 50 && markedUpPrice % 10 === 0) {
        markedUpPrice = markedUpPrice - 1;
      }
      doc.price.markedUpPrice = markedUpPrice;

      // Calculate discountedPrice
      let discountedPrice = Math.floor(
        markedUpPrice * (1 - doc.price.discount / 100)
      );
      if (discountedPrice > 50 && discountedPrice % 10 === 0) {
        discountedPrice = discountedPrice - 1;
      }
      doc.price.discountedPrice = discountedPrice;
    }
  }
);

// Indexes for better query performance
productVariantSchema.index({ 'stock.status': 1 });
productVariantSchema.index({ product: 1 });

const productVariantModel = mongoose.model(
  'productVariants',
  productVariantSchema
);

productVariantSchema.plugin(defaultSortPlugin);

module.exports = productVariantModel;
