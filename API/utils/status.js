const general = require("../utils/general");

class Status {

    constructor() { }

    static success(res, message, data = [], attachedData = {}) {
        const dataSend = { status_code: 200, message: message, data: data };
        if (general.checkObject(attachedData)) {
            dataSend.attached_data = attachedData;
        }

        return res.send(dataSend);
    };

    static error(res, notify, data = []) {
        return res.send({ status_code: notify[0], message: notify[1], data: data });
    };

    static errorSystem(res, message) {
        return res.send({ status_code: 500, message: "System error: " + message, data: [] });
    }
}

module.exports = Status