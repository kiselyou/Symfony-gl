import Ajax from './Ajax';

/**
 *
 * @type {string}
 */
const TEMPLATE_PATH = '/app/es6/app/view/error.ejs';

/**
 *
 * @type {string}
 */
const TEMPLATE = '';

class Error {
    constructor() {
        console.log(TEMPLATE_PATH);


        this.ajax = new Ajax();
        this._loadTemplate();
    }

    _loadTemplate() {
        this.ajax.get(TEMPLATE_PATH)
            .then(
                (res) => {
                    console.log(res, 'asdasdasd');

                },
                (status, meg) => {
                    console.log(status, meg);
                }
            )
    }
}

export default Error;
