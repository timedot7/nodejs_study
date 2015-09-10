var events = require('events');
function CarShow(){
	events.EventEmitter.call(this);
	this.seeCar = function(make){
		this.emit('sawCar',make);
	}
}