const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveL = false, moveR = false, jumpA = false;

function preload() {} // Всё рисуем сами!

function create() {
    // 1. ЧИСТОЕ НЕБО (Градиент как на фото)
    let bg = this.add.graphics();
    bg.fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xA6E0FF, 0xA6E0FF, 1);
    bg.fillRect(0, 0, 1280, 720).setScrollFactor(0);

    // 2. БОЛЬШОЕ СОЛНЦЕ (Программная отрисовка как на твоём фото)
    // Рисуем солнце с мягким свечением
    let sun = this.add.circle(1100, 150, 100, 0xFFFFE0, 0.9);
    sun.setScrollFactor(0); // Привязано к экрану

    // 3. РИСУЕМ ШАР (С сочным лицом)
    let ballG = this.make.graphics({x: 0, y: 0, add: false});
    ballG.fillStyle(0xff3333, 1); ballG.fillCircle(40, 40, 40); // База
    ballG.fillStyle(0xffffff, 1); ballG.fillCircle(25, 30, 8); ballG.fillCircle(55, 30, 8); // Глаза
    ballG.fillStyle(0x000000, 1); ballG.fillCircle(25, 30, 4); ballG.fillCircle(55, 30, 4); // Зрачки
    ballG.lineStyle(4, 0x000000, 0.8); ballG.beginPath(); ballG.arc(40, 45, 20, 0.2, Math.PI - 0.2, false); ballG.strokePath(); // Улыбка
    ballG.generateTexture('hero', 80, 80);

    player = this.physics.add.sprite(200, 500, 'hero');
    player.setBounce(0.3).setCollideWorldBounds(true).setCircle(40);
    player.setDrag(950, 0); // ИНЕРЦИЯ торможения
    player.setMaxVelocity(580, 1300);

    // 4. РИСУЕМ ЗЕМЛЮ (Как на фото: почва с камнями)
    platforms = this.physics.add.staticGroup();
    let groundWidth = 5000;
    
    // Создаем бесконечную текстуру земли прямо кодом
    let gRect = this.add.rectangle(groundWidth/2, 680, groundWidth, 80, 0x5e3a1f); // Почва
    let grassRect = this.add.rectangle(groundWidth/2, 645, groundWidth, 15, 0x7cfc00); // Трава
    this.physics.add.existing(grassRect, true); // Добавляем только траву как коллидер
    platforms.add(grassRect);

    // Добавим камушков в землю для детализации
    let gDetails = this.add.graphics();
    gDetails.fillStyle(0x4d2600, 1);
    for(let j=0; j<100; j++) { gDetails.fillCircle(Math.random()*groundWidth, 670+Math.random()*20, 3+Math.random()*6); }

    this.physics.add.collider(player, platforms);

    // Камера следит за игроком
    this.cameras.main.setBounds(0, 0, groundWidth, 720);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    setupInput();
}

function setupInput() {
    const bind = (id, action) => {
        let el = document.getElementById(id);
        el.ontouchstart = (e) => { e.preventDefault(); window[action] = true; };
        el.ontouchend = (e) => { e.preventDefault(); window[action] = false; };
    };
    bind('left-z', 'moveL'); bind('right-z', 'moveR'); bind('jump-z', 'jumpA');
}

function update() {
    const power = 2200; // Мощность разгона для инерции

    if (window.moveL) {
        player.setAccelerationX(-power);
        player.angle -= 15;
    } else if (window.moveR) {
        player.setAccelerationX(power);
        player.angle += 15;
    } else {
        player.setAccelerationX(0);
        // Плавная остановка вращения
        player.setAngularVelocity(player.body.velocity.x * 1.8);
    }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-880);
        window.jumpA = false;
    }
        }
                                  
