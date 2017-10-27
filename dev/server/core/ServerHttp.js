import qs from 'qs';
import Authorization from "./security/Authorization";

class ServerHttp extends Authorization {
	/**
	 *
	 * @param {Http.Request} req
	 * @param {Http.Response} res
	 */
	constructor(req, res) {
		super(req.session);
		/**
		 *
		 * @type {Http.Request}
		 */
		this.req = req;

		/**
		 *
		 * @type {Http.Response}
		 */
		this.res = res;
	}

	/**
	 * Send view to client
	 *
	 * @param {string} pathView - it is path to template ejs
	 * @param {Object} params
	 * @returns {ServerHttp}
	 */
	responseView(pathView, params = {}) {
		this.res.render(pathView.replace(/^\/+/, ''), params);
		return this;
	};

	/**
	 * Send json to client
	 *
	 * @param {{}|[]} data
	 * @returns {ServerHttp}
	 */
	responseJSON(data) {
		let str = JSON.stringify(data);
		this.res.writeHead(200, {'Content-Type': 'application/json', 'Content-Length': str.length});
		this.res.end(str, 'utf-8', true);
		return this;
	};

	/**
	 *
	 * @returns {string}
	 */
	getCurrentUrl() {
		return this.req.url;
	}

	/**
	 *
	 * @returns {XMLHttpRequest|null|*|a}
	 */
	getXHR() {
		return this.req.xhr;
	}

	/**
	 * Get headers
	 *
	 * @returns {Object}
	 */
	get headers() {
		return this.req.headers;
	}

	/**
	 * Get server host
	 *
	 * @returns {string}
	 */
	get host() {
		return this.headers.host;
	}

	/**
	 * Get POST data
	 *
	 * @returns {Object}
	 */
	get POST() {
		return this.req.body;
	}

	/**
	 * Get GET data
	 *
	 * @returns {{}}
	 */
	get GET() {
		let data = {};
		for (let key in this.req.params) {
			if (this.req.params.hasOwnProperty(key)) {
				data[key] = this.req.params[key];
			}
		}
		for (let key in this.req.query) {
			if (this.req.query.hasOwnProperty(key)) {
				data[key] = this.req.query[key];
			}
		}
		return data;
	}

	/**
	 * Redirect
	 *
	 * @param {string} [path]
	 * @returns {ServerHttp}
	 */
	redirect(path) {
		this.res.redirect(path ? path : '/');
		return this;
	}

	/**
	 *
	 * @param {string} data
	 * @returns {Object|Array}
	 */
	parseData(data) {
		return qs.parse(data);
	}
}

export default ServerHttp;