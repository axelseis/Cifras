


var Cifras = Cifras || {};

Cifras.chars = Cifras.chars || [];

Cifras.Key = function()
{
	this.boardPos;

	this.type;
	this.value;
	this.keyW;

	this.char;
	this.back;

	this.col;
	this.row;

	this.callInPos;

	PIXI.DisplayObjectContainer.call(this);
}

Cifras.Key.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Cifras.Key.prototype.constructor = Cifras.Key;

Cifras.Key.prototype.init = function(callInPos) {
	var levelData = Cifras.LEVELSELDATA;
	var maxW = Math.min(Cifras.W,Cifras.H*0.6)
	
	this.callInPos = callInPos;
	this.keyW = Math.round((maxW*Math.min(1,levelData.columns*0.2))/levelData.columns);
		
	this.setKeyPos();
	this.boardPos = (this.col+1)+((this.row-1)*levelData.rows);
	
	this.pivot.x = this.pivot.y = this.keyW/2;

	this.setNewChar();
	Cifras.boardValues[this.type].push(this.value);		
};
Cifras.Key.prototype.setNewChar = function(ev){
	var keyW = this.keyW;
	var charW = Math.round(keyW*0.4);
	var levelData = Cifras.LEVELSELDATA;
	var skillSelData = Cifras.SKILLSELDATA;
	var tempBack = new PIXI.Graphics();
	
	if(this.parent.children.length == 1){
		var opsratio = levelData.opsRatio||levelData.columns-1
		var mix = [];
		var nb = {ops:[],nums:[]};

		for(var iV=0; iV<levelData.columns*levelData.rows; iV++){
			var type = nb.nums.length < nb.ops.length*opsratio ? 'nums' : 'ops';	
			var chars = type == 'ops' ? skillSelData.ops.slice() : levelData.nums.slice();
			var value = chars.splice(Math.floor(Math.random()*chars.length),1)[0];	
			
			while(nb[type].indexOf(value) != -1 && chars.length){
				value = chars.splice(Math.floor(Math.random()*chars.length),1)[0];	
			}
			nb[type].push(value);
			mix.push(value);
		}

		if(levelData.mixed){
	    	for(var j, x, i = mix.length; i; j = Math.floor(Math.random() * i), x = mix[--i], mix[i] = mix[j], mix[j] = x);
		}

		Cifras.initBoard = mix;
		Cifras.boardValues = {ops:[],nums:[]};
	}
	
	this.value = Cifras.initBoard.shift();
	this.type = this.type || (skillSelData.ops.indexOf(this.value) != -1 ? 'ops' : 'nums');

	if(!this.value){
		var chars = this.type == 'ops' ? skillSelData.ops.slice() : levelData.nums.slice();

		while(!this.value || (Cifras.boardValues[this.type].indexOf(this.value) != -1 && chars.length)){
			this.value = chars.splice(Math.floor(Math.random()*chars.length),1)[0];	
		}		
	}

	var tempChar = Cifras.getChar(this.value,charW);
	tempChar.tint = '0x' + skillSelData.color;

	tempChar.x = (keyW-tempChar.width)*0.5;
	tempChar.y = (keyW-tempChar.height)*0.5;
	
	tempBack.beginFill('0x' + skillSelData['color' + (this.type == 'ops' ? 1 : 1 + Math.ceil(Math.random()*2))]);
	tempBack.drawRect(keyW*0.01,keyW*0.01,keyW*0.98,keyW*0.98);
	tempBack.endFill();

	this.back = tempBack;
	this.char = tempChar

	this.removeChildren();
	
	this.addChild(tempBack);
	this.addChild(tempChar);	
};

Cifras.Key.prototype.goOut = function(callEvent){
	var levelData = Cifras.LEVELSELDATA;
	var tweenX = new Tween(this, "scale.x", 0.5, 243, true);
	var tweenY = new Tween(this, "scale.y", 0.5, 243, true);

	tweenX.easing = tweenY.easing = Tween.backInQuartic;
	var goInthis = this.goIn.bind(this);    	
	var _self = this
	tweenY.onComplete = function() {
		_self.goIn(callEvent);
	};    	
};

Cifras.Key.prototype.goIn = function(callEvent){
	var levelData = Cifras.LEVELSELDATA;
	
	if(levelData.candyMode){
		var prevKeyIndex = this.parent.getChildIndex(this) - levelData.columns+1;
		var prevKey;

		while(prevKeyIndex > 0){
			prevKey = this.parent.getChildAt(prevKeyIndex-1);

			this.parent.swapChildren(this,prevKey);
			prevKey.setKeyPos('0');

			prevKeyIndex -= levelData.columns;
		}

		if(prevKey){
			this.setKeyPos('0');
		}
	}

    if(levelData.killMode){
    	this.visible = false;
    	callEvent()
    }
    else {	
		var tweenX = new Tween(this, "scale.x", 1, 243, true);
		var tweenY = new Tween(this, "scale.y", 1, 243, true);
		var _self = this;

		tweenX.easing = tweenY.easing = Tween.backInQuartic;

		if(levelData.everNew){
			this.setNewChar();
		}

		callEvent();
    }
};

Cifras.Key.prototype.setKeyPos = function(inType,reverse){
	var inType = inType || Cifras.LEVELSELDATA.inType || ((Cifras.Data.levelsData.indexOf(Cifras.LEVELSELDATA)%3)+1).toString() + (Math.round(Math.random()*1) == 0 ? '_r' : '');
	var reverse = inType.toString().indexOf('_r') == -1 ? false : true;
	var keyW = this.keyW;
	var inc = Cifras.W*0.2;
	var levelData = Cifras.LEVELSELDATA;
	var itemsN = levelData.columns*levelData.rows
	var index = this.parent.getChildIndex(this);
	var actN = reverse ? itemsN - index-1 : index;
	var tmax = 227*(2/(itemsN/(2*(index+1)))) + 197;
	
	if (!Cifras.LEVELSELDATA.inType) {
		Cifras.LEVELSELDATA.inType = inType;
	};

	switch(inType.toString()){
		case '0': 
		case '0_r': 
			this.row = Math.ceil((actN+1)/levelData.rows);
			this.col = actN%levelData.columns;
			
			var tweenA = new Tween(this, "y", -keyW/2 + this.row*keyW, 243, true);
			tweenA.easing = Tween.inOutQuintic;				
		break;
		case '1': 
		case '1_r': 
			this.row = levelData.rows - Math.floor(actN/levelData.rows);
			this.col = actN%levelData.columns;
			
			this.x = this.col < levelData.columns/2 ?  - inc - Math.random()*inc : Cifras.W + inc + Math.random()*inc;
			this.y = -keyW/2 + this.row*keyW;

			var tweenA = new Tween(this, "x", keyW/2 + this.col*keyW, tmax, true);
			tweenA.easing = Tween.outBackCubic;				
		break;
		case '2': 
		case '2_r': 
			this.row = levelData.rows - Math.floor(actN/levelData.rows);
			this.col = this.row%2==0 ? actN%levelData.columns : levelData.columns - (actN%levelData.columns) -1;
			
			this.x = keyW/2 + this.col*keyW;
			this.y = reverse ? Cifras.H + keyW : -this.parent.height -keyW;

			var tweenA = new Tween(this, "y", -keyW/2 + this.row*keyW, tmax, true);
			tweenA.easing = Tween.inOutQuintic;				
		break;
		case '3': 
		case '3_r': 
			var spiralPoints = Cifras.Utils.spiral(levelData.columns,levelData.rows);
			var point = spiralPoints[actN];

			this.col = Math.floor(levelData.columns/2) - (1-levelData.columns%2) + point[0];
			this.row = Math.ceil(levelData.rows/2) + point[1];

			this.x = this.col < levelData.columns/2 ?  - inc - keyW : Cifras.W + inc + Math.random()*inc;
			this.y = this.row < levelData.rows/2 ?  -this.parent.height -keyW -inc: this.parent.height + keyW + inc;

			var tweenA = new Tween(this, "x", keyW/2 + this.col*keyW, tmax, true);
			tweenA.easing = Tween.inOutQuintic;				
			var tweenY = new Tween(this, "y", -keyW/2 + this.row*keyW, tmax, true);
			tweenY.easing = Tween.outQuintic;				
		break;
	}

	if(itemsN - index == 1 && inType && this.callInPos){
		tweenA.onComplete = this.callInPos;
		this.callInPos = null
	}
};
	

