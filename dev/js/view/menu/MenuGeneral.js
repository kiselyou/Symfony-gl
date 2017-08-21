import View from '../../system/View';

class MenuGeneral extends View {
    /**
     *
     * @param {string} path It is path to template
     */
    constructor(path) {
        super(path);

        this.upload((el) => {
            this.show(false);
            console.log(el);
        });
    }
}

export default MenuGeneral;