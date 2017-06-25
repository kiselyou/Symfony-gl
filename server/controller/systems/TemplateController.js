const IW = require('./../../core/TemplateLoader.js');

class TemplateController {

    constructor(db, config) {
        this.loader = new IW.TemplateLoader(config);
        this._server = config;
    }

    render(req, res) {

        let content = null;

        try {
            content = this.loader.includePattern(this.loader.createPattern(req.body['path']), []);
        } catch (error) {
            content = this.loader.prepareTemplateError(error)
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(content, this._server.encoding, true);

    }
}

module.exports = TemplateController;
