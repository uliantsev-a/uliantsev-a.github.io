function create() {
    game.world.setBounds(0, 0, lengthWorld.x, lengthWorld.y);
    background = game.add.tileSprite(0, 0, game.world.width, game.world.height, 'background');

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.updateBoundsCollisionGroup();
    //game.physics.p2.setImpactEvents(s); //  Turn on impact events for the world, without this we get no collision callbacks
    
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    resourcesCollisionGroup = game.physics.p2.createCollisionGroup(); 

    game.input.mouse.capture = true; // If true the DOM mouse events will have event.

    // Just to display the bounds [ru] Отображаем границу
    bounds = new Phaser.Rectangle(
        lengthWorld.padding, 
        lengthWorld.padding, 
        game.world.width - lengthWorld.padding, 
        game.world.height - lengthWorld.padding
    );       
    var graphicsBounds = game.add.graphics(bounds.x, bounds.y);
    graphicsBounds.lineStyle(4, 0xffd900, 1);
    graphicsBounds.drawRect(0, 0, bounds.width - lengthWorld.padding, bounds.height - lengthWorld.padding);
    poly = new Phaser.Polygon([
    	new Phaser.Point(0, 0), new Phaser.Point(game.world.width, 0 ),
		new Phaser.Point(game.world.width, game.world.height), 		  new Phaser.Point(0, game.world.height),
		new Phaser.Point(0, game.world.height - lengthWorld.padding), new Phaser.Point(game.world.width - lengthWorld.padding, game.world.height - lengthWorld.padding),
		new Phaser.Point(game.world.width - lengthWorld.padding, lengthWorld.padding),  new Phaser.Point(lengthWorld.padding, lengthWorld.padding),
		new Phaser.Point(lengthWorld.padding, game.world.height - lengthWorld.padding), new Phaser.Point(0, game.world.height - lengthWorld.padding)
	]);
    graphics = game.add.graphics(0, 0);
    graphics.beginFill(0xff0000, 0.5);
    graphics.drawPolygon(poly.points);
    graphics.endFill();
    //

    // Group free resources // Группа свободных ресурсов
    balls = game.add.physicsGroup(Phaser.Physics.P2JS);    
    balls.physicsBodyType = Phaser.Physics.P2JS;
    balls.enableBody = true;
    balls.setAll('outOfBoundsKill', true);
    balls.setAll('checkWorldBounds', true);
    balls.setAll('body.mass', 0.1);
    balls.setAll('body.damping', 0);
    balls.setAll('name', 'ball');
    
    createBalls(countBalls);
    
    // player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
    player = game.add.sprite(lengthWorld.padding + 100, lengthWorld.padding + 100, 'player');
             game.physics.p2.enable(player);
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides(balls, hitResources,);    
    // player.alpha = 0.5;    
    player.speed = 300;
    player.inertia = {
        x: 0,
        y: 0
    }

    fireButton = game.input.activePointer.leftButton;

    // game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);
    // game.camera.follow(player);

    // bullets // заряды
    bullets = game.add.physicsGroup(Phaser.Physics.P2JS);
    bulletsSetParm();
    game.physics.p2.setCollisionGroup(bullets, playerCollisionGroup);

    //game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);
    game.camera.follow(player);
    vulkaiser = game.add.sprite(20, 0, 'vulkaiser');
    //vulkaiser.x = game.camera.width - vulkaiser.width
    vulkaiser.y = game.camera.height - vulkaiser.height
    vulkaiser.fixedToCamera = true;

    game.physics.p2.setPostBroadphaseCallback(checkVeg, this);

    // timer for message for warning when death zone
    timerBlambVulkaiser = game.time.create(false);
    timerBlambVulkaiser.loop(400, blambVulkaiser, this);
    ////warning text
    dangerFount =  game.add.text(vulkaiser.x + vulkaiser.width, game.camera.height - vulkaiser.height, '- Danger ! -');
    dangerFount.visible = false;
    dangerFount.fixedToCamera = true;    
    dangerFount.fontSize = 50;
    dangerFount.fontWeight = 'bold';
    dangerFount.fill = '#f80000';
    textToRestart = game.add.text(game.camera.width / 2, game.camera.height / 2, "Click the mouse button to continue.", { font: "65px Arial", fill: "#ffff00", align: "center" });
    textToRestart.anchor.set(0.5);
    textToRestart.inputEnabled = true;
    textToRestart.visible = false;

    //  Create death player on Timer
    deathTimer = game.time.create(false);
}

function blambVulkaiser(){ 
    vulkaiser.visible = !vulkaiser.visible;
    dangerFount.visible = !dangerFount.visible;
}

function bulletsSetParm(){
    bullets.physicsBodyType = Phaser.Physics.P2JS;
    bullets.createMultiple(1, 'bullet', 0, false);
    bullets.enableBody = true;
    bullets.setAll('name', 'bullet');    
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('body.mass', 0.1);
    bullets.setAll('body.damping', 0);    
    bulletsTimer = game.time.create(false);
    // bullet.body.setCollisionGroup(playerCollisionGroup);
    bullets.setAll('body.fixedRotation',true);
}

function createBalls(count){
// Create and placing spherical resources
    for (var i = 0; i < count; i++)
    {
        var randomBoundsX = Math.floor(Math.random() * (bounds.width  - bounds.x) + bounds.x);
        var randomBoundsY = Math.floor(Math.random() * (bounds.height - bounds.y) + bounds.y);
        var ball = balls.create(randomBoundsX, randomBoundsY, 'ball');        
        ball.body.setCircle(ball.body.height);
        ball.body.setCollisionGroup(resourcesCollisionGroup);
        ball.body.collides(playerCollisionGroup, hitResources, this);
        ball.scale.set(0.5);
    }
    //
}

function death(){
    player.kill();
    bullets.removeAll();
    textToRestart.visible = true;

    //the "click to restart" handler
    game.input.onTap.addOnce(restart,this);
}

function restart(){    
    balls.removeAll();
    textToRestart.visible = false;

    player.revive();
    //bullets.createMultiple(1, 'bullet', 0, false);
    bulletsSetParm();
    // player.body.x = game.world.centerX;
    // player.body.y = game.world.centerY;
    player.body.x = lengthWorld.padding * 1.5, 
    player.body.y = lengthWorld.padding * 1.5;
    createBalls(countBalls);
}

// Check jobs collides [ru] Рабочая проверка на столкновения
function checkVeg(body1, body2) { 
    if (body1.sprite.key == 'ball' && body2.sprite.key  == 'bullet' || body2.sprite.key == 'ball' && body1.sprite.key  == 'bullet'){
        body1.sprite.kill();
        body2.sprite.kill();
    }
	return true;
}

function hitResources(body1, body2){
    body2.sprite.alpha = 0;
    body1.sprite.alpha = 0;
}
    