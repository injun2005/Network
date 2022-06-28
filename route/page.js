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

router.get('/:pageId', (req, res, next) => {
    var title = req.params.pageId
    fs. readFile(`Data/${title}`,'utf8',function(err, description){
        //fs.readdir('./Data', function(err, req.list){
          if(err) {
            next(err);
          }
          var list =template.list(req.list);
          var _template=template.html(title, list, description);
          res.send(_template);
        //})
    }) 
})
module.exports = router;