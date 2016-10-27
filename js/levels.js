


var Cifras = Cifras || {};

Cifras.Levels = (function(){
	var clip;
	var back;
	
	var levelW;

	var levelsContainer;
	var levelSel;
	var pageAct = 0;

	var skillsContainer;
	var skillSel;
	var skillSelData;

	var buttonsContainer;
	var pageText;

	localStorage.clear();
	console.log('localStorage["userData"] ' , localStorage["userData"]);

	var skillsData = Cifras.Data.skillsData;
	var userData = localStorage["userData"] ? JSON.parse(localStorage["userData"]) : Cifras.Data.userData;
	var levelsData = Cifras.Data.levelsData;
	
	var starText;

	function setBackColor(color){
		back.clear();
		back.beginFill('0x' + color);
		back.drawRect(0,0,Cifras.W,Cifras.H);
	};

	function createSkills(){
		var skillW = Cifras.W/skillsData.length;
		var skillH = Math.min(skillW, Cifras.H*0.20);

		for (var i = 0; i < skillsData.length; i++) {
			var tempSkill = new PIXI.DisplayObjectContainer();
			var tempBack = new PIXI.Graphics();
			var tempIcon = PIXI.Sprite.fromFrame('image/' + skillsData[i].icon);

			tempBack.lineStyle(1,0x000000);
			tempBack.beginFill('0x' + skillsData[i].color);
			tempBack.drawRect(0,0,skillW,skillH);

			tempSkill.addChild(tempBack);
			
			tempIcon.scale.x = tempIcon.scale.y = skillW*0.4/tempIcon.width;
			tempIcon.x = (skillW-tempIcon.width)/2;
			tempIcon.y = (skillH-tempIcon.height)/2;
			tempIcon.alpha = 0.5;

			tempSkill.addChild(tempIcon);
			
			tempSkill.x = (skillW*i) - 1+i;
			
			tempSkill.icon = tempIcon;
			tempSkill.back = tempBack;
			tempSkill.skillId = i;

			tempSkill.buttonMode = true;
			tempSkill.interactive = true;
			tempSkill.mousedown = tempSkill.touchstart = onSelectSkill;

			skillsContainer.addChild(tempSkill);
			
		};

		clip.addChild(skillsContainer);
	};
	
	function drawLevelStars(tempLevel){
		if(!tempLevel.stars){
			var stars = new PIXI.DisplayObjectContainer();
			
			stars.y = levelW*0.65;
			tempLevel.stars = stars
			tempLevel.addChild(stars);
		}
		else{
			tempLevel.stars.visible = true;
		}

		if(tempLevel.stars.children){
			tempLevel.stars.removeChildren();
		}
		
		for (var iS = 0; iS < 3; iS++) {
			var tempStar = Cifras.getChar('I',Math.round(levelW*0.27));

			tempStar.x = levelW*0.08 + (levelW*0.3)*iS;
			tempStar.tint = '0x' + (userData.levels[skillSel.skillId][tempLevel.levelId][0] > iS ? skillSelData.color4 : skillSelData.color);

			tempLevel.stars.addChild(tempStar);
		}
	};

	function setLevelActive(tempLevel){		
		var actTime = userData.levels[skillSel.skillId][tempLevel.levelId][1] || '0';

		if(!tempLevel.num){
	        var tempNum = new PIXI.Text(actTime, { font: Math.round(levelW*0.4) + "px cifras", fill: '#' + skillSelData.color});
			tempNum.y = levelW*0.1;
			
			tempLevel.num = tempNum;
			tempLevel.addChild(tempNum);
		}
		else{
			
			tempLevel.num.setStyle({ font: Math.round(levelW*0.4) + "px cifras", fill: '#' + skillSelData.color});
			tempLevel.num.setText(actTime);

			tempLevel.num.visible = true;
		}
		
		tempLevel.num.x = (levelW - tempLevel.num.width)/2;
		
		tempLevel.back.clear();
		tempLevel.back.beginFill('0x' + skillSelData.color3);
		tempLevel.back.drawRect(0,0,levelW,levelW);
		tempLevel.back.endFill();        
		
		if(tempLevel.candado){
			tempLevel.candado.visible = false;
		}
		
		drawLevelStars(tempLevel);
		tempLevel.cfActive = true;
	};

	function setLevelInactive(tempLevel){
		tempLevel.back.clear();
		tempLevel.back.beginFill('0x' + skillSelData.color1);
		tempLevel.back.drawRect(0,0,levelW,levelW);
		tempLevel.back.endFill();

		if(!tempLevel.candado){
			var candado = PIXI.Sprite.fromFrame('image/candado.png');
			candado.scale.x = candado.scale.y = levelW*0.4/candado.width;
			candado.x = (levelW - candado.width)/2;
			candado.y = (levelW - candado.height)/2;

			tempLevel.candado = candado;
			tempLevel.addChild(candado);
		}
		else{
			tempLevel.candado.visible = true;
		}

		if(tempLevel.num){
			tempLevel.num.visible = false;
		}

		if(tempLevel.stars){
			tempLevel.stars.visible = false;
		}
		
		tempLevel.cfActive = false;
	};

	function createLevels(){
		levelW = Math.min(Cifras.W*0.22, Cifras.H*0.12);

		var levelSep = Cifras.W*0.05;
		var firstX = (Cifras.W-((levelW+levelSep)*3)+levelSep)/2;
		var firstY = (Cifras.H*0.70-((levelW+levelSep)*4)+levelSep)/2;

		if(!levelsContainer){
			levelsContainer = new PIXI.DisplayObjectContainer();
			clip.addChild(levelsContainer);
		}
		else{
			levelsContainer.removeChildren();
		}

		for (var i = 0; i < levelsData.length; i++) {
			var tempLevel = new PIXI.DisplayObjectContainer();
			var tempBack = new PIXI.Graphics();

			tempLevel.levelId = i;
			
			tempLevel.back = tempBack;
			tempLevel.addChild(tempBack);

			tempLevel.pivot.x = tempLevel.pivot.y = levelW/2;

			tempLevel.x = levelW/2 + firstX + ((i%3)*(levelW+levelSep)) + (Math.floor(i/12)*(Cifras.W*1));
			tempLevel.y = firstY + (Math.floor((i%12)/3)*(levelW+levelSep));
			
			tempLevel.hitArea = new PIXI.Rectangle(tempLevel.x- levelW/2, tempLevel.y - levelW/2, levelW, levelW);

			levelsContainer.addChild(tempLevel);
		};
		
		levelsContainer.y = skillsContainer.height + (Cifras.H*0.6-levelsContainer.height)/2

	};

	function initButtons(){
		var butS = Cifras.H*0.06;
		var textS = Cifras.H*0.04;
		var lastPage = Math.floor(levelsData.length/12);
		
		var nextBut = new PIXI.Text('>', { font: butS + "px cifras", fill: '#ffffff'});
		var prevBut = new PIXI.Text('<', { font: butS + "px cifras", fill: '#ffffff'});
		
		pageText = new PIXI.Text((pageAct+1) + '|' + (lastPage+1), { font: textS + "px cifras", fill: '#ffffff'});
		
		buttonsContainer = new PIXI.DisplayObjectContainer();
		buttonsContainer.y = Cifras.H*0.9

		nextBut.interactive = prevBut.interactive = true;
		nextBut.x = Cifras.W*0.85;
		prevBut.x = Cifras.W*0.05;
		nextBut.y = prevBut.y = (Cifras.H*0.1-prevBut.height)/2;
		pageText.x = (Cifras.W-pageText.width)/2;
		pageText.y = (Cifras.H*0.1-pageText.height)/2;
		
		prevBut.hitArea = new PIXI.Circle(prevBut.width/2,prevBut.height/2,Cifras.W*0.1)
		nextBut.hitArea = new PIXI.Circle(nextBut.width/2,nextBut.height/2,Cifras.W*0.1)

		nextBut.mousedown = nextBut.touchstart = goNextPage;
		prevBut.mousedown = prevBut.touchstart = goPrevPage;
		
		buttonsContainer.addChild(nextBut);
		buttonsContainer.addChild(prevBut);
		buttonsContainer.addChild(pageText);

		clip.addChild(buttonsContainer);

		back.mousedown = back.touchstart = function(data){
            data.originalEvent.preventDefault();
            
            levelsContainer.dragData = data;
            levelsContainer.initX = pageAct*Cifras.W + data.global.x;
			
			if(levelsContainer.tween){
				levelsContainer.tween.remove();
			}
        };

        back.mouseup = back.mouseupoutside = back.touchend = back.touchendoutside = function(data){
            if(!levelsContainer.initX){
            	return false;
            }
            if(Math.abs(pageAct*Cifras.W + data.global.x - levelsContainer.initX) > Cifras.W*0.1){        	
	            if(pageAct*Cifras.W + data.global.x < levelsContainer.initX){
	            	goNextPage();
	            }
	            else{
	            	goPrevPage();
	            }
            }
            else{
                var tapPos = data.getLocalPosition(levelsContainer);
            	for (var i = 0; i < levelsContainer.children.length; i++) {
            		if(levelsContainer.children[i].cfActive && levelsContainer.children[i].hitArea.contains(tapPos.x,tapPos.y)){
            			selectLevel(levelsContainer.children[i]);
            			break;
            		}            		
            	};
            	goPageAct();
            }

            levelsContainer.dragData = null;
            levelsContainer.initX = null;
        };

        back.mousemove = back.touchmove = function(data){
            if(levelsContainer.dragData){
                var newPosition = levelsContainer.dragData.getLocalPosition(levelsContainer.parent);
                levelsContainer.x = newPosition.x - levelsContainer.initX;
            }
        }
	};

	function goNextPage(ev){
		pageAct =  Math.min(Math.floor(levelsContainer.children.length/12),pageAct + 1 || 1);
		goPageAct();
	};

	function goPrevPage(){
		pageAct =  Math.max(0,pageAct - 1);
		goPageAct();
	};

	function goPageAct(){
		var endX = -Cifras.W * pageAct;
		var time = 100 + Math.abs(Cifras.W*(endX - levelsContainer.x))/1000;

		if(levelsContainer.tween){
			levelsContainer.tween.remove();
		}

		levelsContainer.tween = new Tween(levelsContainer, "position.x", endX, time, true);
		levelsContainer.tween.easing = Tween.outQuintic;

		pageText.setText((pageAct+1) + '|' + (Math.floor(levelsContainer.children.length/12)+1))
	}

	function onSelectSkill(ev){
        if(!back.interactive){
        	return false;
        }

        if(ev.originalEvent){
	        ev.originalEvent.preventDefault();
        }

		if(skillSel){
			skillSel.back.visible = true;
			skillSel.icon.alpha = 0.5;
		}

		skillSel = ev.target || ev
		skillSel.back.visible = false;
		skillSel.icon.alpha = 1;

		Cifras.SKILLSELDATA = skillSelData = skillsData[skillSel.skillId];
		setBackColor(skillSelData.color);

		for (var i = 0; i < levelsContainer.children.length; i++) {
			if(userData.levels[skillSel.skillId][i] != null){
				setLevelActive(levelsContainer.children[i]);	
			}
			else{
				setLevelInactive(levelsContainer.children[i]);
			}
		};

		for (var i = 0; i < buttonsContainer.children.length; i++) {
			buttonsContainer.children[i].tint = '0x' + skillSelData.color4;
		};

		var lastLevel = userData.lastLevel[0] == skillSel.skillId ? userData.lastLevel[1] : userData.levels[skillSel.skillId].length;
		pageAct = Math.floor(lastLevel/12);
		goPageAct();
	};

	function selectLevel(target){
		levelSel = target;
		userData.lastLevel = [skillSel.skillId,target.levelId];

		Cifras.LEVELSELDATA = levelsData[levelSel.levelId];

		var pageAct = Math.floor(target.levelId / 12);
		var inc = Cifras.W*0.2;
		var incY = Cifras.W*0.2;
		var lastNum = levelsContainer.children.length >= (pageAct+1)*12 ? 12 : levelsContainer.children.length - pageAct*12;

		//var easings = ['outQuintic','inOutQuintic','inCubic','inOutCubic','outCubic','noEase'];
		var endX, endY, endR;
		var tweenX, tweenY, tweenR;
		var endS = Cifras.W*0.5/target.width;

		back.interactive = false;

		for (var i = 0; i < lastNum ; i++) {
			var tempLevel = levelsContainer.children[i + (pageAct*12)];

			tempLevel.initPos = [tempLevel.x,tempLevel.y,tempLevel.rotation];

			if(tempLevel != target){
				endX = tempLevel.x < target.x ? -levelsContainer.x - inc - Math.random()*inc : (pageAct*Cifras.W) + Cifras.W + Math.random()*inc;
				endY = tempLevel.y < target.y ? -levelsContainer.y - incY - Math.random()*incY : Cifras.H+ Math.random()*incY;
				endR = Math.random()*5 + 1;
			
				var endT = Math.random()*200 + 550
				
				tweenX = new Tween(tempLevel, "position.x", endX, endT, true);
				tweenX.easing = Tween.randomEase('nobounces');				

				tweenY = new Tween(tempLevel, "position.y", endY, endT, true);
				tweenY.easing = Tween.randomEase('nobounces');				

				tweenR = new Tween(tempLevel, "rotation", endR, endT, true);
				tweenR.easing = Tween.randomEase('nobounces');				
			}

			else{
				tweenX = new Tween(target, "position.x", pageAct*Cifras.W + Cifras.W/2, 640, true);
				tweenX.easing = Tween.backInAx;				

				tweenY = new Tween(target, "position.y", Cifras.H*0.5/2, 730, true);
				tweenY.easing = Tween.outElastic;				

				tweenSx = new Tween(target, "scale.x", endS, 600, true);
				tweenSx.easing = Tween.backInAx;				

				tweenSy = new Tween(target, "scale.y", endS, 600, true);
				tweenSy.easing = tweenSx.easing;				

				tweenAlpha = new Tween(target, "alpha", 0, 750, true);
				tweenAlpha.easing = Tween.inQuintic;				
			}
		};

		levelsContainer.swapChildren(levelSel,levelsContainer.getChildAt(levelsContainer.children.length-1))

		tweenY = new Tween(skillsContainer, "position.y", -skillsContainer.height, 450, true);
		tweenY.easing = Tween.inQuintic;				

		buttonsContainer.initY = buttonsContainer.position.y;
		tweenY = new Tween(buttonsContainer, "position.y", Cifras.H + buttonsContainer.height, 340, true);
		tweenY.easing = Tween.inQuintic;

		tweenY.onComplete = function(){
			Cifras.Game.play();
			levelsContainer.swapChildren(levelSel,levelsContainer.getChildAt(levelSel.levelId))			
		}
		tweenAlpha.onComplete = function(){
			clip.renderable = false;
			clip.visible = false;
		}
	};

	function showLevels(){
		var lastNum = levelsContainer.children.length >= (pageAct+1)*12 ? 12 : levelsContainer.children.length - pageAct*12;

		var endX, endY, endR;
		var tweenX, tweenY, tweenR;

		clip.renderable = true;
		clip.visible = true;

		for (var i = 0; i < lastNum ; i++) {
			var tempLevel = levelsContainer.children[i + (pageAct*12)];

			endX = tempLevel.initPos[0];
			endY = tempLevel.initPos[1];
			endR = tempLevel.initPos[2];
			
			var endT = Math.random()*200 + 550
			
			tweenX = new Tween(tempLevel, "position.x", endX, endT, true);
			tweenX.easing = Tween.randomEase('nobounces');;				

			tweenY = new Tween(tempLevel, "position.y", endY, endT, true);
			tweenY.easing = Tween.randomEase('nobounces');;				

			tweenR = new Tween(tempLevel, "rotation", endR, endT, true);
			tweenR.easing = Tween.randomEase('nobounces');;				
			
			if(tempLevel == levelSel){
				tweenSx = new Tween(tempLevel, "scale.x", 1, 550, true);
				tweenSx.easing = Tween.backInQuartic;				

				tweenSy = new Tween(tempLevel, "scale.y", 1, 550, true);
				tweenSy.easing = tweenSx.easing;				

				tweenAlpha = new Tween(tempLevel, "alpha", 1, 700, true);
				tweenAlpha.easing = Tween.outQuintic;	

			}
		};

		levelsContainer.swapChildren(levelSel,levelsContainer.getChildAt(levelsContainer.children.length-1))

		tweenY = new Tween(skillsContainer, "position.y", 0, 250, true);
		tweenY.easing = Tween.inQuintic;				

		tweenY = new Tween(buttonsContainer, "position.y", buttonsContainer.initY, 250, true);
		tweenY.easing = Tween.inQuintic;

		tweenAlpha.onComplete = function(){
			levelsContainer.swapChildren(levelSel,levelsContainer.getChildAt(levelSel.levelId))			
			back.interactive = true;
			
			if(userData.levels[skillSel.skillId][levelSel.levelId+1] == 0){
				var pageN = Math.floor((levelSel.levelId+1)/12);				
				if(pageN != pageAct){
					pageAct = pageN;
					goPageAct();
				}
			}
		}
	};

	return{
		init: function(stage){
			clip = new PIXI.DisplayObjectContainer();
			skillsContainer = new PIXI.DisplayObjectContainer();
			
			back = Cifras.getBack();

			createSkills();
			createLevels();
			initButtons();

			onSelectSkill(skillsContainer.children[userData.lastLevel[0]]);

			stage.addChild(clip);
		},

		endLevel: function(stars,time){
			userData.levels[skillSel.skillId][levelSel.levelId] = [stars,time];
			setLevelActive(levelSel)

			if(stars && !userData.levels[skillSel.skillId][levelSel.levelId+1] && levelsData.length > levelSel.levelId+1){			
				userData.levels[skillSel.skillId][levelSel.levelId+1] = 0;
				setLevelActive(levelsContainer.getChildAt(levelSel.levelId+1));
			}

			showLevels();
		},

	};
})();

