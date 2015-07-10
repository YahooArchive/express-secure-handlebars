/* 
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
/*jshint -W030 */
var util = require("util"),
    expressHandlebars = require('express-handlebars').ExpressHandlebars,
    secureHandlebars = require('secure-handlebars');

function ExpressSecureHandlebars(config) {

    // override the original handlebars with secure-handlebars
    config || (config = {});
    config.handlebars = config.secureHandlebars || secureHandlebars;

    /* calling super constructor */
    this.constructor.super_.call(this, config);
}

/* inheriting the express-handlebars */
util.inherits(ExpressSecureHandlebars, expressHandlebars);

/* exporting the same signature of express-handlebars */
exports = module.exports  = exphbs;
exports.create            = create;
exports.ExpressHandlebars = ExpressSecureHandlebars;

// ------------------------------------------

function exphbs(config) {
    return create(config).engine;
}

function create(config) {

    /* passing the partialsDir to the secure-handlebars by using the config.compilerOptions */
    config || (config = {});

    return overrideEH(new ExpressSecureHandlebars(config));
}

function overrideEH(secureExpHbs) {
    var r = secureExpHbs.render;

    /* this function is the entry point of parent template file */
    secureExpHbs.render = function (filePath, context, options) {
        this.compilerOptions || (this.compilerOptions = {});
        this.compilerOptions.processingFile = filePath;
        return r.call(this, filePath, context, options);
    };

    return secureExpHbs;
}
