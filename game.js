const config = {
    type: Phaser.AUTO,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH, width: 1280, height: 720 },
    physics: { default: 'arcade', arcade: { gravity: { y: 1600 }, debug: false } },
    scene: { preload: preload, create: create, update: update }
};

const game = new Phaser.Game(config);
let player, platforms, moveL = false, moveR = false, jumpA = false;

function preload() {
    // ЗАГРУЗКА ТВОИХ ФАЙЛОВ
    this.load.image('sky', 'sky.png'); // Твоё новое небо
    // Если ты уже загрузил другие файлы, они тоже подхватятся:
    this.load.image('ball', 'ball.png');
    this.load.image('ground', 'ground.png');
}

function create() {
    let groundWidth = 5000;

    // 1. ДОБАВЛЯЕМ НЕБО (Оно будет бесконечным)
    // tileSprite заставляет картинку повторяться, если уровень длинный
    this.add.tileSprite(0, 0, groundWidth, 720, 'sky').setOrigin(0, 0).setScrollFactor(0.5);

    // 2. ИГРОК (Если ball.png нет, создаем временный красный шар)
    if (this.textures.exists('ball')) {
        player = this.physics.add.sprite(200, 500, 'ball').setScale(0.8);
    } else {
        let bG = this.make.graphics({x: 0, y: 0, add: false});
        bG.fillStyle(0xff3333).fillCircle(40, 40, 40).generateTexture('ball_temp', 80, 80);
        player = this.physics.add.sprite(200, 500, 'ball_temp');
    }
    
    player.setBounce(0.3).setCollideWorldBounds(true).setCircle(40);
    player.setDrag(950, 0); 
    player.setMaxVelocity(580, 1300);

    // 3. ЗЕМЛЯ
    platforms = this.physics.add.staticGroup();
    if (this.textures.exists('ground')) {
        let groundTile = this.add.tileSprite(groundWidth/2, 690, groundWidth, 140, 'ground');
        this.physics.add.existing(groundTile, true);
        platforms.add(groundTile);
    } else {
        let g = this.add.rectangle(groundWidth/2, 680, groundWidth, 80, 0x5e3a1f);
        this.physics.add.existing(g, true);
        platforms.add(g);
    }

    this.physics.add.collider(player, platforms);

    // КАМЕРА
    this.cameras.main.setBounds(0, 0, groundWidth, 720);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    setupControls();
}

function setupControls() {
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
    if (window.moveL) { player.setAccelerationX(-2300); player.angle -= 15; }
    else if (window.moveR) { player.setAccelerationX(2300); player.angle += 15; }
    else { player.setAccelerationX(0); player.setAngularVelocity(player.body.velocity.x * 1.8); }

    if (window.jumpA && player.body.touching.down) {
        player.setVelocityY(-880);
        window.jumpA = false;
    }
}
