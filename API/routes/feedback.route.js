const express = require('express');
const router = express.Router();
const general = require("../utils/general");
const feedBackModel = require('../models/feedback.model');
const validate = require("../middlewares/validate.mdw");
const feedbackSchema = require("../schemas/feedback.json");
const { teacherAuth, adminAuth, studentAuth } = require('../middlewares/auth.mdw');
const courseModel = require("../models/course.model");

router.get('/course/:id', async (req, res) => {
    const courseId = req.params.id;

    const amountAllFeedBack = await feedBackModel.totalFeedBack(courseId);

    const { limit, page } = req.query;

    const param = general.paramPagination(amountAllFeedBack, limit, page);
    param.id = courseId;

    const listFeedBack = await feedBackModel.listFeedBack(param);

    return status.success(res, "List", listFeedBack, { loadMore: param.loadMore, page: param.page, total: amountAllFeedBack });
})

router.post('/', studentAuth, validate(feedbackSchema), async (req, res) => {
    let param = req.body;

    if (!req.body.title) {
        return stauts.error(res, env.status.e_1411);
    }

    if (!req.body.point_star) {
        param.point_star = 5;
    }

    param.status = 1;
    param.id_user = req.id;
    param.created_at = general.getCurrentDayFormat()
    param.updated_at = general.getCurrentDayFormat();

    const addResultId = await feedBackModel.addFeedBack(param);
    const avgRating = await feedBackModel.getAverageRating(param.id_courses);
    await courseModel.setValue(parseFloat(avgRating).toFixed(1), param.id_courses, 'avg_rating');
    await courseModel.increaseNumberRating(param.id_courses);

    const dataFeedback = await feedBackModel.findById(addResultId);

    return status.success(res, "Create Sucess", dataFeedback);
})

router.put('/', adminAuth, async (req, res) => {
    let param = req.body;

    param.updated_at = general.getCurrentDayFormat();
    const updateResult = await feedBackModel.updateFeedBack(param);

    return status.success(res, "Update Sucess", updateResult);

})

module.exports = router;