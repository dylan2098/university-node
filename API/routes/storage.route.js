const express = require('express');
const router = express.Router();
const { teacherAuth, adminAuth, studentAuth } = require('../middlewares/auth.mdw');

const lessonModel = require('../models/lesson.model');
const storageModel = require('../models/storage.model');

router.post("/switch", async (req, res) => {
    if (!req.body.id_user || !req.body.id_lesson)
        return status.error(res, env.status.e_998);

    const data = await storageModel.firstOrDefault(req.body.id_user, req.body.id_lesson);
    if (data != null) {
        const final = await storageModel.delete(data.id_user, data.id_lesson);
        return status.success(res, "Delete success", final);
    }
    else {
        var favourite = {};
        favourite.id_user = req.body.id_user;
        favourite.id_lesson = req.body.id_lesson;
        const final = await storageModel.add(favourite);
        return status.success(res, "Add success", final);
    }
});

router.post('/', studentAuth, async (req, res) => {
    if (!req.body.lessonId || !req.body.courseId)
        return status.error(res, env.status.e_998);

    const data = await storageModel.findVideoOfStorage(req.body.lessonId, req.body.courseId, req.id);

    if (data.length === 0) {
        const response = await storageModel.add({ id_user: req.id, id_lesson: req.body.lessonId, id_course: req.body.courseId });
        return status.success(res, "Add success", response);
    }

    return status.success(res, "Data", data);
})

router.get('/list', studentAuth, async (req, res) => {
    const data = await storageModel.findListVideoStorage(req.id);

    let response = [];

    for (let item of data) {
        const lesson = await lessonModel.loadVideoOfCourse(item.id_course, item.id_lesson);

        item.lesson = lesson[0];
        response.push(item);
    }

    return status.success(res, "List Data", response);
})

module.exports = router;