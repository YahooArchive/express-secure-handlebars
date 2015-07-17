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
    ExpressHandlebars = require('express-handlebars').ExpressHandlebars,
    secureHandlebars = require('secure-handlebars'),
    assign = require('object.assign'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require("fs")),
    glob = Promise.promisify(require('glob'));

function ExpressSecureHandlebars(config) {

    // override the original handlebars with secure-handlebars
    config || (config = {});
    config.handlebars = config.secureHandlebars || secureHandlebars;

    /* calling super constructor */
    this.constructor.super_.call(this, config);

    // compilerOptions is being used for passing params to context-parser-handlebars
    this.compilerOptions || (this.compilerOptions = {});
    this.compilerOptions.cph || (this.compilerOptions.cph = {});
    this.compilerOptions.cph.rawPartialsCache = {};
    this.compilerOptions.cph.processedPartialsCache = {};
    this.compilerOptions.cph.compiledPartialsCache = {};
    this.compilerOptions.cph.enablePartialCombine = false;

    // create a slave instance of the Express Handlebars for caching partials
    var expressSecureHandlebars = this;
    this.slaveExpressHandlebars = new ExpressHandlebars(config);
    var returnTemplate = function (template, options) {
        return template;
    };
    this.slaveExpressHandlebars._compileTemplate = returnTemplate;
    this.slaveExpressHandlebars._precompileTemplate = returnTemplate;
    this.slaveExpressHandlebars.getPartials({}).then(function(rawPartialCache) {
        expressSecureHandlebars.compilerOptions.cph.rawPartialsCache = rawPartialCache;
        // disable the getPartials with partialsDir setting to empty array
        expressSecureHandlebars.partialsDir = [];
    });
}

/* inheriting the express-handlebars */
util.inherits(ExpressSecureHandlebars, ExpressHandlebars);

/* compiling the template into Handlebars template function */
function compileTemplates(templates, precompiled) {
    for (var name in templates) {
        if (templates.hasOwnProperty(name) && !this.compilerOptions.cph.compiledPartialsCache[name]) {
            this.compilerOptions.cph.compiledPartialsCache[name] = precompiled? this._precompileTemplate(templates[name], this.compilerOptions) 
                : this._compileTemplate(templates[name], this.compilerOptions);
        }
    }
}

/* override ExpressHandlebars.render() */
ExpressSecureHandlebars.prototype.render = function (filePath, context, options) {
console.log("r:"+filePath);
    options || (options = {});

    // expose filePath as processingFile in compilerOptions for secure-handlebars
    this.compilerOptions.cph.processingFile = filePath;

    // master express-secure-handlebars
    var expressSecureHandlebars = this;

    // return the Promise from render()
    return ExpressHandlebars.prototype.getTemplate.call(this, filePath, options).then(function(template) {
        compileTemplates.call(expressSecureHandlebars, expressSecureHandlebars.compilerOptions.cph.processedPartialsCache, options.precompiled);
        // options.partials may be set in renderView, we concat it.
        options.partials || (options.partials = {});
        options.partials = assign({}, options.partials, expressSecureHandlebars.compilerOptions.cph.compiledPartialsCache);
    }).then(function() {
        return ExpressHandlebars.prototype.render.call(expressSecureHandlebars, filePath, context, options);
    });
};

/* exporting the same signature of express-handlebars */
exports = module.exports  = exphbs;
exports.create            = create;
exports.ExpressHandlebars = ExpressSecureHandlebars;

// ------------------------------------------

function exphbs(config) {
    return create(config).engine;
}

function create(config) {
    return new ExpressSecureHandlebars(config);
}
