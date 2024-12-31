const ADMIN_ROLES = {
  SUPER_ADMIN: "Super_Admin",
  SHOP_SELLER_SITE_ADMIN: "Shop_Seller_Site_Admin",
};

const CRAFT_TYPES = {
  HANDLOOM_WEAVING: "Handloom Weaving",
  BLOCK_PRINTING: "Block Printing",
  EMBROIDERY: "Embroidery",
  TIE_DYE: "Tie & Dye",
  OTHER: "Other",
};

const ORDER_STATUS = {
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const GENDER = {
  MALE: "Male",
  FEMALE: "Female",
  KIDS: "Kids",
  UNISEX: "Unisex",
};

const PAYMENT_STATUS = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAILED: "Failed",
};

const PRODUCT_VARIANT_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
  LOW_STOCK: "low_stock",
};

const PAYMENT_TYPE = {
  COD: "COD",
  ONLINE_PAYMENT: "Online Payment",
};

module.exports = {
  ADMIN_ROLES,
  CRAFT_TYPES,
  ORDER_STATUS,
  GENDER,
  PAYMENT_STATUS,
  PRODUCT_VARIANT_STATUS,
  PAYMENT_TYPE,
};
