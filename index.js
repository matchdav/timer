var Emitter = require('emitter');
var inherits = require('inherits');

function Timer(limit, wait){
	Emitter.call(this);
	this.limit = parseInt(limit) || 0;;
	this.__started = false;
	this.running = false;
	this.__ended = false;
	this.__expired = false;
	this.log = [];
	var _this = this;
	if(!wait) setTimeout(function(){
		_this.start()
	},0);
}

inherits(Timer,Emitter);

Timer.prototype.now = function() {
	return (new Date(Date.now())).getTime();
};

Timer.prototype.start = function(){

	var _this = this;

	_this.running = true;
	_this.__started = this.now();

	function tick(){
		if(!_this.running) return;
		var time = _this.now();
		if(_this.limit + _this.__started >= time) {
			_this.expire();
		} else _this.emit('tick',time);
	}
	_this.clock = setInterval(tick,5);

	_this.emit('started');
	
	return _this;
};

Timer.prototype.expire = function() {
	this.__expired = true;
	this.stop(null);
	return this;
};

Timer.prototype.capture = function (data) {
	if (!this.running) return false;
	var _event = {time:this.now(),data:data};
	this.log.push(_event);
	this.emit('captured',_event);
	this.emit('queue change',this.log);
	return this;
}

Timer.prototype.lap = Timer.prototype.capture;

Timer.prototype.stop = function(data) {
	if (!this.running) return;
	clearInterval(this.clock);
	if(data) this.capture(data);
	this.__ended = this.now();
	this.running = false;
	this.emit('stopped',this);
	return this;
};

module.exports = Timer;
