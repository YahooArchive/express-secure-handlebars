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
    debug = require('debug')('esh'),
    expressHandlebars = require('express-handlebars').ExpressHandlebars,
    xssFilters = require('xss-filters'),
    privateFilters = xssFilters._privFilters,
    ContextParserHandlebars = require("context-parser-handlebars");

function ExpressSecureHandlebars(config) {

    /* calling super constructor */
    this.constructor.super_.call(this, config);

    if (this.handlebars.helpers) {
        var h = this.handlebars;
        // register below the filters that are automatically applied by context parser 
        [
            'y',
            'yd', 'yc', 
            'yavd', 'yavs', 'yavu',
            'yu', 'yuc',
            'yubl', 'yufull'
        ].forEach(function(filterName){
            h.registerHelper(filterName, privateFilters[filterName]);
        });
        // register below the filters that might be manually applied by developers
        [
            'inHTMLData', 'inHTMLComment',
            'inSingleQuotedAttr', 'inDoubleQuotedAttr', 'inUnQuotedAttr',
            'uriInSingleQuotedAttr', 'uriInDoubleQuotedAttr', 'uriInUnQuotedAttr', 'uriInHTMLData', 'uriInHTMLComment',
            'uriPathInSingleQuotedAttr', 'uriPathInDoubleQuotedAttr', 'uriPathInUnQuotedAttr', 'uriPathInHTMLData', 'uriPathInHTMLComment',
            'uriQueryInSingleQuotedAttr', 'uriQueryInDoubleQuotedAttr', 'uriQueryInUnQuotedAttr', 'uriQueryInHTMLData', 'uriQueryInHTMLComment',
            'uriComponentInSingleQuotedAttr', 'uriComponentInDoubleQuotedAttr', 'uriComponentInUnQuotedAttr', 'uriComponentInHTMLData', 'uriComponentInHTMLComment',
            'uriFragmentInSingleQuotedAttr', 'uriFragmentInDoubleQuotedAttr', 'uriFragmentInUnQuotedAttr', 'uriFragmentInHTMLData', 'uriFragmentInHTMLComment'
        ].forEach(function(filterName){
            h.registerHelper(filterName, xssFilters[filterName]);
        });
        debug(h.helpers);
    }
}

/* inheriting the express-handlebars */
util.inherits(ExpressSecureHandlebars, expressHandlebars);

ExpressSecureHandlebars.prototype.compileTemplate = function (template, options) {
    if (!options || !options.precompiled) {
        try {
            var parser = new ContextParserHandlebars({printCharEnable: false});
            parser.contextualize(template);
            template = parser.getOutput();
        } catch (err) {
            console.log('=====================');
            console.log("[WARNING] ExpressSecureHandlebars: falling back to the original express-handlebars");
            Object.keys(err).forEach(function(k){console.log(k.toUpperCase() + ':\n' + err[k]);});
            console.log("TEMPLATE:\n" + template);
            console.log('=====================');
        }
    } else {
        console.log("[WARNING] ExpressSecureHandlebars: ContextParserHandlebars cannot handle precompiled template!");
    }

    return ExpressSecureHandlebars.super_.prototype.compileTemplate.call(this, template, options);
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
