const db = require('../utils/db');

module.exports = {
    findAllCategoryActive(id) {
        return db('category').where("id_parent", id).andWhere("status", 1);
    },
    async add(category) {
        return await db('category').insert(category);
    },
    async update(category) {
        return await db('category').where("id", category.id).update(category);
    },
    async delete(id) {
        return await db('category').where("id", id).del();
    },

    async listCategorySubscriptionsWeek(monday, sunday) {
        const data = await db('register_buy_courses')
            .select(db.raw('count(register_buy_courses.id_courses) as count_course'), 'category.*')
            .where('register_buy_courses.status', 0)
            .andWhere('category.status', 1)
            .andWhere('register_time', '>=', monday)
            .andWhere('register_time', '<=', sunday)
            .groupBy('category.id')
            .orderBy('count_course', 'desc')
            .join('courses', 'id_courses', '=', 'courses.id')
            .join('category', 'courses.id_category', '=', 'category.id')
            .limit(10);
        return data;
    },
    findAll() {
        return db('category');
    },
    async findById(id) {
        const data = await db('category').where('id', id);
        return data[0];
    },
    async countCategoriesOfParent(id) {
        const data = await db('category').where('id_parent', id);
        return data.length;
    }
}