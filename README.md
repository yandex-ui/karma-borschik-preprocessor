# karma-borschik-preprocessor

[![Build Status](https://travis-ci.org/maksimr/karma-borschik-preprocessor.png?branch=master)](https://travis-ci.org/maksimr/karma-borschik-preprocessor) [![Build Status](https://drone.io/github.com/maksimr/karma-borschik-preprocessor/status.png)](https://drone.io/github.com/maksimr/karma-borschik-preprocessor/latest)

> Preprocessor to build JavaScript files through [borschik](https://github.com/bem/borschik) on the fly.

## Installation

The easiest way is to keep `karma-borschik-preprocessor` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-borschik-preprocessor": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-borschik-preprocessor --save-dev
```

## Configuration
Following code shows the default configuration...
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    preprocessors: {
      '**/*.js': ['borschik']
    },

    borschikPreprocessor: {
      // options passed to the borschik builder
      options: {
        'comments': true,
        'minimize': true
      }
    }
  });
};
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
