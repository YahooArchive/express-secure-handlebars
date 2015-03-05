/*
Copyright (c) 2015, Yahoo Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.

Authors: Nera Liu <neraliu@yahoo-inc.com>
         Albert Yu <albertyu@yahoo-inc.com>
         Adonis Fung <adon@yahoo-inc.com>
*/
(function () {

    require("mocha");
    var expect = require('expect.js'),
        ExpressSecureHandlebars = require('../../src/express-secure-handlebars.js');

    describe("Express Secure Handlebars helpers test suite", function() {

        var privateFiltersExistenceTest = function(helpers) {
            [
                'y',
                'yd', 'yc',
                'yavd', 'yavs', 'yavu',
                'yu', 'yuc',
                'yubl', 'yufull'
            ].forEach(function(filterName) {
                expect(helpers[filterName]).to.be.ok();
            });
        };

        var xssFiltersExistenceTest = function(helpers) {
            [
                'inHTMLData', 'inHTMLComment',
                'inSingleQuotedAttr', 'inDoubleQuotedAttr', 'inUnQuotedAttr',
                'uriInSingleQuotedAttr', 'uriInDoubleQuotedAttr', 'uriInUnQuotedAttr', 'uriInHTMLData', 'uriInHTMLComment',
                'uriPathInSingleQuotedAttr', 'uriPathInDoubleQuotedAttr', 'uriPathInUnQuotedAttr', 'uriPathInHTMLData', 'uriPathInHTMLComment',
                'uriQueryInSingleQuotedAttr', 'uriQueryInDoubleQuotedAttr', 'uriQueryInUnQuotedAttr', 'uriQueryInHTMLData', 'uriQueryInHTMLComment',
                'uriComponentInSingleQuotedAttr', 'uriComponentInDoubleQuotedAttr', 'uriComponentInUnQuotedAttr', 'uriComponentInHTMLData', 'uriComponentInHTMLComment',
                'uriFragmentInSingleQuotedAttr', 'uriFragmentInDoubleQuotedAttr', 'uriFragmentInUnQuotedAttr', 'uriFragmentInHTMLData', 'uriFragmentInHTMLComment'
            ].forEach(function(filterName) {
                expect(helpers[filterName]).to.be.ok();
            });
        };

        it('Express Secure Handlebars private helpers existence test', function(){
            var expressSecureHandlebars = ExpressSecureHandlebars.create();
            privateFiltersExistenceTest(expressSecureHandlebars.handlebars.helpers);
        });

        it('Express Secure Handlebars xss helpers existence test', function(){
            var expressSecureHandlebars = ExpressSecureHandlebars.create();
            xssFiltersExistenceTest(expressSecureHandlebars.handlebars.helpers);
        });

    });
}());
