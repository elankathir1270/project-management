class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //Search
  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        title: {
          $regex: this.queryString.search,
          $options: "i",
        },
      });
    }
    return this;
  }

  //Filter
  filter() {
    const excludeFields = ["sort","sortBy","limit", "page", "fields","search","order"];
    const queryObj = { ...this.queryString };
    excludeFields.forEach((el) => {
      delete queryObj[el];
    });

    const optimizedQuery = this.getOptimizedFilterQuery(queryObj);

    this.query = this.query.find(optimizedQuery);

    return this;
  }

  //Sort
  sort() {
    const sortBy = this.queryString.sortBy || "createdAt";
    const order = this.queryString.order === "asc" ? "" : "-";

    this.query = this.query.sort(`${order}${sortBy}`);

    return this;
  }

  //Pagination
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  //Field limiting(add '-' before variable in req query for exclude)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  getOptimizedFilterQuery(queryObj) {
    const filterQuery = {};

    for (let key in queryObj) {
      const value = queryObj[key];
      const match = key.match(/^(.*)\[(gt|gte|lt|lte)\]$/);

      if (match) {
        const fieldName = match[1];
        const operator = `$${match[2]}`;

        if (!filterQuery[fieldName]) {
          filterQuery[fieldName] = {};
        }
        filterQuery[fieldName][operator] = value;
      } else {
        filterQuery[key] = value;
      }
    }

    return filterQuery;
  }
}

module.exports = ApiFeatures;
