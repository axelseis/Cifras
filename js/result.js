


var Cifras = Cifras || {};

Cifras.Result = function() {
	this.star;
	this.circ;
	this.text;
	
	this.backW;

	this.color;
	this.value = '';
	this.actMatch;

	this.matchX;
	this.matchY;
	this.matchSX;
	this.matchSY;

	PIXI.DisplayObjectContainer.call(this);
}

Cifras.Result.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Cifras.Result.prototype.constructor = Cifras.Result;

Cifras.Result.prototype.init = function() {
	var backW = this.backW = Math.ceil((Cifras.H-Cifras.W)*0.56);
	var tempStar = Cifras.getChar('J',backW);
	var tempCirc = Cifras.getChar('K',backW);
	var charW = Math.round(backW*(0.6 - this.value.toString().length*0.15));
	var tempText = new PIXI.Text(this.value,{ font: charW + "px cifras", fill: '#ffffff'});
	var tempT = new PIXI.DisplayObjectContainer();

	this.removeChildren();

	tempT.addChild(tempStar);
	tempStar.pivot.x = tempT.width*0.5;
	tempStar.pivot.y = tempT.height*0.5;

	tempT.removeChildren();

	tempT.addChild(tempCirc);
	tempCirc.pivot.x = tempT.width*0.5;
	tempCirc.pivot.y = tempT.height*0.5;

	tempT.removeChildren();

	tempT.addChild(tempText);
	tempText.pivot.x = tempT.width*0.50;
	tempText.pivot.y = tempT.height*0.50;

	tempT.removeChildren();

	this.star = tempStar;
	this.circ = tempCirc;
	this.text = tempText;

	this.addChild(tempStar);
	this.addChild(tempCirc);
	this.addChild(tempText);
};

Cifras.Result.prototype.setResult = function(value) {
	this.value = value;

	if(!this.backW){
		this.init();
	}
	else{
		var tempT = new PIXI.DisplayObjectContainer();
		var charW = Math.round(this.backW*(0.5 - this.value.toString().length*0.10));
		
		this.text.setStyle({ font: charW + "px cifras", fill: '#ffffff'});
		this.text.setText(value);
		
		tempT.addChild(this.text);
		this.text.pivot.x = tempT.width*0.51;
		this.text.pivot.y = tempT.height*0.45;

		tempT.removeChildren();
		this.addChild(this.text);
	}

	if(this.color != Cifras.SKILLSELDATA.color4){
		this.color = Cifras.SKILLSELDATA.color4;
		this.text.tint = this.star.tint = this.circ.tint = '0x' + this.color;
	}
}

Cifras.Result.prototype.goOut = function(wins,callFunc) {
	var tmax = 400;
	
	if(this.actMatch){	
		var matchIcon = this.actMatch.children[0];
		var _self = this;
		
		if (wins) {
			this.text.tint = this.star.tint = this.circ.tint = '0x' + Cifras.SKILLSELDATA.color5;
		}

		var tweenX = new Tween(this, "x", this.matchX, tmax, true);
		var tweenY = new Tween(this, "y", this.matchY, tmax, true);
		
		var tweenSX = new Tween(this, "scale.x", this.matchSX, tmax, true);
		var tweenSY = new Tween(this, "scale.y", this.matchSX, tmax, true);
		
		tweenX.easing = tweenY.easing = tweenSX.easing = tweenSY.easing = Tween.inOutQuintic;
		
		tweenX.onComplete = function(){
			matchIcon.parent.wins = wins;
			
			if(wins){
				matchIcon.tint = '0x' + Cifras.SKILLSELDATA.color5;
			}
			else{
				matchIcon.tint = '0x' + Cifras.SKILLSELDATA.color4;
			}
			
			matchIcon.parent.visible = true;
			_self.visible = false;

			if(callFunc) callFunc();
		}	

		this.actMatch = null;
	}
	else if (callFunc) {
		callFunc();
	}
}

Cifras.Result.prototype.goIn = function(match,callFunc) {
	var backW = this.backW;
	var endX = (Cifras.W)*0.5;				
	var endY = (match.parent.y)/2;
	var tmax = 400;
	
	this.actMatch = match;
	this.x = this.matchX = match.x+match.parent.x+(match.width*0.5);				
	this.y = this.matchY = match.y+match.parent.y+(match.height*0.5);
	
	if(match.isStar){
		this.star.visible = true;
		this.circ.visible = false;
	}
	else{
		this.star.visible = false;
		this.circ.visible = true;
	}

	this.text.tint = this.star.tint = this.circ.tint = '0x' + Cifras.SKILLSELDATA.color4;
	this.height = match.height;				

	this.scale.x = this.matchSX = this.matchSY = this.scale.y;

	this.visible = true;
	match.visible = false;

	var tweenX = new Tween(this, "x", endX, tmax, true);
	var tweenY = new Tween(this, "y", endY, tmax, true);
	
	var tweenSX = new Tween(this, "scale.x", 1, tmax, true);
	var tweenSY = new Tween(this, "scale.y", 1, tmax, true);
	
	tweenX.easing = tweenY.easing = tweenSX.easing = tweenSY.easing = Tween.inOutQuintic;

	tweenX.onComplete = callFunc;
}