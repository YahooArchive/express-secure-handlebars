Express with Secure Handlebars
-------


We enhance the [ExpressHandlebars](https://www.npmjs.com/package/express-handlebars) server-side view engine by **automatically** applying [Context-aware XSS output filters](https://www.npmjs.com/package/xss-filters) to better secure your web applications.

- **Immediate Benefits**: Our approach outperforms the [existing HTML escaping](http://handlebarsjs.com/#html-escaping) by applying precise filtering rules that are specific to different output contexts, and is thus *secure against more attack vectors* while *eliminating double encodings* altogether. Kindly refer to [xss-filters](https://www.npmjs.com/package/xss-filters) for details. 
- **Least Adoption Effort**: The manual effort required is as easy as batch replacing `express-handlebars` with `express-secure-handlebars` (i.e., to update those `require()` calls as well as the dependency in your `package.json`). The nitty-gritties of filter choices and integrations are all automated!

## Quick Start

### Installation
```
$ npm install express-secure-handlebars --save
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

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
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

Apply your changes to files in [src/](./src), and then run the tests.
```
$ npm test
```

### Build
[![Build Status](https://travis-ci.org/yahoo/express-secure-handlebars.svg?branch=master)](https://travis-ci.org/yahoo/express-secure-handlebars)

## License

This software is free to use under the Yahoo Inc. BSD license.
See the [LICENSE file](./LICENSE) for license text and copyright information.
