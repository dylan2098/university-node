'use strict';

const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

async function authenticate(req, res, next, tokenHeaders, rolePermission) {
    if (tokenHeaders !== undefined) {
        const arr_strToken = tokenHeaders.split(" ");
        if (arr_strToken[0].toLowerCase() === 'bearer') {

            if (!arr_strToken[1])
                return status.badRequest(res, "Authenticate failed");

            const auth = await jwt.verify(arr_strToken[1], process.env.SECRET_KEY);

            if (!auth)
                return status.error(res, env.status.e_802);

            const user = await userModel.findUserById(auth.userId);

            if (Number.isInteger(rolePermission)) {
                if (rolePermission !== user.role) {
                    return status.error(res, env.status.e_801);
                }
            }

            await jwt.sign(auth, process.env.SECRET_KEY);
            req.id = user.id;
            req.role = user.role;
            req.displayName = user.full_name;
        }
        else
            return status.error(res, env.status.e_803);
    }
    else
        return status.error(res, env.status.e_804);

    return next();
}


async function studentAuth(req, res, next) {
    return await authenticate(req, res, next, req.headers.authorization, env.role.student);
}

async function teacherAuth(req, res, next) {
    return await authenticate(req, res, next, req.headers.authorization, env.role.teacher);
}

async function adminAuth(req, res, next) {
    return await authenticate(req, res, next, req.headers.authorization, env.role.admin);
}

async function commonAuth(req, res, next) {
    return await authenticate(req, res, next, req.headers.authorization);
}

async function guestOrCommonAuth(req, res, next) {
    if(req.headers.authorization && req.headers.authorization != 'undefined')
        return await commonAuth(req, res, next);
    return next();
}


module.exports = { studentAuth, teacherAuth, adminAuth, commonAuth, guestOrCommonAuth };
