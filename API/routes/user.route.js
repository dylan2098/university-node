const jwt = require('jsonwebtoken');
const express = require('express');
const userModel = require('../models/user.model');
const validate = require('../middlewares/validate.mdw');
const userTeacherSchema = require("../schemas/userTeacher.json");
const regex = require("../utils/regex");
const general = require("../utils/general");
const { studentAuth, adminAuth, commonAuth } = require('../middlewares/auth.mdw');


const router = express.Router();


router.get('/list-teachers', adminAuth, async (req, res) => {
    const listTeachers = await userModel.findAll(true);
    return status.success(res, "Get All Teachers", listTeachers);
})

router.get('/', adminAuth, async function (req, res) {
    const listUsers = await userModel.findAll();
    return status.success(res, "Get All success", listUsers);
});

router.get('/profile', commonAuth, async function (req, res) {
    const { id } = req;
    const user = await userModel.findUserById(id);
    if (user === null) {
        return status.error(res, env.status.e_1000);
    }
    return status.success(res, "Get user success", userModel.reduceUser(user));
});

router.get('/:id', adminAuth, async function (req, res) {
    const user = await userModel.findUserById(req.query.id || 0);
    if (user === null) {
        return status.error(res, env.status.e_1000);
    }
    return status.success(res, "Get user success", userModel.reduceUser(user));
});

router.post('/', adminAuth, validate(userTeacherSchema), async function (req, res) {
    const {
        full_name,
        email,
        phone,
        des_futher
    } = req.body;

    const isEmail = regex.regexEmail(email);
    if (!isEmail)
        return status.error(res, env.status.e_603);

    const isPhone = regex.regexPhone(phone);
    if (!isPhone)
        return status.error(res, env.status.e_609);

    const findUser = await userModel.findUserByEmail(email);
    if (findUser)
        return status.error(res, env.status.e_601);

    const param = {
        full_name: full_name,
        email: email,
        password: "12345",
        phone: phone,
        status: 1,
        role: 1,
        des_futher: des_futher
    };

    const result = await userModel.add(param);
    return status.success(res, "Create Success", [{ id: result[0], full_name: param.full_name, email: param.email, role: param.role, status: param.status }]);
});

router.put('/', adminAuth, async (req, res) => {
    const { id } = req.body;
    const user = await userModel.findUserById(id);
    if (!user) {
        return status.error(res, env.status.e_1000);
    }

    data_update = {};
    if (req.body.hasOwnProperty('email')) {
        const isEmail = regex.regexEmail(req.body.email);
        if (!isEmail)
            return status.error(res, env.status.e_603);
        const findUser = await userModel.findUserByEmail(req.body.email);
        if (findUser && findUser.id != id)
            return status.error(res, env.status.e_601);
        data_update['email'] = req.body.email;
    }
    if (req.body.hasOwnProperty('full_name')) {
        data_update['full_name'] = req.body.full_name;
    }
    if (req.body.hasOwnProperty('phone')) {
        const isPhone = regex.regexPhone(req.body.phone);
        if (!isPhone)
            return status.error(res, env.status.e_609);
        data_update['phone'] = req.body.phone;
    }
    if (user.role === env.role.teacher) {
        if (req.body.hasOwnProperty('des_futher')) {
            data_update['des_futher'] = req.body.des_futher;
        }
    }
    await userModel.update(id, data_update);
    return status.success(res, "Update Info User Success", [{ ...data_update, id: id , role: user.role}]);
});

router.put('/update', commonAuth, async (req, res) => {
    const { id } = req;
    const user = await userModel.findUserById(id);
    if (!user) {
        return status.error(res, env.status.e_1000);
    }

    data_update = {};
    if (req.body.hasOwnProperty('email')) {
        const isEmail = regex.regexEmail(req.body.email);
        if (!isEmail)
            return status.error(res, env.status.e_603);
        const findUser = await userModel.findUserByEmail(req.body.email);
        if (findUser && findUser.id != id)
            return status.error(res, env.status.e_601);
        data_update['email'] = req.body.email;
    }
    if (req.body.hasOwnProperty('full_name')) {
        data_update['full_name'] = req.body.full_name;
    }
    if (req.body.hasOwnProperty('phone')) {
        const isPhone = regex.regexPhone(req.body.phone);
        if (!isPhone)
            return status.error(res, env.status.e_609);
        data_update['phone'] = req.body.phone;
    }
    if (user.role === env.role.teacher) {
        if (req.body.hasOwnProperty('des_futher')) {
            data_update['des_futher'] = req.body.des_futher;
        }
    }
    await userModel.update(id, data_update);
    return status.success(res, "Update Info User Success", [{ ...data_update, id: id, role: user.role}]);
});

router.delete('/', adminAuth, async (req, res) => {
    const { id } = req.body;
    const user = await userModel.findUserById(id);
    if (!user) {
        return status.error(res, env.status.e_1000);
    }
    try {
        await userModel.delete(id);
    } catch (error) {
        // Foreign key: errorno = 1451
        if (error.errorno == 1451) {
            return status.error(res, env.status.e_1451);
        }
        else {
            return status.errorSystem(res, "Delete Fail");
        }
    }
    return status.success(res, "Delete Success");
});

router.put('/change-status', adminAuth, async (req, res) => {
    const { id } = req.body;
    const user = await userModel.findUserById(id);
    if (!user) {
        return status.error(res, env.status.e_1000);
    }
    const result = await userModel.update(id, { status: !user.status });
    return status.success(res, "Update user status success", [{ ...user, status: !user.status }]);
});


module.exports = router;
