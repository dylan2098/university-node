const db = require('../utils/db');

module.exports = {

    async firstOrDefault(user_id, lesson_id) {
        const data = await db('storage_video').where('id_user', '=', user_id).andWhere('id_lesson', '=', lesson_id);
        if (data.length == 0)
            return null;

        return data[0];
    },

    add(storage) {
        return db('storage_video').insert(storage);
    },

    delete(user_id, lesson_id) {
        return db('storage_video').where('id_user', '=', user_id).andWhere('id_lesson', '=', lesson_id).del();
    },

    update(id, data) {
        return db('storage_video')
            .where('id', '=', id)
            .update(data);
    },

    findAll() {
        return db('storage_video').select("*");
    },

    findVideoOfStorage(lessonId, courseId, userId) {
        return db('storage_video').where('id_lesson', lessonId).andWhere('id_user', userId).andWhere('id_course', courseId);
    },

    findListVideoStorage(userId) {
        return db('storage_video').where('id_user', userId);
    }
};
