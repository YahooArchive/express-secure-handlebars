Express with Secure Handlebars
-------
[![npm version][npm-badge]][npm]
[![dependency status][dep-badge]][dep-status]
[![Build Status](https://travis-ci.org/yahoo/express-secure-handlebars.svg?branch=master)](https://travis-ci.org/yahoo/express-secure-handlebars)

[npm]: https://www.npmjs.org/package/express-secure-handlebars
[npm-badge]: https://img.shields.io/npm/v/express-secure-handlebars.svg?style=flat-square
[dep-status]: https://david-dm.org/yahoo/express-secure-handlebars
[dep-badge]: https://img.shields.io/david/yahoo/express-secure-handlebars.svg?style=flat-square

We enhance the [express-handlebars](https://www.npmjs.com/package/express-handlebars) server-side view engine by leveraging the [secure-handlebars](https://www.npmjs.com/package/secure-handlebars) for defending against Cross-Site Scripting (XSS). Hence, web applications can be automatically secured by contextual output escaping.

- **Immediate Benefits**: Our approach outperforms the [existing HTML escaping](http://handlebarsjs.com/#html-escaping) by applying precise filtering rules that are specific to different output contexts, and is thus *more secure against XSS vectors* while *eliminating double encodings* altogether.
- **Least Adoption Effort**: The manual effort required is as easy as batch replacing `express-handlebars` with `express-secure-handlebars` (i.e., to update those `require()` calls as well as the dependency in your `package.json`). The nitty-gritties of filter choices and integrations are all automated!

For more details, kindly refer to the introductions to [secure-handlebars](https://www.npmjs.com/package/secure-handlebars) and [xss-filters](https://www.npmjs.com/package/xss-filters).

## Quick Start

### Installation
```sh
npm install express-secure-handlebars --save
```

### Usage
Simply replace `express-handlebars` with the `express-secure-handlebars` package in all `require()`!

## Basic Example
Based on the basic example of [ExpressHandlebars](https://github.com/ericf/express-handlebars#basic-usage), here we show an example app that can be secured only with our package. 

**views/profile.handlebars**:

Given that there is a very typical handlebars template file written like so to incorporate user inputs. 
The enhanced package can secure the web application by automatically applying context-sensitive output filters, which otherwise is still subject to XSS attacks if using the default escaping approach (e.g., when url is javascript:alert(1) or onclick=alert(1)). 

```html
<h1>Example App: {{title}}</h1>
...
<div>User-provided URL: <a href="{{url}}">{{url}}</a></div>
...
```

**views/layouts/main.handlebars**:

Same as the Handlebars original example, this file serves as the HTML page wrapper which can be reused for the different views of the app. {{{body}}} is used as a placeholder for where the main content should be rendered.

```html
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>{{title}}</title></head>
<body>
    {{{body}}}
</body>
</html>
```

**app.js**:

A super simple Express app that registers the Handlebars view engine. 

```javascript
var express = require('express'),
//  The only difference is to replace 'express-handlebars' with our enhanced package.
//  exphbs  = require('express-handlebars');
    exphbs  = require('express-secure-handlebars');

var app = express(),
    hbs = exphbs.create({ /* config */ });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/profile', function (req, res) {
    res.render('profile', {
        title:  'User Profile',
        url:    req.query.url    // an untrusted user input
    });
});

app.listen(3000);
```

## Development

## Known Limitations & Issues
Please refer to the [section](https://github.com/yahoo/secure-handlebars/blob/master/README.md#known-limitations--issues) documented in secure-handlebars.

### Warnings and Workarounds
Please refer to the [section](https://github.com/yahoo/secure-handlebars/blob/master/README.md#warnings-and-workarounds) documented in secure-handlebars.

## How to test
Apply your changes to files in [src/](./src), and then run the tests.
```sh
npm test
```


## License

This software is free to use under the Yahoo Inc. BSD license.
See the [LICENSE file](./LICENSE) for license text and copyright information.
