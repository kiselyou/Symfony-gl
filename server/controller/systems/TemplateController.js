
class TemplateController {

    constructor(config) {
        this.loader = config.view;
        this._config = config;
    }

    render(req, res) {

        let content = null;

        try {
            content = this.loader.includePattern(this.loader.createPattern(req.body['path']), []);
        } catch (error) {
            content = this.loader.prepareTemplateError(error)
        }

        res.writeHead(200, this._config.contentType(2));
        res.end(content, this._config.encoding, true);

    }
}

module.exports = TemplateController;
