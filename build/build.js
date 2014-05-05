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

require.register("bredele~emitter-queue@master", function (exports, module) {

/**
 * Expose 'Queue'
 */

module.exports = Queue;


/**
 * Queue events on emitter-like objects.
 * 
 * @param {Emitter} emitter 
 * @see  http://github.com/component/emitter
 * @api public
 */

function Queue(emitter) {


  /**
   * Cache emitter on.
   * @api private
   */
  var cache = emitter.on;


  /**
   * Emit event and store it if no
   * defined callbacks.
   * example:
   *
   *   .queue('message', 'hi');
   *
   * @param {String} event
   * @api public
   */
  
  emitter.queue = function(topic) {
    this._queue = this._queue || {};
    this._callbacks = this._callbacks || {};
    if(this._callbacks[topic]) {
      this.emit.apply(this, arguments);
    } else {
      (this._queue[topic] = this._queue[topic] || [])
        .push([].slice.call(arguments, 1));
    }
  };


  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   * @return {Emitter}
   * @api public
   */
  
  emitter.on = emitter.addEventListener = function(topic, fn) {
    this._queue = this._queue || {};
    var topics = this._queue[topic];
    cache.apply(this, arguments);
    if(topics) {
      for(var i = 0, l = topics.length; i < l; i++) {
        fn.apply(this, topics[i]);
      }
      delete this._queue[topic];
    }
  };


}

});

require.register("bredele~clone@master", function (exports, module) {

/**
 * Expose 'clone'
 * @param  {Object} obj 
 * @api public
 */

module.exports = function(obj) {
  var cp = null;
  if(obj instanceof Array) {
    cp = obj.slice(0);
  } else {
    //hasOwnProperty doesn't work with Object.create
    // cp = Object.create ? Object.create(obj) : clone(obj);
    cp = clone(obj);
  }
  return cp;
};


/**
 * Clone object.
 * @param  {Object} obj 
 * @api private
 */

function clone(obj){
  if(typeof obj === 'object') {
    var copy = {};
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = clone(obj[key]);
      }
    }
    return copy;
  }
  return obj;
}
});

require.register("component~emitter@1.1.2", function (exports, module) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});

require.register("bredele~looping@1.1.1", function (exports, module) {

/**
 * Expose 'looping'
 */

module.exports = function(obj, fn, scope){
  scope = scope || this;
  if( obj instanceof Array) {
    array(obj, fn, scope);
  } else if(typeof obj === 'object') {
    object(obj, fn, scope);
  }
};


/**
 * Object iteration.
 * @param  {Object}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function object(obj, fn, scope) {
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      fn.call(scope, i, obj[i]);
    }
  }
}


/**
 * Array iteration.
 * @param  {Array}   obj   
 * @param  {Function} fn    
 * @param  {Object}   scope 
 * @api private
 */

function array(obj, fn, scope){
  for(var i = 0, l = obj.length; i < l; i++){
    fn.call(scope, i, obj[i]);
  }
}
});

require.register("bredele~many@0.3.3", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var loop = require("bredele~looping@1.1.1");


/**
 * Expose many.
 *
 * Only works when the first argument of a function
 * is a string.
 *
 * Examples:
 *
 *   var fn = many(function(name, data) {
 *     // do something
 *   });
 *   
 *   fn('bar', {});
 *   fn({
 *     'foo' : {},
 *     'beep' : {}
 *   });
 *
 * @param {Function}
 * @return {Function} 
 * @api public
 */

module.exports = function(fn) {
	var many = function(str) {
		if(typeof str === 'object') loop(str, many, this);
		else fn.apply(this, arguments);
		return this;
	};
	return many;
};

});

require.register("bredele~datastore@1.0.5", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Emitter = require("component~emitter@1.1.2");
var clone = require("bredele~clone@master");
var each = require("bredele~looping@1.1.1");
var many = require("bredele~many@0.3.3");
try {
  var storage = window.localStorage;
} catch(_) {
  var storage = null;
}


/**
 * Expose 'Store'
 */

module.exports = Store;


/**
 * Store constructor.
 *
 * @param {Object} data
 * @api public
 */

function Store(data) {
  if(data instanceof Store) return data;
  this.data = data || {};
  this.formatters = {};
}


Emitter(Store.prototype);


/**
 * Set store attribute.
 * 
 * Examples:
 *
 *   //set
 *   .set('name', 'bredele');
 *   //update
 *   .set({
 *     name: 'bredele'
 *   });
 *   
 * @param {String} name
 * @param {Everything} value
 * @api public
 */

Store.prototype.set = many(function(name, value, strict) {
  var prev = this.data[name];
  if(prev !== value) {
    this.data[name] = value;
    if(!strict) this.emit('updated', name, value);
    this.emit('change', name, value, prev);
    this.emit('change ' + name, value, prev);
  }
});


/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.get = function(name) {
  var formatter = this.formatters[name];
  var value = this.data[name];
  if(formatter) {
    value = formatter[0].call(formatter[1], value);
  }
  return value;
};

/**
 * Get store attribute.
 * 
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

Store.prototype.has = function(name) {
  return this.data.hasOwnProperty(name);
};


/**
 * Delete store attribute.
 * 
 * @param {String} name
 * @return {this}
 * @api public
 */

Store.prototype.del = function(name, strict) {
  //TODO:refactor this is ugly
  if(this.has(name)){
    if(this.data instanceof Array){
      this.data.splice(name, 1);
    } else {
      delete this.data[name]; //NOTE: do we need to return something?
    }
    if(!strict) this.emit('updated', name);
    this.emit('deleted', name, name);
    this.emit('deleted ' + name, name);
  }
  return this;
};


/**
 * Set format middleware.
 * 
 * Call formatter everytime a getter is called.
 * A formatter should always return a value.
 * 
 * Examples:
 *
 *   .format('name', function(val) {
 *     return val.toUpperCase();
 *   });
 *   
 * @param {String} name
 * @param {Function} callback
 * @param {Object} scope
 * @return {this}
 * @api public
 */

Store.prototype.format = function(name, callback, scope) {
  this.formatters[name] = [callback,scope];
  return this;
};


/**
 * Compute store attributes.
 * 
 * Examples:
 *
 *   .compute('name', function() {
 *     return this.firstName + ' ' + this.lastName;
 *   });
 *   
 * @param  {String} name
 * @param {Function} callback
 * @return {this}                
 * @api public
 */

Store.prototype.compute = function(name, callback) {
  //NOTE: I want something clean instaead passing the computed 
  //attribute in the function
  var str = callback.toString();
  var attrs = str.match(/this.[a-zA-Z0-9]*/g);

  this.set(name, callback.call(this.data)); //TODO: refactor (may be use replace)
  for(var l = attrs.length; l--;){
    this.on('change ' + attrs[l].slice(5), function(){
      this.set(name, callback.call(this.data));
    });
  }
  return this;
};


/**
 * Reset store
 * 
 * @param  {Object} data 
 * @return {this} 
 * @api public
 */

Store.prototype.reset = function(data, strict) {
  var copy = clone(this.data),
    length = data.length;
    this.data = data;

  each(copy, function(key, val){
    if(typeof data[key] === 'undefined'){
      if(!strict) this.emit('updated', key);
      this.emit('deleted', key, length);
      this.emit('deleted ' + key, length);
    }
  }, this);

  //set new attributes
  each(data, function(key, val){
    //TODO:refactor with this.set
    var prev = copy[key];
    if(prev !== val) {
      if(!strict) this.emit('updated', key, val);
      this.emit('change', key, val, prev);
      this.emit('change ' + key, val, prev);
    }
  }, this);
  return this;
};


/**
 * Loop through store data.
 * 
 * @param  {Function} cb   
 * @param  {[type]}   scope 
 * @return {this} 
 * @api public
 */

Store.prototype.loop = function(cb, scope) {
  each(this.data, cb, scope || this);
  return this;
};


/**
 * Pipe two stores (merge and listen data).
 * example:
 *
 *   .pipe(store);
 *   
 * note: pipe only stores of same type
 *
 * @param {Store} store 
 * @return {this} 
 * @api public
 */

Store.prototype.pipe = function(store) {
  store.set(this.data);
  this.on('updated', function(name, val) {
    if(val) return store.set(name, val);
    store.del(name);
  });
  return this;
};

/**
 * Synchronize with local storage.
 * 
 * @param  {String} name 
 * @param  {Boolean} bool save in localstore
 * @return {this} 
 * @api public
 */

Store.prototype.local = function(name, bool) {
  //TODO: should we do a clear for .local()?
  if(!bool) {
    storage.setItem(name, this.toJSON());
  } else {
    this.reset(JSON.parse(storage.getItem(name)));
  }
  return this;
};


/**
 * Use middlewares to extend store.
 * 
 * A middleware is a function with the store
 * as first argument.
 *
 * Examples:
 *
 *   store.use(plugin, 'something');
 * 
 * @param  {Function} fn 
 * @return {this}
 * @api public
 */

Store.prototype.use = function(fn) {
  var args = [].slice.call(arguments, 1);
  fn.apply(this, [this].concat(args));
  return this;
};


/**
 * Stringify model
 * @return {String} json
 * @api public
 */

Store.prototype.toJSON = function(replacer, space) {
  return JSON.stringify(this.data, replacer, space);
};

});

require.register("component~indexof@0.0.3", function (exports, module) {
module.exports = function(arr, obj){
  if (arr.indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});

require.register("bredele~wedge@0.1.0", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var index = require("component~indexof@0.0.3");


/**
 * wedge constructor.
 * 
 * @api public
 */

module.exports = function wedge(obj) {
  var args = [].slice.call(arguments, 1);
  if(obj instanceof Array) {
    return array(obj, args);
  }
  return object(obj, args);
};


/**
 * wedge objects.
 *
 * Slice keys from object and return a new 
 * object with just these keys.
 *
 * Examples:
 *
 *   wedge({
 *     video: true,
 *     audio: false,
 *     right: 'admin'
 *   }, 'video', 'right');
 *   // => { video: true, right: 'admin'}
 *   
 * @param  {Object} obj 
 * @return {Object}
 */

function object(obj, args) {
  var result = {};
  for(var i = 0, l = args.length; i < l; i++) {
    var key = args[i];
    result[key] = obj[key];
  }
  return result;
}


/**
 * wedge arrays.
 *
 * Slice items from array and return a new 
 * array with just these items.
 *
 * Examples:
 *
 *   wedge(['olivier', {
 *     video: true
 *   }, 'bredele'], 0, 2);
 *   // => [{video:true}, 'bredele']
 *   
 * @param  {Array} obj 
 * @return {Array}
 */

function array(obj, args) {
  var result = [];
  for(var i = 0, l = obj.length; i < l; i++) {
    if(index(args, i) > -1) result.push(obj[i]);
  }
  return result;
}
});

require.register("bredele~deus@0.3.3", function (exports, module) {

/**
 * Module dependencies
 * @api private
 */

var index = require("component~indexof@0.0.3");


/**
 * Expose 'deus'
 */

module.exports = deus;


/**
 * Make two arguments function flexible.
 *
 * @param {String} one 
 * @param {String} two
 * @return {Function}
 * @api public
 */

function deus(one, two, fn) {
  var types = [one, two];
  var type = function(args, arg) {
    var idx = index(types, typeof arg);
    if(idx > -1 && !args[idx]) args[idx] = arg;
    else args.splice(args.length,0,arg);
  };

  return function() {
    var args = [,,];
    for(var i = 0, l = arguments.length; i < l; i++) {
      type(args, arguments[i]);
    }
    return fn.apply(this, args);
  };
}

});

require.register("bredele~peer@0.1.4", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Queue = require("bredele~emitter-queue@master");
var Store = require("bredele~datastore@1.0.5");
var wedge = require("bredele~wedge@0.1.0");
var deus = require("bredele~deus@0.3.3");


/**
 * Shim
 */

var PeerConnection = (window.RTCPeerConnection ||
  window.mozRTCPeerConnection ||
  window.webkitRTCPeerConnection);
var Candidate = window.RTCIceCandidate || window.mozRTCIceCandidate;
var Session = window.RTCSessionDescription || window.mozRTCSessionDescription;
var constraints = {
  optional: [],
  mandatory: []
};


/**
 * Expose 'peer'
 */

module.exports = Peer;


/**
 * Create an initialize peer
 * connection,
 *
 *
 * Examples:
 *
 *   var foo = peer();
 *   var bar = peer(servers);
 *
 * @param {Array} servers optional
 * @param {Object} options 
 * @api public
 */

function Peer(servers) {
  if(!(this instanceof Peer)) return new Peer(servers);
  Store.call(this);
  this.connection = null;
  this.set('servers', servers);
  this.set(constraints);
  this.codecs = [];
}


// Peer is a datastore

Peer.prototype = Store.prototype;
Queue(Peer.prototype);



/**
 * Create and initialize peer
 * connection.
 *
 * Should be call before offer or answer.
 * 
 * @api private
 */

Peer.prototype.create = function() {
  var _this = this;
  var data = wedge(this.data, 'optional', 'mandatory');
  // should may be format some constraints
  this.connection = new PeerConnection(this.get('servers') || null, data);
  this.connection.onaddstream = function(event) {
    _this.emit('remote stream', event.stream);
  };
  this.connection.onicecandidate = function(event) {
    var candidate = event.candidate;
    if(candidate) _this.emit('candidate', candidate, event);
    else _this.queue('ready');
  };
  this.connection.ongatheringchange =  function(event) {
    var target = event.currentTarget;
    if (target && target.iceGatheringState === 'complete') {
      _this.queue('ready');
    }
  };
  this.emit('create', data);
};


/**
 * Add local stream to peer connection.
 * 
 * @param  {MediaStream} stream
 * @api private
 */

Peer.prototype.stream = function(stream) {
  this.connection.addStream(stream);
  this.queue('local stream', stream);
};


/**
 * Set ice candidate.
 * 
 * @param  {candidate} candidate
 * @api private
 */

Peer.prototype.ice = function(candidate) {
  this.connection.addIceCandidate(new Candidate(candidate));
};


/**
 * Set local session descriptor.
 *
 * If exists, apply codecs on the session
 * description string.
 * 
 * @param  {RTCSessionDescription} session
 * @api private
 */

Peer.prototype.local = function(session) {
  var sdp = session.sdp;
  for(var i = 0, l = this.codecs.length; i < l; i++) {
    sdp = this.codecs[i](sdp);
  }
  session.sdp = sdp;
  this.connection.setLocalDescription(new Session(session));
};


/**
 * Set remote session descriptor.
 * 
 * @param  {RTCSessionDescription} session
 * @api private
 */

Peer.prototype.remote = function(session) {
  this.connection.setRemoteDescription(new Session(session));
};


/**
 * Initialize master peer connection
 * and create offer.
 *
 * Emit and queue offer event.
 *
 * Examples:
 *
 *   var master = peer();
 *   master.on('offer', function(offer) {
 *     // do something with offer
 *   });
 *
 * @param {Object} constraints optional
 * @api private
 * 
 * @see  http://github.com/bredele/emitter-queue
 */

Peer.prototype.offer = deus('function', 'object', function(fn, opts) {
  var _this = this;
  // NOTE we should also pass constraints
  this.connection.createOffer(function(offer) {
    _this.local(offer);
    if(fn) fn(offer);
    _this.queue('offer', offer);
  },function(e) {
    _this.emit('error', e);
  }, opts);
});


/**
 * Initialize slave peer connection
 * and create answer.
 *
 * Emit and queue answer event.
 *
 * Examples:
 *
 *   var slave = peer();
 *   slave.on('answer', function(offer) {
 *     // do something with offer
 *   });
 *   
 * @param {Object} constraints optional
 * @api private
 *
 * @see  http://github.com/bredele/emitter-queue
 */

Peer.prototype.answer = deus('function', 'object', function(fn, opts) {
  var _this = this;
  this.connection.createAnswer(function(offer) {
    _this.local(offer);
    if(fn) fn(offer);
    _this.queue('answer', offer);
  },function(e) {
    _this.emit('error', e);
  }, opts);
});


/**
 * Set peer codecs.
 *
 * A codec is a function which
 * modifies the session description
 * and return a new one.
 *
 * Examples:
 *
 *   peer.codec(function(session) {
 *     // do something 
 *   });
 *
 * @param {Function} fn
 * @api public
 */

Peer.prototype.codec = function(fn) {
  this.codecs.push(fn);
};

});

require.register("bredele~store-toggle@0.1.0", function (exports, module) {

/**
 * Toggle plugins for datastore-like objects.
 *
 * A datastore-like object has at least a set
 * handler to set an object's key with a value.
 *
 * Examples:
 *
 *   store.use(toggle);
 *   // or change scope
 *   store.use(toggle, other);
 *
 * @api public
 */

module.exports = function toggle(ctx, scope) {

	scope = scope || ctx;

	/**
	 * Enable key into a datastore-like
	 * object.
	 *
	 * Examples:
	 *
	 *   store.enable('admin');
	 *   // admin => true
	 *   
	 * @param  {String} key
	 * @return {this}
	 * @api public
	 */
	
	ctx.enable = function(key) {
		scope.set(key, true);
		return this;
	};


	/**
	 * Disable key into a datastore-like
	 * object.
	 *
	 * Examples:
	 *
	 *   store.disable('admin');
	 *   // admin => false
	 *   
	 * @param  {String} key
	 * @return {this}
	 * @api public
	 */
	
	ctx.disable = function(key) {
		scope.set(key, false);
		return this;
	};
};


});

require.register("bredele~media@0.1.5", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var Store = require("bredele~datastore@1.0.5");
var wedge = require("bredele~wedge@0.1.0");
var deus = require("bredele~deus@0.3.3");
var toggle = require("bredele~store-toggle@0.1.0");


// cross browser getUserMedia

navigator.getMedia = ( navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia);


// default constraints

var constraints =  {
  "audio": true,
  "video": {
    "mandatory": {},
    "optional": []
  },
  "autoplay": true
};


/**
 * Expose 'media'
 */

module.exports = Media;


/**
 * Media factory.
 *
 * Examples:
 *
 *  media();
 *  media(obj, success);
 *  media(success);
 * 
 * @param  {Object} obj    
 * @param  {Function} success 
 * @param  {Function} error 
 * @return {Media}
 * @api private
 */

var factory = deus('object', 'function', function(obj, success, error) {
  var media = new Media(obj);
  media.on('error', error);
  if(success) media.capture(success);
  return media;
});


/**
 * media constructor.
 *
 * A media is a function with a datastore
 * as prototype.
 *
 * @param {Object} obj (optional)
 * @param {Function} success (optional)
 * @param {Function} error (optional)
 * @return {Function}
 * @api public
 */

function Media(obj, success, error) {
  if(!(this instanceof Media)) {
    return factory.apply(null, arguments);
  }
  Store.call(this);
  this.use(toggle);
  this.set(constraints);
  this.set(obj);
}


// Media is a datastore

Media.prototype = Store.prototype;


/**
 * Capture media and emit stream
 * event.
 *
 * Capture is call automatically by constructor when
 * a success callbacl is specified. 
 *
 * Examples:
 *
 *   media.capture();
 *   media.capture(function(stream, url) {
 *     // do something with string
 *   });
 * 
 * @param  {Function} cb (optional)
 * @return {this}
 * @api public
 */

Media.prototype.capture = function(cb) {
  var data = wedge(this.data, 'video', 'audio');
  var _this = this;
  navigator.getMedia(data, function(stream) {
    var url;
    if (window.URL) url = window.URL.createObjectURL(stream);
    _this.once('stop', function() {
      stream.stop();
    });
    _this.emit('stream', data, stream, url);
    if(cb) cb(stream, url);
  }, function(error) {
    _this.emit('error', error);
  });
  return this;
};


/**
 * Stop captured media.
 * 
 * @return {this}
 * @api public
 */

Media.prototype.stop = function() {
  this.emit('stop');
  return this;
};

});

require.register("bredele~stomach@0.1.0", function (exports, module) {

/**
 * Stomach constructor.
 *
 * Generate dom from string or html
 * node.
 *
 * Examples:
 *
 *   stomach('<button>hello</button>');
 *   stomach('#hello');
 *   stomach(node);
 *   
 * @param {String | Element} tmpl
 * @return {Element}
 * @api public
 */

module.exports = function(tmpl) {
  if(typeof tmpl === 'string') {
     if(tmpl[0] === '<') {
       var div = document.createElement('div');
       div.insertAdjacentHTML('beforeend', tmpl);
       return div.firstChild;
     } 
     return document.querySelector(tmpl);
   }
   return tmpl;
};

});

require.register("bredele~attach@0.0.3", function (exports, module) {

/**
 * Module dependencies.
 * @api private
 */

var dom = require("bredele~stomach@0.1.0");


/**
 * Expose 'attach'
 */

module.exports = attach;


/**
 * Attach stream to a video element.
 *
 * Examples:
 *
 *   attach(media, 'video');
 *   attach(media, node, options);
 *
 * @param {Media | Stream} media
 * @param {Element | String} el
 * @param {Object} options
 * @return {Media}
 * @api public
 * 
 * @see  http://github.com/bredelemedia
 */

function attach(media, el, options) {
  var node = dom(el);
  var success = function(stream, url) {
    node.src = url;
  };
  var video;
  if(typeof media === 'function') {
    video = media(options, success);
  } else {
    video = media;
    video.set(options);
    video.capture(success);
  }
  node.autoplay = video.get('autoplay');
  //NOTE: it should work with stream too instead media
  return video;
}


});

require.register("bredele~connect@0.0.3", function (exports, module) {

/**
 * Connect two local peer connection.
 *
 * Connect create an offer and an answer and
 * set session descriptions for each peer.
 * 
 * Examples:
 *
 *   var master = peer();
 *   var slave = peer();
 *   master.use(connect(slave));
 *   
 * @param {Peer} slave
 * @param {Boolean} bool (false to differ offer)
 * @api public
 */


module.exports = function connect(slave, bool) {

  return function(ctx) {

    ctx.on('candidate', function(candidate) {
      slave.ice(candidate);
    });

    slave.on('candidate', function(candidate) {
      ctx.ice(candidate);
    });

    slave.on('answer', function(offer) {
      ctx.remote(offer);
    });

    ctx.on('offer', function(offer) {
      slave.remote(offer);
      slave.answer();
    });

    ctx.create();
    slave.create();
    if(bool !== false) ctx.offer();
  };

};

});

require.register("bredele~video@0.1.0", function (exports, module) {

/**
 * Modules dependencies.
 * @api private
 */

var attach = require("bredele~attach@0.0.3");
var media = require("bredele~media@0.1.5");
var wedge = require("bredele~wedge@0.1.0");


/**
 * Default video constraints.
 * @type {Object}
 */

var constraints = {
  "mandatory": {},
  "optional": []
};


/**
 * Get a video stream from an HTML node
 * and attach the stream to a peer connection.
 * 
 * Examples:
 *
 *   peer.use(video('#id'));
 *   
 * @param {Element} node
 * @return {Function}
 * @api public
 */

module.exports = function(node, options) {

  return function(peer) {
    var data = wedge(peer.data, 'video');
    var video = media(constraints);

    // we don't validate video constraints
    if(data.video) video.set(data);

    video.on('stream', function(data, stream) {
      peer.emit('stream');
      peer.queue('_stream', stream);
    });

    // add stream always before offer
    peer.on('create', function() {
      peer.on('_stream', function(stream) {
        peer.stream(stream);
      });
    });
    
    attach(video, node, options);
  };

};
});

require.register("bredele~signal@0.0.2", function (exports, module) {

/**
 * Signal plugin.
 *
 * Connect two remote peer through
 * socket.io (no ice trickle).
 *
 * Examples:
 *
 *   var chat = peer();
 *   chat.use(signal('room'));
 *
 * @param {String} room
 * @param {String} address optional
 * @api public
 *
 * @see  http://github.com/bredele/peer
 */

module.exports = function signal(room, address) {

  // initialize socket
  
  var socket = io.connect(address);

  return function(peer) {
    var type = 'slave';
    peer.create();
    
    socket.on('slave offer', function(offer) {
      peer.remote(offer);
    });


    socket.on('master offer', function(offer) {
      peer.remote(offer);
      peer.answer();
    });

    peer.once('ready', function() {
      socket.emit(type + ' offer', peer.connection.localDescription);
    });

    
    socket.on('slave', function() {
      type = 'master';
      peer.offer();
    });

    // NOTE: can we create an offer even before the handshake?
    socket.emit('join', room);
  };
};

});

require.register("bredele~opus@0.1.0", function (exports, module) {

/**
 * Set opus as the preferred audio codec.
 * 
 * Examples:
 *
 *   peer.codec(opus);
 *
 * @return {Function} codec
 * @api public
 */

module.exports = function(sdp) {
  var lines = sdp.split('\r\n');
  var index;
  for(var i = 0, l = lines.length; i < l; i++) {
    var line = lines[i];
    if(line.indexOf('opus/48000') > -1) {
      // m-audio comes before opus
      var payload = extract(line, /:(\d+) opus\/48000/i);
      if(payload) {
        lines[index] = update(lines[index], payload);
      }
    }
    if(line.indexOf('m=audio') > -1) index = i;
  }
  lines = remove(lines, index);
  sdp = lines.join('\r\n');
  return sdp;
};


/**
 * Extract pattern from line.
 * 
 * @param  {String} line 
 * @param  {Regex} pattern 
 * @return {String}
 * @api private 
 */

function extract(line, pattern){
  var result = line.match(pattern);
  return (result && result.length === 2) ? result[1] : null;
}


/**
 * Set the selected codec to the first 
 * in the m-audio line.
 * 
 * @param  {String} line 
 * @param  {String} payload 
 * @return {String}
 * @api private
 */

function update(line, payload) {
  var elements = line.split(' ');
  var result = [];
  var index = 0;
  for(var i = 0, l = elements.length; i < l; i++) {
    var element = elements[i];
    // Format of media starts from the fourth.
    if(index === 3) result[index++] = payload;
    // Put target payload to the first.
    if(element !== payload) result[index++] = element;
  }
  return result.join(' ');
}


/**
 * Strip CN from the session description
 * before CN constraints is ready.
 * 
 * @param  {Array} lines
 * @param  {Number} index 
 * @return {Array}
 * @api private
 */

function remove(lines, index) {
  var elements = lines[index].split(' ');
    // Scan from end for the convenience of removing an item.
  for(var i = lines.length; i--;) {
    var payload = extract(lines[i], /a=rtpmap:(\d+) CN\/\d+/i);
    if(payload) {
      var cnPos = elements.indexOf(payload);
      if(cnPos !== -1) {
        // Remove CN payload from m line.
        elements.splice(cnPos, 1);
      }
      // Remove CN line in sdp
      lines.splice(i, 1);
    }
  }
  lines[index] = elements.join(' ');
  return lines;
}


});

require.register("hangout", function (exports, module) {

/**
 * Modules dependencies.
 * @api private
 */

var peer = require("bredele~peer@0.1.4");
var signal = require("bredele~signal@0.0.2");
var video = require("bredele~video@0.1.0");
var opus = require("bredele~opus@0.1.0");

module.exports = function(servers) {

	// initialize peer with stun and turn servers

	hangout = peer(JSON.parse(servers));


	// start handshake when video is captured

	hangout.on('stream', function() {
		hangout.use(signal('hangout'));
	});


	// display remote video when added

	hangout.on('remote stream', function(stream) {
		var video = document.querySelector('.you');
		video.src = window.URL.createObjectURL(stream);
		video.play();
	});


	// settings

	hangout.codec(opus);
	hangout.use(video('.me'));

};


});

require("hangout")
