import Game from "./game";
import { PlayMode } from './enums';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bird extends cc.Component {
    game: Game = null;

    jumpHeight: number;
    jumpDuration: number;
    visibleHeight: number;
    birdHeight: number;
    beginY: number;

    onLoad () {
        this.birdHeight = this.node.height * this.node.scaleY;
        this.jumpHeight = this.birdHeight * 1.5;
        this.jumpDuration = 0.03;
        this.visibleHeight = cc.view.getVisibleSize().height / 2;
        this.beginY = this.node.y;
        cc.log("jumpHeight=", this.jumpHeight);
        cc.log("bird height=", this.node.height, "scaleY=", this.node.scaleY);
        cc.log("bird y=", this.node.y);
        cc.log("visable height=", this.visibleHeight);
    }

    flyUp() {
        cc.Tween.stopAllByTarget(this.node);
        let targetY = this.node.y + this.jumpHeight;
        // 边界判断
        if (this.node.y + this.jumpHeight >= this.visibleHeight - this.birdHeight / 2) {
            targetY = this.visibleHeight - this.birdHeight / 2
        }
        cc.tween(this.node)
            .to(this.jumpDuration, { angle: 30 }, { easing: 'sineOut' })
            .to(this.jumpDuration, { position: cc.v2(this.node.x, targetY) }, { easing: 'sineOut' })
            .to(this.jumpDuration, { angle: 0 }, { easing: 'sineIn' })
            .start();
        cc.log("flyUp bird position y", this.node.y);
    }

    flyDown() {
        cc.Tween.stopAllByTarget(this.node);
        cc.tween(this.node)
            .to(this.jumpDuration, { angle: -30 }, { easing: 'sineIn' })
            .to(this.jumpDuration, { position: cc.v2(this.node.x, this.node.y - this.jumpHeight) }, { easing: 'sineOut' })
            .to(this.jumpDuration, { angle: 0 }, { easing: 'sineOut' })
            .start();
        cc.log("flyDown bird position y", this.node.y);
    }


    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        this.game.gameOver();
    }

    init (game: Game) {
        this.game = game;
    }

    reset() {
        const body = this.node.getComponent(cc.RigidBody);
        body.type = cc.RigidBodyType.Static;
        cc.tween(this.node)
            .to(this.jumpDuration, { position: cc.v2(this.node.x, this.beginY) }, { easing: 'sineOut' })
            .start();
        body.type = cc.RigidBodyType.Dynamic;
    }
}
