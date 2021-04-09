import Phaser from 'phaser';
import AnimationKeys from '~/consts/AnimationKeys';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';
import RocketMouse from '../game/RocketMouse';
import LaserObstacle from '../game/LaserObstacle';

export default class Game extends Phaser.Scene {

    private background!: Phaser.GameObjects.TileSprite;
    private mouseHole!: Phaser.GameObjects.Image;
    private window1!: Phaser.GameObjects.Image;
    private window2!: Phaser.GameObjects.Image;
    private bookcase1!: Phaser.GameObjects.Image;
    private bookcase2!: Phaser.GameObjects.Image;
    private bookcases: Phaser.GameObjects.Image[] = [];
    private windows: Phaser.GameObjects.Image[] = [];
    private mouse!: RocketMouse;
    private laserObstacle!: LaserObstacle;
    private coins!: Phaser.Physics.Arcade.StaticGroup;
    private scoreLabel!: Phaser.GameObjects.Text;
    private score = 0;

    

    constructor() {
        super(SceneKeys.Game)
    }

    init() {
        this.score = 0;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        
        this.background = this.add.tileSprite(
            0, 0,
            width, height,
            TextureKeys.Background
        )
            .setOrigin(0, 0)
            .setScrollFactor(0, 0);
        
        this.mouseHole = this.add.image(
            Phaser.Math.Between(900, 1500),
            501,
            TextureKeys.MouseHole
        );
        
        this.window1 = this.add.image(
            Phaser.Math.Between(900, 1300),
            200,
            TextureKeys.Window1
        );

        this.window2 = this.add.image(
            Phaser.Math.Between(1600, 2000),
            200,
            TextureKeys.Window2
        );

        this.windows = [this.window1, this.window2]

        this.bookcase1 = this.add.image(
            Phaser.Math.Between(2200, 2700),
            580,
            TextureKeys.Bookcase1
        )
            .setOrigin(0.5, 1);
        
        this.bookcase2 = this.add.image(
            Phaser.Math.Between(2900, 3400),
            580,
            TextureKeys.Bookcase2
        )
            .setOrigin(0.5, 1);
        
        this.bookcases = [this.bookcase1, this.bookcase2];
        
        // mouse
        this.mouse = new RocketMouse(this, width * 0.5, height - 30);
        this.add.existing(this.mouse)

        const body = this.mouse.body as Phaser.Physics.Arcade.Body;
        body.setCollideWorldBounds(true);
        body.setVelocityX(200);

        this.physics.world.setBounds(
            0, 0,
            Number.MAX_SAFE_INTEGER, height - 55
        );

        this.cameras.main.startFollow(this.mouse);
        this.cameras.main.setBounds(
            0, 0,
            Number.MAX_SAFE_INTEGER, height);
        
        // laserObstacle
        this.laserObstacle = new LaserObstacle(this, 900, 100);
        this.add.existing(this.laserObstacle);

        this.physics.add.overlap(
            this.laserObstacle,
            this.mouse,
            this.handleOverlapLaser,
            undefined,
            this);
        
        // coins
        this.coins = this.physics.add.staticGroup();
        this.spawnCoins();

        this.overlapCoins = this.physics.add.overlap(
            this.mouse,
            this.coins,
            this.handleCollectCoin,
            undefined,
            this
        );

        this.physics.add.overlap(
            this.laserObstacle,
            this.coins,
            this.coinsAndObstacle,
            undefined,
            this
        );
        
        //score
        this.scoreLabel = this.add.text(
            10, 10,
            `Score: ${this.score}`,
            {
                fontSize: '24px',
                color: '#080808',
                shadow: { fill: true, blur: 0, offsetY: 0 },
                padding: { left: 5, right: 5, top: 3, bottom: 5 }
            })
            .setScrollFactor(0);
        
        //gameover
        this.events.once('dead', this.dead, this);
         

    }
    
    update(t: number, dt: number) {
        this.background.setTilePosition(this.cameras.main.scrollX);
        this.wrapMouseHole();
        this.wrapWindows();
        this.wrapBookcases();
        this.wrapLaserObstacle();
        this.teleportBackwards();
    }

    private wrapMouseHole() {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        if (this.mouseHole.x + this.mouseHole.width < scrollX) {
            this.mouseHole.x = Phaser.Math.Between(
                rightEdge + 100,
                rightEdge + 1000
            )
        }
    }

    private wrapWindows()
    {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let width = this.window1.width * 2;

        if (this.window1.x + width < scrollX)
        {
            this.window1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + this.scale.width
            )

            const overlap = this.bookcases.find(bc => {
                Math.abs(this.window1.x - bc.x) <=
                    (bc.width + this.window1.width)/2
            })

            this.window1.visible = !overlap;
        }

        width = this.window2.width * 2;
        if (this.window2.x + width < scrollX)
        {
            this.window2.x = Phaser.Math.Between(
                this.window1.x + width,
                this.window1.x + width + this.scale.width
            )

            const overlap = this.bookcases.find(bc => {
                Math.abs(this.window2.x - bc.x) <=
                    (bc.width + this.window2.width)/2
            })

            this.window2.visible = !overlap;
        }
    }

    private wrapBookcases()
    {
        const scrollX = this.cameras.main.scrollX;
        const sceneWidth = this.scale.width;
        const rightEdge = scrollX + sceneWidth;
        
        let width = this.bookcase1.width * 2;
        if (this.bookcase1.x + width < scrollX)
        {
            this.bookcase1.x = Phaser.Math.Between(
                rightEdge + width,
                rightEdge + width + sceneWidth
            )
        }
        
        width = this.bookcase2.width * 2;
        if (this.bookcase2.x + width < scrollX)
        {
            this.bookcase2.x = Phaser.Math.Between(
                this.bookcase1.x + width,
                this.bookcase1.x + width + sceneWidth;
            )
            
        }
    }

    private wrapLaserObstacle()
    {
        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        const body = this.laserObstacle.body as
            Phaser.Physics.Arcade.StaticBody;

        const width = this.laserObstacle.width
        if (this.laserObstacle.x < scrollX) {
            this.laserObstacle.x = Phaser.Math.Between(
                rightEdge + width + 200,
                rightEdge + width + this.scale.width + 200
            )
            this.laserObstacle.y = Phaser.Math.Between(
                0, 300
            )

            body.x = this.laserObstacle.x + body.offset.x;
            body.y = this.laserObstacle.y+ body.offset.y;
        }
    }

    private handleOverlapLaser(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject)
    {
        obj2.kill();
        this.physics.world.removeCollider(this.overlapCoins);
    }

    private spawnCoins() {
        this.coins.children.each(child => {
            const coin = child as Phaser.Physics.Arcade.Sprite;
            this.coins.killAndHide(coin);
            coin.body.enable = false;
        })

        const scrollX = this.cameras.main.scrollX;
        const rightEdge = scrollX + this.scale.width;

        let x = rightEdge + 100;

        const numCoins = Phaser.Math.Between(1, 20);

        for (let i = 0; i < numCoins; i++){
            const coin = this.coins.get(
                x,
                Phaser.Math.Between(100, this.scale.height - 100),
                TextureKeys.Coin
            ) as Phaser.Physics.Arcade.Sprite;

            
            coin.setVisible(true);
            coin.setActive(true);

            const body = coin.body as Phaser.Physics.Arcade.StaticBody;
            body.setCircle(body.width * 0.4);
            body.setOffset(body.width * 0.1, body.width * 0.1);
            body.enable = true;
            body.updateFromGameObject();

            

            x += coin.width * 1.6;
        }
    }

    private handleCollectCoin(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) {
        const coin = obj2 as Phaser.Physics.Arcade.Sprite
        this.coins.killAndHide(coin);
        coin.body.enable = false;

        this.score += 1;
        this.scoreLabel.text = `Score: ${this.score}`;
    }

    private coinsAndObstacle(
        obj1: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) {
        const coin = obj2 as Phaser.Physics.Arcade.Sprite
        this.coins.killAndHide(coin);
        coin.body.enable = false;
    }

    private teleportBackwards() {
        const scrollX = this.cameras.main.scrollX;
        const maxX = 340 * 8;

        if (scrollX > maxX) {
            this.mouse.x -= maxX;
            this.mouseHole.x -= maxX;
            this.windows.forEach(win => {
                win.x -= maxX;
            });
            this.bookcases.forEach(win => {
                win.x -= maxX;
            });
            this.laserObstacle.x -= maxX;
            const laserBody = this.laserObstacle.body as
                Phaser.Physics.Arcade.StaticBody;
            laserBody.x -= maxX;
            this.spawnCoins();
            this.coins.children.each(
                child => {
                    const coin = child as Phaser.Physics.Arcade.Sprite;
                    if (!coin.active) {
                        return;
                    }
                    coin.x -= maxX;
                    const body = coin.body as Phaser.Physics.Arcade.StaticBody;
                    body.updateFromGameObject();
                }
            )
        }
    }

    private dead() {
        this.scene.run(SceneKeys.GameOver, { score: this.score });
    }
}