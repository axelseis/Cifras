


var Cifras = (function(){
	var stage;
	var rendered;
	var loader;

	var chars = {};

	var clip, back;

	var w, h, t;
	
	var playing;

	var assets = [
		'image/candado.png',
		'image/iconEasy.png',
		'image/iconNormal.png',
		'image/iconHard.png'
	];

	function onLoadAssets(ev){
		Cifras.Game.init(clip);
		Cifras.Levels.init(clip);
		//Cifras.Game.play(Cifras.Data.levelsData[2]);
	};

	function tick(time){
	    t = time;

	    renderer.render(stage);	

	    Cifras.Game.update(time);
		Tween.runTweens();
	    
	    if(playing){
		    requestAnimationFrame( tick );
	    }
	};

	return{
		boardValues : {nums:[],ops:[]},
		tocaNum: true,
		
		SKILLSELDATA: null,
		LEVELSELDATA: null,
		
		W: 0,
		H: 0,

		getCharTextures: function() {
			return chars;	
		},

		getChar: function(charId,charW){
			var charW = Math.floor(charW);
			var tempChar = chars[charId + '_' + charW];

			if(!tempChar){
				tempChar = chars[charId + '_' + charW] = new PIXI.Text(charId, { font: charW + "px cifras", fill: '#ffffff'});
			}
			else{
				tempChar = new PIXI.Sprite(tempChar.texture);
			}

			return tempChar;
		},
		
		getNewBoardValue: function(type){
			var chars = type == 'ops' ? skillSelData.ops.slice() : levelData.nums.slice();
			var lastVal = this.value;

		    for(var j, x, i = chars.length; i; j = Math.floor(Math.random() * i), x = chars[--i], chars[i] = chars[j], chars[j] = x);

			while(!this.value || (Cifras.boardValues[this.type].indexOf(this.value) != -1 && chars.length)){
				this.value = chars.splice(Math.floor(Math.random()*chars.length),1)[0];	
			}
			
			if (!chars.length && lastVal) {
				this.value = Cifras.boardValues[this.type].indexOf(lastVal) == -1  ? lastVal : this.value;
			}
		},

		getBack: function(){
			return back;
		},
		
		getT: function(){
			return t;
		},

		init: function(){
			//PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;

			this.W = window.innerWidth;
			this.H = window.innerHeight;

			stage = new PIXI.Stage(0x2a3134);
		    renderer = PIXI.autoDetectRenderer(this.W, this.H, {antialias:true});
		    //renderer = new PIXI.CanvasRenderer(w, h);
		    
		    document.body.appendChild(renderer.view);

  		    clip = new PIXI.DisplayObjectContainer();
  		    stage.addChild(clip);

		    back = new PIXI.Graphics();
			back.interactive = true;
			clip.addChild(back);

		    loader = new PIXI.AssetLoader(assets);
		    loader.onComplete = onLoadAssets;
		    loader.load();

  		    this.play();
		},

		endLevel: function(stars){
			this.Levels.endLevel(stars);
		},
				
		playStop: function(){
			if (playing) {
				this.stop();
			}
			else{
				this.play();
			}
		},
				
		play: function(){
			playing = true;
			requestAnimationFrame(tick);
		},
				
		stop: function(){
			playing = false;
		}
	};
})();


