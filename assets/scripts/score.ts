import Game from "./game";
import SettingData from "./settingData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Score extends cc.Component {
    game: Game;
    score: number = 0;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    currentScoreLabel: cc.Label = null;

    @property(cc.Label)
    bestScoreLabel: cc.Label = null;

    init(game: Game) {
        this.game = game;
        this.reset();
    }

    reset() {
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
    }
}