var http = require("http")
  , server = http.createServer(function(req, res){
      switch (req.url) {
        case "/foo":
          res.statusCode = 200
          res.setHeader("Content-Type", "text/html")
          res.end("bar", "utf-8")
          return
        break
        case "/bar":
          res.statusCode = 404
          res.setHeader("Content-Type", "text/html")
          res.end("bar", "utf-8")
          return
        break
        default:
          res.statusCode = 404
          res.setHeader("Content-Type", "text/html")
          res.end("", "utf-8")
          return
        break
      }
    })

server.listen(parseInt(process.env.PORT, 10))
