const db = require('../utils/db');

module.exports = {

    async firstOrDefault(user_id, courses_id)
    {
        const data = await db('favourite').where('id_user','=',user_id).andWhere('id_courses','=',courses_id);
        if(data.length == 0)
            return null;
        
        return data[0];
    },

    add(favourite) {
        return db('favourite').insert(favourite);
    },

    delete(user_id, courses_id) {
        return db('favourite').where('id_user','=',user_id).andWhere('id_courses','=',courses_id).del();
    },

    update(id, data) {
        return db('favourite')
            .where('id', '=', id)
            .update(data);
    },

    findAll() {
        return db('favourite').select("*");
    },
};
