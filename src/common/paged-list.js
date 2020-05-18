class PagedList {
    constructor(items, count, page, size) {
        this.items = items;
        this.totalItems = count;
        this.page = page;
        this.size = size;
    }

    get data() {
        return this.items;
    }

    get pageInfo() {
        return {
            page: this.page,
            size: this.size,
            totalPages: Math.ceil(this.totalItems / this.size),
            totalItems: this.totalItems
        };
    }
}

module.exports = PagedList;