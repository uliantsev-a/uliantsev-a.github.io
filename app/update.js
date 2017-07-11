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
            }
            
            if (bullets.countDead() > 0){
                var bullet = bullets.getFirstExists(false);
                bullet.reset(
                    player.x + player.inertia.x * 10 + sP,
                    player.y + player.inertia.y * 10 + sP
                );

                bullet.angle = player.angle + 90;
                bullet.body.velocity.x = player.inertia.x*2000;
                bullet.body.velocity.y = player.inertia.y*2000;
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

    var dx = Math.round(game.input.mousePointer.x - (player.x - game.camera.x));  
    var dy = Math.round(game.input.mousePointer.y - (player.y - game.camera.y));    

    playerRotation = Math.atan2 (dy, dx);
    var angle = playerRotation + (Math.PI / 2) + game.math.degToRad (-90);

    if(dx > 15 || dx < -15){
        player.parent.inertia.x = Math.cos (angle);
        player.parent.inertia.rotation = playerRotation;
    }
    if (dy > 15 || dy < -15) {
        player.parent.inertia.y = Math.sin (angle);
        player.parent.inertia.rotation = playerRotation
    }
    // console.info(player.parent.inertia)
    player.inertia = player.parent.inertia;
    player.inertia.x += player.inertia.x - player.parent.playerCapt.x < 3 ? (player.index / 100) : 0 //? player.inertia.x > 0 : player.index * -0.1;
    console.info(player.index)
    player.inertia.y += player.inertia.y - player.parent.playerCapt.y < 3 ? (player.index / 100) : 0
    player.body.rotation = player.inertia.rotation

    if (player.inertia.x > 0) {
        player.body.moveLeft(-1 * player.inertia.x * player.inertia.speed);
    } else {
        player.body.moveRight(player.inertia.x * player.inertia.speed);
    }
    if (player.inertia.y > 0) {
        player.body.moveDown(player.inertia.y * player.inertia.speed);
    } else {
        player.body.moveUp(-1 * player.inertia.y * player.inertia.speed);
    }

    // if(poly.contains(player.x, player.y)){
    //     console.info('constains');
    // }

}


function bulletKill(bullet){
    //console.info('bulletKill')
    bullet.kill();
}
