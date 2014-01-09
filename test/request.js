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
    , req2 = request.create({
        headers: {
          "key" : "value"
        },
        method : "POST",
        url : "url",
        queryString : "foo=bar",
        data : "bar=baz",
        withCredentials : true
      })

  test.equal(req.url, "url", "string is used as url")
  
  test.equal(req2.url, "url", "url")
  test.equal(req2.headers.key, "value", "headers")
  test.equal(req2.method, "POST", "method")
  test.equal(req2.queryString, "foo=bar", "queryString")
  test.equal(req2.data, "bar=baz", "data")
  test.equal(req2.withCredentials, true, "withCredentials")
  test.end()
  
})

tape("request._options", function(test){
  
  var object = {}
  
  request._options.call(object, "bar", "foo")
  test.equal(object.foo, "bar", "copies prop into object")
  test.end()

})

tape("request._options", function(test){

  var object = {}

  request._options.call(object, "bar", "foo")
  test.equal(object.foo, "bar", "copies prop into object")
  test.end()

})

tape("request._createXHR", function(test){
  
  test.ok(isXHR(request._createXHR()), "returns a new request")
  test.end()
  
})

tape("request._setHeader", function(test){
  
  var object = {
    setRequestHeader : function(key, value){
      test.equal(key, "foo", "key")
      test.equal(value, "bar", "value")
      test.end()
    }
  }
  
  request._setHeader.call(object, "bar", "foo")
  
})

tape("request._setHeaders", function(test){
  
  var setRequestHeader = function(key, value){
        this.headers[key] = value
      }
    , getParams = request.create({
        method : "GET",
        headers : null
      })
    , xhrGetParams = {
        headers : {},
        setRequestHeader : setRequestHeader
      }
    , headersGetParams = request.create({
        method : "GET",
        headers : {
          "foo" : "bar"
        }
      })
    , xhrHeadersGetParams = {
        headers : {},
        setRequestHeader : setRequestHeader
      }
    , postParams = request.create({
        method : "POST",
        headers : null
      })
    , xhrPostParams = {
        headers : {},
        setRequestHeader : setRequestHeader
      }
    , headersPostParams = request.create({
        method : "POST",
        headers : {
          "foo" : "bar"
        }
      })
    , xhrHeadersPostParams = {
        headers : {},
        setRequestHeader : setRequestHeader
      }
    
  getParams._setHeaders(xhrGetParams)
  headersGetParams._setHeaders(xhrHeadersGetParams)
  postParams._setHeaders(xhrPostParams)
  headersPostParams._setHeaders(xhrHeadersPostParams)
  
  test.deepEqual(xhrGetParams.headers, {}, "get, no headers")
  test.deepEqual(xhrHeadersGetParams.headers, {"foo":"bar"}, "get, headers")
  test.deepEqual(xhrPostParams.headers, {
    "X-Requested-With": "XMLHttpRequest",
    "Content-type": "application/x-www-form-urlencoded"
  }, "post, no headers")
  test.deepEqual(xhrHeadersPostParams.headers, {
    "foo":"bar",
    "X-Requested-With": "XMLHttpRequest",
    "Content-type": "application/x-www-form-urlencoded"
  }, "post, headers")
  test.end()
  
  
})

tape("request._createXHRCallback", function(test){
  
  var xhrPromise = promise.create()
    , xhrCallback = request._createXHRCallback(xhrPromise)
    , obj
  
  xhrCallback.call({readyState:1})
  xhrCallback.call({readyState:2})
  xhrCallback.call({readyState:3})
  xhrCallback.call(obj = {readyState:4, status:200})
  
  xhrPromise.then(function(value){
    test.equal(value, obj, "promise is fulfill with 200 status")
    test.end()
  })
  
})


tape("request._createXHRCallback (failing status)", function(test){

  var xhrPromise = promise.create()
    , xhrCallback = request._createXHRCallback(xhrPromise)
    , obj

  xhrCallback.call({readyState:1})
  xhrCallback.call({readyState:2})
  xhrCallback.call({readyState:3})
  xhrCallback.call(obj = {readyState:4, status:400})

  xhrPromise.then(null, function(value){
    test.equal(value, obj, "promise is rejected with 400 status")
    test.end()
  })

})

tape("request._resolveUrl", function(test){
  
  test.equal(request._resolveUrl("foo", "bar=baz"), "foo?bar=baz")
  test.equal(request._resolveUrl("foo?", "bar=baz"), "foo?bar=baz")
  test.equal(request._resolveUrl("foo?foo=bar", "bar=baz"), "foo?foo=bar&bar=baz")
  test.end()
  
})

tape("request.load (url, GET)", function(test){

  test.plan(4)

  var req = request.create("foo")
    , pro = req.load()

  pro.then(function(value){
    test.ok(isXHR(value), "passes XMLHttpRequest")
    test.equal(value.responseText, "File not found. :(", "response is right")
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

  var req = request.create({
        url : "bar",
        method : "POST"
      })
    , pro = req.load()

  pro.then(function(){
    test.fail()
  }, function(value){
    test.ok(isXHR(value), "passes XMLHttpRequest")
    test.equal(value.responseText, "", "response is right")
    test.ok(value.status == 405 || value.status == 0 /* local tests */, "status is right")
  })

})