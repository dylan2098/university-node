const jwt = require('jsonwebtoken')

exports.sign = async (obj) => {
    const token = await jwt.sign(obj, process.env.SECRET_KEY, { expiresIn: process.env.EXPIRESIN })
    if (!token)
        return false;

    return token;
}

exports.verify = async (token) => {
    try {
        let obj = await jwt.verify(token, process.env.SECRET_KEY,
            {
                ignoreExpiration: true
            });

        if (obj) {
            delete obj.exp;
            delete obj.iat;
            return obj;
        }

    } catch (error) { }
}