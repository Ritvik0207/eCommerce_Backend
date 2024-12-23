const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shop name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Shop description is required'],
      trim: true,
    },
    logo: {
      url: {
        type: String,
        // required: [true, 'Shop logo is required'],
      },
      altText: String,
    },
    bannerImage: {
      url: {
        type: String,
      },
      altText: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'admin',
      required: true,
    },
    contactEmail: {
      type: String,
      // required: [true, 'Contact email is required'],
      lowercase: true,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
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
        required: [true, 'Country is required'],
        default: 'India',
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
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
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      website: String,
    },
  },
  {
    timestamps: true,
    // These options enable virtual fields to be included when converting documents to JSON/Objects
    // toJSON: { virtuals: true } - Includes virtuals when document is converted to JSON (e.g. res.json())
    // toObject: { virtuals: true } - Includes virtuals when document is converted to a plain object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },

    // Example usage:
    // const shop = await Shop.findById(id);
    // console.log(shop.toJSON()); // Will include virtual 'products' field
    // const shopObj = shop.toObject(); // Will include virtual 'products' field
    // Both will output something like:
    // {
    //   name: "My Shop",
    //   address: {...},
    //   products: [
    //     { name: "Product 1", price: 100 },
    //     { name: "Product 2", price: 200 }
    //   ]
    // }
  }
);

// Virtual populate for products
shopSchema.virtual('products', {
  ref: 'product',
  foreignField: 'shop',
  localField: '_id',
});

const shopModel = mongoose.model('shop', shopSchema);
module.exports = shopModel;
