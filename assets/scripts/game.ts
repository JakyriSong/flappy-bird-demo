import Bird from "./bird";
import Ground from "./ground";
import PipePool from "./pipePool";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {
    @property(cc.Component)
    ground: Ground = null;

    @property(cc.Component)
    pipePool: PipePool = null;

    @property(cc.Component)
    bird: Bird = null;

    pipe: cc.Node[] = [];

    canvasHeight: number;

    speed: number = 200;
    interval: number = 384;
    pipeBeginPosX: number = 768;
    isStart: boolean = false;
    isOver: boolean = false;

    onLoad () {
        this.canvasHeight = cc.Canvas.instance.node.height;

        this.ground.init(this);

        this.bird = this.bird.getComponent('bird');
        this.bird.init(this);

        this.pipePool = this.pipePool.getComponent('pipePool');
        this.pipePool.init(this)

        this.initPhysicsManager();
        this.initListener();
    }

    start () {
        if (!this.isStart) {
            this.startGame();
        }
    }

    startGame() {
        this.isStart = true;
        this.createPipe();
    }

    gameOver() {
        this.isOver = true;
        cc.log("Game Over!");
    }

    createPipe() {
        let node = this.pipePool.getPipe();
        this.node.addChild(node);
    }

    initPhysicsManager() {
        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabledDebugDraw = true;
        collisionManager.enabled = true;
    }

    initListener() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.up:
                    this.bird.flyUp();
                    break;
                case cc.macro.KEY.s:
                case cc.macro.KEY.down:
                    this.bird.flyDown();
            }
        })
    }

}
