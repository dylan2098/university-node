const db = require('../utils/db');

module.exports = {
    listLessonOfCourse(idCourse) {
        return db('lesson').where('id_courses', idCourse).orderBy('chapter', 'asc').orderBy('sort_number', 'asc');
    },
    loadVideoOfCourse(idCourse, idLesson) {
        return db('lesson').where('id_courses', idCourse).andWhere('id', idLesson);
    },
    async getVideoFirst(idCourse) {
        const data = await db('lesson').where('id_courses', idCourse).orderBy('chapter', 'asc').orderBy('sort_number', 'asc');
        return data[0];
    },
    delete(idCourse, idLesson) {
        return db('lesson').where("id", idLesson).andWhere("id_courses", idCourse).del();
    },
    add(lesson) {
        return db('lesson').insert(lesson);
    },
    update(lesson) {
        return db('lesson').where("id", lesson.id).andWhere("id_courses", lesson.id_courses).update(lesson);
    },
    findLesson(idLesson, idCourses) {
        return db('lesson').where("id", idLesson).andWhere("id_courses", idCourses);
    }
}