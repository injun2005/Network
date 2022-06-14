const express = require('express')
var fs = require('fs');
var qs = require('querystring');
const template = require('./lib/templete.js');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  fs.readdir('./Data', function(err,filelist) {
    title = 'Hello';
    var description = '엘레나';
    var list =template.list(filelist);
    var _template=template.html(title, list, description);
    res.send(_template);
  })
})
app.get('/page/:pageId', (req, res) => {
    var title = req.params.pageId
    fs. readFile(`Data/${title}`,'utf8',function(err, description){
        fs.readdir('./Data', function(err, filelist){
          var list =template.list(filelist);
          var _template=template.html(title, list, description);
          res.send(_template);
        })
    }) 
})

app.get('/create', (req, res) => {
  fs.readdir('./Data', function(err, filelist){
    title = 'CREATE';
    var description = `<form  action="http:/create_page" method="post">
    <input type="text" name="title">
    <p>
     <textarea name="description" placeholder = "description"></textarea>
    </p>
    <input type="submit">
    </form>`;
    var list =template.list(filelist);
    var _template = template.html(title, list, description);
    res.send(_template);
  })
})
app.post('/create_page', (req, res) => {
  var body = '';
    req.on('data', function(data){
      body = body + data;
    })
    req.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`Data/${title}`, description, 'utf8', function(err){
        res.redirect(`/page/${title}`)
      })
    })
})
app.get('/update/:pageId', (req, res) => {
  var title = req.params.pageId;
  fs. readFile(`Data/${title}`,'utf8',function(err, description){
    fs.readdir('./Data', function(err, filelist){
      var list =template.list(filelist);
      var update_description = description;
      description = `<form  action="http:/update_page" method="post">
      <input type="hidden" name="id" value="${title}">
      <input type="text" name="title" value="${title}">
      <p>
       <textarea name="description" placeholder = "description">${update_description}</textarea>
      </p>
      <input type="submit">
      </form>`;
      var _template=template.html(title, list, description);
      res.send(_template);
    });
   })
})
app.post('/update_page', (req, res) => {
  var body = '';
  req.on('data', function(data){
    body = body + data;
  })
  req.on('end', function(){
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`Data/${id}`, `data/${title}`, function(err) {
      fs.writeFile(`Data/${title}`, description, 'utf8', function(err){
        res.redirect(`/page/${title}`)
    })
  })
})
})
app.post('/delete_page', (req, res) => {
  var body = '';
  req.on('data', function(data){
    body = body + data;
  })
  req.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      fs.unlink(`data/${id}`, function(err){
      res.redirect(`/`);
    })
  })
})
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})