import Phaser from 'phaser';

import Game from './scenes/Game';
import Preloader from './scenes/Preloader';
import GameOver from './scenes/GameOver';
import Title from './scenes/Title'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 640,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
			debug : false,
		}
	},
	scene: [Preloader, Game, GameOver, Title];
}

export default new Phaser.Game(config)
