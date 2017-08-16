import View from '../../system/View';

class Registration extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);

        this.upload();
    }
}

export default Registration;
