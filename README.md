# Sonos Webdriver.io

Sonos Webdriver.io is a simple NPM project for providing some utility functions to use within our Webdriver.io tests.

## How To Use

To use this module in your Node project you can install it with this command:

```bash
npm install sonos-webdriverio --save
```

You can then call the module with:

```javascript
var drive = require('sonos-webdriverio');
```

### Methods
___

**getBaseUrl**

The `getBaseUrl()` method returns an object that sets the absolute url your tests will run against. The object itself
has two properties:

1. @property **baseUrl** - The absolute url your tests will run against. Defaults to `http://localhost:3000/`. This
allows you to write your tests in a local environment with no additional configuration.
2. @property **env** - The environment your base url is tagged with. Defaults to `dev`. The `env` property can be the
same for multiple urls, but each base url only has a single `env` tag.

Example

```javascript
drive.getBaseUrl().baseUrl   // 'http://localhost:3000'
drive.getBaseUrl().env       // 'dev'
```

**environments**

The `environments()` method returns an object of browsers and platforms that we can run our tests against. Each
environment can run against either Browserstack or Saucelabs, (this object doesn't affect local testing). We also
include properties that you can use in your tests to determine if the current environment is mobile and what
viewport sizes it supports.

1. Firefox on Linux
2. Chrome on OS X 10.9
3. Safari 7 on OS X 10.9
4. Internet Explorer 11
5. Internet Explorer 10
6. Internet Explorer 9

**getViewPort**

The `getViewport()` method allows us to resize the browser window for a specific set of tests. It supports five
viewport sizes:

1. small
2. medium
3. large
4. xlarge
5. xxlarge

Please note that tests for xxlarge viewports won't run if your monitor is incapable of a width greater than 1920px.