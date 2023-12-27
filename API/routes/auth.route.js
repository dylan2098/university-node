const express = require('express');
const randomstring = require('randomstring');
const userModel = require('../models/user.model');
const regex = require("../utils/regex");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("../utils/jwt");
const general = require("../utils/general");
const passport = require("passport");

const validate = require("../middlewares/validate.mdw");
const { teacherAuth, studentAuth } = require('../middlewares/auth.mdw');
const userSchema = require("../schemas/user.json");
const sendEmail = require("../utils/mail");
const { TemplateSignUp, TemplateResetPassword } = require("../utils/template");
// const Nexmo = require('nexmo');

// signup
router.post('/sign-up', validate(userSchema), async (req, res) => {
    if (req.body) {
        const isEmail = regex.regexEmail(req.body.email);
        if (!isEmail)
            return status.error(res, env.status.e_603);

        const isPhone = regex.regexPhone(req.body.phone);
        if (!isPhone)
            return status.error(res, env.status.e_609);

        const findUser = await userModel.findUserByEmail(req.body.email);
        if (findUser)
            return status.error(res, env.status.e_601);

        const param = {
            email: req.body.email,
            full_name: req.body.full_name,
            phone: req.body.phone,
            password: req.body.password,
            status: 0,
            role: 2,
            created_at: general.getCurrentDayFormat(),
            updated_at: general.getCurrentDayFormat()
        };

        const userId = await userModel.add(param);
        const code = randomstring.generate(6);
        await userModel.updateCodeActive(userId[0], code);

        const user = await userModel.findUserById(userId[0]);
        // Generate token
        const accessToken = await jwt.sign({
            userId: user.id
        }, process.env.SECRET_KEY, {
            expiresIn: process.env.EXPIRESIN
        });

        // Update refresh token
        const refreshToken = randomstring.generate();
        await userModel.updateRefreshToken(user.id, refreshToken);

        let reduceUser = userModel.reduceUser(user);
        reduceUser.access_token = accessToken;

        const paramSendMail = { email: param.email, code_active: code };
        await sendEmail(param.email, TemplateSignUp.getSubject(paramSendMail), TemplateSignUp.getText(), TemplateSignUp.getHTML(paramSendMail));
        return status.success(res, "Create Success", [reduceUser]);
    }
})

router.post('/active', studentAuth, async (req, res) => {
    const userId = req.id;
    const code = req.body.code;

    const user = await userModel.findUserById(userId);
    if (user == null || user.code_active == "")
        return status.error(res, env.status.e_614);

    if (code != user.code_active)
        return status.error(res, env.status.e_605);

    const result = await userModel.updateCodeActive(user.id, "");
    const active = await userModel.updateActiveStatus(user.id, true);
    return status.success(res, "Active Success", result, active);
});

//Change password
router.post('/change-password', studentAuth, async (req, res) => {

    if (!req.id || !req.body.password)
        return status.error(res, env.status.e_602);

    const user = await userModel.findUserById(req.id);
    if (user == null)
        return status.error(res, env.status.e_606);

    // const user = await userModel.findUserByEmailActive(email);
    // if (user == null)
    //     return status.error(res, env.status.e_603);

    const email = user.email;

    const isCompare = await bcrypt.compare(req.body.password, user.password);
    if (!isCompare)
        return status.error(res, env.status.e_604);

    const isValid = req.body.new_password == req.body.repeat_new_password;
    if (!isValid)
        return status.error(res, env.status.e_615);

    const data = userModel.changePassword(email, req.body.new_password);
    return status.success(res, "Change Password Success", [data]);
});


// signin
router.post('/', async (req, res) => {

    if (!req.body.email || !req.body.password)
        return status.error(res, env.status.e_602);

    const user = await userModel.findUserByEmail(req.body.email);
    if (user == null)
        return status.error(res, env.status.e_603);
    if (user.status != 1){
        return status.error(res, env.status.e_616);
    }

    const isCompare = await bcrypt.compare(req.body.password, user.password);
    if (!isCompare)
        return status.error(res, env.status.e_604);


    // Generate token
    const accessToken = await jwt.sign({
        userId: user.id
    }, process.env.SECRET_KEY, {
        expiresIn: process.env.EXPIRESIN
    });

    // Update refresh token
    const refreshToken = randomstring.generate();
    await userModel.updateRefreshToken(user.id, refreshToken);

    let reduceUser = userModel.reduceUser(user);
    reduceUser.access_token = accessToken;
    reduceUser.refresh_token = refreshToken;

    return status.success(res, "Login Success", [reduceUser]);
});



router.post('/refresh', async (req, res) => {
    const { access_token, refresh_token } = req.body;
    const arrAcesstoken = access_token.split(' ');
    const { userId } = await jwt.verify(arrAcesstoken[1]);

    const user = await userModel.findUserById(userId);
    if (user.status != 1){
        return status.error(res, env.status.e_616);
    }

    const ret = await userModel.isValidRefreshToken(userId, refresh_token);
    if (ret === true) {
        const newAccessToken = await jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRESIN });
        return status.success(res, "Create Token Success", [newAccessToken])
    }

    return status.error(res, env.status.e_805);
});



require('../models/google.model')
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get("/google/callback", passport.authenticate('google', {
    failureRedirect: 'http://localhost:3000/sign-in',
}), (req, res) => {
    res.redirect(`http://localhost:3000/sign-in?accessToken=${req.user.access_token}&refreshToken=${req.user.refresh_token}&displayName=${req.user.full_name}&role=${req.user.role}&id=${req.user.id}`);
})

module.exports = router;