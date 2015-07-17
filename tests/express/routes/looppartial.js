var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    var data = {
    };
    res.render('looppartial', data);
});

module.exports = router;
