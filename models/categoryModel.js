const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
      trim: true,
      maxLength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description cannot exceed 200 characters'],
    },
    isProductForKids: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unisex'],
      required: [true, 'Gender is required'],
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subCategory',
      },
    ],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
categorySchema.index({ name: 'text' });
categorySchema.index({ slug: 1 });
categorySchema.index(
  { name: 1, gender: 1, isProductForKids: 1 },
  { unique: true }
);

// Virtual for products count
categorySchema.virtual('productsCount', {
  ref: 'product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;
