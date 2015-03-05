var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    var data = {
        title : "express secure handlebars"
    };
    res.render('index', data);
});

module.exports = router;
