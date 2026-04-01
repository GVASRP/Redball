// В начале файла добавим переменную для данных уровня
let levelData;

function preload() {
    // ЗАГРУЗКА КОНФИГА УРОВНЯ
    this.load.json('level1', 'levels/level1.json');
    
    // Загрузка текстур (неба, шара и т.д.)
    this.load.image('sky', 'sky.png');
}

function create() {
    levelData = this.cache.json.get('level1');
    const worldWidth = levelData.groundWidth;

    // 1. ФОН И СОЛНЦЕ
    this.add.graphics().fillGradientStyle(0x4FA9FF, 0x4FA9FF, 0xA6E0FF, 0xA6E0FF, 1)
        .fillRect(0, 0, 1280, 720).setScrollFactor(0);
    this.add.circle(1100, 150, 100, 0xFFFFE0, 0.9).setScrollFactor(0);

    // 2. ГРУППЫ
    platforms = this.physics.add.staticGroup();
    let boxes = this.physics.add.group();

    // 3. АВТО-ГЕНЕРАЦИЯ ПЛАТФОРМ ИЗ JSON
    levelData.platforms.forEach(p => {
        createPlatform(this, p.x, p.y, p.w, p.h);
    });

    // 4. АВТО-ГЕНЕРАЦИЯ ЯЩИКОВ ИЗ JSON
    levelData.boxes.forEach(b => {
        let box = boxes.create(b.x, b.y, null);
        // Генерируем текстуру ящика, если нет картинки
        if(!this.textures.exists('wood_box')) {
            let g = this.make.graphics({x:0, y:0, add:false});
            g.fillStyle(0x8B4513).fillRect(0,0,80,80).lineStyle(4, 0x5e3a1f).strokeRect(5,5,70,70);
            g.generateTexture('wood_box', 80, 80);
        }
        box.setTexture('wood_box').setDrag(100).setMass(2);
    });

    // 5. ИГРОК (Ставим на позицию из конфига)
    player = this.physics.add.sprite(levelData.playerStart.x, levelData.playerStart.y, 'ball_hero');
    // ... (тут настройки физики плеера как раньше)

    // КОЛЛИЗИИ И КАМЕРА
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(boxes, platforms);
    this.physics.add.collider(player, boxes);
    this.cameras.main.setBounds(0, 0, worldWidth, 720);
    this.cameras.main.startFollow(player, true, 0.1, 0.1);

    setupInput();
}

function createPlatform(scene, x, y, width, height) {
    let plat = scene.add.rectangle(x, y, width, height, 0x5e3a1f);
    let grass = scene.add.rectangle(x, y - height/2 + 7, width, 15, 0x7cfc00);
    scene.physics.add.existing(plat, true);
    platforms.add(plat);
}
