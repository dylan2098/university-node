const db = require('../utils/db');
const bcrypt = require("bcryptjs");

module.exports = {
    async findAll(teacher = false) {
        let sql = db('users').select('id', 'full_name', 'email', 'role', 'status', 'phone', 'des_futher', 'created_at', 'updated_at');

        if (teacher === true) {
            sql.where('role', 1);
        }

        return await sql;
    },

    async findUserById(id) {
        const users = await db('users')
            .where('id', id);

        if (users.length === 0) {
            return null;
        }

        return users[0];
    },

    async findUserByEmail(email) {
        const users = await db('users').where('email', email);
        if (users.length === 0) {
            return null;
        }
        return users[0];
    },

    async findUserByEmailActive(email) {
        const users = await db('users').where('email', email).andWhere('status', 1);
        // const users = await db('users').where('email', email);
        if (users.length === 0) {
            return null;
        }
        return users[0];
    },

    async add(user) {
        const salt = await bcrypt.genSalt(parseInt(process.env.GEN_SALT));
        user.password = await bcrypt.hash(user.password, salt);
        const result = await db('users').insert(user);
        return result;
    },

    async changePassword(email, password) {
        var user = await this.findUserByEmailActive(email);

        const salt = await bcrypt.genSalt(process.env.GEN_SALT);
        const userPass = await bcrypt.hash(password, salt);

        var data = {};
        data.password = userPass;
        return this.update(user.id, data);
    },

    updateRefreshToken(id, refreshToken) {
        return db('users').where('id', id).update('refresh_token', refreshToken);
    },

    updateCodeActive(id, codeActive) {
        return db('users').where('id', id).update('code_active', codeActive);
    },

    updateActiveStatus(id, isActive) {
        return db('users').where('id', id).update('status', isActive ? 1 : 0);
    },

    async isValidRefreshToken(id, refreshToken) {
        const list = await db('users').where('id', id).andWhere('refresh_token', refreshToken);
        if (list.length > 0) {
            return true;
        }
        return false;
    },

    delete(id) {
        return db('users')
            .where('id', id)
            .del();
    },

    update(user_id, data) {
        return db('users')
            .where('id', '=', user_id)
            .update(data);
    },

    reduceUser(user) {
        let reduce = {};
        reduce.id = user.id;
        reduce.full_name = user.full_name;
        reduce.email = user.email;
        reduce.gender = user.gender;
        reduce.day_of_birth = user.day_of_birth;
        reduce.address = user.address;
        reduce.image = user.image;
        reduce.phone = user.phone;
        reduce.role = user.role;
        reduce.refresh_token = user.refresh_token;
        reduce.status = user.status;
        reduce.des_futher = user.des_futher;
        reduce.point = user.point;
        reduce.created_at = user.created_at;
        reduce.updated_at = user.updated_at;
        return reduce;
    },

};
