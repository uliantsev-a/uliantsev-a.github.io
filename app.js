<<<<<<< HEAD
=======
function preload() {
    game.load.image('background','assets/debug-grid-1920x1920.png');
    game.load.image('player', 'assets/shmup-ship.png');
    game.load.image('ball', 'assets/bubble.png');
    game.load.image('bullet', 'assets/bullet.png');
    game.load.image('vulkaiser', 'assets/vulkaiser_red.png');
}

var player;
var lengthWorld = {x: 3920, y: 3920, padding: 400}

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
var lengthWorld = {x: 3920, y: 3920, padding: 400}


function render() {
    game.debug.text( balls.countDead()   + ' Dead balls', 32, 32);
    game.debug.text( balls.countLiving() + ' Living balls', 32, 62);
}