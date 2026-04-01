const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 800, height: 450 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1200 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveLeft = false, moveRight = false, doJump = false;

function preload() {
    // Здесь пока пусто, рисуем всё программно ниже
}

function create() {
    // 1. Красивое небо (градиент)
    let graphics = this.add.graphics();
    graphics.fillGradientStyle(0x87CEEB, 0x87CEEB, 0xE0F7FA, 0xE0F7FA, 1);
    graphics.fillRect(0, 0, 800, 450);

    // 2. Создаем землю с травой
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(400, 430, 800, 40, 0x4d2600); // Земля
    this.add.rectangle(400, 412, 800, 10, 0x4db300); // Трава сверху
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    // 3. Рисуем Красный Шар (Player)
    let ballCanvas = this.make.graphics({x: 0, y: 0, add: false});
    ballCanvas.fillStyle(0xff0000, 1);
    ballCanvas.fillCircle(20, 20, 20); // Тело
    ballCanvas.fillStyle(0xffffff, 1);
    ballCanvas.fillCircle(12, 15, 4); // Левый глаз
    ballCanvas.fillCircle(28, 15, 4); // Правый глаз
    ballCanvas.fillStyle(0x000000, 1);
    ballCanvas.fillCircle(12, 15, 2); // Зрачок
    ballCanvas.fillCircle(28, 15, 2); 
    ballCanvas.lineStyle(2, 0x000000, 1);
    ballCanvas.beginPath();
    ballCanvas.arc(20, 22, 10, 0.2, Math.PI - 0.2, false); // Улыбка
    ballCanvas.strokePath();
    
    ballCanvas.generateTexture('playerBall', 40, 40);

    player = this.physics.add.sprite(100, 300, 'playerBall');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    player.setCircle(20);
    this.physics.add.collider(player, platforms);

    setupMobileControls();
}

function setupMobileControls() {
    // Привязываем нажатия к кнопкам из HTML
    const bind = (id, target, val) => {
        const el = document.getElementById(id);
        el.ontouchstart = (e) => { e.preventDefault(); window[target] = val; };
        el.ontouchend = (e) => { e.preventDefault(); window[target] = !val; };
    };
    
    window.moveLeft = false; window.moveRight = false; window.doJump = false;
    
    document.getElementById('left-btn').ontouchstart = () => moveLeft = true;
    document.getElementById('left-btn').ontouchend = () => moveLeft = false;
    document.getElementById('right-btn').ontouchstart = () => moveRight = true;
    document.getElementById('right-btn').ontouchend = () => moveRight = false;
    document.getElementById('jump-btn').ontouchstart = () => doJump = true;
    document.getElementById('jump-btn').ontouchend = () => doJump = false;
}

function update() {
    if (moveLeft) {
        player.setVelocityX(-220);
        player.angle -= 8;
    } else if (moveRight) {
        player.setVelocityX(220);
        player.angle += 8;
    } else {
        player.setVelocityX(0);
        player.setAngularVelocity(0);
    }

    if (doJump && player.body.touching.down) {
        player.setVelocityY(-550);
    }
}
