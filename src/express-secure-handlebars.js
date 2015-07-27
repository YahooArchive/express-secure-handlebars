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
    assign = Object.assign || require('object.assign'),
    Promise = require('promise'),
    path = require('path');

function ExpressSecureHandlebars(config) {

    // override the original handlebars with secure-handlebars
    config || (config = {});
    config.handlebars = config.secureHandlebars || secureHandlebars;

    /* calling super constructor */
    this.constructor.super_.call(this, config);

    // dedicate a special express-handlebars for fetching raw partials
    this._exphbsForRawPartials = new ExpressHandlebarsForRawPartials(config);
    this._partialsCache = {
        preprocessed: {}
    };

    // compilerOptions is being used for passing params to secure-handlebars
    this.compilerOptions || (this.compilerOptions = {});
    this.compilerOptions.shbsPartialsCache = this._partialsCache;
}

/* inheriting the express-handlebars */
util.inherits(ExpressSecureHandlebars, ExpressHandlebars);

// always returns an empty cache, since the partial is loaded and analyzed on-demand
// TODO: preprocess all templates, and export all partials for compatibility
ExpressSecureHandlebars.prototype.getPartials = function (options) {
    return {};
};

// retrieve file content directly from the preprocessed partial cache if it exists
ExpressSecureHandlebars.prototype._getFile = function (filePath, options) {

    var file = this._partialsCache.preprocessed[path.relative('.', filePath)];
    return file ? Promise.resolve(file) : ExpressHandlebars.prototype._getFile.call(this, filePath, options);

};


// _getTemplates literally has the core of getTemplates, except that it takes an array of filePaths as input
/*
// getTemplates can be rewritten to use _getTemplates in the following way
ExpressSecureHandlebars.prototype.getTemplates = function (dirPath, options) {
    options || (options = {});
    
    return this._getDir(dirPath, {cache: options.cache}).map(function (filePath) {
        return path.join(dirPath, filePath);
    }).then(function(filePaths) {
        return this._getTemplates(filePaths, options);
    }.bind(this));
};
*/
ExpressSecureHandlebars.prototype._getTemplates = function (filePaths, options) {
    options || (options = {});

    var templates = filePaths.map(function (filePath) {
        return this.getTemplate(filePath, options);
    }, this);

    return Promise.all(templates).then(function (templates) {
        return filePaths.reduce(function (hash, filePath, i) {
            hash[filePath] = templates[i];
            return hash;
        }, {});
    });
};


// override render() for on-demand partial preprocessing and (pre-)compilation
ExpressSecureHandlebars.prototype.render = function (filePath, context, options) {
    options || (options = {});

    // expose filePath as processingFile in compilerOptions for secure-handlebars
    this.compilerOptions.processingFile = filePath;

    // ensure getPartials() is called to fetch raw partials
    return this._exphbsForRawPartials.getPartials(options).then(function(rawPartialsCache) {

        // in constructor, this.compilerOptions.shbsPartialsCache = this._partialsCache
        this._partialsCache.raw = rawPartialsCache;

        // this._partialsCache.preprocessed is filled by the underlying (pre-)compile() in getTemplate()
        // TODO: improve this by keeping the returned (pre-)compiled template
        return this.getTemplate(filePath, options).catch(function(err){
            throw err;
        });

    }.bind(this)).then(function() {

        var partialKeys = Object.keys(this._partialsCache.preprocessed);

        // disable preprocessing partials in partial
        this.compilerOptions.enablePartialProcessing = false;
        
        // Merge render-level and (pre-)compiled pre-processed partials together
        return Promise.all([
            this._getTemplates(partialKeys, options),   // (pre-)compile pre-processed partials
            options.partials                            // collected at renderView
        ]).then(function (partials) {
            return assign.apply(null, [{}].concat(partials));
        }).catch(function(err) {
            throw err;
        }).finally(function() {
            // re-enable partial handling
            this.compilerOptions.enablePartialProcessing = true;
        }.bind(this));

    }.bind(this)).then(function(partials) {

        options.partials = partials;

        return ExpressHandlebars.prototype.render.call(this, filePath, context, options);

    }.bind(this));
};


function ExpressHandlebarsForRawPartials(config) {
    this.constructor.super_.call(this, config);
}
util.inherits(ExpressHandlebarsForRawPartials, ExpressHandlebars);
ExpressHandlebarsForRawPartials.prototype._precompileTemplate = ExpressHandlebarsForRawPartials.prototype._compileTemplate = function (template, options) {
    return template;
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
