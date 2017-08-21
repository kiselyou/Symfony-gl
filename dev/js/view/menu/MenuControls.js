import MenuGeneral from './MenuGeneral';
import {VIEW_PATH_MENU_GENERAL} from './../view-path';

class MenuControls {
    constructor() {

        this.menuGeneral = new MenuGeneral(VIEW_PATH_MENU_GENERAL);
    }
}

export default MenuControls;
