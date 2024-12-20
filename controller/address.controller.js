const addressModel = require("../models/addressModel");
const userModel = require("../models/user");

// const createAddress = async (req, res) => {
//   try {
//     const info = req.body;
//     const address = await addressModel.create({
//       user_id: info.user_id,
//       name: info.name,
//       address: info.address,
//       district: info.district,
//       state: info.state,
//       pincode: info.pincode,
//       phone: info.phone,
//       street: info.street,
//       landmark: info.landmark,
//     });
//     res.status(201).json({
//       success: true,
//       message: "Address succesfully Added",
//       address,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

const createAddress = async (req, res) => {
  try {
    const { user_id, setDefault, ...addressInfo } = req.body;

    // Check if the user exists
    const user = await userModel.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new address
    const newAddress = await addressModel.create({
      user_id,
      ...addressInfo,
    });

    // Add the address to the user's address array
    user.address.push(newAddress._id);
    await user.save();

    return res.status(201).json({
      success: true,
      message: "Address successfully added",
      address: newAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAddress = async (req, res) => {
  try {
    const address = await addressModel.find();
    res.status(200).json({
      success: true,
      message: "Address succesfully fetch",
      address,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Update Address
const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAddress = await addressModel.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated document
      runValidators: true, // Validate before updating
    });

    if (!updatedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    res.status(200).json({
      success: true,
      message: "Address successfully updated",
      address: updatedAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete Address
const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the address
    const address = await addressModel.findByIdAndDelete(id);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    // Remove the address reference from the user's address array
    await userModel.updateOne(
      { _id: address.user_id },
      { $pull: { address: id } }
    );

    res.status(200).json({
      success: true,
      message: "Address successfully deleted",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createAddress,
  getAddress,
  updateAddress,
  deleteAddress,
};
