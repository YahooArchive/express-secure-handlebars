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
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be.equal('ok');
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars data binding test", function(done) {
            request(app)
                .get('/')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be.equal('<h1>express secure handlebars</h1>\n');
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

        it("Express Secure Handlebars data binding / yd filter test", function(done) {
            request(app)
                .get('/yd')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be.equal("<div>>&lt;'\"& </div>\n");
                    expect(res.status).to.be.equal(200);
                    done();
                });
        });

    });

}());
