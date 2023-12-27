const db = require('../utils/db');
const general = require("../utils/general");
const registerBuyCourseModel = require('./register_buy_course.model');

module.exports = {
    findCoursesByCategoryId(idCategory) {
        return db('courses').where('id_category', idCategory).andWhere('active', 1);
    },

    async findCourseById(id, active = true) {
        let sql = db('courses').select('courses.*', 'category.name as category_name', 'users.full_name', 'users.email')
            .where('courses.id', id)
            .join('category', 'id_category', '=', 'category.id')
            .join('users', 'id_creator', '=', 'users.id')


        if (active == true) {
            sql.andWhere('courses.active', 1)
        }

        return await sql;
    },

    async findCourse(courseId, userId) {
        return db('register_buy_courses')
            .select('id_courses', 'category.name as category_name', db.raw('count(register_buy_courses.id_courses) as count_course'), 'courses.*', 'users.full_name', 'users.email')
            .andWhere('id_courses', courseId)
            .andWhere('id_user', userId)
            .andWhere('courses.active', 1)
            .groupBy('id_courses')
            .join('courses', 'id_courses', '=', 'courses.id')
            .join('users', 'id_creator', '=', 'users.id')
            .join('category', 'id_category', '=', 'category.id')
    },

    async listCourseBestSeller(id) {
        let sql = db('register_buy_courses')
            .select('id_courses', 'category.name as category_name', db.raw('count(register_buy_courses.id_courses) as count_course'), 'courses.*', 'users.full_name', 'users.email')
            .where('register_buy_courses.status', 1)
            .andWhere('courses.status', 1)
            .andWhere('courses.active', 1)
            .groupBy('id_courses')
            .orderBy('count_course', 'desc')
            .join('courses', 'id_courses', '=', 'courses.id')
            .join('users', 'id_creator', '=', 'users.id')
            .join('category', 'id_category', '=', 'category.id')
            .limit(5);

        if (id !== null) {
            sql.andWhere('id_category', id)
        };

        return await sql;
    },

    async listCourseBestNew() {
        return db('courses')
            .orderBy('id', 'desc')
            .limit(10)
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'id_creator', '=', 'users.id')
            .where('courses.active', 1)
            .select(
                'courses.id',
                'courses.title',
                'courses.des_short',
                'courses.status',
                'courses.price',
                'courses.promotion_price',
                'courses.image',
                'courses.avg_rating',
                'courses.number_of_rating',
                'courses.total_time',
                'courses.number_of_view',
                'category.name as category_name',
                'users.full_name', 'users.email'
            );
    },

    async getTotal(idCourse, column) {
        const data = await db('courses').select(column).where('id', idCourse).andWhere('courses.active', 1);
        return data[0][column] || 0;
    },

    setValue(value, idCourse, column) {
        return db('courses').update(column, value).where('id', idCourse).andWhere('courses.active', 1);
    },

    increaseNumberRating(id) {
        return db('courses').increment('courses.number_of_rating').where("id", '=', id);
    },

    async handleRegisterOrBuy(param) {
        let nameColumn = '';
        if (param.status === 0) {
            nameColumn = 'total_registration';
            param.register_time = general.getCurrentDayFormat();
        } else {
            nameColumn = 'total_purchased';
            param.buy_time = general.getCurrentDayFormat();
        }

        let total = await this.getTotal(param.id_courses, nameColumn);

        const actions = await registerBuyCourseModel.findUserAction(param.id_courses, param.id_user, param.status);

        if (actions.length > 0) {
            await registerBuyCourseModel.remove(actions[0].id);
            total -= 1;
        } else {
            await registerBuyCourseModel.BuyOrRegisterCourse(param);
            total += 1;
        }

        await this.setValue(total, param.id_courses, nameColumn);
    },

    getMyUploadCourses(creator_id) {
        return db('courses')
            .where({
                id_creator: creator_id
            })
            .join('category', 'category.id', '=', 'courses.id_category')
            .where('courses.active', 1)
            .select(
                'courses.id',
                'courses.title',
                'courses.des_short',
                'courses.status',
                'courses.price',
                'courses.promotion_price',
                'courses.image',
                'courses.avg_rating',
                'courses.number_of_rating',
                'courses.total_time',
                'courses.number_of_view',
                db.ref('category.name').as('category_name'),
            );
    },

    add(course) {
        return db('courses').insert(course);
    },

    async getFavouriteCoursesByUserId(user_id) {
        const data = await db('favourite')
            .where('id_user', '=', user_id)
            .join('courses', 'courses.id', '=', 'favourite.id_courses')
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'users.id', '=', 'courses.id_creator')
            .andWhere('courses.active', 1)
            .select(
                'courses.id',
                'courses.title',
                'courses.des_short',
                'courses.price',
                'courses.promotion_price',
                'courses.image',
                'courses.avg_rating',
                'courses.total_time',
                'courses.number_of_rating',
                'courses.status',
                db.ref('category.name').as('category_name'),
                'users.full_name',
            );

        return data;
    },

    getTop10CoursesViewMost() {
        return db('courses')
            .where('courses.number_of_view', '>', 0)
            .andWhere('courses.active', 1)
            .orderBy([{ column: 'courses.number_of_view', order: 'desc' }, { column: 'courses.id', order: 'desc' }])
            .limit(10)
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'users.id', '=', 'courses.id_creator')
            .select(
                'courses.id',
                'courses.title',
                'courses.des_short',
                'courses.price',
                'courses.promotion_price',
                'courses.image',
                'courses.avg_rating',
                'courses.total_time',
                'courses.number_of_rating',
                'courses.status',
                db.ref('category.name').as('category_name'),
                'users.full_name',
            );
    },

    getTop4CoursesHotMost(start_day, end_day) {
        return db('register_buy_courses')
            .andWhere('courses.active', 1)
            .where('register_buy_courses.status', '=', 1) // 1: buy, 0: register
            .where('register_buy_courses.buy_time', '>=', start_day)
            .where('register_buy_courses.buy_time', '<=', end_day)
            .groupBy('register_buy_courses.id_courses')
            .orderBy([{ column: 'count_courses_bought', order: 'desc' }, { column: 'register_buy_courses.id_courses', order: 'desc' }])
            .limit(4)
            .join('courses', 'courses.id', '=', 'register_buy_courses.id_courses')
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'users.id', '=', 'courses.id_creator')
            .select(
                db.raw('count(register_buy_courses.id_courses) as count_courses_bought'),
                'courses.id',
                'courses.title',
                'courses.des_short',
                'courses.price',
                'courses.promotion_price',
                'courses.image',
                'courses.avg_rating',
                'courses.total_time',
                'courses.number_of_rating',
                'courses.status',
                db.ref('category.name').as('category_name'),
                'users.full_name',
                'register_buy_courses.id_courses'
            );
    },

    async getCourseDetail(id) {
        return db('courses').where('id', id).andWhere('courses.active', 1);
    },

    async deleteFileOnCloud(publicId, resourceType = 'video') {
        const data = await cloudinary.v2.api.delete_resources([publicId], {
            resource_type: resourceType
        });
        return data;
    },

    async findByCatalog(id) {
        return db('courses')
            .join('category', 'category.id', '=', 'courses.id_category')
            .where("category.id", '=', id)
            .andWhere('courses.active', 1)
    },

    async findAll(pagination = false, limit = 10, numberOffset = 10) {
        let sql = db('courses')
            .select('courses.*', 'category.id as category_id', 'category.name as category_name', 'users.full_name', 'users.email')
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'courses.id_creator', '=', 'users.id')
            .where('courses.active', 1)

        if (pagination) {
            sql.limit(limit);
            sql.offset(numberOffset)
        }

        return await sql;
    },

    increaseView(id) {
        return db('courses').increment('courses.number_of_view').where("id", '=', id);
    },

    async listCourseByCategory(idCategory, pagination = false, limit = 10, numberOffset = 10) {
        let sql = db('courses')
            .select('category.name as category_name', 'courses.*', 'users.full_name', 'users.email', db.raw('count(courses.id) as count_course'))
            .where('courses.id_category', idCategory)
            .andWhere('courses.active', 1)
            .groupBy('courses.id')
            .join('users', 'id_creator', '=', 'users.id')
            .join('category', 'id_category', '=', 'category.id')

        if (pagination) {
            sql.limit(limit);
            sql.offset(numberOffset)
        }

        return await sql;
    },

    async listRegisteredOrBuyCourses(userId) {
        return db('register_buy_courses')
            .select('category.name as category_name', 'courses.*')
            .where('register_buy_courses.id_user', userId)
            .whereIn('register_buy_courses.status', [1])
            .join('courses', 'id_courses', '=', 'courses.id')
            .join('category', 'id_category', '=', 'category.id')
    },

    async update(course) {
        return db('courses').where("id", course.id).update(course);
    },

    async listCourses(query) {
        let sql = db('courses')
            .select('courses.*', 'category.id as category_id', 'category.name as category_name', 'users.full_name', 'users.email')
            .join('category', 'category.id', '=', 'courses.id_category')
            .join('users', 'courses.id_creator', '=', 'users.id');

        if (query.category) {
            sql.where('category.id', parseInt(query.category));
        }

        if (query.teacher) {
            sql.where('users.id', parseInt(query.teacher))
        }

        return await sql;
    }
}
