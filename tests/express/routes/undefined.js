var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    var data = {
    };
    res.render('undefined', data);
});

module.exports = router;
