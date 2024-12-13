import Game from "./game";

const random = (min, max) => {
    return Math.random() * (max - min) + min
}

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pipe extends cc.Component {
    game: Game = null;
    isPass: boolean = false;
    hasNext: boolean = false;

    @property(cc.Sprite)
    topPipe: cc.Sprite = null;

    @property(cc.Sprite)
    bottomPipe: cc.Sprite = null;

    update (dt) {
        let speed = this.game.speed * dt
        this.node.x -= speed;

        if (this.node.x < -(this.game.canvasWidth + 100)) {
            cc.log("revert pipe");
            this.game.pipePool.revert(this.node);
        }
        if (!this.hasNext && this.game.pipeBeginPosX - this.node.x > this.game.interval) {
            cc.log("create pipe");
            this.game.createPipe();
            this.hasNext = true;
        }

        if (!this.isPass && this.game.bird.node.x > this.node.x) {
            cc.log("pipe:", this.game.bird.node.x, this.node.x);
            this.isPass = true;
            this.game.addScore();
        }

    }

    init (game: Game) {
        this.game = game;
        this.isPass = false;
        this.hasNext = false;
        this.initPos();
    }

    initPos() {
        this.node.setPosition(cc.v2(this.game.pipeBeginPosX, 0));

        let canvasHeight = this.game.canvasHeight;
        let groundHeight = this.game.ground.node.height;
        let y = canvasHeight / 2 - groundHeight;

        let gap = random(250, 300);
        let topHeight = random(10, 20);
        topHeight *= topHeight;

        let yt = canvasHeight / 2 - topHeight;
        let yb = yt - gap;
        this.topPipe.node.y = yt + groundHeight / 2;
        this.bottomPipe.node.y = yb + groundHeight / 2;
        cc.log("gap=", gap, " bottom y=", yb, " top y=" + yt);
    }
}
