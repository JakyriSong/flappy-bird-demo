import Game from "./game";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bird extends cc.Component {
    game: Game = null;

    jumpHeight: number;
    jumpDuration: number;

    onLoad () {
        this.jumpHeight = this.node.height * this.node.scaleY / 2;
        cc.log("jumpHeight=", this.jumpHeight);
        cc.log("bird height=", this.node.height, "scaleY=", this.node.scaleY);
        this.jumpDuration = 0.05;
    }

    start () {

    }

    // update (dt) {}

    flyUp() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .to(this.jumpDuration, { angle: 30 }, { easing: 'sineOut' })
            .to(this.jumpDuration, { position: cc.v2(this.node.x, this.node.y + this.jumpHeight) }, { easing: 'sineOut' })
            .to(this.jumpDuration, { angle: 0 }, { easing: 'sineIn' })
            .start();
    }

    flyDown() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .to(this.jumpDuration, { angle: -30 }, { easing: 'sineIn' })
            .to(this.jumpDuration, { position: cc.v2(this.node.x, this.node.y - this.jumpHeight) }, { easing: 'sineOut' })
            .to(this.jumpDuration, { angle: 0 }, { easing: 'sineOut' })
            .start();
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.game.gameOver();
    }

    init (game: Game) {
        this.game = game;
    }
}
