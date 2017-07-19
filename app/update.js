function update() {    
    // console.info('update')
    for (var sP = 0; sP < squadronPlayer.length; sP++){

        // console.info(sP)
        var player = squadronPlayer.children[sP];
        movePlayer(player);

        if (fireButton.isDown)
        {
            var diffBull = Math.abs(squadronPlayer.children.length - bullets.length);
            if (diffBull > 0) {
                bullets.createMultiple(diffBull, 'bullet', 0, false);
                bullets.setAll('body.fixedRotation',true);
                // bullets.setAll('idle','false');
                //bullets.idle = false;
            }
            
            if (bullets.countDead() > 0){
                var bullet = bullets.getFirstExists(false);
                bullet.reset(
                    player.x ,
                    player.y 
                );

                bullet.angle = player.angle + 90;
                bullet.body.velocity.x = -Math.cos (player.parent.inertia.rotation) * 2000;
                bullet.body.velocity.y = -Math.sin (player.parent.inertia.rotation) * 2000;
                bullet.body.setCollisionGroup(bulletsCollisionGroup);

                bullet.body.hasCollided = false;
                bullet.body.collides(resourcesCollisionGroup, hitResources);
                bullet.body.collides(enemiesCollisionGroup, hitShep);

                game.time.events.add(Phaser.Timer.SECOND, bulletKill, this, bullet);
                // if (squadronPlayer.children.length < bullets.length)
                // { bullets.createMultiple(1, 'bullet', 0, false);}
            }
        }

        if (poly.contains(player.x, player.y))
        {
            // Если анимация не на паузе и игрок существует стартуем анимацию опасности
            // Если анимация на паузе и игрок существует возобновляем анимацию опасности
            // Иначе игрока НЕ существует останавливаемё анимацию опасности
            if ( player.exists && !timerBlambVulkaiser.paused) timerBlambVulkaiser.start() 
            else if( player.exists && timerBlambVulkaiser.paused) timerBlambVulkaiser.resume()
            else { 
                timerBlambVulkaiser.pause(); 
                vulkaiser.visible = false;
                dangerFount.visible = false;
            };
            // if ( !timerBlambVulkaiser.paused && !player.exists ) { } 
            if ( ! deathTimer.running && player.exists ){
                deathTimer.add(Phaser.Timer.SECOND*2.5, death, this);
                deathTimer.start();
            }
        }
        else
        {
            if ( timerBlambVulkaiser.paused) timerBlambVulkaiser.pause();
            vulkaiser.visible = false;
            dangerFount.visible = false;
            if (deathTimer.running) {
                deathTimer.stop();
                deathTimer.remove();
            }
        }
    }

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            //enemiesAlive++;
            enemies[i].update();    
        }
    }
}  

function movePlayer (player) 
{
    // The difference between the position of the mouse cursor and the character on the overview screen 
    //// [ru] Разница между позицией курсора мыши и персонажем на экране обзора
    // player.x - position peronage [ru] позиция персонажа
    // game.camera.x - beginer coordinates for camera in map [ru] начало координат камеры на карте мира
    // mousePointer.x - coordinates mouse [ru] координата мыши

    var mouseX = game.input.mousePointer.x,
        mouseY = game.input.mousePointer.y;

    var centerX = game.camera.width  / 2,
        centerY = game.camera.height / 2;

    var diffMoveX = centerX - mouseX,
        diffMoveY = centerY - mouseY;

    // var dx = Math.round(game.input.mousePointer.x - (player.x - game.camera.x));  
    // var dy = Math.round(game.input.mousePointer.y - (player.y - game.camera.y));  
    var dx = diffMoveX,
        dy = diffMoveY;

    var playerRotation = Math.atan2 (dy, dx);    

    // if(dx > player.width || dx < -player.width){
    //     player.parent.inertia.x = Math.cos (angle);
    // }
    // if (dy > player.height || dy < -player.height) {
    //     player.parent.inertia.y = Math.sin (angle);
    // }
    // player.inertia = player.parent.inertia;
    // player.inertia.x += player.inertia.x - player.parent.playerCapt.x > 10 ? (player.index / 100) : 0 //? player.inertia.x > 0 : player.index * -0.1;
    // // console.info(player.index)
    // player.inertia.y += player.inertia.y - player.parent.playerCapt.y > 10 ? (player.index / 100) : 0    
    if(Math.abs(diffMoveX) > player.width + player.width / 2)
    {
        player.parent.inertia.x = Math.cos(playerRotation) * player.parent.inertia.speed;
        player.parent.inertia.rotation = playerRotation;
    } 

    if(Math.abs(diffMoveY) > player.height + player.height / 2)
    {
        player.parent.inertia.y = Math.sin(playerRotation) * player.parent.inertia.speed;
        player.parent.inertia.rotation = playerRotation;
    } 
    // console.info([angle,Math.cos (angle), Math.sin(angle)])

    player.body.rotation = player.parent.inertia.rotation + game.math.degToRad (-180);
    player.body.moveLeft(player.parent.inertia.x);
    player.body.moveUp(player.parent.inertia.y);


}


function bulletKill(bullet){
    //console.info('bulletKill')
    bullet.kill();
}
