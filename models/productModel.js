const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const productSchema = new mongoose.Schema(
  {
    // Base image
    baseImage: {
      url: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
        default: 'Product image',
      },
    },

    // Basic product details
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxLength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxLength: [200, 'Short description cannot exceed 200 characters'],
    },

    // Product categorization
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: true,
    },
    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'subCategory',
      // required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'shop',
      required: true,
    },

    // Product specifications
    specifications: {
      // Common specifications for all handloom products
      material: {
        type: String,
        default: 'Other',
      },
      weaveType: {
        type: String,
      },
      craftTechnique: String,
      careInstructions: String,

      // Optional specifications based on product type
      fabricCount: String, // For sarees, dhotis etc
      borderType: String,
      borderWidth: String,
      palluDetails: String,
      threadCount: Number,
      zariType: String,
    },

    // Target audience
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unisex'],
      default: 'Unisex',
    },
    ageGroup: {
      type: String,
      enum: ['Adult', 'Kids', 'All'],
      default: 'Adult',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },
    isVisible: {
      type: Boolean,
      default: true,
    },

    // SEO fields
    metaTitle: {
      type: String,
      maxLength: [60, 'Meta title should not exceed 60 characters'],
      trim: true,
      // Example: "Handwoven Silk Saree with Zari Border | Traditional Kanchipuram"
    },
    metaDescription: {
      type: String,
      maxLength: [160, 'Meta description should not exceed 160 characters'],
      trim: true,
      // Example: "Elegant handcrafted Kanchipuram silk saree with pure zari border. Features traditional temple designs and contrast pallu. Perfect for weddings and festivals."
    },
    keywords: [
      {
        type: String,
        trim: true,
        // Examples: ["silk saree", "kanchipuram silk", "wedding saree", "traditional saree", "handloom", "zari work"]
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for variants with nested virtuals
productSchema.virtual('variants', {
  ref: 'productVariants',
  localField: '_id',
  foreignField: 'product',
  options: { virtuals: true }, // Enable nested virtuals
});

// Index for better search performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ 'specifications.material': 1 });
productSchema.index({ category: 1, subcategory: 1 });

productSchema.plugin(defaultSortPlugin);

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
