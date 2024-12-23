const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        notes: {
          type: String,
          maxLength: 500,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
wishlistSchema.index({ user: 1 });

// Methods
wishlistSchema.methods.addItem = async function (productId, notes) {
  if (
    this.items.some((item) => item.product.toString() === productId.toString())
  ) {
    throw new Error('Product already exists in wishlist');
  }

  this.items.push({
    product: productId,
    notes: notes,
  });

  return this.save();
};

wishlistSchema.methods.removeItem = async function (productId) {
  this.items = this.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  return this.save();
};

// Static methods
wishlistSchema.statics.findUserWishlists = function (userId) {
  return this.find({ user: userId })
    .populate('items.product')
    .sort('-updatedAt');
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
