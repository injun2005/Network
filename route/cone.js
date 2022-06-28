var express = require('express');
var router = express.Router();
var fs = require('fs');
const template = require('../lib/templete.js');

router.use(function(req, res, next) {
    fs.readdir('./Data', function(err,filelist) {
        req.list = filelist;
        next();
    })
})

router.get('/', (req, res) => {
    //fs.readdir('./Data', function(err,req.list) {
      title = 'Hello';
      var description = `엘레나`; 
      var list =template.list(req.list);
      var _template=template.html(title, list, description);
      res.send(_template);
    //})
  })
module.exports = router;