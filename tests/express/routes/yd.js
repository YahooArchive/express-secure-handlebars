var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    var data = {
        input: "><'\"& "
    };
    res.render('yd', data);
});

module.exports = router;
