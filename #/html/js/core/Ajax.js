var IW = IW || {};

/**
 *
 * @constructor
 */
IW.Ajax = function () {

    var xhr = new XMLHttpRequest();

    /**
     *
     * @param {string} url
     * @param {{}} [param]
     * @param {string.<IW.Ajax.POST|IW.Ajax.GET>} [method] - default POST
     * @returns {IW.Ajax}
     */
    this.open = function ( url, param, method ) {
        xhr.open(method ? method : IW.Ajax.POST, url);
        return this;
    };

    /**
     *
     * @param {function} success
     * @param {function} error
     * @returns {IW.Ajax}
     */
    this.send = function ( success, error ) {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) {
                return;
            }

            if (xhr.status != 200) {
                if (error) {
                    error.call(this, xhr.status, xhr.statusText);
                }
            } else {
                success.call(this, xhr.responseText);
            }
        };
        return this;
    };

};

IW.Ajax.POST = 'POST';
IW.Ajax.GET = 'GET';