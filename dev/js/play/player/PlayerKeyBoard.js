
class PlayerKeyBoard {
	constructor() {

		/**
		 * Start/Stop move
		 *
		 * @type {{code: number, name: string}}
		 */
		this.startOrStopMoveShip = {
			code: 32,
			name: 'space'
		};

		/**
		 * Set aim
		 *
		 * @type {{code: number, name: string}}
		 */
		this.target = {
			code: 17,
			mouse: 'left',
			name: 'Ctrl + left click'
		};

		/**
		 * Show path to aim
		 *
		 * @type {{code: number, name: string}}
		 */
		this.targetPath = {
			code: 80,
			name: 'p'
		};

		/**
		 * Start move ship by double click
		 *
		 * @type {boolean}
		 */
		this.moveByDoubleClick = true;
	}
}

export default PlayerKeyBoard;