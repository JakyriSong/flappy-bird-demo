import Game from "./game";
import Welcome from "./welcome";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Ground extends cc.Component {
    game: Game = null;
    gd: cc.Node[];
    speed: number;

    onLoad () {
        this.speed = this.game == null ? 200 : this.game.speed;
        this.gd = this.node.children;
        cc.log("gd height=", this.gd[0].height);
        cc.log("canvos height=", cc.Canvas.instance.node.height);
    }

    start () {

    }

    update (dt) {
        this.gd[0].x -= this.speed * dt;
        this.gd[1].x -= this.speed * dt;
        if (this.gd[0].x  <= -this.gd[0].width) {
            this.gd[0].x = this.gd[1].width + this.gd[1].x;
        }
        if (this.gd[1].x  <= -this.gd[1].width) {
            this.gd[1].x = this.gd[0].width + this.gd[0].x;
        }
    }

    init (game: Game) {
        this.game = game;
    }
}
