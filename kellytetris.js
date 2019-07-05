/**
 * @category  games
 * @package   Kelly
 * @author    Rubchuk Vladimir <torrenttvi@gmail.com>
 * @copyright 2016 Rubchuk Vladimir
 * @license   GPLv3
 * @version   1.0
 *
 * Usage example :
 * 
 *   KellyTetris.playMe();
 *
 **/

function KellyTetris(holder, fExit) {
	var blocks = [ // from origin point
		[[0, 0], [-1, 0], [-1, -1], [0, -1]], // quad
		[[0, 0], [0, -1], [1, 0], [1, 1]],
		[[0, 0], [0, -1], [0, 1], [1, 1]],
		[[0, 0], [0, 1], [1, 0], [1, -1]], 
		[[0, 0], [0, 1], [0, -1], [0, -2]], // long
		[[0, 0], [1, 0], [0, 1], [-1, 0]],  
		[[0, 0], [0, -1], [0, 1], [-1, 1]] 
	];		

	var handler = this;
	var holder = document.getElementById(holder);
	var onExit = fExit;
	
	var mapBlocks = new Array(2), map, mapBlockKey = new Array(2);	
	var mapPos, defaultMapPos = [4, 0];
	var gameover = false;
	
	var speed = 350, score = 0, tick = 0, lastCalledTime, delta;
	var arotate = 0, adown = 0, amove = 0;
	
	document.body.onkeydown = function(e){ // 2 - up // 4 - down /// 1 - left // 3 - right
	    var c = e.keyCode - 36;
		if (gameover && c == 2) {
			handler.restart();
			return;
		}
		
		if (gameover && c == 4) {
			handler.stop();
			return;
		}		
		
		if (c == 2) arotate = 1;
		if (c == 4) adown = 1;
		if (c == 1) amove = -1;
		if (c == 3) amove = 1;	
	};
	
	function cleanMap() {
		map = new Array(10); // [x] [y]
		for (var x = 0; x < map.length; x++){
			map[x] = new Array(20);
		}
	}
	
	function setRandomBlock(i) {
		mapBlockKey[i] = Math.floor(Math.random() * blocks.length);
		mapBlocks[i] = blocks[mapBlockKey[i]].slice();
	}
	
	function checkCollision(newPos, rotate) {

		var block = mapBlocks[0];
		if (rotate && mapBlockKey[0] > 0) {
			var rblock = [];
			for (var i=0; i < block.length; i++){	
				// rblock[i] = [block[i][1], -1 * block[i][0]];
				 rblock[i] = [-1 * block[i][1], block[i][0]];
			}
			
			block = rblock;
		}
		
		for (var i=0; i < block.length; i++){		
			
			if (newPos[1] + block[i][1] >= map[0].length)  return true;
			if (newPos[0] + block[i][0] < 0 || newPos[0] + block[i][0] >= map.length) {
			//console.log(newPos[0] + ' ' + newPos[1])
			return true;
			}
					
			if (map[newPos[0] + block[i][0]][newPos[1] + block[i][1]]) { // hit something
				return true;
			}
		}
		
		if (rotate && mapBlockKey[0] > 0) {
			mapBlocks[0] = rblock;
		}
	
		//console.log(newPos[0] + ' ' + newPos[1] + ' amove ' +  amove)		
		return false;
	}
	
	function step() {
		var newPos = [mapPos[0], mapPos[1]+1];

		if (checkCollision(newPos)) {
		
			var block = mapBlocks[0];
			for (var i=0; i < block.length; i++){
				map[mapPos[0] + block[i][0]][mapPos[1] + block[i][1]] = mapBlocks[0] + 1;
				// console.log((mapPos[0] + block[i][0]) + ' ' + (mapPos[1] + block[i][1]))
			}
			
			nextBlock();
		} else {
			mapPos = newPos;
		}		
		
		var removeLines = 0;
		for (var y = 0; y < map[0].length; y++){
			var beasy = 0;
			for (var x = 0; x < 10; x++){
				if (map[x][y]) beasy++;				
			}
			
			if (beasy == 10) {
				for (var x = 0; x < 10; x++){
					map[x].splice(y, 1);
					map[x].splice(0, 0, 0);					
				}
				
				removeLines++;
			}
		}
		
		score += removeLines * 100 * removeLines;
		var newSpeed = speed - (Math.floor(score / 400) * 50); // may be add levels
		// console.log(newSpeed);
		if (newSpeed < 70) newSpeed = 70;
		
		tick = newSpeed;
	}
	
	function draw() {
	
		if (gameover) {
			holder.innerHTML = '\u0418\u0433\u0440\u0430 \u043e\u043a\u043e\u043d\u0447\u0435\u043d\u0430<br>\u0412\u0441\u0435\u0433\u043e \u043e\u0447\u043a\u043e\u0432: ' + score + '<br><br><br><br>\u041d\u0430\u0436\u043c\u0438\u0442\u0435 ↑  \u0447\u0442\u043e\u0431\u044b \u043d\u0430\u0447\u0430\u0442\u044c \u0441\u043d\u043e\u0432\u0430.<br>\u041d\u0430\u0436\u043c\u0438\u0442\u0435 ↓</b> \u0447\u0442\u043e\u0431\u044b \u0432\u044b\u0439\u0442\u0438 <br><br><br><br><b>\u0410\u0432\u0442\u043e\u0440</b>: NC22 <a href="https://github.com/NC22">Github</a> <br>\u041f\u0435\u0440\u0435\u0432\u0451\u043b \u0438 \u0434\u043e\u0440\u0430\u0431\u043e\u0442\u0430\u043b: \u0414\u0430\u0432\u0438\u0434 \u0421\u0430\u0439\u0440\u0435\u043a\u0441: <a href="https://vk.com/gamercool57">VK</a>';
			return;
		}
		
		var o = '';
		
		for (var y = 0; y < map[0].length; y++){
			for (var x = 0; x < 10; x++){
						
				var setted = false;
				var block = mapBlocks[0];
				for (var bi=0; bi < block.length; bi++){
					if (mapPos[0] + block[bi][0] == x && mapPos[1] + block[bi][1] == y ) {
						o += "[]";
						
						setted = true;
						break;
					}
				}
				
				if (setted) continue;
				
				if (map[x][y]) o += "[]"; // + map[x][y];
				else o += ". ";				
			}
			
			if (y == 3) {
				o += "\u0421\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0439:";
			}
			
			if (y >= 5 && y <= 8) {
				o += "  ";
				var curY = 1 - (y-5);
				for (var curX = -2; curX < 2; curX++){
					// console.log(curX + ' ' + curY + ' || ' + blocks[mapBlocks[1]][curX + 2][0] + ' | ' + blocks[mapBlocks[1]][curX + 2][1]);
					var bfound = false;
					for (var bi=0; bi < mapBlocks[1].length; bi++){
						if (curX == mapBlocks[1][bi][0] && curY == mapBlocks[1][bi][1]) {
							o += '[]';
							bfound = true;
							break;
						}
					}
					
					if (!bfound) o += '. ';
				}
			}
			
			if (y == 10) {
				o += "\u041e\u0447\u043a\u043e\u0432: " + score;
			}
			
			o += "<br>";
		}
		holder.innerHTML = o;
	}
	
	function nextBlock() {
		mapPos = new Array();
		mapPos[0] = defaultMapPos[0];
		mapPos[1] = defaultMapPos[1];
		
		if (mapBlocks[1]) {
			mapBlocks[0] = mapBlocks[1].slice();
			mapBlockKey[0] = mapBlockKey[1];
		} else {
			setRandomBlock(0);
		}
		
		setRandomBlock(1);
		amove = 0;
		adown = 0;
		arotate = 0;
		if (checkCollision(mapPos)) {
			gameover = true;
		}
	}
		
	this.restart = function () {
		score = 0;
		gameover = false;
		cleanMap();
		nextBlock();
		handler.process();
		draw();
	}
	
	this.process = function() {	
		if (lastCalledTime) {
			delta = Date.now() - lastCalledTime;
			tick -= delta;
		}
				
		if (amove || adown || arotate) { // momental reaction			
			if (!checkCollision([mapPos[0] + amove, mapPos[1] + adown], arotate)) mapPos = [mapPos[0] + amove, mapPos[1] + adown];
			amove = 0;
			adown = 0;
			arotate = 0;
			draw();
		}
		
		lastCalledTime = Date.now();
		if (tick <= 0) {
			step();
			draw();
		}
		
        // fps = 1 /delta / 1000;
		if (!gameover) window.requestAnimationFrame(function() { handler.process(); });
	}
	
	this.stop = function() {
		gameover = true;
		document.body.onkeydown = false;
		
		if (onExit) onExit(handler);
	}
	
	handler.restart();
}

// cfg - starttext , screen, text, delayBefore, delayAfter, onEnd

KellyTetris.consoleUpdateCursor = function(cfg) {
	if (cfg.cursor) {
		var oldCursor = cfg.cursor;
			oldCursor.style.opacity = 0;
		setTimeout(function () {oldCursor.parentNode.removeChild(oldCursor)}, 500);
		cfg.cursor = false;
	} else if (!cfg.cursor) {
		cfg.cursor = document.createElement("span");
		cfg.cursor.style.transition = 'all 1s';
		cfg.cursor.style.opacity = '1';
		cfg.cursor.innerHTML = '';
		cfg.screen.appendChild(cfg.cursor);
	}
};

KellyTetris.consoleType = function(cfg) {
	
	if (cfg.starttext) {
		cfg.screen.innerHTML += cfg.starttext;
		cfg.starttext = '';
	}
	
	if (!cfg.delayAfter && (!cfg.text || !cfg.text.length)) {
		cfg.screen.innerHTML += '<br>';
		
		if (cfg.onEnd) cfg.onEnd(cfg);
		return;
	}
	
	if (!cfg.screen) return;
	
	var typeTime;
	
	if (cfg.delayBefore > 0) {
		cfg.delayBefore--;
		typeTime = 500;
		
		KellyTetris.consoleUpdateCursor(cfg);
		
	} else if (cfg.text) {
		cfg.screen.innerHTML += cfg.text.slice(0, 1);
		cfg.text = cfg.text.slice(1, cfg.text.length);
		typeTime = (2 + Math.floor(Math.random() * 8)) * 80;
	} else if (cfg.delayAfter > 0) {
		cfg.delayAfter--;
		typeTime = 500;
		
		KellyTetris.consoleUpdateCursor(cfg);
	}
	
	setTimeout(
		function() { KellyTetris.consoleType(cfg); }, typeTime
	);
}


// attach to body - "include to page as easter egg"

KellyTetris.playMe = function() {
	var body = document.body;
	var html = document.getElementsByTagName("html")[0];
		html.style.padding = '0px';
		html.style.margin = '0px';
		html.style.height = '100%';
		html.style.width = '100%';
		
		body.style.padding = '0px';
		body.style.margin = '0px';
		
	var gameContainer = document.createElement("div");
		gameContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
		gameContainer.style.position = 'absolute';
		gameContainer.style.width = '100%';
		gameContainer.style.height = '100%';
		gameContainer.style.left = '0px';
		gameContainer.style.top = '0px';
		gameContainer.style.opacity = 0;
		gameContainer.style.cursor = 'default';
		gameContainer.style.zIndex = '9999';
		
		gameContainer.style.transition = 'opacity 1s';
		
	var game = document.createElement("pre");
		game.style.wordWrap = 'break-word';
		game.style.whiteSpace = 'pre-wrap';
		game.style.fontSize = '12px;';
		game.style.padding = '0';
		game.style.margin = '0';
		game.style.paddingLeft = '12px';
		game.style.paddingTop = '12px';
		game.style.display = 'block';
		game.style.color = '#10ea10';
		game.style.border = '0px';
		game.style.background = 'transparent';
		
		game.id = 'tris';
		game.style.minHeight = '0px';
		
	gameContainer.appendChild(game);
	body.appendChild(gameContainer);
	
	setTimeout(function() {
		gameContainer.style.opacity = 1;
		
		KellyTetris.consoleType({
			starttext : 'Microsoft Windows [Version x.x.xxxx]\n(c) Корпорация Майкрософт (Microsoft Corp.), 2009. Все права защищены.\n',
			text : 'C:\\Users\\User\\>\nC:\\Users\\User\\>cd Tetris\nC:\\User\\User\\Tetris\\>start tetris\nЗапуск игры Tetris...',
			delayBefore : 5,
			delayAfter : 15,
			screen : game,
			onEnd : function() {
				
				game.innerHTML = '';
				
				var tris = new KellyTetris('tris',
					function() {
					
						gameContainer.style.opacity = 0;
						
						setTimeout(function() {						
							body.removeChild(gameContainer);
						}, 1000);
					}
				);				
				
				// gameContainer.onclick = function() {
				//	tris.stop();
				// }	
			
			}
		});
	
		
	}, 100);
}
