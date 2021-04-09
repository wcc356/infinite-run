import { Bodies } from 'matter';
import Phaser from 'phaser';
import TextureKeys from '~/consts/TextureKeys';


export default class LaserObstale extends Phaser.GameObjects.Container
{
    constructor(scene: Phaser.Scene, x: number, y: number)
    {
        super(scene, x, y);
        
        const top = scene.add.image(
            0, 0, TextureKeys.LaserEnd
        )
            .setOrigin(0.5, 0);
        
        const middle = scene.add.image(
            0, top.y + top.displayHeight,
            TextureKeys.LaserMiddle
        )
            .setOrigin(0.5, 0);
        
        middle.setDisplaySize(middle.width, 150);
        
        const bottom = scene.add.image(
            0, middle.y + middle.displayHeight,
            TextureKeys.LaserEnd
        )
            .setOrigin(0.5, 0)
            .setFlipY(true);
        
        this.add(top);
        this.add(middle);
        this.add(bottom);

        scene.physics.add.existing(this, true);
        const body = this.body as Phaser.Physics.Arcade.StaticBody;
        const width = top.displayWidth;
        const height =
            top.displayHeight +
            middle.displayHeight +
            bottom.displayHeight;
        body.setSize(width*0.6, height*0.8);
        body.setOffset(-width * 0.3, height * 0.1);

        body.position.x = this.x + body.offset.x;
        body.position.y = this.y + body.offset.y;
    }
}