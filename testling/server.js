var http = require("http")
  , https = require("https")
  , server = http.createServer(function(req, res){
      switch (req.url) {
        case "/foo":
          res.statusCode = 200
          res.setHeader("Content-Type", "text/html")
          res.end("File not found. :(", "utf-8")
          return
        break
        case "/bar":
          res.statusCode = 405
          res.setHeader("Content-Type", "text/html")
          res.end("", "utf-8")
          return
        break
      }
    })

server.listen(parseInt(process.env.PORT, 10))
