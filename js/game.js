(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(288, 505, Phaser.AUTO, 'flappy-bird-reborn');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
'use strict';

var Bird = function(game, x, y, frame) {
  //add the properties of a Phaser.Sprite
  Phaser.Sprite.call(this, game, x, y, 'bird', frame);

  // set the sprite's anchor to the center
  this.anchor.setTo(0.5, 0.5);

  //add and play animations
  this.animations.add('flap');
  this.animations.play('flap', 12, true);
  
  //add the bird to the physics prefab
  this.game.physics.arcade.enableBody(this);

};

Bird.prototype = Object.create(Phaser.Sprite.prototype);
Bird.prototype.constructor = Bird;

Bird.prototype.update = function() {
  
  //check to see if our angle is less than 90
  if(this.angle < 90) {
    //rotate the bird towards the ground by 2.5 degrees
    this.angle += 2.5;
  }
  
};

Bird.prototype.flap = function() {

  //set our bird's physics velocity to -400 pixels per second
  this.body.velocity.y = -400;

  //rotate the bird to -40 degrees
  this.game.add.tween(this).to({angle: -40}, 100).start();

};

module.exports = Bird;

},{}],3:[function(require,module,exports){
'use strict';

var Ground = function(game, x, y, width, height) {  
  Phaser.TileSprite.call(this, game, x, y, width, height, 'ground');

  //auto-scroll the ground
  this.autoScroll(-200,0);

  //enable physics on the ground sprite for collision detection
  this.game.physics.arcade.enableBody(this);

  //gameObject.body contains physics data and how an object moves, collides, and behaves
  //in a given physics simulation.

  //disallow the ground to fall from gravity
  this.body.allowGravity = false;

  //disallow reaction to external forces
  this.body.immovable = true;
  
};

Ground.prototype = Object.create(Phaser.TileSprite.prototype);
Ground.prototype.constructor = Ground;

Ground.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Ground;

},{}],4:[function(require,module,exports){
'use strict';

var Pipe = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'pipe', frame);

  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);

  this.body.allowGravity = false;
  this.body.immovable = true;
  
};

Pipe.prototype = Object.create(Phaser.Sprite.prototype);
Pipe.prototype.constructor = Pipe;

Pipe.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Pipe;

},{}],5:[function(require,module,exports){
'use strict';
var Pipe = require('./pipe');

var PipeGroup = function(game, parent) {
  Phaser.Group.call(this, game, parent);

  //add the top pipe to the group (frame[0])
  this.topPipe = new Pipe(this.game, 0, 0, 0);
  //add the bottom pipe to the group (frame[1])
  //440 = pipe.height + (bird.height * 5)  aka space between
  //the top and bottom pipes === 5* the bird's height
  this.bottomPipe = new Pipe(this.game, 0, 440, 1);

  this.add(this.topPipe);
  this.add(this.bottomPipe);  
  this.hasScored = false;

  //add velocity to the pipes
  this.setAll('body.velocity.x', -200);
};

PipeGroup.prototype = Object.create(Phaser.Group.prototype);
PipeGroup.prototype.constructor = PipeGroup;

PipeGroup.prototype.update = function() {
  this.checkWorldBounds();
};

PipeGroup.prototype.checkWorldBounds = function() {
  if(!this.topPipe.inWorld) {
    this.exists = false;
  }
};


PipeGroup.prototype.reset = function(x, y) {

  this.topPipe.reset(0,0);

  this.bottomPipe.reset(0, 440);

  this.x = x;
  this.y = y;

  this.setAll('body.velocity.x', -200);

  this.hasScored = false;
  this.exists = true;
};


module.exports = PipeGroup;

},{"./pipe":4}],6:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],7:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],8:[function(require,module,exports){
'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {
  },
  create: function() {
    //add the background to the menu screen  --  this.game.add.sprite(x, y, key)
    //x and y are the anchor points in px (default top left corner of asset)
    this.background = this.game.add.sprite(0, 0, 'background');

    //add the ground sprite as a tile -- this.game.add.tileSprite(placementX, placementY, keyWidth, keyHeight, key)
    this.ground = this.game.add.tileSprite(0, 400, 335, 112, 'ground');

    //auto-scroll the ground in the negative x direction -- this.ground.autoScroll(xSpeed,ySpeed);
    this.ground.autoScroll(-100, 0);

    //create group to hold title assets so they can be manipulated as a whole
    this.titleGroup = this.game.add.group();

    //create the title sprite and add it to the group
    this.title = this.game.add.sprite(0,0, 'title');
    this.titleGroup.add(this.title);

    //create the bird sprite and add it to the group
    this.bird = this.game.add.sprite(200, 5, 'bird');
    this.titleGroup.add(this.bird);
    
    //use all available spritesheet images to create a new
    //animation called 'flap'  --  this.bird.animations.add(animationKey)
    this.bird.animations.add('flap');
    //run animation -- this.bird.animations.play(animationKey, frameRate, loop)
    this.bird.animations.play('flap', 12, true);

    //set the origination location of the group
    this.titleGroup.x = 30;
    this.titleGroup.y = 100;

    //create an oscillating animation tween for the group
    // -- this.game.add.tween(object).to(properties, duration, ease, autoStart, delay, repeat, yoyo )
    // object: any game object (sprite, group, etc)
    this.game.add.tween(this.titleGroup).to({y:115}, 350, Phaser.Easing.Linear.NONE, true, 0, 1000, true);

    //add our start button with a callback
    // -- var button = this.game.add.button(x, y, key, callback, callbackContext);
    this.startButton = this.game.add.button(this.game.width/2, 300, 'startButton', this.startClick, this);

    //move anchorPoint from top left to the center of the button 
    this.startButton.anchor.setTo(0.5, 0.5);

  },
  //start button click handler
  startClick: function(){
    //starts the 'play' state
    this.game.state.start('play');
  },
  update: function() {
  }
};
module.exports = Menu;

},{}],9:[function(require,module,exports){
'use strict';

var Bird = require('../prefabs/bird');
var Ground = require('../prefabs/ground');
var PipeGroup = require('../prefabs/pipeGroup');

function Play() {}
Play.prototype = {
  create: function() {
    //Phaser's prefab physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // give the world an initial gravity of 1200
    this.game.physics.arcade.gravity.y = 1200;

    //add backgroun sprite
    this.background = this.game.add.sprite(0,0, 'background');

    //create a new bird object
    this.bird = new Bird(this.game, 100, this.game.height/2);

    //add it to the game
    this.game.add.existing(this.bird);

    // create and add a group to hold ou pipeGroup prefabs
    this.pipes = this.game.add.group();

    //create and add a new Ground object
    // -- new Ground(game, x, y, width, height, key)
    this.ground = new Ground(this.game, 0, 400, 335, 112); //we hardcoded in the key
    this.game.add.existing(this.ground);

    ///////////////BIRD FLAP FUNCTION////////////////
    //keep the spacebar from propagating up into the browser
    this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    //add keyboard controls and attach to bird flap function
    var flapKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    flapKey.onDown.add(this.bird.flap, this.bird);

    //add mouse/touch controls and attach to bird flap function
    this.input.onDown.add(this.bird.flap, this.bird);
    /////////////////////////////////////////////////


    //add a timer that will call `this.generatePipes()` every 1.25 seconds
    // -- game.time.events.loop(delay, callback, callbackContext, arguments)
    this.pipeGenerator = this.game.time.events.loop(Phaser.Timer.SECOND * 1.25, this.generatePipes, this);
    this.pipeGenerator.timer.start();

  },

  update: function() {
    // enable collisions between the bird and the ground
    this.game.physics.arcade.collide(this.bird, this.ground, this.deathHandler, null, this);
    
    // enable collisions between the bird and each group in the pipes group
    this.pipes.forEach(function(pipeGroup) {
        this.game.physics.arcade.collide(this.bird, pipeGroup, this.deathHandler, null, this);
    }, this);
    
  },

  deathHandler: function() {
    this.game.state.start('gameover');
  },

  generatePipes: function() {
    var pipeY = this.game.rnd.integerInRange(-100, 100);
    var pipeGroup = this.pipes.getFirstExists(false);
    if(!pipeGroup) {
        pipeGroup = new PipeGroup(this.game, this.pipes);  
    }
    pipeGroup.reset(this.game.width, pipeY);
  },

  shutdown: function() {
    this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    this.bird.destroy();
    this.pipes.destroy();
  },
};

module.exports = Play;
},{"../prefabs/bird":2,"../prefabs/ground":3,"../prefabs/pipeGroup":5}],10:[function(require,module,exports){

'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    //Boilerplate code that plays while loading other assets
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);
    this.load.setPreloadSprite(this.asset);

    //loading images --  this.load.image(key, url);
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('title', 'assets/title.png');
    this.load.image('startButton', 'assets/start-button.png');

    //loading spritesheet -- this.load.spritesheet(key, url, frameWidth (px), frameHeight (px), numberOfFrames)
    this.load.spritesheet('bird', 'assets/bird.png', 34, 24, 3);
    this.load.spritesheet('pipe', 'assets/pipes.png', 54,320,2);
  },
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

},{}]},{},[1])