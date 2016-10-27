/*
Copyright (c) 2013 Marian Euent

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/


/*
	@param {Object} object: Any object you want to tween. For example: PIXI.Sprite
	@param {String} property: the property which needs to be changed. Use "property.property.property..." if the property is little deeper. Pass "" to create a Wait-Tween
	@param {float} value: targetValue of tweening
	@param {int} frames: duration of the tween in frames.
	@param {boolean} autostart: starting when created? Set to false if you use it with ChainedTween
	
	use examples:
	new Tween(sprite, "position.x", 100, 60, true);
	new Tween(sprite.position, "x", 100, 60, true);
	
*/
function Tween(object, property, value, totalTime, autostart){
	this.object = object;
	
	var properties = property.split(".");
	this.property = properties[properties.length-1];
	for(var i=0;i<properties.length -1; i++){
		this.object = this.object[properties[i]]
	}
	
	this.targetValue = value;
	this.startValue;
	this.active = autostart;
	this.initT;
	this.totalT = totalTime;
	this.onComplete;
	this.onCompleteParams;
	this.easing = Tween.noEase;
	
	Tween.tweens.push(this);
}

Tween.prototype.setOnComplete = function(callback, parameters){
	this.onComplete = callback;
	this.onCompleteParams = parameters;
}

Tween.prototype.start = function(){
	this.active = true;
}

Tween.prototype.initIterations = function(){
	if(this.property != ""){
		this.initT = Cifras.getT();
		this.startValue = this.object[this.property];
		this.targetValue = this.targetValue - this.startValue;
	}
}

Tween.prototype.update = function(){
	if(!this.active){
		return false;
	}

	if(this.initT == null){
		this.initIterations();
	}

	var actT = Cifras.getT();
	if(actT-this.initT <= this.totalT){
		if(this.property != ""){
			var newValue = this.easing(actT-this.initT, this.startValue, this.targetValue, this.totalT);
			this.object[this.property] = newValue;
		}
		return false;
	}
	else{
		this.active = false;
		this.object[this.property] = this.targetValue+this.startValue;
		if(this.onComplete != null){
			this.onComplete(this.onCompleteParams);
			
		}
		return true;
	}
}

Tween.prototype.remove = function(){
	var index = Tween.tweens.indexOf(this);
	if(index != -1){
		Tween.tweens.splice(index, 1);
	}
}

Tween.tweens = [];
// Call this every Frame of your Game/Application to keep the tweens running.
Tween.runTweens = function(){
	for(var i=0;i < Tween.tweens.length;i++){
		var tween = Tween.tweens[i];
		if(tween.update()){
			var index = Tween.tweens.indexOf(tween);
			if(index != -1){
				Tween.tweens.splice(index, 1);
			}
			i--;
		}
	}
};

// EASING
// use example:
// var tween = new Tween(sprite, "alpha", 0, 60, true);
// tween.easing = Tween.outElastic;

Tween.noEase = function(t, b, c, d) {
	t/=d;
	return b+c*(t);
}

Tween.outElastic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(34*tc*ts + -109*ts*ts + 129*tc + -68*ts + 15*t);
}

Tween.outInQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(6*tc + -9*ts + 4*t);
};

Tween.outBackCubic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(4*tc + -9*ts + 6*t);
}

Tween.inElastic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(56*tc*ts + -105*ts*ts + 60*tc + -10*ts);
}

Tween.inOutQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(6*tc*ts + -15*ts*ts + 10*tc);
}

Tween.inQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc*ts);
}

Tween.outQuintic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc*ts + -5*ts*ts + 10*tc + -10*ts + 5*t);
}

Tween.inCubic = function(t, b, c, d) {
	var tc=(t/=d)*t*t;
	return b+c*(tc);
}

Tween.inOutCubic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(-2*tc + 3*ts);
}

Tween.outCubic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(tc + -3*ts + 3*t);
}

Tween.inBounce = function (t, b, c, d) {
	return c - Tween.outBounce (d-t, 0, c, d) + b;
};

Tween.outBounce = function (t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
};

Tween.backInQuartic = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(4*tc + -3*ts);
};

Tween.backInAx = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(-8*tc*ts + 31*ts*ts + -44*tc + 26*ts + -4*t);
};

Tween.elasticOutAx = function(t, b, c, d) {
	var ts=(t/=d)*t;
	var tc=ts*t;
	return b+c*(25.5*tc*ts + -78*ts*ts + 88*tc + -45*ts + 10.5*t);
};

Tween.easeInOutSine = function (t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
};

Tween.easeInOutElastic = function(t, b, c, d, a, p) {
    var a = a || 1;
    var p = p || 100;
    var s;
    if(t==0) return b;  if((t/=d/2)==2) return b+c;  if(!p) p=d*(.3*1.5);
    if(!a || a < Math.abs(c)) { a=c; s=p/4; }       else s = p/(2*Math.PI) * Math.asin(c/a);
    if(t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin((t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

    Tween.easeInOutBack = function(t, b, c, d, s) {
        if(s == undefined) s = 1.70158;
        if((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },    

Tween.easings = [Tween.outBounce,Tween.inBounce,Tween.inOutCubic,Tween.outCubic,Tween.outQuintic,Tween.inOutQuintic,Tween.inElastic,Tween.outElastic,Tween.noEase];
Tween.nobounces = [Tween.inOutCubic,Tween.outCubic,Tween.outQuintic,Tween.inOutQuintic];
Tween.inouts = [Tween.inOutCubic,Tween.inOutQuintic];
Tween.ins = [Tween.inBounce,Tween.inElastic];
Tween.outs = [Tween.outBounce,Tween.outCubic,Tween.outQuintic,Tween.outElastic];

Tween.randomEase = function(type){
	switch(type){
		case 'all':
			return this.easings[Math.floor(Math.random()*this.easings.length)];
		break;
		case 'ins':
			return this.ins[Math.floor(Math.random()*this.ins.length)];
		break;
		case 'outs':
			return this.outs[Math.floor(Math.random()*this.outs.length)];
		break;
		case 'inouts':
			return this.inouts[Math.floor(Math.random()*this.inouts.length)];
		break;
		case 'nobounces':
			return this.nobounces[Math.floor(Math.random()*this.nobounces.length)];
		break;
	}
}