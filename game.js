const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 } } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, boxes, moveL = false, moveR = false, jumpA = false;

// --- ТВОЙ РЕДАКТОР УРОВНЯ ---
// Просто копируй строчки и меняй X и Y, чтобы строить продолжение!
const levelMap = {
    platforms: [
        {x: 600, y: 680, w: 1200}, // Начало
        {x: 1800, y: 600, w: 400},  // Первая ступенька
        {x: 2500, y: 680, w: 1000}, // Островок
        {x: 3800, y: 550, w: 600}   // Высокая платформа
    ],
    boxes: [
        {x: 1000, y: 500}, // Первый ящик
        {x: 2600, y: 500}  // Второй ящик
    ]
};

function preload() {} 

function create() {
    // 1. ВИЗУАЛ (Солнце и Небо)
    this.add.graphics().fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xA6E0FF, 0xA6E0FF, 1).fillRect(0, 0, 1280, 720).setScrollFactor(0);
    this.add.circle(1100, 150, 100, 0xFFFFE0, 0.9).setScrollFactor(0);

    platforms = this.physics.add.staticGroup();
    boxes = this.physics.add.group();

    // 2. СТРОИМ УРОВЕНЬ ИЗ СПИСКА ВЫШЕ
    levelMap.platforms.forEach(p => {
        let plat = this.add.rectangle(p.x, p.y, p.w, 80, 0x5e3a1f);
        this.add.rectangle(p.x, p.y - 33, p.w, 15, 0x7cfc00); // Трава
        this.physics.add.existing(plat, true);
        platforms.add(plat);
    });

    levelMap.boxes.forEach(b => {
        let box = boxes.create(b.x, b.y, null);
        let g = this.make.graphics({x:0, y:0, add:false});
        g.fillStyle(0x8B4513).fillRect(0,0,70,70).lineStyle(4, 0x5e3a1f).strokeRect(5,5,60,60);
        g.generateTexture('box'+b.x, 70, 70);
        box.setTexture('box'+b.x).setDrag(200).setMass(2).setBounce(0.1);
    });

    // 3. ИГРОК
    let bG = this.make.graphics({x: 0, y: 0, add: false});
    bG.fillStyle(0xff3333).fillCircle(40, 40, 40);
    bG.fillStyle(0xffffff).fillCircle(25, 30, 8).fillCircle(55, 30, 8);
    bG.fillStyle(0x000000).fillCircle(25, 30, 4).fillCircle(55, 30, 4);
    bG.generateTexture('hero', 80, 80);
    
    player = this.physics.add.sprite(200, 500, 'hero');
    player.setBounce(0.3).setCircle(40).setDrag(950, 0).setMaxVelocity(600, 1200);

    // 4. ФИЗИКА
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(boxes, platforms);
    this.physics.add.collider(player, boxes);

    this.cameras.main.setBounds(0, 0, 5000, 720);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    setupInput();
}

function setupInput() {
    const bind = (id, action) => {
        let el = document.getElementById(id);
        if(el) {
            el.ontouchstart = (e) => { e.preventDefault(); window[action] = true; };
            el.ontouchend = (e) => { e.preventDefault(); window[action] = false; };
        }
    };
    bind('left-z', 'moveL'); bind('right-z', 'moveR'); bind('jump-z', 'jumpA');
}

function update() {
    if (window.moveL) { player.setAccelerationX(-2200); player.angle -= 15; }
    else if (window.moveR) { player.setAccelerationX(2200); player.angle += 15; }
    else { player.setAccelerationX(0); player.setAngularVelocity(player.body.velocity.x * 1.5); }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-850);
        window.jumpA = false;
    }
                                                                                    }
