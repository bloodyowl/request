var tape = require("tape")
  , promise = require("bloody-promise")
  , request = require("../")


function isXHR(value){
  if(XMLHttpRequest && XMLHttpRequest.prototype) {
    return XMLHttpRequest.prototype.isPrototypeOf(value)
  }
  // ie7 crap
  return value && typeof value.open == "object"
}

tape("request.create", function(test){

  var req = request.create("url")
  var req2 = request.create({
    headers: {
      "key" : "value"
    },
    method : "POST",
    url : "url",
    queryString : "foo=bar",
    body : "bar=baz",
    withCredentials : true
  })

  test.equal(req.url, "url", "string is used as url")

  test.equal(req2.url, "url", "url")
  test.equal(req2.headers.key, "value", "headers")
  test.equal(req2.method, "POST", "method")
  test.equal(req2.queryString, "foo=bar", "queryString")
  test.equal(req2.body, "bar=baz", "data")
  test.equal(req2.withCredentials, true, "withCredentials")
  test.end()

})

tape("request.load (url, GET)", function(test){

  test.plan(4)

  var req = request.create("ok")
  var pro = req.load()

  pro.then(function(value){
    test.ok(isXHR(value), "passes XMLHttpRequest")
    test.equal(value.responseText, "ok", "response is right")
    test.equal(value.status, 200, "status is right")
  })
  .then(function(){
    return req.load()
  })
  .then(function(value){
    test.ok(value, "creates a new XHR at .load")
  })

})

tape("request.load (error, POST)", function(test){

  test.plan(3)

  var rand = String(Math.random())
  var req = request.create({
    url : "fail",
    method : "POST",
    body : rand
  })
  var pro = req.load()

  pro.then(function(){
    test.fail()
  }, function(value){
    test.ok(isXHR(value), "passes XMLHttpRequest")
    test.equal(value.responseText, rand, "response is right")
    test.equal(value.status, 405, "status is right")
  })

})
