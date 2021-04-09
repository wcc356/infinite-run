import phaser from 'phaser';
import SceneKeys from '~/consts/SceneKeys';

export default class GameOver extends Phaser.Scene{
    private score: number;

    constructor() {    
        super(SceneKeys.GameOver);
    }

    init(data) {
        this.score = data.score as number;
    }

    create() {
        const { width, height } = this.scale;

        const x = width * 0.5;
        const y = height * 0.5;

        this.add.rectangle(x, y, width, height, '#ffffff', 0.5); 

        this.add.text(
            x, y ,
            `You Got ${this.score} Points!`, {
            fontFamily: 'Arial Black',
            fontSize: '48px',
            color: '#F8F0EE',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 15, right: 15, top: 10, bottom: 10 }
        })
            .setOrigin(0.5)

        
        this.add.text(
            x, y * 1.3,
            'Press Space to Play Again', {
            fontSize: '28px',
            color: '#FFFFFF',
            shadow: { fill: true, blur: 0, offsetY: 0 },
            padding: { left: 15, right: 15, top: 10, bottom: 10 }
        })
            .setOrigin(0.5)
           
        
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.stop(SceneKeys.GameOver);
            this.scene.stop(SceneKeys.Game);
            this.scene.start(SceneKeys.Game);
        }) 
    }
}
