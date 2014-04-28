/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (module.definition) {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};

require.register("bredele~clone@master", Function("exports, module",
"\n\
/**\n\
 * Expose 'clone'\n\
 * @param  {Object} obj \n\
 * @api public\n\
 */\n\
\n\
module.exports = function(obj) {\n\
  var cp = null;\n\
  if(obj instanceof Array) {\n\
    cp = obj.slice(0);\n\
  } else {\n\
    //hasOwnProperty doesn't work with Object.create\n\
    // cp = Object.create ? Object.create(obj) : clone(obj);\n\
    cp = clone(obj);\n\
  }\n\
  return cp;\n\
};\n\
\n\
\n\
/**\n\
 * Clone object.\n\
 * @param  {Object} obj \n\
 * @api private\n\
 */\n\
\n\
function clone(obj){\n\
  if(typeof obj === 'object') {\n\
    var copy = {};\n\
    for (var key in obj) {\n\
      if (obj.hasOwnProperty(key)) {\n\
        copy[key] = clone(obj[key]);\n\
      }\n\
    }\n\
    return copy;\n\
  }\n\
  return obj;\n\
}\n\
//# sourceURL=components/bredele/clone/master/index.js"
));

require.modules["bredele-clone"] = require.modules["bredele~clone@master"];
require.modules["bredele~clone"] = require.modules["bredele~clone@master"];
require.modules["clone"] = require.modules["bredele~clone@master"];


require.register("component~emitter@1.1.2", Function("exports, module",
"\n\
/**\n\
 * Expose `Emitter`.\n\
 */\n\
\n\
module.exports = Emitter;\n\
\n\
/**\n\
 * Initialize a new `Emitter`.\n\
 *\n\
 * @api public\n\
 */\n\
\n\
function Emitter(obj) {\n\
  if (obj) return mixin(obj);\n\
};\n\
\n\
/**\n\
 * Mixin the emitter properties.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {Object}\n\
 * @api private\n\
 */\n\
\n\
function mixin(obj) {\n\
  for (var key in Emitter.prototype) {\n\
    obj[key] = Emitter.prototype[key];\n\
  }\n\
  return obj;\n\
}\n\
\n\
/**\n\
 * Listen on the given `event` with `fn`.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.on =\n\
Emitter.prototype.addEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
  (this._callbacks[event] = this._callbacks[event] || [])\n\
    .push(fn);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Adds an `event` listener that will be invoked a single\n\
 * time then automatically removed.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.once = function(event, fn){\n\
  var self = this;\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  function on() {\n\
    self.off(event, on);\n\
    fn.apply(this, arguments);\n\
  }\n\
\n\
  on.fn = fn;\n\
  this.on(event, on);\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Remove the given callback for `event` or all\n\
 * registered callbacks.\n\
 *\n\
 * @param {String} event\n\
 * @param {Function} fn\n\
 * @return {Emitter}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.off =\n\
Emitter.prototype.removeListener =\n\
Emitter.prototype.removeAllListeners =\n\
Emitter.prototype.removeEventListener = function(event, fn){\n\
  this._callbacks = this._callbacks || {};\n\
\n\
  // all\n\
  if (0 == arguments.length) {\n\
    this._callbacks = {};\n\
    return this;\n\
  }\n\
\n\
  // specific event\n\
  var callbacks = this._callbacks[event];\n\
  if (!callbacks) return this;\n\
\n\
  // remove all handlers\n\
  if (1 == arguments.length) {\n\
    delete this._callbacks[event];\n\
    return this;\n\
  }\n\
\n\
  // remove specific handler\n\
  var cb;\n\
  for (var i = 0; i < callbacks.length; i++) {\n\
    cb = callbacks[i];\n\
    if (cb === fn || cb.fn === fn) {\n\
      callbacks.splice(i, 1);\n\
      break;\n\
    }\n\
  }\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Emit `event` with the given args.\n\
 *\n\
 * @param {String} event\n\
 * @param {Mixed} ...\n\
 * @return {Emitter}\n\
 */\n\
\n\
Emitter.prototype.emit = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  var args = [].slice.call(arguments, 1)\n\
    , callbacks = this._callbacks[event];\n\
\n\
  if (callbacks) {\n\
    callbacks = callbacks.slice(0);\n\
    for (var i = 0, len = callbacks.length; i < len; ++i) {\n\
      callbacks[i].apply(this, args);\n\
    }\n\
  }\n\
\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Return array of callbacks for `event`.\n\
 *\n\
 * @param {String} event\n\
 * @return {Array}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.listeners = function(event){\n\
  this._callbacks = this._callbacks || {};\n\
  return this._callbacks[event] || [];\n\
};\n\
\n\
/**\n\
 * Check if this emitter has `event` handlers.\n\
 *\n\
 * @param {String} event\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Emitter.prototype.hasListeners = function(event){\n\
  return !! this.listeners(event).length;\n\
};\n\
\n\
//# sourceURL=components/component/emitter/1.1.2/index.js"
));

require.modules["component-emitter"] = require.modules["component~emitter@1.1.2"];
require.modules["component~emitter"] = require.modules["component~emitter@1.1.2"];
require.modules["emitter"] = require.modules["component~emitter@1.1.2"];


require.register("bredele~looping@1.1.1", Function("exports, module",
"\n\
/**\n\
 * Expose 'looping'\n\
 */\n\
\n\
module.exports = function(obj, fn, scope){\n\
  scope = scope || this;\n\
  if( obj instanceof Array) {\n\
    array(obj, fn, scope);\n\
  } else if(typeof obj === 'object') {\n\
    object(obj, fn, scope);\n\
  }\n\
};\n\
\n\
\n\
/**\n\
 * Object iteration.\n\
 * @param  {Object}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function object(obj, fn, scope) {\n\
  for (var i in obj) {\n\
    if (obj.hasOwnProperty(i)) {\n\
      fn.call(scope, i, obj[i]);\n\
    }\n\
  }\n\
}\n\
\n\
\n\
/**\n\
 * Array iteration.\n\
 * @param  {Array}   obj   \n\
 * @param  {Function} fn    \n\
 * @param  {Object}   scope \n\
 * @api private\n\
 */\n\
\n\
function array(obj, fn, scope){\n\
  for(var i = 0, l = obj.length; i < l; i++){\n\
    fn.call(scope, i, obj[i]);\n\
  }\n\
}\n\
//# sourceURL=components/bredele/looping/1.1.1/index.js"
));

require.modules["bredele-looping"] = require.modules["bredele~looping@1.1.1"];
require.modules["bredele~looping"] = require.modules["bredele~looping@1.1.1"];
require.modules["looping"] = require.modules["bredele~looping@1.1.1"];


require.register("bredele~many@0.3.3", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var loop = require(\"bredele~looping@1.1.1\");\n\
\n\
\n\
/**\n\
 * Expose many.\n\
 *\n\
 * Only works when the first argument of a function\n\
 * is a string.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   var fn = many(function(name, data) {\n\
 *     // do something\n\
 *   });\n\
 *   \n\
 *   fn('bar', {});\n\
 *   fn({\n\
 *     'foo' : {},\n\
 *     'beep' : {}\n\
 *   });\n\
 *\n\
 * @param {Function}\n\
 * @return {Function} \n\
 * @api public\n\
 */\n\
\n\
module.exports = function(fn) {\n\
\tvar many = function(str) {\n\
\t\tif(typeof str === 'object') loop(str, many, this);\n\
\t\telse fn.apply(this, arguments);\n\
\t\treturn this;\n\
\t};\n\
\treturn many;\n\
};\n\
\n\
//# sourceURL=components/bredele/many/0.3.3/index.js"
));

require.modules["bredele-many"] = require.modules["bredele~many@0.3.3"];
require.modules["bredele~many"] = require.modules["bredele~many@0.3.3"];
require.modules["many"] = require.modules["bredele~many@0.3.3"];


require.register("bredele~datastore@1.0.5", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var Emitter = require(\"component~emitter@1.1.2\");\n\
var clone = require(\"bredele~clone@master\");\n\
var each = require(\"bredele~looping@1.1.1\");\n\
var many = require(\"bredele~many@0.3.3\");\n\
try {\n\
  var storage = window.localStorage;\n\
} catch(_) {\n\
  var storage = null;\n\
}\n\
\n\
\n\
/**\n\
 * Expose 'Store'\n\
 */\n\
\n\
module.exports = Store;\n\
\n\
\n\
/**\n\
 * Store constructor.\n\
 *\n\
 * @param {Object} data\n\
 * @api public\n\
 */\n\
\n\
function Store(data) {\n\
  if(data instanceof Store) return data;\n\
  this.data = data || {};\n\
  this.formatters = {};\n\
}\n\
\n\
\n\
Emitter(Store.prototype);\n\
\n\
\n\
/**\n\
 * Set store attribute.\n\
 * \n\
 * Examples:\n\
 *\n\
 *   //set\n\
 *   .set('name', 'bredele');\n\
 *   //update\n\
 *   .set({\n\
 *     name: 'bredele'\n\
 *   });\n\
 *   \n\
 * @param {String} name\n\
 * @param {Everything} value\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.set = many(function(name, value, strict) {\n\
  var prev = this.data[name];\n\
  if(prev !== value) {\n\
    this.data[name] = value;\n\
    if(!strict) this.emit('updated', name, value);\n\
    this.emit('change', name, value, prev);\n\
    this.emit('change ' + name, value, prev);\n\
  }\n\
});\n\
\n\
\n\
/**\n\
 * Get store attribute.\n\
 * \n\
 * @param {String} name\n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.get = function(name) {\n\
  var formatter = this.formatters[name];\n\
  var value = this.data[name];\n\
  if(formatter) {\n\
    value = formatter[0].call(formatter[1], value);\n\
  }\n\
  return value;\n\
};\n\
\n\
/**\n\
 * Get store attribute.\n\
 * \n\
 * @param {String} name\n\
 * @return {Boolean}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.has = function(name) {\n\
  return this.data.hasOwnProperty(name);\n\
};\n\
\n\
\n\
/**\n\
 * Delete store attribute.\n\
 * \n\
 * @param {String} name\n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.del = function(name, strict) {\n\
  //TODO:refactor this is ugly\n\
  if(this.has(name)){\n\
    if(this.data instanceof Array){\n\
      this.data.splice(name, 1);\n\
    } else {\n\
      delete this.data[name]; //NOTE: do we need to return something?\n\
    }\n\
    if(!strict) this.emit('updated', name);\n\
    this.emit('deleted', name, name);\n\
    this.emit('deleted ' + name, name);\n\
  }\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Set format middleware.\n\
 * \n\
 * Call formatter everytime a getter is called.\n\
 * A formatter should always return a value.\n\
 * \n\
 * Examples:\n\
 *\n\
 *   .format('name', function(val) {\n\
 *     return val.toUpperCase();\n\
 *   });\n\
 *   \n\
 * @param {String} name\n\
 * @param {Function} callback\n\
 * @param {Object} scope\n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.format = function(name, callback, scope) {\n\
  this.formatters[name] = [callback,scope];\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Compute store attributes.\n\
 * \n\
 * Examples:\n\
 *\n\
 *   .compute('name', function() {\n\
 *     return this.firstName + ' ' + this.lastName;\n\
 *   });\n\
 *   \n\
 * @param  {String} name\n\
 * @param {Function} callback\n\
 * @return {this}                \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.compute = function(name, callback) {\n\
  //NOTE: I want something clean instaead passing the computed \n\
  //attribute in the function\n\
  var str = callback.toString();\n\
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);\n\
\n\
  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)\n\
  for(var l = attrs.length; l--;){\n\
    this.on('change ' + attrs[l].slice(5), function(){\n\
      this.set(name, callback.call(this.data));\n\
    });\n\
  }\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Reset store\n\
 * \n\
 * @param  {Object} data \n\
 * @return {this} \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.reset = function(data, strict) {\n\
  var copy = clone(this.data),\n\
    length = data.length;\n\
    this.data = data;\n\
\n\
  each(copy, function(key, val){\n\
    if(typeof data[key] === 'undefined'){\n\
      if(!strict) this.emit('updated', key);\n\
      this.emit('deleted', key, length);\n\
      this.emit('deleted ' + key, length);\n\
    }\n\
  }, this);\n\
\n\
  //set new attributes\n\
  each(data, function(key, val){\n\
    //TODO:refactor with this.set\n\
    var prev = copy[key];\n\
    if(prev !== val) {\n\
      if(!strict) this.emit('updated', key, val);\n\
      this.emit('change', key, val, prev);\n\
      this.emit('change ' + key, val, prev);\n\
    }\n\
  }, this);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Loop through store data.\n\
 * \n\
 * @param  {Function} cb   \n\
 * @param  {[type]}   scope \n\
 * @return {this} \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.loop = function(cb, scope) {\n\
  each(this.data, cb, scope || this);\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Pipe two stores (merge and listen data).\n\
 * example:\n\
 *\n\
 *   .pipe(store);\n\
 *   \n\
 * note: pipe only stores of same type\n\
 *\n\
 * @param {Store} store \n\
 * @return {this} \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.pipe = function(store) {\n\
  store.set(this.data);\n\
  this.on('updated', function(name, val) {\n\
    if(val) return store.set(name, val);\n\
    store.del(name);\n\
  });\n\
  return this;\n\
};\n\
\n\
/**\n\
 * Synchronize with local storage.\n\
 * \n\
 * @param  {String} name \n\
 * @param  {Boolean} bool save in localstore\n\
 * @return {this} \n\
 * @api public\n\
 */\n\
\n\
Store.prototype.local = function(name, bool) {\n\
  //TODO: should we do a clear for .local()?\n\
  if(!bool) {\n\
    storage.setItem(name, this.toJSON());\n\
  } else {\n\
    this.reset(JSON.parse(storage.getItem(name)));\n\
  }\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Use middlewares to extend store.\n\
 * \n\
 * A middleware is a function with the store\n\
 * as first argument.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   store.use(plugin, 'something');\n\
 * \n\
 * @param  {Function} fn \n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.use = function(fn) {\n\
  var args = [].slice.call(arguments, 1);\n\
  fn.apply(this, [this].concat(args));\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Stringify model\n\
 * @return {String} json\n\
 * @api public\n\
 */\n\
\n\
Store.prototype.toJSON = function(replacer, space) {\n\
  return JSON.stringify(this.data, replacer, space);\n\
};\n\
\n\
//# sourceURL=components/bredele/datastore/1.0.5/index.js"
));

require.modules["bredele-datastore"] = require.modules["bredele~datastore@1.0.5"];
require.modules["bredele~datastore"] = require.modules["bredele~datastore@1.0.5"];
require.modules["datastore"] = require.modules["bredele~datastore@1.0.5"];


require.register("component~indexof@0.0.3", Function("exports, module",
"module.exports = function(arr, obj){\n\
  if (arr.indexOf) return arr.indexOf(obj);\n\
  for (var i = 0; i < arr.length; ++i) {\n\
    if (arr[i] === obj) return i;\n\
  }\n\
  return -1;\n\
};\n\
//# sourceURL=components/component/indexof/0.0.3/index.js"
));

require.modules["component-indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["component~indexof"] = require.modules["component~indexof@0.0.3"];
require.modules["indexof"] = require.modules["component~indexof@0.0.3"];


require.register("bredele~deus@0.3.3", Function("exports, module",
"\n\
/**\n\
 * Module dependencies\n\
 * @api private\n\
 */\n\
\n\
var index = require(\"component~indexof@0.0.3\");\n\
\n\
\n\
/**\n\
 * Expose 'deus'\n\
 */\n\
\n\
module.exports = deus;\n\
\n\
\n\
/**\n\
 * Make two arguments function flexible.\n\
 *\n\
 * @param {String} one \n\
 * @param {String} two\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
function deus(one, two, fn) {\n\
  var types = [one, two];\n\
  var type = function(args, arg) {\n\
    var idx = index(types, typeof arg);\n\
    if(idx > -1 && !args[idx]) args[idx] = arg;\n\
    else args.splice(args.length,0,arg);\n\
  };\n\
\n\
  return function() {\n\
    var args = [,,];\n\
    for(var i = 0, l = arguments.length; i < l; i++) {\n\
      type(args, arguments[i]);\n\
    }\n\
    return fn.apply(this, args);\n\
  };\n\
}\n\
\n\
//# sourceURL=components/bredele/deus/0.3.3/index.js"
));

require.modules["bredele-deus"] = require.modules["bredele~deus@0.3.3"];
require.modules["bredele~deus"] = require.modules["bredele~deus@0.3.3"];
require.modules["deus"] = require.modules["bredele~deus@0.3.3"];


require.register("bredele~wedge@0.1.0", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var index = require(\"component~indexof@0.0.3\");\n\
\n\
\n\
/**\n\
 * wedge constructor.\n\
 * \n\
 * @api public\n\
 */\n\
\n\
module.exports = function wedge(obj) {\n\
  var args = [].slice.call(arguments, 1);\n\
  if(obj instanceof Array) {\n\
    return array(obj, args);\n\
  }\n\
  return object(obj, args);\n\
};\n\
\n\
\n\
/**\n\
 * wedge objects.\n\
 *\n\
 * Slice keys from object and return a new \n\
 * object with just these keys.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   wedge({\n\
 *     video: true,\n\
 *     audio: false,\n\
 *     right: 'admin'\n\
 *   }, 'video', 'right');\n\
 *   // => { video: true, right: 'admin'}\n\
 *   \n\
 * @param  {Object} obj \n\
 * @return {Object}\n\
 */\n\
\n\
function object(obj, args) {\n\
  var result = {};\n\
  for(var i = 0, l = args.length; i < l; i++) {\n\
    var key = args[i];\n\
    result[key] = obj[key];\n\
  }\n\
  return result;\n\
}\n\
\n\
\n\
/**\n\
 * wedge arrays.\n\
 *\n\
 * Slice items from array and return a new \n\
 * array with just these items.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   wedge(['olivier', {\n\
 *     video: true\n\
 *   }, 'bredele'], 0, 2);\n\
 *   // => [{video:true}, 'bredele']\n\
 *   \n\
 * @param  {Array} obj \n\
 * @return {Array}\n\
 */\n\
\n\
function array(obj, args) {\n\
  var result = [];\n\
  for(var i = 0, l = obj.length; i < l; i++) {\n\
    if(index(args, i) > -1) result.push(obj[i]);\n\
  }\n\
  return result;\n\
}\n\
//# sourceURL=components/bredele/wedge/0.1.0/index.js"
));

require.modules["bredele-wedge"] = require.modules["bredele~wedge@0.1.0"];
require.modules["bredele~wedge"] = require.modules["bredele~wedge@0.1.0"];
require.modules["wedge"] = require.modules["bredele~wedge@0.1.0"];


require.register("bredele~store-toggle@0.1.0", Function("exports, module",
"\n\
/**\n\
 * Toggle plugins for datastore-like objects.\n\
 *\n\
 * A datastore-like object has at least a set\n\
 * handler to set an object's key with a value.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   store.use(toggle);\n\
 *   // or change scope\n\
 *   store.use(toggle, other);\n\
 *\n\
 * @api public\n\
 */\n\
\n\
module.exports = function toggle(ctx, scope) {\n\
\n\
\tscope = scope || ctx;\n\
\n\
\t/**\n\
\t * Enable key into a datastore-like\n\
\t * object.\n\
\t *\n\
\t * Examples:\n\
\t *\n\
\t *   store.enable('admin');\n\
\t *   // admin => true\n\
\t *   \n\
\t * @param  {String} key\n\
\t * @return {this}\n\
\t * @api public\n\
\t */\n\
\t\n\
\tctx.enable = function(key) {\n\
\t\tscope.set(key, true);\n\
\t\treturn this;\n\
\t};\n\
\n\
\n\
\t/**\n\
\t * Disable key into a datastore-like\n\
\t * object.\n\
\t *\n\
\t * Examples:\n\
\t *\n\
\t *   store.disable('admin');\n\
\t *   // admin => false\n\
\t *   \n\
\t * @param  {String} key\n\
\t * @return {this}\n\
\t * @api public\n\
\t */\n\
\t\n\
\tctx.disable = function(key) {\n\
\t\tscope.set(key, false);\n\
\t\treturn this;\n\
\t};\n\
};\n\
\n\
\n\
//# sourceURL=components/bredele/store-toggle/0.1.0/index.js"
));

require.modules["bredele-store-toggle"] = require.modules["bredele~store-toggle@0.1.0"];
require.modules["bredele~store-toggle"] = require.modules["bredele~store-toggle@0.1.0"];
require.modules["store-toggle"] = require.modules["bredele~store-toggle@0.1.0"];


require.register("bredele~media@0.1.5", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var Store = require(\"bredele~datastore@1.0.5\");\n\
var wedge = require(\"bredele~wedge@0.1.0\");\n\
var deus = require(\"bredele~deus@0.3.3\");\n\
var toggle = require(\"bredele~store-toggle@0.1.0\");\n\
\n\
\n\
// cross browser getUserMedia\n\
\n\
navigator.getMedia = ( navigator.getUserMedia ||\n\
  navigator.webkitGetUserMedia ||\n\
  navigator.mozGetUserMedia ||\n\
  navigator.msGetUserMedia);\n\
\n\
\n\
// default constraints\n\
\n\
var constraints =  {\n\
  \"audio\": true,\n\
  \"video\": {\n\
    \"mandatory\": {},\n\
    \"optional\": []\n\
  },\n\
  \"autoplay\": true\n\
};\n\
\n\
\n\
/**\n\
 * Expose 'media'\n\
 */\n\
\n\
module.exports = Media;\n\
\n\
\n\
/**\n\
 * Media factory.\n\
 *\n\
 * Examples:\n\
 *\n\
 *  media();\n\
 *  media(obj, success);\n\
 *  media(success);\n\
 * \n\
 * @param  {Object} obj    \n\
 * @param  {Function} success \n\
 * @param  {Function} error \n\
 * @return {Media}\n\
 * @api private\n\
 */\n\
\n\
var factory = deus('object', 'function', function(obj, success, error) {\n\
  var media = new Media(obj);\n\
  media.on('error', error);\n\
  if(success) media.capture(success);\n\
  return media;\n\
});\n\
\n\
\n\
/**\n\
 * media constructor.\n\
 *\n\
 * A media is a function with a datastore\n\
 * as prototype.\n\
 *\n\
 * @param {Object} obj (optional)\n\
 * @param {Function} success (optional)\n\
 * @param {Function} error (optional)\n\
 * @return {Function}\n\
 * @api public\n\
 */\n\
\n\
function Media(obj, success, error) {\n\
  if(!(this instanceof Media)) {\n\
    return factory.apply(null, arguments);\n\
  }\n\
  Store.call(this);\n\
  this.use(toggle);\n\
  this.set(constraints);\n\
  this.set(obj);\n\
}\n\
\n\
\n\
// Media is a datastore\n\
\n\
Media.prototype = Store.prototype;\n\
\n\
\n\
/**\n\
 * Capture media and emit stream\n\
 * event.\n\
 *\n\
 * Capture is call automatically by constructor when\n\
 * a success callbacl is specified. \n\
 *\n\
 * Examples:\n\
 *\n\
 *   media.capture();\n\
 *   media.capture(function(stream, url) {\n\
 *     // do something with string\n\
 *   });\n\
 * \n\
 * @param  {Function} cb (optional)\n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Media.prototype.capture = function(cb) {\n\
  var data = wedge(this.data, 'video', 'audio');\n\
  var _this = this;\n\
  navigator.getMedia(data, function(stream) {\n\
    var url;\n\
    if (window.URL) url = window.URL.createObjectURL(stream);\n\
    _this.once('stop', function() {\n\
      stream.stop();\n\
    });\n\
    _this.emit('stream', data, stream, url);\n\
    if(cb) cb(stream, url);\n\
  }, function(error) {\n\
    _this.emit('error', error);\n\
  });\n\
  return this;\n\
};\n\
\n\
\n\
/**\n\
 * Stop captured media.\n\
 * \n\
 * @return {this}\n\
 * @api public\n\
 */\n\
\n\
Media.prototype.stop = function() {\n\
  this.emit('stop');\n\
  return this;\n\
};\n\
\n\
//# sourceURL=components/bredele/media/0.1.5/index.js"
));

require.modules["bredele-media"] = require.modules["bredele~media@0.1.5"];
require.modules["bredele~media"] = require.modules["bredele~media@0.1.5"];
require.modules["media"] = require.modules["bredele~media@0.1.5"];


require.register("bredele~stomach@0.1.0", Function("exports, module",
"\n\
/**\n\
 * Stomach constructor.\n\
 *\n\
 * Generate dom from string or html\n\
 * node.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   stomach('<button>hello</button>');\n\
 *   stomach('#hello');\n\
 *   stomach(node);\n\
 *   \n\
 * @param {String | Element} tmpl\n\
 * @return {Element}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(tmpl) {\n\
  if(typeof tmpl === 'string') {\n\
     if(tmpl[0] === '<') {\n\
       var div = document.createElement('div');\n\
       div.insertAdjacentHTML('beforeend', tmpl);\n\
       return div.firstChild;\n\
     } \n\
     return document.querySelector(tmpl);\n\
   }\n\
   return tmpl;\n\
};\n\
\n\
//# sourceURL=components/bredele/stomach/0.1.0/index.js"
));

require.modules["bredele-stomach"] = require.modules["bredele~stomach@0.1.0"];
require.modules["bredele~stomach"] = require.modules["bredele~stomach@0.1.0"];
require.modules["stomach"] = require.modules["bredele~stomach@0.1.0"];


require.register("bredele~attach@0.0.3", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var dom = require(\"bredele~stomach@0.1.0\");\n\
\n\
\n\
/**\n\
 * Expose 'attach'\n\
 */\n\
\n\
module.exports = attach;\n\
\n\
\n\
/**\n\
 * Attach stream to a video element.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   attach(media, 'video');\n\
 *   attach(media, node, options);\n\
 *\n\
 * @param {Media | Stream} media\n\
 * @param {Element | String} el\n\
 * @param {Object} options\n\
 * @return {Media}\n\
 * @api public\n\
 * \n\
 * @see  http://github.com/bredelemedia\n\
 */\n\
\n\
function attach(media, el, options) {\n\
  var node = dom(el);\n\
  var success = function(stream, url) {\n\
    node.src = url;\n\
  };\n\
  var video;\n\
  if(typeof media === 'function') {\n\
    video = media(options, success);\n\
  } else {\n\
    video = media;\n\
    video.set(options);\n\
    video.capture(success);\n\
  }\n\
  node.autoplay = video.get('autoplay');\n\
  //NOTE: it should work with stream too instead media\n\
  return video;\n\
}\n\
\n\
\n\
//# sourceURL=components/bredele/attach/0.0.3/index.js"
));

require.modules["bredele-attach"] = require.modules["bredele~attach@0.0.3"];
require.modules["bredele~attach"] = require.modules["bredele~attach@0.0.3"];
require.modules["attach"] = require.modules["bredele~attach@0.0.3"];


require.register("bredele~connect@0.0.3", Function("exports, module",
"\n\
/**\n\
 * Connect two local peer connection.\n\
 *\n\
 * Connect create an offer and an answer and\n\
 * set session descriptions for each peer.\n\
 * \n\
 * Examples:\n\
 *\n\
 *   var master = peer();\n\
 *   var slave = peer();\n\
 *   master.use(connect(slave));\n\
 *   \n\
 * @param {Peer} slave\n\
 * @param {Boolean} bool (false to differ offer)\n\
 * @api public\n\
 */\n\
\n\
\n\
module.exports = function connect(slave, bool) {\n\
\n\
  return function(ctx) {\n\
\n\
    ctx.on('candidate', function(candidate) {\n\
      slave.ice(candidate);\n\
    });\n\
\n\
    slave.on('candidate', function(candidate) {\n\
      ctx.ice(candidate);\n\
    });\n\
\n\
    slave.on('answer', function(offer) {\n\
      ctx.remote(offer);\n\
    });\n\
\n\
    ctx.on('offer', function(offer) {\n\
      slave.remote(offer);\n\
      slave.answer();\n\
    });\n\
\n\
    ctx.create();\n\
    slave.create();\n\
    if(bool !== false) ctx.offer();\n\
  };\n\
\n\
};\n\
\n\
//# sourceURL=components/bredele/connect/0.0.3/index.js"
));

require.modules["bredele-connect"] = require.modules["bredele~connect@0.0.3"];
require.modules["bredele~connect"] = require.modules["bredele~connect@0.0.3"];
require.modules["connect"] = require.modules["bredele~connect@0.0.3"];


require.register("bredele~emitter-queue@master", Function("exports, module",
"\n\
/**\n\
 * Expose 'Queue'\n\
 */\n\
\n\
module.exports = Queue;\n\
\n\
\n\
/**\n\
 * Queue events on emitter-like objects.\n\
 * \n\
 * @param {Emitter} emitter \n\
 * @see  http://github.com/component/emitter\n\
 * @api public\n\
 */\n\
\n\
function Queue(emitter) {\n\
\n\
\n\
  /**\n\
   * Cache emitter on.\n\
   * @api private\n\
   */\n\
  var cache = emitter.on;\n\
\n\
\n\
  /**\n\
   * Emit event and store it if no\n\
   * defined callbacks.\n\
   * example:\n\
   *\n\
   *   .queue('message', 'hi');\n\
   *\n\
   * @param {String} event\n\
   * @api public\n\
   */\n\
  \n\
  emitter.queue = function(topic) {\n\
    this._queue = this._queue || {};\n\
    this._callbacks = this._callbacks || {};\n\
    if(this._callbacks[topic]) {\n\
      this.emit.apply(this, arguments);\n\
    } else {\n\
      (this._queue[topic] = this._queue[topic] || [])\n\
        .push([].slice.call(arguments, 1));\n\
    }\n\
  };\n\
\n\
\n\
  /**\n\
   * Listen on the given `event` with `fn`.\n\
   *\n\
   * @param {String} event\n\
   * @param {Function} fn\n\
   * @return {Emitter}\n\
   * @api public\n\
   */\n\
  \n\
  emitter.on = emitter.addEventListener = function(topic, fn) {\n\
    this._queue = this._queue || {};\n\
    var topics = this._queue[topic];\n\
    cache.apply(this, arguments);\n\
    if(topics) {\n\
      for(var i = 0, l = topics.length; i < l; i++) {\n\
        fn.apply(this, topics[i]);\n\
      }\n\
      delete this._queue[topic];\n\
    }\n\
  };\n\
\n\
\n\
}\n\
\n\
//# sourceURL=components/bredele/emitter-queue/master/index.js"
));

require.modules["bredele-emitter-queue"] = require.modules["bredele~emitter-queue@master"];
require.modules["bredele~emitter-queue"] = require.modules["bredele~emitter-queue@master"];
require.modules["emitter-queue"] = require.modules["bredele~emitter-queue@master"];


require.register("bredele~peer@0.1.0", Function("exports, module",
"\n\
/**\n\
 * Module dependencies.\n\
 * @api private\n\
 */\n\
\n\
var Queue = require(\"bredele~emitter-queue@master\");\n\
var Store = require(\"bredele~datastore@1.0.5\");\n\
var wedge = require(\"bredele~wedge@0.1.0\");\n\
var deus = require(\"bredele~deus@0.3.3\");\n\
\n\
\n\
/**\n\
 * Shim\n\
 */\n\
\n\
var PeerConnection = (window.RTCPeerConnection ||\n\
  window.mozRTCPeerConnection ||\n\
  window.webkitRTCPeerConnection);\n\
var Candidate = window.RTCIceCandidate || window.mozRTCIceCandidate;\n\
var Session = window.RTCSessionDescription || window.mozRTCSessionDescription;\n\
var constraints = {\n\
\toptional: [],\n\
\tmandatory: []\n\
};\n\
\n\
\n\
/**\n\
 * Expose 'peer'\n\
 */\n\
\n\
module.exports = Peer;\n\
\n\
\n\
/**\n\
 * Create an initialize peer\n\
 * connection,\n\
 *\n\
 *\n\
 * Examples:\n\
 *\n\
 *   var foo = peer();\n\
 *   var bar = peer(servers);\n\
 *\n\
 * @param {Array} servers optional\n\
 * @param {Object} options \n\
 * @api public\n\
 */\n\
\n\
function Peer(servers) {\n\
\tif(!(this instanceof Peer)) return new Peer(servers);\n\
\tStore.call(this);\n\
\tthis.connection = null;\n\
\tthis.set('servers', servers);\n\
\tthis.set(constraints);\n\
}\n\
\n\
\n\
// Peer is a datastore\n\
\n\
Peer.prototype = Store.prototype;\n\
Queue(Peer.prototype);\n\
\n\
\n\
\n\
/**\n\
 * Create and initialize peer\n\
 * connection.\n\
 *\n\
 * Should be call before offer or answer.\n\
 * \n\
 * @api private\n\
 */\n\
\n\
Peer.prototype.create = function() {\n\
\tvar _this = this;\n\
\tvar data = wedge(this.data, 'optional', 'mandatory');\n\
\t// should may be format some constraints\n\
\tthis.connection = new PeerConnection(this.get('servers') || null, data);\n\
\tthis.connection.onaddstream = function(event) {\n\
\t\t_this.emit('remote stream', event.stream);\n\
\t};\n\
\tthis.connection.onicecandidate = function(event) {\n\
\t\tvar candidate = event.candidate;\n\
\t\tif(candidate) _this.emit('candidate', candidate, event);\n\
\t};\n\
\tthis.emit('create', data);\n\
};\n\
\n\
\n\
/**\n\
 * Add local stream to peer connection.\n\
 * \n\
 * @param  {MediaStream} stream\n\
 * @api private\n\
 */\n\
\n\
Peer.prototype.stream = function(stream) {\n\
\tthis.connection.addStream(stream);\n\
\tthis.queue('local stream', stream);\n\
};\n\
\n\
\n\
/**\n\
 * Set ice candidate.\n\
 * \n\
 * @param  {candidate} candidate\n\
 * @api private\n\
 */\n\
\n\
Peer.prototype.ice = function(candidate) {\n\
\tthis.connection.addIceCandidate(new Candidate(candidate));\n\
};\n\
\n\
\n\
/**\n\
 * Set local session descriptor.\n\
 * \n\
 * @param  {RTCSessionDescription} session\n\
 * @api private\n\
 */\n\
\n\
Peer.prototype.local = function(session) {\n\
\tthis.connection.setLocalDescription(new Session(session));\n\
};\n\
\n\
\n\
/**\n\
 * Set remote session descriptor.\n\
 * \n\
 * @param  {RTCSessionDescription} session\n\
 * @api private\n\
 */\n\
\n\
Peer.prototype.remote = function(session) {\n\
\tthis.connection.setRemoteDescription(new Session(session));\n\
};\n\
\n\
\n\
/**\n\
 * Initialize master peer connection\n\
 * and create offer.\n\
 *\n\
 * Emit and queue offer event.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   var master = peer();\n\
 *   master.on('offer', function(offer) {\n\
 *     // do something with offer\n\
 *   });\n\
 *\n\
 * @param {Object} constraints optional\n\
 * @api private\n\
 * \n\
 * @see  http://github.com/bredele/emitter-queue\n\
 */\n\
\n\
Peer.prototype.offer = deus('function', 'object', function(fn, opts) {\n\
\tvar _this = this;\n\
\t// NOTE we should also pass constraints\n\
\tthis.connection.createOffer(function(offer) {\n\
\t\t_this.connection.setLocalDescription(offer);\n\
\t\tif(fn) fn(offer);\n\
\t\t_this.queue('offer', offer);\n\
\t},function(e) {\n\
\t\t_this.emit('error', e);\n\
\t}, opts);\n\
});\n\
\n\
\n\
/**\n\
 * Initialize slave peer connection\n\
 * and create answer.\n\
 *\n\
 * Emit and queue answer event.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   var slave = peer();\n\
 *   slave.on('answer', function(offer) {\n\
 *     // do something with offer\n\
 *   });\n\
 *   \n\
 * @param {Object} constraints optional\n\
 * @api private\n\
 *\n\
 * @see  http://github.com/bredele/emitter-queue\n\
 */\n\
\n\
Peer.prototype.answer = deus('function', 'object', function(fn, opts) {\n\
\tconsole.log(opts, fn);\n\
\tvar _this = this;\n\
\tthis.connection.createAnswer(function(offer) {\n\
\t\t_this.connection.setLocalDescription(offer);\n\
\t\tif(fn) fn(offer);\n\
\t\t_this.queue('answer', offer);\n\
\t},function(e) {\n\
\t\t_this.emit('error', e);\n\
\t}, opts);\n\
});\n\
\n\
\n\
/**\n\
 * Set peer codes.\n\
 *\n\
 * @param {Function} fn\n\
 * @api public\n\
 */\n\
\n\
Peer.prototype.codec = Peer.prototype.use;\n\
\n\
//# sourceURL=components/bredele/peer/0.1.0/index.js"
));

require.modules["bredele-peer"] = require.modules["bredele~peer@0.1.0"];
require.modules["bredele~peer"] = require.modules["bredele~peer@0.1.0"];
require.modules["peer"] = require.modules["bredele~peer@0.1.0"];


require.register("bredele~channel@0.0.1", Function("exports, module",
"\n\
/**\n\
 * Create a single data chanel from the peer connection\n\
 * once created.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   peer.use(channel('chat'));\n\
 * \n\
 * @param {String || JSON} name\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(name) {\n\
\n\
\treturn function(peer) {\n\
\n\
\t\tvar channel;\n\
\n\
\t\t// Enable rtp coomunication\n\
\t\t\n\
\t\tpeer.set('optional', [{\n\
\t\t\tRtpDataChannels: true\n\
\t\t}]);\n\
\n\
\n\
\t\t/**\n\
\t\t * Send data through channel.\n\
\t\t * \n\
\t\t * @param  {String } data \n\
\t\t * @return {this}\n\
\t\t * @api public\n\
\t\t */\n\
\t\t\n\
\t\tpeer.send = function(data) {\n\
\t\t\tif(typeof data === 'object') {\n\
\t\t\t\tdata = JSON.stringify(data);\n\
\t\t\t}\n\
\t\t\tchannel.send(data);\n\
\t\t};\n\
\n\
\n\
\t\t// create data channel\n\
\t\t\n\
\t\tpeer.on('create', function() {\n\
\n\
\t\t\t// options\n\
\t\t\tchannel = peer.connection.createDataChannel(name);\n\
\n\
\t\t\tchannel.onmessage = function (event) {\n\
\t\t\t\tpeer.emit('message', event.data);\n\
\t\t\t};\n\
\n\
\t\t\tchannel.onerror = function (error) {\n\
\t\t\t\tpeer.emit('error', error);\n\
\t\t\t};\n\
\n\
\t\t\tchannel.onopen = function () {\n\
\t\t\t\tpeer.emit('channel open', name);\n\
\t\t\t};\n\
\n\
\t\t\tchannel.onclose = function () {\n\
\t\t\t\tpeer.emit('channel close', name);\n\
\t\t\t};\n\
\n\
\t\t});\n\
\n\
\t};\n\
};\n\
\n\
\n\
\n\
//# sourceURL=components/bredele/channel/0.0.1/index.js"
));

require.modules["bredele-channel"] = require.modules["bredele~channel@0.0.1"];
require.modules["bredele~channel"] = require.modules["bredele~channel@0.0.1"];
require.modules["channel"] = require.modules["bredele~channel@0.0.1"];


require.register("bredele~signal@0.0.1", Function("exports, module",
"\n\
/**\n\
 * Signal plugin.\n\
 *\n\
 * Connect two remote peer through\n\
 * socket.io.\n\
 *\n\
 * Examples:\n\
 *\n\
 *   var chat = peer();\n\
 *   chat.use(signal('room'));\n\
 *\n\
 * @param {String} room\n\
 * @param {String} address optional\n\
 * @api public\n\
 *\n\
 * @see  http://github.com/bredele/peer\n\
 */\n\
\n\
module.exports = function signal(room, address) {\n\
\n\
  // initialize socket\n\
  \n\
  var socket = io.connect(address);\n\
\n\
  return function(peer) {\n\
    peer.create();\n\
\n\
    // set ice candidate\n\
    \n\
    socket.on('candidate', function(candidate) {\n\
      peer.ice(candidate);\n\
    });\n\
\n\
    // send ice candidate\n\
    \n\
    peer.on('candidate', function(candidate) {\n\
      socket.emit('candidate', candidate);\n\
    });\n\
\n\
    // get answer from slave\n\
    \n\
    socket.on('slave offer', function(offer) {\n\
      peer.remote(offer);\n\
    });\n\
\n\
\n\
    // get offer from master\n\
    \n\
    socket.on('master offer', function(offer) {\n\
      peer.remote(offer);\n\
      console.log('create answer');\n\
      peer.answer(function(token) {\n\
        peer.local(token);\n\
        socket.emit('slave offer', token);\n\
      });\n\
    });\n\
\n\
    // slave is connected\n\
    \n\
    socket.on('slave', function() {\n\
      console.log('create offer');\n\
      peer.offer(function(offer) {\n\
        socket.emit('master offer', offer);\n\
      });\n\
    });\n\
\n\
    // NOTE: can we create an offer even before the handshake?\n\
    socket.emit('join', room);\n\
  };\n\
};\n\
\n\
//# sourceURL=components/bredele/signal/0.0.1/index.js"
));

require.modules["bredele-signal"] = require.modules["bredele~signal@0.0.1"];
require.modules["bredele~signal"] = require.modules["bredele~signal@0.0.1"];
require.modules["signal"] = require.modules["bredele~signal@0.0.1"];


require.register("video", Function("exports, module",
"\n\
/**\n\
 * Modules dependencies.\n\
 * @api private\n\
 */\n\
\n\
var attach = require(\"bredele~attach@0.0.3\");\n\
var media = require(\"bredele~media@0.1.5\");\n\
var wedge = require(\"bredele~wedge@0.1.0\");\n\
\n\
\n\
/**\n\
 * video constructor.\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(node, options) {\n\
\n\
  return function(peer) {\n\
    var data = wedge(peer.data, 'video');\n\
    var video = media({\n\
      video:true\n\
    });\n\
\n\
    // video should not be undefined\n\
    if(data.video) video.set(data);\n\
\n\
    video.on('stream', function(data, stream) {\n\
      peer.emit('stream');\n\
      peer.queue('_stream', stream);\n\
    });\n\
\n\
    // add stream always before offer\n\
    peer.on('create', function() {\n\
      peer.on('_stream', function(stream) {\n\
        peer.stream(stream);\n\
      });\n\
    });\n\
    \n\
    attach(video, node, options);\n\
  };\n\
\n\
};\n\
//# sourceURL=index.js"
));

require.modules["video"] = require.modules["video"];


require("video")