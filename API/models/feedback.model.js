const db = require('../utils/db');

module.exports = {
    listFeedBack(param) {
        return db('feedback').select('feedback.*', 'users.full_name', 'users.email').where('id_courses', param.id)
            .andWhere('feedback.status', 1)
            .join('users', 'id_user', '=', 'users.id')
            .limit(param.limit)
            .offset(param.numberOffset)
            .orderBy(param.columnSort, param.typeSort)
    },

    async totalFeedBack(idCourse) {
        const all = await db('feedback').where('id_courses', idCourse).andWhere('status', 1) || [];
        return all.length;
    },

    addFeedBack(feedback) {
        return db('feedback').insert(feedback);
    },

    updateFeedBack(feedback) {
        return db('feedback').where('id', feedback.id).update(feedback);
    },

    async getAverageRating(idCourse) {
        const data = await db('feedback').avg('point_star as rating').where('status', 1).andWhere('id_courses', idCourse);
        return data[0].rating;
    },

    findById(id) {
        return db('feedback').select('feedback.*', 'users.full_name', 'users.email')
            .andWhere('feedback.status', 1).andWhere('feedback.id', id)
            .join('users', 'id_user', '=', 'users.id')
    }
}