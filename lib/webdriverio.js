var argv = require('minimist'),
		chai = require('chai'),
		_ = require('lodash');

module.exports = {

	setupChai: function(browser) {
		chaiAsPromised = require('chai-as-promised');
		chai.use(chaiAsPromised);
		chai.should();
		chaiAsPromised.transferPromiseness = browser.transferPromiseness;
	},

	/* ====================================================================================================================
	 * @exports environments()
	 * @returns Object
	 *
	 * A list of browser, OS, and device environments that we can test on SauceLabs. In the dev environment, we use the
	 * default, which is Firefox. We can add more environments, information here: https://saucelabs.com/platforms
	 * ====================================================================================================================
	 */
	environments: function() {

		return {
			firefox: {
				browserName: 'firefox',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: true,
					xlarge: false,
					xxlarge: false
				}
			},
			chrome: {
				browserName: 'chrome',
				platform: 'MAC',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: true,
					xlarge: false,
					xxlarge: false
				}
			},
			safari: {
				browserName: 'safari',
				version: '7',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: false,
					xlarge: false,
					xxlarge: false
				}
			},
			ie11: {
				browserName: 'internet explorer',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: true,
					xlarge: false,
					xxlarge: false
				}
			},
			ie10: {
				browserName: 'internet explorer',
				version: '10',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: true,
					xlarge: false,
					xxlarge: false
				}
			},
			ie9: {
				browserName: 'internet explorer',
				version: '9',
				mobile: false,
				viewports: {
					small: true,
					medium: true,
					large: true,
					xlarge: false,
					xxlarge: false
				}
			}
		};

	},

	getViewport: function(viewport) {

		var h = 1000,
			viewports = {
				xxlarge: 1950,
				xlarge: 1500,
				large: 1280,
				medium: 700,
				small: 430
			},
			w;

		if (viewport === 'xxlarge') {
			w = viewports.xxlarge;
		}

		if (viewport === 'xlarge') {
			w = viewports.xlarge;
		}

		if (viewport === 'large') {
			w = viewports.large;
		}

		if (viewport === 'medium') {
			w = viewports.medium;
		}

		if (viewport === 'small') {
			w = viewports.small;
		}

		return {
			width: w,
			height: h
		}

	},

	/* ====================================================================================================================
	 * @exports getBaseUrl()
	 * @returns Object
	 *
	 * Through the CLI, we can pass flags to our "grunt e2e" command.
	 *
	 * @flag --production: Runs our integration tests on the production environment
	 * @flag --stage: Runs our integration tests on the staging environment
	 *
	 * If now flag is provided, we assume that we're running our tests on a development environment. We return an object
	 * with the url and environment name.
	 * ====================================================================================================================
	 */

	getBaseUrl: function() {

		var args = argv(process.argv.slice(3)),
			url = args.url,
			env = args.env,
			ret;

		if (typeof env !== 'undefined' && env !== '') {

			switch (env) {
				case 'suit-stage':
					url = 'http://static.sonos.com/v2/stage/';
					env = 'stage';
					break;
				case 'suit-production':
					url = 'http://static.sonos.com/v2/live/';
					env = 'production';
					break;
				case 'suit-static':
					url = 'http://localhost:8000/';
					env = 'dev';
					break;

			}

			ret = {
				baseUrl: url,
				env: env
			};

		} else if ((typeof url !== 'undefined' && url !== '')) {

			ret = {
				baseUrl: url + '/',
				env: 'dev'
			};

		} else {

			ret = {
				baseUrl: 'http://localhost:3000/',
				env: 'dev'
			};

		}

		return ret.baseUrl;

	},

	setupGrunt: function(gruntConfig) {

		_(this.environments()).forEach(function(environment, key) {

			var desiredCapabilities = {
					browserName: environment.browserName,
					version: environment.version,
					platform: environment.platform
				},
				tests = gruntConfig.webdriver.options.tests;

			// Sets up the local testing configuration
			gruntConfig.webdriver[key] = {
				tests: tests,
				options: {
					desiredCapabilities: desiredCapabilities
				}
			};

			// Sets up the browserstack testing configuration
			// Should be run with --env argument
			gruntConfig.webdriver['browserstack-' + key] = {
				tests: tests,
				options: {
					host: 'hub.browserstack.com',
					port: 80,
					user: gruntConfig.webdriver.options.browserstack.user,
					key: gruntConfig.webdriver.options.browserstack.key,
					desiredCapabilities: desiredCapabilities,
					inputCapabilities: {browserstack: {debug: true}}
				}
			};

			// Sets up the saucelabs testing configuration
			// Should be run with --env argument
			gruntConfig.webdriver['saucelabs-' + key] = {
				tests: tests,
				options: {
					host: 'ondemand.saucelabs.com',
					port: 80,
					user: gruntConfig.webdriver.options.saucelabs.user,
					key: gruntConfig.webdriver.options.saucelabs.key,
					desiredCapabilities: desiredCapabilities
				}
			};
		});

	}

};