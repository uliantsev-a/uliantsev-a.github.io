var game = new Phaser.Game(
    window.innerWidth, window.innerHeight,
    Phaser.AUTO,
    'game',
    {
        preload: preload,
        create: create,
        render: render,
        update: update
    }
);

var player;
var weapon;
var lengthWorld = {x: 3920, y: 3920, padding: 400}

function preload() {
    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('player', 'assets/shmup-ship.png');
    game.load.image('ball', 'assets/bubble.png');
    game.load.image('bullet', 'assets/bullet.png');
}
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
    var bounds = new Phaser.Rectangle(
        lengthWorld.padding, 
        lengthWorld.padding, 
        game.world.width - lengthWorld.padding, 
        game.world.height - lengthWorld.padding
    );       
    var graphicsBounds = game.add.graphics(bounds.x, bounds.y);
    graphicsBounds.lineStyle(4, 0xffd900, 1);
    graphicsBounds.drawRect(0, 0, bounds.width - lengthWorld.padding, bounds.height - lengthWorld.padding);
    //

    // Free resources // Свободыне ресурсы
    balls = game.add.physicsGroup(Phaser.Physics.P2JS);    
    balls.physicsBodyType = Phaser.Physics.P2JS;
    balls.enableBody = true;
    balls.setAll('outOfBoundsKill', true);
    balls.setAll('checkWorldBounds', true);
    balls.setAll('body.mass', 0.1);
    balls.setAll('body.damping', 0);
    balls.setAll('name', 'ball');
    

    for (var i = 0; i < 20; i++)
    {
        var ball = balls.create(bounds.randomX, bounds.randomY, 'ball');        
        ball.body.setCircle(ball.body.height);
        ball.body.setCollisionGroup(resourcesCollisionGroup);
        ball.body.collides(playerCollisionGroup, hitResources, this);
        ball.scale.set(0.5);
    }
    //
    
    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
             game.physics.p2.enable(player);
    player.body.setCollisionGroup(playerCollisionGroup);
    player.body.collides(balls, hitResources,);    
    player.alpha = 0.5;    
    player.speed = 300;
    player.inertia = {
        x: 0,
        y: 0
    }

    fireButton = game.input.activePointer.leftButton;

    //game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);
    game.camera.follow(player);

    // bullets // заряды
    bullets = game.add.physicsGroup(Phaser.Physics.P2JS);
    bullets.physicsBodyType = Phaser.Physics.P2JS;
    bullets.enableBody = true;
    bullets.setAll('name', 'bullet');
    bullets.createMultiple(1, 'bullet', 0, false);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('body.mass', 0.1);
    bullets.setAll('body.damping', 0);
    bulletsTimer = game.time.create(false);
    // bullet.body.setCollisionGroup(playerCollisionGroup);
    game.physics.p2.setCollisionGroup(bullets, playerCollisionGroup);
    bullets.setAll('body.fixedRotation',true);

    //game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.1, 0.1);
    game.camera.follow(player);

    game.physics.p2.setPostBroadphaseCallback(checkVeg, this);
}
// Check jobs collides [ru] Рабочая проверка на столкновения
function checkVeg(body1, body2) { 
    if (body1.sprite.key == 'ball' && body2.sprite.key  == 'bullet' || body2.sprite.key == 'ball' && body1.sprite.key  == 'bullet'){
        console.info('sd')
        body1.sprite.kill();
        body2.sprite.kill();
    }
return true;
}

function update() {

    movePlayer(player);    

    if (fireButton.isDown)
    {
        console.info('fire!');

        if (bullets.countDead() > 0){
            var bullet = bullets.getFirstExists(false);
            bullet.reset(
                player.x + player.inertia.x * 10, 
                player.y + player.inertia.y * 10
            );

            bullet.angle = player.angle + 90;
            bullet.body.velocity.x = player.inertia.x*1000;
            bullet.body.velocity.y = player.inertia.y*1000;
            bullet.body.setCollisionGroup(playerCollisionGroup);
            bullet.body.collides(resourcesCollisionGroup, hitResources);
            game.time.events.add(Phaser.Timer.SECOND, bulletKill, this, bullet);
            console.info(bullet)
        }
    }
}

function bulletKill(bullet){
    console.info('bulletKill')
    bullet.kill();
}

function hitResources(body1, body2){
    console.info('hitResources');
    body2.sprite.alpha = 0;    
}

function render () {

}

 function movePlayer (player) 
 {
    // The difference between the position of the mouse cursor and the character on the overview screen 
    //// [ru] Разница между позицией курсора мыши и персонажем на экране обзора
    // player.x - position peronage [ru] позиция персонажа
    // game.camera.x - beginer coordinates for camera in map [ru] начало координат камеры на карте мира
    // mousePointer.x - coordinates mouse [ru] координата мыши

    var dx = Math.round(game.input.mousePointer.x - (player.x - game.camera.x));  
    var dy = Math.round(game.input.mousePointer.y - (player.y - game.camera.y));

    playerRotation = Math.atan2 (dy, dx);

    // if (dx > 15 || dx < -15 || dy > 15 || dy < -15) {player.body.rotation = playerRotation}
    //     else {player.body.rotation = 0}

    // console.info([dx, dy, playerRotation]);
    var angle = playerRotation + (Math.PI / 2) + game.math.degToRad (-90);  
    // player.body.rotation = playerRotation + game.math.degToRad (90);  
    // var angle = player.body.rotation + game.math.degToRad (-180) + (Math.PI / 2);  
    
    //player.body.rotateRight(100);

    if(dx > 15 || dx < -15){
        player.inertia.x = Math.cos (angle);
        player.inertia.rotation = playerRotation;
    }
    if (dy > 15 || dy < -15) {
        player.inertia.y = Math.sin (angle);
        player.inertia.rotation = playerRotation
    }
    player.body.rotation = player.inertia.rotation

    if (player.inertia.x > 0) {
        player.body.moveLeft(-1 * player.inertia.x * player.speed);
    } else {
        player.body.moveRight(player.inertia.x * player.speed);
    }
    if (player.inertia.y > 0) {
        player.body.moveDown(player.inertia.y * player.speed);
    } else {
        player.body.moveUp(-1 * player.inertia.y * player.speed);
    }
 } 


function refillResources(){

}
