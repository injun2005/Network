var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/templete.js')

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathname = url.parse(_url, true).pathname;
   if(pathname == '/'){
      if(queryData.id == undefined ){
        fs.readdir('./Data', function(err, filelist){
          title = '엘레나 사전';
          var description = '엘레나에 대하여';
          var list = template.list(filelist);
          var _template = template.html(title, list, description);
          response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
          response.end(_template);
        })
      }
      else{
        fs. readFile(`Data/${queryData.id}`,'utf8',function(err, description){
          fs.readdir('./Data', function(err, filelist){
            var list =template.list(filelist);
            var _template=template.html(title, list, description);
            response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
            response.end(_template);
        });
      })
    }
  }
  else if (pathname == '/update') {
    fs. readFile(`Data/${title}`,'utf8',function(err, description){
      fs.readdir('./Data', function(err, filelist){
        var list =template.list(filelist);
        var update_description = description;
        description = `<form  action="http:/update_page" method="post">
        <input type="text" name="id" value="${title}">
        <p>
         <textarea name="description" placeholder = "description" value = "${title}"></textarea>
        </p>

        <input type="submit">

        </form>`;
        var _template=template.html(title, list, description);
        response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
        response.end(_template);
      });
     })
   }
   else if(pathname == '/delete_page') {
     var body = '';
     request.on('data', function(data){
       body = body + data;
     })
     request.on('end', function(data){
       var post = qs.parse(body);
       var id = post.id;
       fs.unlink(`data/${id}`, function(err){
       response.writeHead(302, {Location:encodeURI(`/?id=${title}`), 'Content-Type': 'text/html; charset=utf-8'});
       response.end();
     })
   })
 }
  else if(pathname == '/create') {
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
      response.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
      response.end(_template);
    })
  }
  else if (pathname == '/create_page') {
    var body = '';
    request.on('data', function(data){
      body = body + data;
    })
    request.on('end', function(data){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        response.writeHead(302, {Location:encodeURI(`/?id=${title}`), 'Content-Type': 'text/html; charset=utf-8'});
        response.end('전송 완료');
      })
      console.log(body);
    })
  }
  else if (pathname == '/update_page') {
    var body = '';
    request.on('data', function(data){
      body = body + data;
    })
    request.on('end', function(data){
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(err) {
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.writeHead(302, {Location:encodeURI(`/?id=${title}`), 'Content-Type': 'text/html; charset=utf-8'});
          response.end('전송 완료');
      })
    })
  })
}
else{
  response.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
  response.end('NOT FOUND');
}

});
app.listen(3000);
