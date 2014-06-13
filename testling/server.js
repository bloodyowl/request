var http = require("http")
var port = parseInt(process.env.PORT, 10)
var server = http.createServer(function(req, res){
  console.log(req.url)
  switch (req.url) {
    case "/ok":
      res.statusCode = 200
      res.setHeader("Content-Type", "text/plain")
      res.end("ok")
      return
    break
    case "/fail":
      if(req.method == "POST") {
        res.statusCode = 405
        res.setHeader("Content-Type", "text/plain")
        var body = ""
        req.on("data", function(chunk){
          body += chunk
        })
        req.on("end", function(){
          res.end(body)
        })
        return
      }
      req.statusCode = 200
      res.setHeader("Content-Type", "text/plain")
      res.end("nok")
      return
    break
  }
})

server.listen(port)
console.log("listening to " + port)
