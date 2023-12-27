
const moment = require("moment");

class General {
    static paramPagination(total, limit = 20, page = 1, columnSort = 'id', typeSort = 'desc') {
        if (limit <= 0) limit = 20;
        if (page <= 1) page = 1;

        let param = { columnSort, typeSort };

        const canLoadMore = total - (page - 1) * limit;

        if (canLoadMore <= 0 || canLoadMore <= limit)
            param.loadMore = false;
        else
            param.loadMore = true;

        param.limit = parseInt(limit);
        param.page = parseInt(page)
        param.numberOffset = (page - 1) * limit;

        return param;
    }

    static checkObject(obj) {
        if (obj && obj.constructor === Object && Object.keys(obj).length > 0)
            return true;
        return false;
    }

    static getCurrentDayFormat() {
        return moment().format('YYYY-MM-DD HH:mm:ss');
    }

    static convertDayToFormat(str_day) {
        return moment(str_day).format('YYYY-MM-DD HH:mm:ss');
    }

    static numPages(total, numberOfPage) {
        return Math.ceil(total / numberOfPage);
    }


    static compareRatingDescending(a, b) {
        if (a.avg_rating < b.avg_rating) {
            return 1;
        }
        if (a.avg_rating > b.avg_rating) {
            return -1;
        }
        return 0;
    }

    static compareRatingAscending(a, b) {
        if (a.avg_rating < b.avg_rating) {
            return -1;
        }
        if (a.avg_rating > b.avg_rating) {
            return 1;
        }
        return 0;
    }

    static comparePriceAscending(a, b) {
        if (a.price < b.price) {
            return -1;
        }
        if (a.price > b.price) {
            return 1;
        }
        return 0;
    }

    static comparePriceDescending(a, b) {
        if (a.price < b.price) {
            return 1;
        }
        if (a.price > b.price) {
            return -1;
        }
        return 0;
    }
}

module.exports = General;