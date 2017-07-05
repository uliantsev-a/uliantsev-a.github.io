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
            // console.info(bullet)
        }
    }

    if (poly.contains(player.x, player.y))
    {
        if (! timerBlambVulkaiser.paused) timerBlambVulkaiser.start();
    }
    else
    {
        if ( timerBlambVulkaiser.paused) timerBlambVulkaiser.pause();
        vulkaiser.visible = false;
        dangerFount.visible = false;
    }
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

    if(poly.contains(player.x, player.y)){
        console.info('constains');
    }

}


function bulletKill(bullet){
    console.info('bulletKill')
    bullet.kill();
}
