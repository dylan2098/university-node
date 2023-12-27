class Regex {
    constructor() { };

    static regexEmail(email) {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    static regexPhone(phone) {
        const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        return regex.test(phone);
    }
}

module.exports = Regex;