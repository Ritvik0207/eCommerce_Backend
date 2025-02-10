const mongoose = require('mongoose');
const { defaultSortPlugin } = require('../utils/mongoosePlugin');

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxLength: [50, 'Subcategory name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description cannot exceed 200 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'Category is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
    },
    metaTitle: {
      type: String,
      maxLength: [60, 'Meta title should not exceed 60 characters'],
      trim: true,
    },
    metaDescription: {
      type: String,
      maxLength: [160, 'Meta description should not exceed 160 characters'],
      trim: true,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
subCategorySchema.index({ name: 'text' });
subCategorySchema.index({ slug: 1 });
subCategorySchema.index({ category: 1 });

// Virtual for products count
subCategorySchema.virtual('productsCount', {
  ref: 'product',
  localField: '_id',
  foreignField: 'subcategory',
  count: true,
});

subCategorySchema.plugin(defaultSortPlugin);

const subCategoryModel = mongoose.model('subCategory', subCategorySchema);
module.exports = subCategoryModel;
