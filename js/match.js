


var Cifras = Cifras || {};

Cifras.chars = Cifras.chars || [];

Cifras.Match = function() {
	this.isStar;
	this.wins;

	PIXI.DisplayObjectContainer.call(this);
}

Cifras.Match.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Cifras.Match.prototype.constructor = Cifras.Match;

Cifras.Match.prototype.init = function(matchW,matchesCols,callFunc) {
	var levelData = Cifras.LEVELSELDATA;
	var skillSelData = Cifras.SKILLSELDATA;

	var iN = this.parent.children.length-1
	var nStar = levelData.stars.indexOf(iN+1)+1;
	var isStar = nStar > 0;	
	var charId = isStar ? 'I' : 'C'
	var charW = Math.round(matchW * (isStar ? 1 : 0.84));
	var tempChar = Cifras.getChar(charId,charW);

	tempChar.tint = '0x' + skillSelData.color4;

	this.addChild(tempChar);

	this.x = matchW*(iN%matchesCols+1)-matchW+(matchW*(isStar ? 0 : 0.12));
	this.y = Math.floor(iN/matchesCols)*matchW+(matchW*(isStar ? 0 : 0.12));
	
	this.alpha = 0;
	this.isStar = isStar;

	var tmax = isStar ? 400*nStar : 400;
	var tweenA = new Tween(this, "alpha", 1, tmax, true);
	tweenA.easing = isStar ? Tween.easeInOutElastic : Tween.outElastic;	

	tweenA.onComplete = callFunc;
};

Cifras.Match.prototype.goWin = function(posWin,callFunc) {
	var tmax = 720;
	var endW = (Cifras.W*0.15);
	var endS = endW/this.width;

	var endX = (Cifras.W*0.5)-this.parent.x+((posWin-1)*endW*1.2);
	var endY = (Cifras.H*0.48)-this.parent.y;

	this.pivot.x = this.width*0.5;
	this.pivot.y = this.height*0.5

	var tweenX = new Tween(this, "x", endX, tmax, true);
	var tweenY = new Tween(this, "y", endY, tmax, true);
	
	var tweenSX = new Tween(this, "scale.x", endS, tmax, true);
	var tweenSY = new Tween(this, "scale.y", endS, tmax, true);
	
	tweenX.easing = Tween.inOutQuintic;
	tweenX.easing = tweenY.easing = tweenSX.easing = tweenSY.easing = Tween.outQuintic;

	if(callFunc) tweenX.onComplete = callFunc;	
}

