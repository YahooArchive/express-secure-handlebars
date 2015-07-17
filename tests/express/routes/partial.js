var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    var data = {
        'exp': 'header',
        'js':  'js',
    };
    res.render('partial', data);
});

module.exports = router;
