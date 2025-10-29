function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

 class APIFunctionality {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      const keywordString = this.queryStr.keyword.replace(/\+/g, " ").trim();
      if (!keywordString) return this;

      const words = keywordString.split(/\s+/);

      const regexQueries = words
        .map((word) => {
          const safeWord = escapeRegex(word);
          const fuzzyPattern =
            safeWord.length > 2 ? safeWord.split("").join(".*") : safeWord;

          return [
            { name: { $regex: fuzzyPattern, $options: "i" } },
            { category: { $regex: fuzzyPattern, $options: "i" } },
            { description: { $regex: fuzzyPattern, $options: "i" } },
          ];
        })
        .flat();

      if (regexQueries.length > 0) {
        this.query = this.query.find({ $or: regexQueries });
      }
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}
export default APIFunctionality