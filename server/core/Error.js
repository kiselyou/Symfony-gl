
class Error {
    constructor(exiption) {

        this.exiption = exiption;

        this.log = [];
    }

    message(msg) {

        console.log(this.exiption, msg);
    }
}

/**
 *
 * @module Error
 */
module.exports = Error;
