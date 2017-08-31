
import fs from 'fs';
import prompt from 'prompt';

const DIR = './dev/server/config/';
const PATH_CONFIG = 'config.json';
const PATH_DATABASE = 'database.json';
const PATH_MAILER = 'mailer.json';
const PATH_SECURITY = 'security.json';

// Commands
// npm run config-ini
// Y - Yes. Rewrite and continue
// N - No. Not rewrite and continue
// S - Stop. Not rewrite and Stop

let schema = {
    properties: {
      	encoding: {
			description: 'Unicode',
			default: 'utf-8'
		},
		server_port: {
			description: 'Server port',
			message: 'Port must be integer',
			type: 'integer',
			default: 80
		},
		server_host: {
			description: 'Server hostname',
			default: '127.0.0.1'
		},
		socket_port: {
			description: 'Socket port',
			message: 'Port must be integer',
			type: 'integer',
			default: 3000
		},
		socket_host: {
			description: 'Socket hostname',
			default: '127.0.0.1'
		},
		secretKeyBase: {
			description: 'Secret Key',
			default: '8b892ca3-ca24-4873-974a-c783aee83d3e'
		}
	}
};

let database = {
    properties: {
		mysql_port: {
			description: 'Database port',
			message: 'Port must be integer',
			type: 'integer',
			default: 3306
		},
		mysql_host: {
			description: 'Database hostname',
			default: '127.0.0.1'
      	},
      	mysql_database: {
			description: 'Database name',
			default: 'database_name'
      	},
      	mysql_user: {
			description: 'Database user',
			default: 'root'
      	},
      	mysql_password: {
			description: 'Database password',
			default: 'root',
			replace: '*',
			hidden: true
      	}
    }
};

let mailer = {
    properties: {
      	mailer_sender: {
			description: 'Mailer sender',
			default: ''
      	},
      	mailer_host: {
			description: 'Mailer hostname',
			default: 'smtp.gmail.com'
      	},
      	mailer_port: {
			description: 'Mailer port',
			message: 'Port must be integer',
			type: 'integer',
			default: 465
      	},
      	mailer_user: {
			description: 'Mailer user',
			default: 'game.iron.war@gmail.com'
      	},
      	mailer_password: {
			description: 'Mailer password',
			default: 'root',
			replace: '*',
			hidden: true
      	}
    }
};

if (!fs.existsSync(DIR)){
    fs.mkdirSync(DIR);
}

askBase();

/**
 * @returns {void}
 */
function askBase() {
    console.log('==================== CREATE BASE CONFIGURATION ====================');
    prompt.start();
    prompt.get(schema, function (err, result) {
        writeFile(PATH_CONFIG, createBaseConfig(result), (status) => {
            if (status) {
                askMailer();
            }
        });
    });
}

/**
 * @returns {void}
 */
function askMailer() {
    console.log('=================== CREATE MAILER CONFIGURATION ===================');
    prompt.start();
    prompt.get(mailer, function (err, result) {
        writeFile(PATH_MAILER, createMailerConfig(result), (status) => {
            if (status) {
                askDatabase();
            }
        });
    });
}

/**
 * @returns {void}
 */
function askDatabase() {
    console.log('================== CREATE DATABASE CONFIGURATION ==================');
    prompt.start();
    prompt.get(database, function (err, result) {
        writeFile(PATH_DATABASE, createDatabaseConfig(result), (status) => {
            if (status) {
                askSecurity();
            }
        });
    });
}

/**
 * @returns {void}
 */
function askSecurity() {
    writeFile(PATH_SECURITY, createSecurityConfig(), (status) => {
        if (status) {
            console.log('=========== The configuration was created successfully  ===========');
        }
    });
}

/**
 *
 * @param {Object} responses
 * @returns {{encoding: *, server: {dev: {port: *, host: *}, prod: {port: *, host: *}}, socket: {dev: {port: *, host: *}, prod: {port: *, host: *}}, secretKeyBase: *}}
 */
function createBaseConfig(responses) {
	return {
        encoding: responses['encoding'],
        server: {
            dev: {
                port: responses['server_port'],
                host: responses['server_host']
            },
            prod: {
                port: responses['server_port'],
                host: responses['server_host']
            }
        },
        socket: {
            dev: {
                port: responses['socket_port'],
                host: responses['socket_host']
            },
            prod: {
                port: responses['socket_port'],
                host: responses['socket_host']
            }
        },
        secretKeyBase: responses['secretKeyBase']
    };
}

/**
 *
 * @param {Object} responses
 * @returns {{sender: *, transporter: {host: *, port: *, secure: boolean, auth: {user: *, pass: *}}}}
 */
function createMailerConfig(responses) {
    return {
        sender: responses['mailer_sender'],
        transporter: {
            host: responses['mailer_host'],
            port: responses['mailer_port'],
            secure: true,
            auth: {
                user: responses['mailer_user'],
                pass: responses['mailer_password']
            }
        }
    };
}

/**
 *
 * @returns {{access_control: [*,*,*], role_hierarchy: {ROLE_ANONYMOUSLY: Array, ROLE_IW: [string], ROLE_IW_USER: [string], ROLE_IW_ADMIN: [string]}}}
 */
function createSecurityConfig() {
   return {
       access_control: [
           {path: '/', role: 'ROLE_ANONYMOUSLY'},
           {path: '/home', role: 'ROLE_IW_USER'},
           {path: '/admin', role: 'ROLE_IW_ADMIN'}
       ],
       role_hierarchy: {
           ROLE_ANONYMOUSLY: [],
           ROLE_IW: ['ROLE_ANONYMOUSLY'],
           ROLE_IW_USER: ['ROLE_IW'],
           ROLE_IW_ADMIN: ['ROLE_IW_USER']
       }
   };
}

/**
 *
 * @param {Object} responses
 * @returns {{mysql: {host: *, port: *, user: *, password: *, database: *}}}
 */
function createDatabaseConfig(responses) {
    return {
		mysql: {
			host: responses['mysql_host'],
			port: responses['mysql_port'],
			user: responses['mysql_user'],
			password: responses['mysql_password'],
			database: responses['mysql_database']
		}
	};
}

/**
 * @param {boolean} status
 * @param {Object} [res]
 * @callback listenerDone
 */

/**
 *
 * @param {string} file
 * @param {Object} obj
 * @param {listenerDone} listener
 * @returns {void}
 */
function writeFile(file, obj, listener) {
    let json = JSON.stringify(obj, null, 4);
    let path = DIR + file;
    fs.exists(path, (exists) => {
        if (exists) {
            let schema = {
                properties: {
                    confirm: {
                        description: 'The configuration has already exist. Do you really want continue and rewrite the file "' + path + '" (Y|N|S)',
                        message: 'You need confirm this action. Please set value Y or N',
                        type: 'string',
                        required: true
                    }
                }
            };

            prompt.start();
            prompt.get(schema, function (err, result) {
                switch (result['confirm'].toLowerCase()) {
                    case 'y':
                    case 'yes':
                        // File has already exist. Rewrite
                        _write(path, json, listener);
                        break;
                    case 'stop':
                    case 's':
                        // Stop generate configuration
                        listener(false);
                        break;
                    case 'no':
                    case 'n':
                    default:
                        // Skip and continue
                        listener(true);
                        break;
                }
            });
        } else {
            // File does not exist. Create a new
            _write(path, json, listener);
        }
    });
}

/**
 *
 * @param {string} path
 * @param {string} json
 * @param {listenerDone} listener
 * @private
 */
function _write(path, json, listener) {
    fs.writeFile(path, json, 'utf8', (error, res) => {
        if (error) {
            console.log('Cannot write to the file "' + path + '"');
            listener(false);
            return;
        }
        listener(true, res);
    });
}
