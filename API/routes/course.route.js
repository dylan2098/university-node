const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const { teacherAuth, studentAuth, adminAuth, commonAuth, guestOrCommonAuth } = require('../middlewares/auth.mdw');
const courseSchema = require("../schemas/course.json");
const lessonSchema = require("../schemas/lesson.json");
const validate = require("../middlewares/validate.mdw");
const moment = require('moment');
const userModel = require('../models/user.model');
const registerBuyModel = require('../models/register_buy_course.model');
const favouriteModel = require('../models/favourite.model');
const lessonModel = require('../models/lesson.model');
const general = require("../utils/general");
const lunr = require('lunr');
const { numPages } = require('../utils/general');
const jwt = require('jsonwebtoken');



//delete lesson
router.delete('/:idCourse/lesson/:idLesson', teacherAuth, async (req, res) => {
    const { idCourse, idLesson } = req.params;
    const response = await lessonModel.delete(idCourse, idLesson);
    return status.success(res, "Delete Success", response);
})


// add lesson
router.post('/add-lesson', teacherAuth, validate(lessonSchema), async (req, res) => {
    const lessonId = await lessonModel.add(req.body);
    const response = await lessonModel.findLesson(lessonId, req.body.id_courses);
    return status.success(res, "Add Success", response);
})

// update lesson
router.put('/update/lesson', teacherAuth, async (req, res) => {
    const response = await lessonModel.update(req.body);
    return status.success(res, "Update Success", response);
})


// update active course 
router.put('/active-course', adminAuth, async (req, res) => {
    await courseModel.update(req.body);
    const response = await courseModel.findCourseById(req.body.id, false);
    return status.success(res, "Update Success", response);
})


router.get('/list-courses', adminAuth, async (req, res) => {
    const response = await courseModel.listCourses(req.query);
    return status.success(res, "List courses", response);
})


// all course
router.get('/all', guestOrCommonAuth || true, async (req, res) => {

    const { limit, page } = req.query;

    const allCourses = await courseModel.findAll();

    const total = allCourses.length;

    const param = general.paramPagination(total, limit, page);

    let response = await courseModel.findAll(true, limit, param.numberOffset);

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, "List courses", response, { loadMore: param.loadMore, page: param.page, total });
})



router.get('/my-courses', studentAuth, async (req, res) => {
    const response = await courseModel.listRegisteredOrBuyCourses(req.id);
    return status.success(res, "List courses by category", response);
});

// search course

router.get('/search', guestOrCommonAuth, async (req, res) => {
    let { q, limit, page, sort, type } = req.query;

    const documents = await courseModel.findAll();

    // setup field show and field search index
    let idx = lunr(function () {
        this.ref('id');
        this.field('title');
        this.field('category_name');

        documents.forEach(function (doc) {
            this.add(doc)
        }, this)
    })

    const dataSearch = idx.search(q);

    let listDataSearch = [];

    // loop and get data from ref result
    if (dataSearch.length > 0) {
        for (let item of dataSearch) {
            let itemResult = await courseModel.findCourseById(parseInt(item.ref));
            if (itemResult.length > 0)
                listDataSearch.push(itemResult[0]);
        }
    }

    let response = [];

    // set page and limit if fail data
    if (page == undefined || page < 1) page = 1;
    if (limit == undefined || limit < 1) limit = 10;


    if (page > general.numPages(listDataSearch.length, limit)) {
        page = numPages(listDataSearch.length, limit);
    }

    for (let i = (page - 1) * limit; i < (page * limit); i++) {
        if (listDataSearch[i])
            response.push(listDataSearch[i]);
    }

    const param = general.paramPagination(listDataSearch.length, limit, page);


    if (type === 'asc') {

        if (sort === 'rating') {
            response.sort(general.compareRatingAscending);
        }
        else
            response.sort(general.comparePriceAscending);
    }
    else {

        if (sort === 'price') {
            response.sort(general.comparePriceDescending)
        }
        else
            response.sort(general.compareRatingDescending);

    }

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, "Search", response, { page: parseInt(page), total: listDataSearch.length, loadMore: param.loadMore });
})


// register or buy course
router.post('/register-buy', studentAuth, async (req, res, next) => {
    // status 0: register,  1: buy

    let param = req.body;

    param.id_user = req.id;

    await courseModel.handleRegisterOrBuy(param);

    let dataCourse = await courseModel.findCourse(param.id_courses, req.id);

    const register = await registerBuyModel.findUserAction(param.id_courses, req.id, 0);

    const buy = await registerBuyModel.findUserAction(param.id_courses, req.id, 1);

    const favourite = await favouriteModel.firstOrDefault(req.id, param.id_courses);

    if (register.length > 0) {
        dataCourse[0].is_register = true;
    }
    else {
        dataCourse[0].is_register = false;
    }

    if (buy.length > 0) {
        dataCourse[0].is_buy = true
    }
    else {
        dataCourse[0].is_buy = false
    }

    if (favourite != null) {
        dataCourse[0].is_favourite = true
    }

    return status.success(res, `Success`, dataCourse);
});


router.get('/best-seller', guestOrCommonAuth, async (req, res) => {
    let response = await courseModel.listCourseBestSeller(null);

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, `Get list Success`, response);
});

router.get('/best-new', guestOrCommonAuth, async (req, res) => {
    let response = await courseModel.listCourseBestNew();

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, `Get list Success`, response);
})

router.get('/best-seller-category/:id', guestOrCommonAuth, async (req, res) => {
    const { id } = req.params;
    let response = await courseModel.listCourseBestSeller(id);

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, `Get list Success`, response);
});

router.get('/my-upload-courses', teacherAuth, async (req, res) => {
    const { id } = req;
    let listCourses = await courseModel.getMyUploadCourses(id);
    return status.success(res, `Get list my upload courses success`, listCourses);
});

router.post('/', teacherAuth, validate(courseSchema), async (req, res) => {
    let param = req.body;
    param.id_creator = req.id;
    param.status = 0; // Chưa hoàn thành
    const result = await courseModel.add(param);
    const course = await courseModel.findCourseById(result[0]);
    return status.success(res, "Create Success", [course[0]]);
});

router.get('/my-favourite-courses', studentAuth, async (req, res) => {
    const { id } = req;
    const response = await courseModel.getFavouriteCoursesByUserId(id);

    for (let item of response) {
        item.is_favourite = true;
    }
    return status.success(res, `Get list my favourite courses success`, response);
});

router.get('/top-10-courses-view-most', guestOrCommonAuth, async (req, res) => {
    let response = await courseModel.getTop10CoursesViewMost();

    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, `Get top 10 courses view most success`, response);
});

router.get('/top-4-courses-hot-most', guestOrCommonAuth, async (req, res) => {
    const monday = moment().subtract(1, 'weeks').startOf('isoWeek').format("YYYY-MM-DD 00:00:00");
    const sunday = moment().subtract(1, 'weeks').endOf('isoWeek').format("YYYY-MM-DD 23:59:59");

    let response = await courseModel.getTop4CoursesHotMost(monday, sunday);
    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }
    return status.success(res, `Get top 4 courses hot most success`, response);
});

router.delete('/delete-file/:id', async (req, res) => {
    const data = await courseModel.deleteFileOnCloud(req.params.id);
    return status.success(res, "Delete success", data);
});

// detail course
router.get('/:id', guestOrCommonAuth, async (req, res) => {
    const { id } = req.params;
    let data = await courseModel.getCourseDetail(id);

    // get creator info
    const dataCreator = await userModel.findUserById(data[0].id_creator);
    data[0].user = userModel.reduceUser(dataCreator);

    const firstVideo = await lessonModel.getVideoFirst(id);

    if (firstVideo && firstVideo.id > 0)
        data[0].first_video_id = firstVideo.id;

    const student_id = req.id;
    if (student_id && req.role === 2){
        data = await handleActionStudent(data, student_id);
    }

    await courseModel.increaseView(id);

    return status.success(res, "Detail Course", data)
})

router.get('/cate/:id', async (req, res) => {
    const { id } = req.params;
    let data = await courseModel.findByCatalog(id);
    return status.success(res, "Get Success", data);
})


// danh sach video cua khoa hoc
router.get('/:id/lesson', commonAuth, async (req, res) => {
    if (!req.params.id) {
        return;
    }
    const response = await lessonModel.listLessonOfCourse(req.params.id);
    return status.success(res, "Get List Success", response);
})


// lesson route

// video tung bai hoc
router.get('/:idCourse/lesson/:idLesson', commonAuth, async (req, res) => {
    if (!req.params.idCourse || !req.params.idLesson) {
        return;
    }

    const { idCourse, idLesson } = req.params;

    const response = await lessonModel.loadVideoOfCourse(idCourse, idLesson);

    if (response.length <= 0) {
        return status.error(res, env.status.e_404);
    }

    return status.success(res, "Get video success", response);
})


// list course of category
router.get('/category/:id', guestOrCommonAuth, async (req, res) => {
    const { id } = req.params;
    const { limit, page } = req.query;
    if (!id) {
        return;
    }

    const allCourses = await courseModel.listCourseByCategory(id);
    const total = allCourses.length;

    const param = general.paramPagination(total, limit, page);

    let response = await courseModel.listCourseByCategory(id, true, limit, param.numberOffset);
    const student_id = req.id;
    if (student_id && req.role === 2){
        response = await handleActionStudent(response, student_id);
    }

    return status.success(res, "List courses by category", response, { loadMore: param.loadMore, page: param.page, total });
})



// update course
router.put('/', teacherAuth, async (req, res) => {
    const { id } = req.body;
    const course = await courseModel.findCourseById(id);
    if (course && course[0].id_creator !== req.id){
        return status.error(res, env.status.e_801);
    }
    const response = await courseModel.update(req.body);
    return status.success(res, "Update Success", response);
})


module.exports = router;



const handleActionStudent = async (courses, student_id) => {
    let clone_courses = [];
    for (let item of courses) {
        let clone_item = {...item};
        const register = await registerBuyModel.findUserAction(item.id, student_id, 0);
        const buy = await registerBuyModel.findUserAction(item.id, student_id, 1);
        const favourite = await favouriteModel.firstOrDefault(student_id, item.id);

        if (register.length > 0) {
            clone_item.is_register = true
        }
        else {
            clone_item.is_register = false
        }

        if (buy.length > 0) {
            clone_item.is_buy = true
        }
        else {
            clone_item.is_buy = false
        }

        if (favourite != null) {
            clone_item.is_favourite = true
        }
        clone_courses.push(clone_item);
    }
    return clone_courses;
}