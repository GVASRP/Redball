const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 450 },
    physics: { 
        default: 'arcade', 
        arcade: { gravity: { y: 1200 }, friction: 0.1, debug: false } 
    },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveLeft = false, moveRight = false, doJump = false;

function preload() {}

function create() {
    // Фон неба
    this.add.graphics().fillGradientStyle(0x87CEEB, 0x87CEEB, 0xB0E2FF, 0xB0E2FF, 1).fillRect(0, 0, 800, 450);

    // Земля
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(400, 430, 800, 40, 0x5e3a1f); 
    this.add.rectangle(400, 412, 800, 12, 0x76c410); 
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // Рисуем Шар (сделаем его чуть больше и четче)
    let graphics = this.make.graphics({x: 0, y: 0, add: false});
    graphics.fillStyle(0xff2222, 1);
    graphics.fillCircle(25, 25, 25);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(17, 18, 6); graphics.fillCircle(33, 18, 6);
    graphics.fillStyle(0x000000, 1);
    graphics.fillCircle(17, 18, 3); graphics.fillCircle(33, 18, 3);
    graphics.lineStyle(3, 0x000000, 0.8);
    graphics.beginPath(); graphics.arc(25, 28, 12, 0.2, Math.PI - 0.2, false); graphics.strokePath();
    graphics.generateTexture('playerBall', 50, 50);

    player = this.physics.add.sprite(100, 300, 'playerBall');
    player.setBounce(0.3);
    player.setCollideWorldBounds(true);
    player.setCircle(25);
    
    // Настройка инерции
    player.setDragX(500); // Сопротивление (чтобы не катился вечно)
    player.setMaxVelocity(350, 1000); // Макс скорость

    this.physics.add.collider(player, platforms);
    setupMobileControls();
}

function setupMobileControls() {
    document.getElementById('left-btn').ontouchstart = () => moveLeft = true;
    document.getElementById('left-btn').ontouchend = () => moveLeft = false;
    document.getElementById('right-btn').ontouchstart = () => moveRight = true;
    document.getElementById('right-btn').ontouchend = () => moveRight = false;
    document.getElementById('jump-btn').ontouchstart = () => doJump = true;
    document.getElementById('jump-btn').ontouchend = () => doJump = false;
}

function update() {
    const acceleration = 1200;

    if (moveLeft) {
        player.setAccelerationX(-acceleration);
        player.angle -= 12;
    } else if (moveRight) {
        player.setAccelerationX(acceleration);
        player.angle += 12;
    } else {
        player.setAccelerationX(0);
        // Эффект затухания вращения
        player.setAngularVelocity(player.body.velocity.x * 2);
    }

    if (doJump && player.body.touching.down) {
        player.setVelocityY(-600);
    }
}
