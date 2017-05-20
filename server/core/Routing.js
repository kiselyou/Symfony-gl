function Routing(config) {

    this.DIR_APP = this.getEnvironment(config);
    this.PATH_APP = __dirname + '/' + this.DIR_APP;

    this.TEMPLATE_JS = '/js';
    this.TEMPLATE_HTML = '/html';
    this.DIR_TEMPLATES = '/patterns';
    this.DIR_ROUTES = '/server/routing';
    this.PATH_TEMPLATES = this.PATH_APP + this.DIR_TEMPLATES;
    this.PATH_TEMPLATES_JS = this.PATH_TEMPLATES + this.TEMPLATE_JS;
    this.PATH_TEMPLATES_HTML = this.PATH_TEMPLATES + this.TEMPLATE_HTML;

    this.PATH_ROUTES = __dirname + this.DIR_ROUTES;

    /**
     * Get directory of environment
     *
     * @param {{environment: {app: boolean, dist: boolean}}} config
     * @returns {string} possible values ( 'app' | 'dist' )
     */
    this.getEnvironment = function (config) {
        for ( var environment in config.environment ) {
            if (config.environment.hasOwnProperty(environment) && config.environment[environment]) {
                return environment;
            }
        }
        return 'app';
    }
}
