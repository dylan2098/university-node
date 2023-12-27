const db = require('../utils/db');

module.exports = {
    BuyOrRegisterCourse(course) {
        return db('register_buy_courses').insert(course);
    },

    findUserAction(idCourse, idUser, status) {
        return db('register_buy_courses').select('id').where('id_user', idUser).andWhere('id_courses', idCourse).andWhere('status', status);
    },

    remove(id) {
        return db('register_buy_courses').where('id', id).del();
    },
}