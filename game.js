const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveL = false, moveR = false, jumpA = false;

function preload() {} // Всё рисуем сами кодом!

function create() {
    // 1. СОЧНОЕ НЕБО С ГРАДИЕНТОМ
    let bg = this.add.graphics();
    bg.fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xB0E2FF, 0xB0E2FF, 1);
    bg.fillRect(0, 0, 1280, 720).setScrollFactor(0);

    // СОЛНЦЕ И ОБЛАКА
    this.add.circle(1100, 120, 70, 0xFFFFE0, 0.9).setScrollFactor(0); 
    let clouds = this.add.graphics().setAlpha(0.6).setDepth(5).setScrollFactor(0);
    clouds.fillStyle(0xffffff, 1);
    for (let i = 0; i < 5; i++) { 
        let cx = 100 + Math.random() * 800;
        let cy = 100 + Math.random() * 150;
        clouds.fillCircle(cx, cy, 35); clouds.fillCircle(cx+40, cy-15, 45); clouds.fillCircle(cx+80, cy, 35);
    }

    // 2. ДЕТАЛИЗИРОВАННЫЙ ШАР (Как настоящий)
    let ballG = this.make.graphics({x: 0, y: 0, add: false});
    // Тень и основа
    ballG.fillStyle(0xcc0000, 1); ballG.fillCircle(40, 42, 40); // Тень снизу
    ballG.fillStyle(0xff3333, 1); ballG.fillCircle(40, 40, 40); // База
    ballG.fillStyle(0xffffff, 0.4); ballG.fillCircle(25, 20, 18); // Большой блик
    ballG.fillStyle(0xffffff, 0.8); ballG.fillCircle(18, 15, 6);  // Мелкий яркий блик
    // Лицо
    ballG.fillStyle(0xffffff, 1); ballG.fillCircle(25, 30, 8); ballG.fillCircle(55, 30, 8); // Глаза
    ballG.fillStyle(0x000000, 1); ballG.fillCircle(25, 30, 4); ballG.fillCircle(55, 30, 4); // Зрачки
    ballG.lineStyle(5, 0x000000, 0.8); ballG.beginPath(); ballG.arc(40, 45, 20, 0.2, Math.PI - 0.2, false); ballG.strokePath(); // Ротик
    ballG.generateTexture('ball', 80, 80);

    player = this.physics.add.sprite(200, 500, 'ball');
    player.setBounce(0.3).setCollideWorldBounds(true).setCircle(40);
    player.setDrag(950, 0); // Крутая инерция
    player.setMaxVelocity(580, 1300);

    // 3. ЗЕМЛЯ С ТЕКСТУРОЙ (Как на фото)
    platforms = this.physics.add.staticGroup();
    let groundWidth = 5000;
    
    // ОСНОВА ЗЕМЛИ (Коричневая почва)
    let g = this.add.graphics();
    g.fillStyle(0x8B4513, 1); 
    g.fillRect(0, 640, groundWidth, 250);
    // Добавляем текстуру "почвы" (камушки)
    g.fillStyle(0x6F370D, 1);
    for(let j=0; j<150; j++) { g.fillCircle(Math.random()*groundWidth, 660+Math.random()*50, 5+Math.random()*15); }
    // ТРАВА С СОВРЕМЕННЫМИ ТРАВИНКАМИ
    g.fillStyle(0x7cfc00, 1);
    g.fillRect(0, 640, groundWidth, 18);
    g.lineStyle(4, 0x66cc00, 0.9);
    for(let k=0; k<2500; k++) { // Много мелких травинок
        let gx = Math.random()*groundWidth;
        g.lineBetween(gx, 640, gx, 625 + Math.random()*10); 
    }
    
    // Невидимый хитбокс для физики
    let floor = this.add.rectangle(groundWidth/2, 680, groundWidth, 80, 0x000000, 0);
    this.physics.add.existing(floor, true);
    platforms.add(floor);

    this.physics.add.collider(player, platforms);

    // 4. КНОПКИ-КОНТУРЫ (Стрелки из оригинала)
    let ui = this.add.graphics().setScrollFactor(0).setDepth(100);
    ui.lineStyle(5, 0xffffff, 0.4);
    
    // Стрелка Влево
    ui.strokeRoundedRect(40, 600, 100, 80, 20); 
    ui.strokeTriangle(65, 640, 115, 615, 115, 665);
    // Стрелка Вправо
    ui.strokeRoundedRect(220, 600, 100, 80, 20);
    ui.strokeTriangle(295, 640, 245, 615, 245, 665);
    // Прыжок (Круг)
    ui.strokeCircle(1150, 630, 65);
    ui.fillStyle(0xffffff, 0.3); ui.fillCircle(1150, 630, 60); // Чуть-чуть заливки

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
    if (window.moveL) { player.setAccelerationX(-2300); player.angle -= 15; }
    else if (window.moveR) { player.setAccelerationX(2300); player.angle += 15; }
    else { player.setAccelerationX(0); player.setAngularVelocity(player.body.velocity.x * 1.8); }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-880);
        window.jumpA = false;
    }
        }
