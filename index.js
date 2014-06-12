var promise = require("bloody-promise")
var klass = require("bloody-class")
var hasOwn = Object.prototype.hasOwnProperty
var configurable = {
  headers : 1,
  method : 1,
  url : 1,
  queryString : 1,
  data : 1,
  withCredentials : 1
}

function isStatusOk(status){
  return status >= 200 && status < 300 || status == 304
}

function createCallback(resolve, reject){
  return function(){
    var readyState = this.readyState
    var status
    if(readyState != 4) {
      return
    }
    if(isStatusOk(this.status)) {
      resolve(this)
      return
    }
    reject(this)
  }
}

function resolveURL(url, queryString){
  var index
  if(queryString == null) {
    return url
  }
  index = url.indexOf("?")
  if(index == -1) {
      return url + "?" + queryString
  }
  if(index == url.length - 1) {
    return url + queryString
  }
  return url + "&" + queryString
}

function createShorthand(method) {
  return function(options, data){
    if(typeof options == "string") {
      options = {
        url : options,
        data : arguments.length > 1 ? data : null
      }
    }
    options.method = method
    return this.create(options).load()
  }
}

module.exports = klass.extend({
  headers : null,
  defaultHeaders : {
    "x-requested-with" : "XMLHttpRequest",
    "content-type" : "application/x-www-form-urlencoded; charset=utf-8"
  },
  method : "GET",
  url : null,
  queryString : null,
  data : null,
  withCredentials : false,
  constructor : function(options){
    var key
    if(typeof options == "string") {
      options = {
        url : options
      }
    }
    for(key in options) {
      if(hasOwn.call(options, key) && configurable[key]) {
        this[key] = options[key]
      }
    }
  },
  promise : function(fn){
    return promise.create(fn)
  },
  load : function(){
    var req = this
    return req.promise(function(resolve, reject){
      var xhr = new XMLHttpRequest()
      var callback = createCallback(resolve, reject)
      var url = resolveURL(req.url, req.queryString)
      var key
      xhr.open(req.method, url, true)
      for(key in req.defaultHeaders) {
        xhr.setRequestHeader(key, req.defaultHeaders[key])
      }
      for(key in req.headers) {
        xhr.setRequestHeader(key, req.headers[key])
      }
      xhr.withCredentials = Boolean(req.withCredentials)
      xhr.onreadystatechange = callback
      xhr.send(req.data)
    })
  },
  get : function(options){
    if(typeof options == "string") {
      options = {
        url : options
      }
    }
    options.method = "GET"
    return this.create(options).load()
  },
  post : createShorthand("POST"),
  del : createShorthand("DELETE"),
  put : createShorthand("PUT"),
  options : createShorthand("OPTIONS"),
  head : createShorthand("HEAD")
})
