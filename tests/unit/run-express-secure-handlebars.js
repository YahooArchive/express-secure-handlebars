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
        expressHandlebars = require('express-handlebars'),
        expressSecureHandlebars = require('../../src/express-secure-handlebars.js');

    describe("Express Secure Handlebars test suite", function() {

        it("Express Secure Handlebars same signature test", function() {
            // console.log(expressHandlebars);
            expect(typeof expressHandlebars).to.be.equal('function');
            expect(typeof expressHandlebars.create).to.be.equal('function');
            expect(typeof expressHandlebars.ExpressHandlebars).to.be.equal('function');
            expect(expressHandlebars.create).to.be.ok();
            expect(expressHandlebars.ExpressHandlebars).to.be.ok();
            expect(expressHandlebars.create().compileTemplate).to.be.ok();


            // console.log(expressSecureHandlebars);
            expect(typeof expressSecureHandlebars).to.be.equal('function');
            expect(typeof expressSecureHandlebars.create).to.be.equal('function');
            expect(typeof expressSecureHandlebars.ExpressHandlebars).to.be.equal('function');
            expect(expressSecureHandlebars.create).to.be.ok();
            expect(expressSecureHandlebars.ExpressHandlebars).to.be.ok();
            expect(expressSecureHandlebars.create().compileTemplate).to.be.ok();
        });

        it("Express Secure Handlebars new instance test", function() {
            var expHbs = new expressHandlebars();
            expect(typeof expHbs).to.be.equal('function');
            var expSecureHbs = new expressSecureHandlebars();
            expect(typeof expSecureHbs).to.be.equal('function');
        });

        it("Express Secure Handlebars create() new instance with handlebars test", function() {
            var expHbs = expressHandlebars.create();
            expect(expHbs.handlebars).to.be.ok();
            var expSecureHbs = expressSecureHandlebars.create();
            expect(expSecureHbs.handlebars).to.be.ok();
        });

        var data = {url: 'javascript:alert(1)'};
        it("Express Secure Handlebars fallback on error test", function() {
            var template = '{{#if url}}<a href="{{url}}"{{else}}<a href="{{url}}">closed</a>{{/if}}';
            var expSecureHbs = expressSecureHandlebars.create();
            var t1 = expSecureHbs.compileTemplate(template);

            var expHbs = expressHandlebars.create();
            var t2 = expHbs.compileTemplate(template);
            expect(t1(data)).to.be.equal(t2(data));
        });

       it("Express Secure Handlebars compileTemplate test", function() {
            var template = '<a href="{{url}}">closed</a>';
            var expSecureHbs = expressSecureHandlebars.create();
            var t1 = expSecureHbs.compileTemplate(template);

            var expHbs = expressHandlebars.create();
            var t2 = expHbs.compileTemplate(template);
            expect(t1(data)).not.to.be.equal(t2(data));
        });
    });

}());
