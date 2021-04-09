import Phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';
import TextureKeys from '~/consts/TextureKeys';

export default class Title extends Phaser.Scene {
    constructor() {
        super(SceneKeys.Title);
    }

    create() {
        const { width, height } = this.scale;

        this.background = this.add.tileSprite(
            0, 0,
            width, height,
            TextureKeys.Background
        )
            .setOrigin(0, 0)
        
        this.add.text(
            width / 2, height * 0.4,
            ['Running', 'Rocket', 'Mouse'],
            {
                fontFamily: 'Arial Black',
                fontSize: 64,
                color: '#EF424C',
                align: 'center',
                stroke: '#2D3440',
                strokeThickness: 14,
            })
            .setOrigin(0.5, 0.5);
        
        const press = this.add.text(
            width/2, height* 0.7,
            'Press Space to Start the game', {
            fontSize: '32px',
                color: '#F8F0EE',
            padding: { left: 15, right: 15, top: 10, bottom: 10 }
        })
            .setStroke('#28DFDB', 3)
            .setShadow(2, 2, '#28DFDB', 2, false, false)
            .setOrigin(0.5);
        
        this.flashElement(this, press);
        
        this.input.keyboard.once('keydown-SPACE', el => this.scene.start(SceneKeys.Game))
    }

    private flashElement(scene, element,
        repeat = true, easing = 'Linear',
        overallDuration = 1500, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration =
                overallDuration - visiblePauseDuration / 2;
            
            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 0,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: visiblePauseDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 0,
                        ease: easing,
                        onComplete: () => {
                            if (repeat === true) {
                                this.flashElement(scene, element);
                            }
                        }
                    }
                ]
            });
        
        }
    }
}