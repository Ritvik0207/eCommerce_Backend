const commentRatingModel = require("../models/commentRatingModel");
const productModel = require("../models/productModel");
// const { uploadFile } = require("../upload/upload");
const writeComment = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const { productId, userId, title, commentText, ratings, image_id } =
      req.body;
    // const { files } = req;
    // const fieldname = [];
    // for (const file of files) {
    //   const fileId = await uploadFile(file);
    //   fieldname.push(fileId);
    // }

    if (ratings && ratings.length > 0) {
      const rating = ratings[0].rating;
      // console.log("Received Rating Value:", rating, "Type:", typeof rating);

      const numericRating = Number.parseFloat(rating);
      console.log(
        "Parsed Rating:",
        numericRating,
        "Type:",
        typeof numericRating
      );

      if (
        Number.isNaN(numericRating) ||
        numericRating < 1 ||
        numericRating > 5
      ) {
        return res.status(400).json({
          success: false,
          message: "Rating must be a valid number between 1 and 5.",
        });
      }

      const commentRating = await new commentRatingModel({
        productId,
        userId,
        title,
        commentText,
        ratings: [{ userId, rating: numericRating }],
        // image_id: fieldname,
      }).save();

      await updateProductAverageRating(productId);
      res.status(201).json({
        success: true,
        message: "CommentRating successfully submitted",
        commentRating: commentRating,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No ratings provided.",
      });
    }
  } catch (err) {
    console.log("Error in writeComment:", err);
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

  if (Number.isNaN(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be a number between 1 and 5.",
    });
  }

  try {
    const comment = await commentRatingModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const existingRating = comment.ratings.find((r) => r.userId.equals(userId));
    if (existingRating) {
      existingRating.rating = rating;
    } else {
      comment.ratings.push({ userId, rating: Number(rating) });
    }
    await comment.save();
    await updateProductAverageRating(comment.productId);

    res.json({ message: "Rating updated successfully", comment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const updateProductAverageRating = async (productId) => {
//   const comments = await commentRatingModel.find({ productId });
//   const ratings = comments.flatMap((comment) =>
//     comment.ratings.map((r) => r.rating)
//   );
//   const averageRating = ratings.length
//     ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
//     : 0;

//   await productModel.findByIdAndUpdate(productId, { averageRating });
// };

const updateProductAverageRating = async (productId) => {
  const comments = await commentRatingModel.find({ productId });

  // console.log("Comments fetched for productId:", productId, comments);

  const ratings = comments.flatMap((comment) =>
    comment.ratings.map((r) => r.rating)
  );

  // console.log("Ratings collected:", ratings);
  const validRatings = ratings.filter(
    (rating) => typeof rating === "number" && !Number.isNaN(rating)
  );

  const averageRating = validRatings.length
    ? (validRatings.reduce((a, b) => a + b, 0) / validRatings.length).toFixed(2)
    : 0;

  const totalReviews = comments.length;
  // console.log("Calculated Average Rating:", averageRating);
  await productModel.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating),
    totalReviews: totalReviews,
  });
};

module.exports = { writeComment, getCommentRating, updateRating };
