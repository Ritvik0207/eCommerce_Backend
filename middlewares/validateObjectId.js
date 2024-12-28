const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const validateObjectId = asyncHandler(async(req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.statusCode = 400;
        throw new Error('Invalid  ID format');
    }

    next();
})

module.exports = {validateObjectId};