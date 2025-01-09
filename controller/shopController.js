const asyncHandler = require('express-async-handler');
const shopModel = require('../models/shopModel');
const productModel = require('../models/productModel');
const adminModel = require('../models/adminModel');
const { uploadFile } = require('../upload/upload');
const cloudinary = require('cloudinary').v2;

// create a new shop
const createShop = asyncHandler(async(req, res) => {
    const info = req.body;
    const {files} = req;

    const existingShop = await shopModel.findOne({name: info.name});

    if (existingShop) {
        res.statusCode = 400;
        throw new Error('This shop name is already taken.');
    }

    let logoUrl = '';
    let bannerImageUrl = '';

    if (files.logo) {
        logoUrl = await uploadFile(files.logo[0]);
    }

    if (files.bannerImageUrl) {
        bannerImageUrl = await uploadFile(files.bannerImage[0]);
    }

    const newShop = await shopModel.create({
        name: info.name,
        description: info.description,
        owner: info.owner,
        contactEmail: info.contactEmail,
        contactPhone: info.contactPhone,
        address: {
            street: info.street,
            city: info.city,
            state: info.state,
            pincode: info.pincode,
            country: info.country || 'India',
        },
        logo: {
            url: logoUrl,
            altText: info.logoAltText || '',
        },
        bannerImage: {
            url: bannerImageUrl,
            altText: info.bannerImageAltText || '',
        },
        status: info.status || 'active',
        socialMedia: {
            factbook: info.facebook || '',
            instagram: info.instagram || '',
            twitter: info.twitter || '',
            website: info.website || '',
        }
    });

    const admin = await adminModel.findById(info.owner);

    if (!admin) {
        res.statusCode = 404;
        throw new Error('owner not found');
    }
    admin.shop = newShop._id;
    await admin.save();

    res.status(201).json({
        success: true,
        message: 'Shop successfully created', 
        shop: newShop
    })
})

// update details of a shop
const updateShop = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const info = req.body;
    const { files } = req;

    const shop = await shopModel.findById(id);

    if (!shop) {
        res.statusCode = 404;
        throw new Error('Shop not found');
    }

    let logoUrl = shop.logo.url;
    let bannerImageUrl = shop.bannerImage.url;

    if (files.logo) {
        // destroy the previous logo
        if (shop.logo.url) {
            const oldLogoPublicId = shop.logo.url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(oldLogoPublicId);
        }
        logoUrl = await uploadFile(files.logo[0]);
    }

    if (files.bannerImage) {
        // destroy previous banner
        if (shop.bannerImage.url) {
            const oldBannerPublicId = shop.bannerImage.url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(oldBannerPublicId);
        }
        bannerImageUrl = await uploadFile(files.bannerImage[0]);
    }

    shop.name = info.name || shop.name;
    shop.description = info.description || shop.description;
    shop.contactEmail = info.contactEmail || shop.contactEmail;
    shop.contactPhone = info.contactPhone || shop.contactPhone;
    shop.address.street = info.street || shop.address.street;
    shop.address.city = info.city || shop.address.city;
    shop.address.state = info.state || shop.address.state;
    shop.address.pincode = info.pincode || shop.address.pincode;
    shop.address.country = info.country || shop.address.country;
    shop.logo.url = logoUrl;
    shop.logo.altText = info.logoAltText || shop.logo.altText;
    shop.bannerImage.url = bannerImageUrl;
    shop.bannerImage.altText = info.bannerImageAltText || shop.bannerImage.altText;
    shop.socialMedia.facebook = info.facebook || shop.socialMedia.facebook;
    shop.socialMedia.instagram = info.instagram || shop.socialMedia.instagram;
    shop.socialMedia.twitter = info.twitter || shop.socialMedia.twitter;
    shop.socialMedia.website = info.website || shop.socialMedia.website;
    shop.status = info.status || shop.status;

    const updatedShop = await shop.save();

    res.status(200).json({
        success: true, 
        message: 'Shop successfully updated',
        shop: updatedShop
    });
});

// get all details of a shop
const getShopDetails = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const shop = await shopModel.findById(id).populate('products');

    if (!shop) {
        res.statusCode = 404;
        throw new Error('Shop not found');
    }

    res.status(200).json({
        success: true,
        shop
    })
})

// delete a shop
const deleteShop = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const shop = await shopModel.findById(id);

    if (!shop) {
        res.statusCode = 404;
        throw new Error('Shop not found');
    }

    // delete images in cloudinary first (logo and banner)
    if (shop.logo?.url) {
        const logoPublicId = shop.logo.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(logoPublicId);
    }

    if (shop.bannerImage?.url) {
        const bannerPublicId = shop.bannerImage.url.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(bannerPublicId);
    }

    const admin = await adminModel.findById(shop.owner);
    if (admin) {
        admin.shop = null;
        await admin.save();
    }
    
    await shop.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Shop successfully deleted'
    });
})

// get all products for a shop
const getAllProducts = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const shop = await shopModel.findById(id)

    if (!shop) {
        res.statusCode = 404;
        throw new Error('Shop not found');
    }

    const products = await productModel.find({ shop: id });

    return res.status(200).json({
        success: true,
        products
    })
})

//get all shops
const getAllShops = asyncHandler(async(req,res) =>{
    const shops = await shopModel.find({});
    return res.status(200).json({
    success: true,
    shops,
  });
})

//get shop by seller id
const getShopBySellerId = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    const shop = await shopModel.find({ owner: id });
    return res.status(200).json({
        success: true,
        shop
    })
})
module.exports = { 
    createShop, 
    updateShop, 
    getShopDetails,
    deleteShop,
    getAllProducts,
    getAllShops,
    getShopBySellerId,
};