var promise = require("bloody-promise")
  , klass = require("bloody-class")
  , _hasOwnProperty = {}.hasOwnProperty


function each(object, callback, thisValue){
  var key
  if(!object) return
  for(key in object) {
    if(!_hasOwnProperty.call(object, key)) continue
    callback.call(thisValue, object[key], key, object)
  }
}

module.exports = klass.extend({
  constructor : function(object){
    if(typeof object == "string") {
      object = {url:object}
    }
    each(object, this._options, this)
  },
  _options : function(item, key){
    this[key] = item
  },
  destructor : function(){
    if(!this.xhr) return
    if(this.xhr.readyState != 4){
      this.xhr.aborted = true
      this.xhr.abort()
    }
    this.xhr = null
  },
  _createXHR : function(){
    return new XMLHttpRequest()
  },
  _setHeader: function(item, key){
    this.setRequestHeader(key, item)
  },
  _setHeaders : function(xhr){
    if(this.method == "POST") {
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    }
    each(this.headers, this._setHeader, xhr)
  },
  _createXHRCallback : function(boundPromise){
    return function(){
      var readyState = this.readyState
        , status = this.status
      if(readyState != 4 || this.aborted) return
      if(status >= 200 && status < 300 || status == 304) {
        return boundPromise.fulfill(this)
      }
      if((status < 200 || 300 < status) && status != 304) {
        boundPromise.reject(this)
      }
    }
  },
  _resolveUrl : function(baseUrl, queryString){
    if(!queryString) return baseUrl
    switch(baseUrl.indexOf("?")) {
      case -1:
      return baseUrl + "?" + queryString
      break
      case baseUrl.length - 1:
      return baseUrl + queryString
      break
      default:
      return baseUrl + "&" + queryString
    }
  },
  load : function(){
    this.destroy()
    var xhr = this._createXHR()
      , xhrPromise = promise.create()
      , callback = this._createXHRCallback(xhrPromise)
      , url = this._resolveUrl(this.url, this.queryString)
    this.xhr = xhr
    xhr.open(this.method, url, true)
    this._setHeaders(xhr)
    xhr.withCredentials = !!this.withCredentials
    xhr.onreadystatechange = callback
    xhr.send(this.data || null)
    return xhrPromise
  },
  headers : null,
  method : "GET",
  url : null,
  queryString : null,
  data : null,
  withCredentials : false,
  xhr : null
})
