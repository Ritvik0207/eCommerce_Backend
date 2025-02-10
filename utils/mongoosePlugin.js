const defaultSortPlugin = (schema) => {
  schema.pre(/^find/, function (next) {
    // Check if sort is not already specified in the query
    if (!this.getQuery().sort) {
      this.sort({ createdAt: -1 });
    }
    next();
  });
};

module.exports = { defaultSortPlugin };
