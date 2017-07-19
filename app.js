function preload() {
    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('player', 'assets/shmup-ship.png');
    game.load.image('ball', 'assets/bubble.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('vulkaiser', 'assets/vulkaiser_red.png');
}

var player;
var countBalls = 100;
var controlRadiusShep = 50;
var defaultShepCount = 2;
var countScore = 0;
var lengthWorld = {x: 6920, y: 6920, padding: 1000};

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

function render() {
    game.debug.text( balls.countDead()   + ' Collaps balls', 32, 32);
    game.debug.text( balls.countLiving() + ' Living balls', 32, 64);
    game.debug.text( countScore + ' Count Scope', 32, 96);
}