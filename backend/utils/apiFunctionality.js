class APIFunctionality {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        if (this.queryStr.keyword) {
            const keywordString = this.queryStr.keyword.replace(/\+/g, ' ').trim();
            const words = keywordString.split(/\s+/);

            const regexQueries = words.flatMap(word => {
                if (word.length <= 2) return [];
                const fuzzyPattern = word.split('').join('.*'); // Improved fuzzy
                return [
                    { name: { $regex: fuzzyPattern, $options: "i" } },
                    { category: { $regex: fuzzyPattern, $options: "i" } },
                    { description: { $regex: fuzzyPattern, $options: "i" } }
                ];
            });

            if (regexQueries.length === 0 && keywordString.length > 0) {
                const fallbackPattern = keywordString.split('').join('.*');
                regexQueries.push(
                    { name: { $regex: fallbackPattern, $options: "i" } },
                    { category: { $regex: fallbackPattern, $options: "i" } },
                    { description: { $regex: fallbackPattern, $options: "i" } }
                );
            }

            if (regexQueries.length > 0) {
                this.query = this.query.find({ $or: regexQueries });
            }
        }
        return this;
    }

    filter() {
        const queryCopy = { ...this.queryStr };
        const removeFields = ["keyword", "page", "limit"];
        removeFields.forEach(key => delete queryCopy[key]);

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);

        let parsedQuery = {};
        try {
            parsedQuery = JSON.parse(queryStr);
        } catch (err) {
            console.error("Error parsing query string:", err);
        }

        if (parsedQuery.category) {
            parsedQuery.category = { $regex: new RegExp(`^${parsedQuery.category}$`, 'i') };
        }

        this.query = this.query.find({
            ...this.query.getFilter(),
            ...parsedQuery
        });

        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default APIFunctionality;
