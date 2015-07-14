var express = require('express'),
    path = require('path'),
    app = express(),
    expressHbs = require('../../src/express-secure-handlebars.js');

var routes = require('./routes/index');
var routesyd = require('./routes/yd');
var routesundefined = require('./routes/undefined');
var routespartial = require('./routes/partial');
var routeslooppartial = require('./routes/looppartial');

app.expressSecureHandlebars = expressHbs.create({ partialsDir: __dirname + '/views/partials',
                               extname:'hbs' });
app.engine('hbs', app.expressSecureHandlebars.engine);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

process.chdir(__dirname);

app.use('/', routes);
app.use('/yd', routesyd);
app.use('/undefined', routesundefined);
app.use('/partial', routespartial);
app.use('/looppartial', routeslooppartial);
app.get('/ok', function(req, res){
    res.status(200).send('ok');
});

var port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;
