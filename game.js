const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveL = false, moveR = false, jumpA = false;

function preload() {}

function create() {
    // 1. НЕБО С ГРАДИЕНТОМ
    let bg = this.add.graphics();
    bg.fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xB0E2FF, 0xB0E2FF, 1);
    bg.fillRect(0, 0, 1280, 720).setScrollFactor(0);

    // 2. СОЛНЦЕ И ОБЛАКА
    this.add.circle(1100, 120, 60, 0xFFFFE0, 0.8).setScrollFactor(0); // Солнце
    for (let i = 0; i < 5; i++) {
        let cx = Math.random() * 5000;
        let cy = 100 + Math.random() * 100;
        let cloud = this.add.graphics().setAlpha(0.7);
        cloud.fillStyle(0xffffff, 1);
        cloud.fillCircle(cx, cy, 30); cloud.fillCircle(cx+30, cy-10, 35); cloud.fillCircle(cx+60, cy, 30);
    }

    // 3. РИСУЕМ ОБЪЕМНЫЙ ШАР (с бликом)
    let ballG = this.make.graphics({x: 0, y: 0, add: false});
    ballG.fillStyle(0xff0000, 1); ballG.fillCircle(40, 40, 40); // База
    ballG.fillStyle(0xff6666, 0.5); ballG.fillCircle(25, 25, 15); // Блик для объема
    ballG.fillStyle(0xffffff, 1); ballG.fillCircle(25, 30, 8); ballG.fillCircle(55, 30, 8); // Глаза
    ballG.fillStyle(0x000000, 1); ballG.fillCircle(25, 30, 4); ballG.fillCircle(55, 30, 4); // Зрачки
    ballG.lineStyle(4, 0x000000, 0.8); ballG.beginPath(); ballG.arc(40, 45, 20, 0.2, Math.PI - 0.2, false); ballG.strokePath(); // Ротик
    ballG.generateTexture('ball', 80, 80);

    player = this.physics.add.sprite(200, 500, 'ball');
    player.setBounce(0.3).setCollideWorldBounds(true).setCircle(40);
    player.setDrag(900, 0); 
    player.setMaxVelocity(550, 1200);

    // 4. РИСУЕМ ЗЕМЛЮ КАК НА ФОТО (с камнями)
    platforms = this.physics.add.staticGroup();
    let groundWidth = 5000;
    
    // Сама земля
    let g = this.add.graphics();
    g.fillStyle(0x8B4513, 1); // Коричневый
    g.fillRect(0, 640, groundWidth, 200);
    // Добавляем "камушки" в землю для детализации
    g.fillStyle(0x6F370D, 1);
    for(let j=0; j<100; j++) { g.fillCircle(Math.random()*groundWidth, 660+Math.random()*40, 5+Math.random()*10); }
    // Трава
    g.fillStyle(0x7cfc00, 1);
    g.fillRect(0, 640, groundWidth, 15);
    
    let floor = this.add.rectangle(groundWidth/2, 680, groundWidth, 80, 0x000000, 0);
    this.physics.add.existing(floor, true);
    platforms.add(floor);

    this.physics.add.collider(player, platforms);

    // 5. КНОПКИ (Сделаем их более заметными, как контуры на фото)
    let ui = this.add.graphics().setScrollFactor(0).setDepth(100);
    ui.lineStyle(4, 0xffffff, 0.5);
    ui.strokeTriangle(60, 640, 120, 600, 120, 680); // Лево
    ui.strokeTriangle(280, 640, 220, 600, 220, 680); // Право
    ui.strokeCircle(1150, 620, 60); // Прыжок

    this.cameras.main.setBounds(0, 0, groundWidth, 720);
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
    if (window.moveL) { player.setAccelerationX(-2200); player.angle -= 15; }
    else if (window.moveR) { player.setAccelerationX(2200); player.angle += 15; }
    else { player.setAccelerationX(0); player.setAngularVelocity(player.body.velocity.x * 1.8); }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-850);
        window.jumpA = false;
    }
}
