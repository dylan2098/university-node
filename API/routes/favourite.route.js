const express = require('express');
const router = express.Router();
const registerBuyModel = require('../models/register_buy_course.model');
const favouriteModel = require('../models/favourite.model');
const courseModel = require('../models/course.model');
const { teacherAuth, studentAuth } = require('../middlewares/auth.mdw');

router.post("/switch", studentAuth, async (req, res) => {
    if (!req.id || !req.body.id_courses)
        return status.error(res, env.status.e_998);


    const data = await favouriteModel.firstOrDefault(req.id, req.body.id_courses);
    const dataCourse = await courseModel.findCourseById(req.body.id_courses);

    const register = await registerBuyModel.findUserAction(dataCourse[0].id, req.id, 0);

    const buy = await registerBuyModel.findUserAction(dataCourse[0].id, req.id, 1);


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

    if (data != null) {
        const final = await favouriteModel.delete(data.id_user, data.id_courses);
        dataCourse[0].is_favourite = false;
        return status.success(res, "Delete success", dataCourse);
    }
    else {
        let favourite = {};
        favourite.id_user = req.id;
        favourite.id_courses = req.body.id_courses;
        const final = await favouriteModel.add(favourite);
        dataCourse[0].is_favourite = true;
        return status.success(res, "Add success", dataCourse);
    }
});

module.exports = router;