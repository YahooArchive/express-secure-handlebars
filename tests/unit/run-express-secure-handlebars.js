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
        path = require('path'),
        expressHandlebars = require('express-handlebars'),
        expressSecureHandlebars = require('../../src/express-secure-handlebars.js'),
        handlebars = require('handlebars');

    describe("Express Secure Handlebars test suite", function() {

        this.timeout(5000);

        it("same signature test", function() {
            // console.log(expressHandlebars);
            expect(typeof expressHandlebars).to.be.equal('function');
            expect(typeof expressHandlebars.create).to.be.equal('function');
            expect(typeof expressHandlebars.ExpressHandlebars).to.be.equal('function');
            expect(expressHandlebars.create).to.be.ok();
            expect(expressHandlebars.ExpressHandlebars).to.be.ok();

            // console.log(expressSecureHandlebars);
            expect(typeof expressSecureHandlebars).to.be.equal('function');
            expect(typeof expressSecureHandlebars.create).to.be.equal('function');
            expect(typeof expressSecureHandlebars.ExpressHandlebars).to.be.equal('function');
            expect(expressSecureHandlebars.create).to.be.ok();
            expect(expressSecureHandlebars.ExpressHandlebars).to.be.ok();
        });

        it("new instance test", function() {
            var expHbs = new expressHandlebars();
            expect(typeof expHbs).to.be.equal('function');
            var expSecureHbs = new expressSecureHandlebars();
            expect(typeof expSecureHbs).to.be.equal('function');
        });

        it("create() new instance with handlebars test", function() {
            var expHbs = expressHandlebars.create();
            expect(expHbs.handlebars).to.be.ok();
            var expSecureHbs = expressSecureHandlebars.create();
            expect(expSecureHbs.handlebars).to.be.ok();
        });

        var data = {url: 'javascript:alert(1)'};

        it("empty template test", function() {
            expect(new expressSecureHandlebars.create().handlebars.compile('')(data)).to.be.equal('');
        });

        var template = '{{#if url}}<a href="{{url}}"{{else}}<a href="{{url}}">closed</a>{{/if}}';
        it("handlebars fallback on compile error test", function() {
            var t1 = expressSecureHandlebars.create().handlebars.compile(template);
            var t2 = expressHandlebars.create().handlebars.compile(template);

            expect(t1(data)).to.be.equal(t2(data));
        });

        it("handlebars fallback on precompile error test", function() {
            var templateSpec1 = expressSecureHandlebars.create().handlebars.precompile(template);
            var templateSpec2 = expressHandlebars.create().handlebars.precompile(template);
            var t1 = handlebars.template(eval('(' + templateSpec1 + ')'));
            var t2 = handlebars.template(eval('(' + templateSpec2 + ')'));

            expect(t1(data)).to.be.equal(t2(data));
        });

        it("handlebars compile test", function() {
            var template = '<a href="{{url}}">closed</a>';
            var t1 = expressSecureHandlebars.create().handlebars.compile(template);
            var t2 = expressHandlebars.create().handlebars.compile(template);

            expect(t1(data)).not.to.be.equal(t2(data));
        });

        it("handlebars render test", function(done) {

            var filePath = path.resolve('../express/views/yd.hbs');
            var expSecureHbs = expressSecureHandlebars.create();

            expect(expSecureHbs.compilerOptions).to.be.ok();
            expect(expSecureHbs.compilerOptions.shbsPartialsCache).to.be.ok();
            
            expSecureHbs.render(filePath, {input: '<script>alert(1)</script>'}).then(function(output){
                if (output === '<div>&lt;script>alert(1)&lt;/script></div>\n' && 
                    expSecureHbs.compilerOptions.processingFile === filePath) {
                    done();
                }

            });


        });

    });
}());
