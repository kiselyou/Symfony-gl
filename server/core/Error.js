const TITLE_ALERT = 'SERVER ERROR:';
const TITLE_WARNING = 'WARNING:';
const TITLE_PERMISSION = 'PERMISSION DENIED:';

class Error {
    constructor(exception) {

        this._exception = exception;

        this.log = [];

        this.msg = null;

        this.type = null;
    }

    /**
     *
     * @param exception
     * @returns {Error}
     */
    exception(exception) {
        this._exception = exception;
        return this;
    }

    /**
     *
     * @param {string} msg
     * @param {string} [className]
     * @param {string} [methodName]
     * @returns {Error}
     */
    alert(msg, className = null, methodName = null) {
        this.type = 'alert';
        console.log(this._exception, msg, className, methodName);
        return this;
    }

    /**
     *
     * @param {string} msg
     * @param {string} [className]
     * @param {string} [methodName]
     * @returns {Error}
     */
    warning(msg, className = null, methodName = null) {
        this.type = 'warning';
        console.log(this._exception, msg, className, methodName);
        return this;
    }

    /**
     *
     * @param {string} msg
     * @param {string} [className]
     * @param {string} [methodName]
     * @returns {Error}
     */
    permission(msg, className = null, methodName = null) {
        this.type = 'permission';
        console.log(this._exception, msg, className, methodName);
        return this;
    }

    /**
     * Get message for user
     *
     * @returns {string}
     */
    get() {
        let msg = '';
        switch (this.type) {
            case 'alert':
                msg += TITLE_ALERT + ' ' + this.msg;
                break;
            case 'warning':
                msg += TITLE_WARNING + ' ' + this.msg;
                break;
            case 'permission':
                msg += TITLE_PERMISSION + ' ' + this.msg;
                break;
        }
        return msg;
    }
}

/**
 *
 * @module Error
 */
module.exports = Error;
