const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        variantId: {
          type: [String, mongoose.Schema.Types.ObjectId],
          ref: 'ProductVariant',
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Regular functions have their own 'this' binding which is determined by how they are called
// Arrow functions inherit 'this' from the enclosing scope
// In mongoose schema methods, we need 'this' to refer to the document instance
// So we must use regular functions, not arrow functions
wishlistSchema.methods = {
  addItem: async function (productId, variantId) {
    const exists = this.items.some(
      (item) => item.product.toString() === productId.toString()
    );

    if (exists) {
      throw new Error('Product already exists in wishlist');
    }

    this.items.push({ product: productId, variantId: variantId });
    return this.save();
  },

  removeItem: async function (productId) {
    this.items = this.items.filter(
      (item) => item.product.toString() !== productId.toString()
    );
    return this.save();
  },
};

wishlistSchema.statics = {
  getByUser: function (userId) {
    // return [] if wishlist is not found
    return this.findOne({ user: userId })
      .populate('items.product')
      .sort('-updatedAt')
      .then((wishlist) => {
        return wishlist ? wishlist.items : [];
      });
  },
};

module.exports = mongoose.model('Wishlist', wishlistSchema);
