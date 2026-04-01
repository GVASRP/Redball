const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 450,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 800 }, debug: false }
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, cursors, joyStick;

function preload() {
    // Загружаем графику (пока временные ссылки, потом заменим на твои)
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/red_ball.png');
    this.load.image('ground', 'https://labs.phaser.io/assets/sprites/platform.png');
}

function create() {
    // Создаем мир
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 430, 'ground').setScale(2).refreshBody();

    // Наш колобок
    player = this.physics.add.sprite(100, 300, 'ball');
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);
    player.setCircle(15); // Делаем хитбокс круглым

    this.physics.add.collider(player, platforms);

    // Управление для теста (стрелочки)
    cursors = this.input.keyboard.createCursorKeys();
    
    // Текст-заглушка для интерфейса
    this.add.text(16, 16, 'Red Ball 5: Alpha', { fontSize: '24px', fill: '#fff' });
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.angle -= 10;
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.angle += 10;
    } else {
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-450);
    }
}
