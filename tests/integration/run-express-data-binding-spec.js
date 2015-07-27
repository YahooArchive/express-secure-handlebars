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
        request = require('supertest');

    describe("Express Secure Handlebars data binding test suite", function() {

        var app;
        before(function() {
            app = require('../express/app.js');
        });

        it("Express Secure Handlebars server up test", function(done) {
            request(app)
                .get('/ok')
                .end(function(err, res) {
                    expect(res.text).to.be.equal('ok');
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars data binding test", function(done) {
            request(app)
                .get('/')
                .end(function(err, res) {
                    expect(res.text).to.be.equal('<h1>express secure handlebars</h1>\n');
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars data binding / yd filter test", function(done) {
            request(app)
                .get('/yd')
                .end(function(err, res) {
                    expect(res.text).to.be.equal("<div>>&lt;'\"& </div>\n");
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars undefined data binding test", function(done) {
            request(app)
                .get('/undefined')
                .end(function(err, res) {
                    expect(res.text).to.be.match(/<div><\/div>/);
                    expect(res.text).to.be.match(/<input id=\ufffd>/);
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars partial test", function(done) {
            request(app)
                .get('/partial')
                .end(function(err, res) {
                    expect(res.text).to.be.match(/header/);
                    expect(res.text).to.be.match(/js/);
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars partial cache test", function(done) {
            var cacheTest = function() {
                var esh = app.expressSecureHandlebars;
                expect(esh.compilerOptions).to.be.ok();
                expect(esh.compilerOptions.shbsPartialsCache).to.be.ok();
                expect(esh.compilerOptions.shbsPartialsCache.raw['header']).to.equal('{{exp}}\n\n');
                expect(esh.compilerOptions.shbsPartialsCache.raw['l1']).to.equal('{{> l2 }}\n');
                expect(esh.compilerOptions.shbsPartialsCache.raw['l2']).to.equal('{{> l1 }}\n');
                expect(esh.compilerOptions.shbsPartialsCache.raw['script']).to.equal('{{js}}\n');
                expect(esh.compilerOptions.shbsPartialsCache.preprocessed['SJST/1/header']).to.equal('{{{yd exp}}}\n\n');
                expect(esh.compilerOptions.shbsPartialsCache.preprocessed['SJST/6/script']).to.equal('{{{y js}}}\n');

                // TODO: compiled is available only when options.cache is true
                // expect(esh.compilerOptions.shbsPartialsCache.compiled['SJST/1/header']).to.be.ok();
                // expect(esh.compilerOptions.shbsPartialsCache.compiled['SJST/6/script']).to.be.ok();

                done();
            }
            request(app)
                .get('/partial')
                .end(function(err, res) {
                    cacheTest();
                });
        });

        // make sure it won't be infinite loop
        it("Express Secure Handlebars loop partial test", function(done) {
            request(app)
                .get('/looppartial')
                .end(function(err, res) {
                    expect(res.status).to.be.equal(500);
                    done();
                });
        });
    });
}());
