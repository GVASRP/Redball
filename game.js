const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveL = false, moveR = false, jumpA = false;

function preload() {} // Ничего не грузим извне, рисуем всё сами!

function create() {
    // 1. КРАСИВОЕ НЕБО
    let bg = this.add.graphics();
    bg.fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xA6E0FF, 0xA6E0FF, 1);
    bg.fillRect(0, 0, 1280, 720).setScrollFactor(0);

    // 2. РИСУЕМ КНОПКИ (как на фото)
    let ui = this.add.graphics().setScrollFactor(0).setDepth(10);
    ui.lineStyle(6, 0xffffff, 0.4);
    // Кнопки влево/вправо
    ui.strokeRoundedRect(40, 580, 100, 80, 20); 
    ui.strokeRoundedRect(200, 580, 100, 80, 20);
    // Прыжок
    ui.strokeCircle(1150, 620, 60);

    // 3. РИСУЕМ ШАР (С тенями и бликами)
    let ballG = this.make.graphics({x: 0, y: 0, add: false});
    ballG.fillStyle(0xff3333, 1); ballG.fillCircle(40, 40, 40); // Основа
    ballG.fillStyle(0xffffff, 1); ballG.fillCircle(25, 30, 8); ballG.fillCircle(55, 30, 8); // Глаза
    ballG.fillStyle(0x000000, 1); ballG.fillCircle(25, 30, 4); ballG.fillCircle(55, 30, 4); // Зрачки
    ballG.lineStyle(4, 0x000000, 0.8); ballG.beginPath(); ballG.arc(40, 45, 20, 0.1, Math.PI - 0.1, false); ballG.strokePath(); // Улыбка
    ballG.generateTexture('ball', 80, 80);

    player = this.physics.add.sprite(200, 500, 'ball');
    player.setBounce(0.3).setCollideWorldBounds(true).setCircle(40);
    player.setDrag(900, 0); // ИНЕРЦИЯ торможения
    player.setMaxVelocity(550, 1200);

    // 4. РИСУЕМ ЗЕМЛЮ
    platforms = this.physics.add.staticGroup();
    let ground = this.add.rectangle(2500, 700, 5000, 60, 0x5e3a1f); // Почва
    let grass = this.add.rectangle(2500, 665, 5000, 15, 0x7cfc00); // Трава
    this.physics.add.existing(ground, true);
    platforms.add(ground);

    this.physics.add.collider(player, platforms);

    // Камера как в оригинале
    this.cameras.main.setBounds(0, 0, 5000, 720);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    setupControls();
}

function setupControls() {
    const bind = (id, action) => {
        let el = document.getElementById(id);
        el.ontouchstart = (e) => { e.preventDefault(); window[action] = true; };
        el.ontouchend = (e) => { e.preventDefault(); window[action] = false; };
    };
    bind('left-z', 'moveL'); bind('right-z', 'moveR'); bind('jump-z', 'jumpA');
}

function update() {
    const power = 2200; // Мощность разгона

    if (window.moveL) {
        player.setAccelerationX(-power);
        player.angle -= 15;
    } else if (window.moveR) {
        player.setAccelerationX(power);
        player.angle += 15;
    } else {
        player.setAccelerationX(0);
        player.setAngularVelocity(player.body.velocity.x * 1.8);
    }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-850);
        window.jumpA = false;
    }
                    }
        
