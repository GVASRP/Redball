const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 450 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1000 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveLeft = false, moveRight = false, doJump = false;

function preload() {
    // Временный спрайт красного шара
    this.load.image('ball', 'https://labs.phaser.io/assets/sprites/red_ball.png');
}

function create() {
    // Создаем землю (платформу)
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(400, 430, 800, 40, 0x008000); // Зеленая трава
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Создаем игрока
    player = this.physics.add.sprite(100, 300, 'ball');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setCircle(16); // Чтобы катился как круг
    this.physics.add.collider(player, platforms);

    // Логика кнопок для телефона
    setupControls();
}

function setupControls() {
    document.getElementById('left-btn').ontouchstart = () => moveLeft = true;
    document.getElementById('left-btn').ontouchend = () => moveLeft = false;
    document.getElementById('right-btn').ontouchstart = () => moveRight = true;
    document.getElementById('right-btn').ontouchend = () => moveRight = false;
    document.getElementById('jump-btn').ontouchstart = () => doJump = true;
    document.getElementById('jump-btn').ontouchend = () => doJump = false;
}

function update() {
    if (moveLeft) {
        player.setVelocityX(-200);
        player.angle -= 10;
    } else if (moveRight) {
        player.setVelocityX(200);
        player.angle += 10;
    } else {
        player.setVelocityX(0);
    }

    if (doJump && player.body.touching.down) {
        player.setVelocityY(-500);
    }
}
