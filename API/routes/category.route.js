const express = require('express');
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const router = express.Router();
const { teacherAuth, adminAuth, studentAuth, commonAuth } = require('../middlewares/auth.mdw');
const moment = require('moment');


router.get('/list', commonAuth, async (req, res) => {
    const categories = await categoryModel.findAll();

    let response = []

    for (let category of categories) {
        if (category.id_parent > 0) {
            category.parent = await categoryModel.findById(category.id_parent);
        }
        response.push(category);
    }

    return status.success(res, "Get all list", response);
})

router.get('/list-category-subscriptions-week', async (req, res) => {
    const monday = moment().day("Sunday").add(1, 'days').subtract(7, 'days').format("YYYY-MM-DD 00:00:00");
    const sunday = moment().day("Saturday").add(1, 'days').subtract(7, 'days').format("YYYY-MM-DD 23:59:59");

    const data = await categoryModel.listCategorySubscriptionsWeek(monday, sunday);

    return status.success(res, "Get list", data);
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const listCateogry = await categoryModel.findAllCategoryActive(id);
    return status.success(res, "List Category Parent", listCateogry);
});


router.post('/', adminAuth, async (req, res) => {
    let { name, id_parent } = req.body;

    if (name === '') {
        return status.error(res, env.status.e_1000);
    }

    if (!id_parent) {
        id_parent = 0;
    }

    const param = {
        name,
        id_parent,
        status: 0
    };

    const newItemId = await categoryModel.add(param);

    const response = await categoryModel.findById(newItemId);
    response.parent = await categoryModel.findById(response.id_parent);

    return status.success(res, "Create Success", response);
});


router.put('/', adminAuth, async (req, res) => {
    let { name, id } = req.body;

    if (name === '') {
        return status.error(res, env.status.e_1000);
    }

    await categoryModel.update(req.body);

    const response = await categoryModel.findById(id);

    if (response.id_parent > 0) {
        response.parent = await categoryModel.findById(response.id_parent);
    }

    return status.success(res, "Update Success", response);
});

router.delete('/', adminAuth, async (req, res) => {
    const { id } = req.body;
    const coursesOfCategory = await courseModel.findCoursesByCategoryId(id);
    const countCategoriesOfParent = await categoryModel.countCategoriesOfParent(id);

    // neu co khoa hoc trong category hoac trong category cha co chua category con
    if (coursesOfCategory.length > 0 || countCategoriesOfParent > 0) {
        await categoryModel.update({ id, status: 0 });
        const response = await categoryModel.findById(id);
        if (response.id_parent > 0)
            response.parent = await categoryModel.findById(response.id_parent);

        return status.success(res, "Update Status Success", response, { action: 'UPDATE' });
    }
    else {
        categoryModel.delete(id);
        return status.success(res, "Delete Success", [], { action: 'DELETE' });
    }
})

router.get('/detail/:id', adminAuth, async (req, res) => {
    const { id } = req.params;

    const response = await categoryModel.findById(id);

    if (response.id_parent > 0) {
        response.parent = await categoryModel.findById(response.id_parent);
    }

    return status.success(res, "Get Success", response);
})

module.exports = router;