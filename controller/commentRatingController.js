const commentRatingModel = require("../models/commentRatingModel");
const productModel = require("../models/productModel");
const writeComment = async (req, res) => {
  try {
    const { productId, userId, commentText, rating } = req.body;
    const commentRating = await new commentRatingModel({
      productId,
      userId,
      commentText,
      ratings: [{ userId, rating }],
    }).save();
    await updateProductAverageRating(productId);
    res.status(201).json({
      success: true,
      message: "CommentRating succesfully submitted",
      commentRating: commentRating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getCommentRating = async (req, res) => {
  try {
    const commentRating = await commentRatingModel
      .find()
      .populate({ path: "product", strictPopulate: false })
      .populate({ path: "users", strictPopulate: false });
    res.status(200).json({
      success: true,
      message: "CommentRating succesfully fetch",
      commentRating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateRating = async (req, res) => {
  const { commentId } = req.params;
  const { userId, rating } = req.body;

  try {
    const comment = await commentRatingModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const existingRating = comment.ratings.find((r) => r.userId.equals(userId));
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      comment.ratings.push({ userId, rating });
    }
    await comment.save();
    await updateProductAverageRating(comment.productId);

    res.json({ message: "Rating updated successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProductAverageRating = async (productId) => {
  const comments = await commentRatingModel.find({ productId });
  const ratings = comments.flatMap((comment) =>
    comment.ratings.map((r) => r.rating)
  );
  const averageRating = ratings.length
    ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
    : 0;

  await productModel.findByIdAndUpdate(productId, { averageRating });
};

module.exports = { writeComment, getCommentRating, updateRating };
