import Game from "./game";
import SettingData from "./settingData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Score extends cc.Component {
    game: Game;
    score: number = 0;
    intervalId: number | null = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    currentScoreLabel: cc.Label = null;

    @property(cc.Label)
    bestScoreLabel: cc.Label = null;

    @property(cc.Label)
    restartButtonLabel: cc.Label = null;

    init(game: Game) {
        this.game = game;
        this.reset();
    }

    reset() {
        this.clearCountDown();
        this.updateScore(0);
        this.node.active = false;
        this.scoreLabel.node.active = true;
        this.scoreLabel.node.zIndex = 999;
    }

    updateScore(score: number) {
        this.score = score;
        this.scoreLabel.string = this.score.toString();
    }

    addScore() {
        this.updateScore(this.score + 1);
    }

    showScoreBoard() {
        let settingData = SettingData.getInstance();
        settingData.maxScore = Math.max(settingData.maxScore, this.score);

        this.node.active = true;
        this.node.zIndex = 9999;

        this.currentScoreLabel.string = this.score.toString();
        this.bestScoreLabel.string = settingData.maxScore.toString();

        this.startCountDown(5);
    }

    startCountDown(initialTime: number) {
        let time = initialTime;
        cc.log("startCountDown");
        this.restartButtonLabel.string = time.toString();
        this.intervalId = setInterval(() => {
            if (time <= 0) {
                this.clearCountDown();
                this.game.restartGame();
            } else {
                time--;
                cc.log("count down, time = ", time);
                this.restartButtonLabel.string = time.toString();
            }
        }, 1000);
    }

    clearCountDown() {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
