


var Cifras = Cifras || {};

Cifras.Game = (function(){
	var clip;
	var keysContainer;
	var matchesContainer;

	var result, resultW;

	var levelData;
	var skillSelData;

	var inited;
	var matchesCols, matchW;
	var creatingKeys, creatingMatches;
	var endingMatch;

	var expr, actExpr, actValue;
	var actTemplate, actPos;
	var actMatch = 0;
	var actResult;

	var timerContainer;
	var backButton;

	var tocaNum;

	function createKeys(){
		if(!keysContainer){
			keysContainer = new PIXI.DisplayObjectContainer();
			keysContainer.y = Cifras.H-Cifras.W;
			clip.addChild(keysContainer);
		}
		else{
			keysContainer.removeChildren();
		}

		creatingKeys = true;
	};
	
	function createKey(){
		var tempKey = new Cifras.Key();

		keysContainer.addChild(tempKey);
		if(keysContainer.children.length == levelData.columns*levelData.rows){
			tempKey.init(createMatches.bind(this));
		}
		else tempKey.init();

		keysContainer.x = (Cifras.W-(tempKey.keyW*levelData.columns))/2;
		keysContainer.y = (Cifras.H*2-Cifras.W-(tempKey.keyW*levelData.columns))/2;

		if(keysContainer.children.length == levelData.columns*levelData.rows){
			creatingKeys = false;
		}
	};
	
	function activatekeys(){
		var keysArr = [];

		for (var i = 0; i < keysContainer.children.length; i++) {
			keysArr.push(keysContainer.children[i]);
		}

		for (var ik = 0; ik < keysArr.length; ik++) {
			var tempKey = keysArr[ik];
			
			if(tempKey.boardPos != ik+1){
				var keyAtPos = keysContainer.getChildAt(tempKey.boardPos-1);
				keysContainer.swapChildren(tempKey,keyAtPos);
			}
			
			tempKey.interactive = true;
			
			tempKey.mousedown = tempKey.touchstart = function(ev){
				
				if(!endingMatch && (this.type == 'nums' && tocaNum || this.type == 'ops'  && !tocaNum)){
					Cifras.boardValues[this.type].splice(Cifras.boardValues[this.type].indexOf(this.value),1);
					
					endingMatch = addCharToExpr(this.value,this.type);
					this.interactive = false;
					tocaNum = !tocaNum;
										
					if(endingMatch){
						endMatch();
					}
					else if(!timerContainer.playing){
						timerContainer.playing = true;
						timerContainer.initTime = Cifras.getT();
					}

					var _self = this;
					this.goOut(function(ev) {
						if(!levelData.fitTemplate && actPos > 1){
							expr.setText(evalExpr(actExpr));
							expr.x = (Cifras.W-expr.width)/2;
						}
						if(!levelData.killMode){
							_self.interactive = true;
							Cifras.boardValues[_self.type].push(_self.value);		
						}
					});
				}

			    ev.originalEvent.preventDefault();	
			}
		}
	};

	function addCharToExpr(newChar,charType){
		var ended = false;

		if(levelData.fitTemplate){
			while(actPos < actTemplate.length && '( )'.indexOf(actTemplate.charAt(actPos)) != -1){
				actPos++;
			}
			
			actExpr = actPos == 0 ? '' : actExpr.slice(0,actExpr.length-(actTemplate.length-actPos));
			actExpr += newChar + actTemplate.slice(actPos+1);
			
			actPos++;

			if (actPos > 1) {
				var lastPos = actTemplate.length;
				while('( )'.indexOf(actTemplate.charAt(lastPos)) != -1){
					lastPos--;
				}

				if(actPos > lastPos){
					ended = true;
				}
			};
		}

		else{		
			actPos++;
			if(charType == 'nums'){
				actExpr += newChar;
				if(actPos>1 && evalExpr(actExpr) == result.value){
					ended = true;
				}
			}
			else if(actPos > 1){
				actExpr = evalExpr(actExpr) + newChar;
				actPos = 1;
			}
			else{
				actExpr += newChar;
			}
		}

		expr.setText(actExpr);
		expr.x = (Cifras.W-expr.width)/2;

		return ended;
	};

	function evalExpr(express){
		return(Math.round(eval(express)*10)/10);
	}

	function getRandomResult(pos){
		var pos = pos || 0;
		var tempExp = '';
		var nums = Cifras.boardValues.nums.slice();
		var ops = Cifras.boardValues.ops.slice();
		var min = levelData.range ? levelData.range[0] : 0;
		var max = levelData.range ? levelData.range[1] : 100;
		var value = 0;

		for (var i = 0; i < actTemplate.length; i++) {
			var tempChar = actTemplate.charAt(i);
			if(tempChar == '_'){
				var tempN = nums.splice(Math.floor(Math.random()*nums.length),1)[0];
				tempExp += tempN;
				if (!levelData.fitTemplate) {
					value = evalExpr(value+tempN);
				}
			}
			else if(tempChar == 'o'){
				var tempN = ops.splice(Math.floor(Math.random()*ops.length),1)[0];
				tempExp += tempN;
				if (!levelData.fitTemplate) {
					value = value+tempN;
				}
			}
			else{
				tempExp += tempChar;
			}
		}

		value = value || evalExpr(tempExp)

		if((value < min || value > max || value == 0 || value == result.value) && pos < 1000){
			value = getRandomResult(pos+1);
		}
		else{			
			console.log('tempExp ' , tempExp);
		}
		return value;
	};

	function endMatch(){
		var wins = result && evalExpr(actExpr) == result.value;
		var lastObj = matchesContainer.children[actMatch];
		
		if(!wins && levelData.fitTemplate){		
			expr.setText(evalExpr(actExpr));
			expr.x = (Cifras.W-expr.width)/2;
		}

		result.goOut(wins,function(){		
			if(wins) actMatch++;
			if(Cifras.boardValues.nums.length && actMatch < matchesContainer.children.length){
				initMatch();
			}
			else{
				endGame();
			}
		})
	};

	function initMatch(){
		var actObj = matchesContainer.children[actMatch];
	
		if(actObj){
			actTemplate = levelData.killMode ? levelData.templates[actMatch%levelData.templates.length] : levelData.templates[Math.floor(Math.random()*levelData.templates.length)];
	    	actValue = null;
			endingMatch = false;

			result.setResult(getRandomResult());	
			result.goIn(actObj,function(){
				if(!inited){
					inited = true;
					activatekeys();
				}
			});

			tocaNum = true;

	    	actExpr = '';
			actPos = 0;
	    	
	    	if(levelData.fitTemplate){
	    		actExpr = actTemplate;
	    	}

			if(!expr){
				expr = new PIXI.Text(actExpr,{ font: ((Cifras.H-Cifras.W)*0.15) + "px cifras", fill: '#' + skillSelData.color4});
				clip.addChild(expr);
			}
			else{
		    	expr.setText(actExpr);
		    	expr.setStyle({ font: ((Cifras.H-Cifras.W)*0.15) + "px cifras", fill: '#' + skillSelData.color4});
		    }
			
			expr.y = keysContainer.y - ((Cifras.H-Cifras.W)*0.25);
			expr.x = (Cifras.W-expr.width)/2;
		}
	};

	function createMatches(){
		var minW = Cifras.W*0.04;
		var maxH = (Cifras.H-Cifras.W);
		var maxW = Cifras.W*0.8;
		
		matchesCols = Math.min(Math.floor(maxW/minW),levelData.stars[2]);
		var rows = Math.floor(levelData.stars[2]/matchesCols);
		matchW = Math.min(maxH*0.20, maxW/matchesCols);
		
		if(!matchesContainer){
			matchesContainer = new PIXI.DisplayObjectContainer();
			matchesContainer.y = maxH*0.7;
			clip.addChild(matchesContainer);

		    matchesContainer.interactive = true;
		}
		else{
			matchesContainer.removeChildren();
		}

		actMatch = 0;
		creatingMatches = true;
	}

	function createMatch(){
		var tempMatch = new Cifras.Match();
		var iN = matchesContainer.children.length;
		var callFunc;

		if(iN+1 == levelData.stars[2]){
			callFunc = function() {
				initTimer();
				initBackBut();

				initMatch();
			}
			creatingMatches = false;
		}

		matchesContainer.addChild(tempMatch);
		tempMatch.init(matchW,matchesCols,callFunc);

		matchesContainer.y = (keysContainer.y-matchW*Math.floor(iN/matchesCols)*0.2)*0.58;
		matchesContainer.x = (Cifras.W-matchesContainer.width)/2;
	}

	function endGame(){
		var tempContainer = new PIXI.DisplayObjectContainer();
		var lastPos = Math.max(0,Math.min(matchesContainer.children.length-1,actMatch));
		var actObj = matchesContainer.children.length ? matchesContainer.getChildAt(lastPos) : null;
		var stars, time;
		var callResult;

		backButton.interactive = false;
		timerContainer.playing = false;
		
		if(expr)expr.setText('');
		actExpr = null;

		while(!actObj.wins && lastPos){
			lastPos--;
			actObj = matchesContainer.getChildAt(lastPos);
		}

		if(lastPos == 0 && !actObj.wins){
			stars = 0;
		}
		else{
			stars = levelData.stars.indexOf(lastPos+1);
			while(stars == -1 && lastPos){
				lastPos--;
				stars = levelData.stars.indexOf(lastPos+1);
			}
			stars ++;
		}

		if(stars){
			result.goOut(null, function(){
				tempContainer.x = 0;
				tempContainer.y = 0;

				clip.parent.addChild(tempContainer);

				var timeObj = timerContainer.time;
				var timeX = timerContainer.x + timeObj.x;
				var timeY = timerContainer.y + timeObj.y;
				var timeW = timeObj.width;
				var timeH = timeObj.height;
				
				timeObj.setStyle({font: Cifras.H*0.15 + "px cifras", fill: '#ffffff'});
				if(stars == 3){
					timeObj.tint = '0x' + Cifras.SKILLSELDATA.color5;
				}
				timerContainer.time = null;
				tempContainer.addChild(timeObj);

				timeObj.x = timeX;
				timeObj.y = timeY;
				timeObj.scale.x = timeW/timeObj.width;
				timeObj.scale.y = timeH/timeObj.height;

				timeObj.pivot.x = timeObj.width;
				timeObj.pivot.y = timeObj.height*0.5;

				var endX = (Cifras.W - timeObj.width*1.2)/2;
				var endY = Cifras.H*0.25;
				var maxT = 657;

				var tweenSX = new Tween(timeObj, "scale.x", 1, maxT, true);
				var tweenSY = new Tween(timeObj, "scale.y", 1, maxT, true);
				var tweenX = new Tween(timeObj, "x", endX, maxT, true);
				var tweenY = new Tween(timeObj, "y", endY, maxT, true);

				tweenSX.easing = tweenSY.easing = tweenX.easing = tweenY.easing = Tween.inOutQuintic;	
				
				var tweenA = new Tween(timerContainer, "alpha", 0, maxT, true);
				tweenA.easing = Tween.outQuintic;	

				for (var i = 0; i < levelData.stars.length; i++) {
					var tempStar = matchesContainer.children[levelData.stars[i]-1-i]
					var oldX = tempStar.x + matchesContainer.x;
					var oldY = tempStar.y + matchesContainer.y;
					var callFunc;

					tempContainer.addChild(tempStar);
					tempStar.x = oldX;
					tempStar.y = oldY;
					
					if(i == levelData.stars.length-1){
						tempStar.goWin(i, function(){
							goOut(stars,timeObj.text,tempContainer);
						});
					}
					else{
						tempStar.goWin(i,null);
					}
				}

				matchesContainer.removeChildren();
			});
		}
		else{
			result.goOut();
			goOut(0,0);
		}

		var tweenA = new Tween(backButton, "alpha", 0, 365, true);
		tweenA.easing = Tween.outQuintic;	
	};

	function goOut(stars,time,tempContainer){
		var maxT = tempContainer ? 825 : 453;

		var tweenA = new Tween(clip, "alpha", 0, maxT, true);
		tweenA.easing = Tween.outQuintic;	

		tweenA.onComplete = function(ev) {
			Cifras.Levels.endLevel(stars,time);
			
			if(tempContainer){
				var tweenA = new Tween(tempContainer, "alpha", 0, 278, true);
				tweenA.easing = Tween.inQuintic;

				tweenA.onComplete = function() {
				    clip.visible = false;
				    clip.renderable = false;

					timerContainer.visible = false;
					matchesContainer.removeChildren();
				    
				    tempContainer.removeChildren();
				    clip.removeChild(tempContainer);					
				}
			}
			else{
			    clip.visible = false;
			    clip.renderable = false;

				timerContainer.visible = false;
				matchesContainer.removeChildren();
			}
		}
	};

	function initBackBut(){
		if(!backButton){
			backButton = Cifras.getChar('F',Cifras.H*0.05);
			backButton.x = Cifras.W*0.02;
			backButton.y = Cifras.H*0.01;

		    backButton.mousedown = backButton.touchstart = endGame;
		    clip.addChild(backButton);
		}

		backButton.tint = '0x' + Cifras.SKILLSELDATA.color4;
		backButton.interactive = true;	

		var tweenA = new Tween(backButton, "alpha", 1, 376, true);
		tweenA.easing = Tween.outQuintic;	
	};

	function initTimer(){
		var charW = Cifras.H*0.05;
		var timeStr = levelData.maxTime ? levelData.maxTime > 0 ? '+' + levelData.maxTime : levelData.maxTime : '0:00';

		if(!timerContainer){
			var tempIcon = Cifras.getChar('E',charW);

			timerContainer = new PIXI.DisplayObjectContainer();
			timerContainer.x = Cifras.W*0.98;
			timerContainer.y = Cifras.H*0.01;

			timerContainer.icon = tempIcon;

			timerContainer.addChild(tempIcon);
			
			clip.addChild(timerContainer);

			tempIcon.x = -tempIcon.width;
		}

		if (!timerContainer.time) {
			var tempText = new PIXI.Text(timeStr, {font: charW*0.9 + "px cifras", fill: '#ffffff'});
			timerContainer.time = tempText;
			timerContainer.addChild(tempText);
			tempText.x = -timerContainer.icon.width*1.2-tempText.width;
		}

		else{
			timerContainer.time.setStyle({font: charW*0.9 + "px cifras", fill: '#ffffff'})
			timerContainer.time.setText(timeStr);
		}

		timerContainer.icon.tint = '0x' + Cifras.SKILLSELDATA.color4;
		timerContainer.time.tint = '0x' + Cifras.SKILLSELDATA.color4;

		timerContainer.visible = true;
		timerContainer.alpha = 0;

		var tweenA = new Tween(timerContainer, "alpha", 1, 354, true);
		tweenA.easing = Tween.outQuintic;
	};

	function secsToString(seconds){
	    var hours   = Math.floor(seconds / 3600);
	    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
	    var seconds = seconds - (hours * 3600) - (minutes * 60);

	    if (seconds < 10) {seconds = "0"+seconds;}
	    
	    return minutes+':'+seconds;
	};

	function setTime(t){
		var secs = Math.round((t - timerContainer.initTime)/1000);
		var secsStr = secsToString(secs);

		if(levelData.maxTime){
			secs = levelData.maxTime - secs;
			secsStr = (secs > 0 ? '+' : '') + secs.toString();
		}

		timerContainer.time.setText(secsStr);
		timerContainer.time.x = -timerContainer.icon.width*1.2-timerContainer.time.width;
	};

	return{
		init: function(stage){
			clip = new PIXI.DisplayObjectContainer();

			result = new Cifras.Result();
			result.init();
			clip.addChild(result);
			result.visible = false;

		    stage.addChild(clip);
		    
		    clip.visible = false;
		    clip.renderable = false;
		},

		play: function(){
		    levelData = Cifras.LEVELSELDATA;
		    skillSelData = Cifras.SKILLSELDATA;

		    clip.visible = true;
		    clip.renderable = true;
			clip.alpha = 1;
		    inited = false;

		    createKeys();
		},

		update: function(time){
			if(creatingMatches){
				createMatch();
			}
			if(creatingKeys){
				createKey();
			}
			if(timerContainer && timerContainer.playing){
				setTime(time);
			}
		}
	};
})();


