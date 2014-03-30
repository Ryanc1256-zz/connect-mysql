/*! 
* Connect - mysql
* Copyright(c) 2014 Ryan Clough <ryanc1256@gmail.com>
* MIT Licensed
*/

var oneDay = 86400;

module.exports = function(session){
	var Store = session.Store;

	

	function mysqlStore(options){
		var self = this;
		options = options || {};
		Store.call(this, options);
		this.prefix = null || options.prefix ? 'sess:' : options.prefix;			
		this.client = options.client || new require('mysql').createConnection({host: options.host, user: options.user, password: options.password});
		
		if (this.client){
			this.client.connect();
		}

		this.table = options.table ? 'sessions' : options.table;

		if ( this.table ) {

		}
		self.client.on('error', function(){self.emit('disconnect')});
		self.client.on('connection', function(err, value){console.log(err); self.emit('connect')});
	};

	mysqlStore.prototype.__proto__ = Store.prototype;

	mysqlStore.prototype.get = function(sid, fn){
		console.log(sid);
		sid = this.prefix + sid;
		this.client('session', function(err, data){
			if (err){
				return fn(err);w
			}
			if (!data){return fn()}
			var result;
			try {
				result = JSON.parse(data);
			} catch (e){
				return fn(e);
			}
			return fn(null, result);
		});
	};

	mysqlStore.prototype.set = function(sid, sess, fn){
		sid = this.prefix + sid;
		try {
			var maxAge = sess.cookie.maxAge,
				ttl = this.ttl,
				sess = JSON.stringify(sess);

			ttl = ttl || ('number' == typeof maxAge ? maxAge / 1000 | 0 : oneDay);

			//this.
		} catch (e){
			fn && fn(e);
		}
	};

	mysqlStore.prototype.destroy = function(sid, fn){
		sid = this.prefix + sid;
		this.client.del(sid, fn);
	};

	return mysqlStore;
}