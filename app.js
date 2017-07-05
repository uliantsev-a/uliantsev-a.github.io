function preload() {
    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('player', 'assets/shmup-ship.png');
    game.load.image('ball', 'assets/bubble.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('vulkaiser', 'assets/vulkaiser_red.png');
}

var game = new Phaser.Game(
    800,
    600,
    Phaser.AUTO,
    'game',
    {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
);

var player;
// var total = 0;
var lengthWorld = {x: 1920, y: 1920, padding: 400}

function render() {
    game.debug.text( balls.countDead()   + ' Dead balls', 32, 32);
    game.debug.text( balls.countLiving() + ' Living balls', 32, 62);

    game.debug.text("Time until event: " + game.time.events.duration.toFixed(0), 32, 32*32);
    game.debug.text("Next tick: " + game.time.events.next.toFixed(0), 32, 32*4);
}