import Bird from "./bird";
import Ground from "./ground";
import PipePool from "./pipePool";
import Score from "./score";
import SettingData from "./settingData";

import { PlayMode, Difficulty } from './enums';

const {ccclass, property} = cc._decorator;

const SettingMap: Map<Difficulty, [number, number]> = new Map<Difficulty, [number, number]>(
    [
        // intvervalStep, 
        [Difficulty.Easy, [4, 256]],
        [Difficulty.Medium, [3, 192]],
        [Difficulty.Hard, [2, 128]]
    ]
);

@ccclass
export default class Game extends cc.Component {
    @property(cc.Component)
    ground: Ground = null;

    @property(cc.Component)
    pipePool: PipePool = null;

    @property(cc.Component)
    bird: Bird = null;

    @property(cc.Component)
    score: Score = null;

    @property(cc.Button)
    bntPause: cc.Button = null;

    @property(cc.Button)
    bntResume: cc.Button = null;

    pipe: cc.Node[] = [];

    canvasHeight: number;

    gravity: cc.Vec2 = cc.v2(0, -100);
    maxSpeed: number = 200;
    initSpeed: number = 150;
    speed: number = 150;
    speedStep: number = 2;
    intervalBase: number = 384;
    intervalOffset: number = 192;
    pipeBeginPosX: number = 768;
    interval: number = this.intervalBase;
    isOver: boolean = false;
    playMode: PlayMode;
    difficulty: Difficulty;

    onLoad () {
        this.canvasHeight = cc.Canvas.instance.node.height;

        this.ground.init(this);

        this.bird = this.bird.getComponent('bird');
        this.bird.init(this);

        this.pipePool = this.pipePool.getComponent('pipePool');
        this.pipePool.init(this);

        this.score.init(this);

        cc.log("Game scene loaded");
    }

    onEnable() {
        cc.log("Game scene enabled");
        this.loadSetting();
        this.initPhysicsManager();
        this.initListener();
        cc.log("isPaused", cc.director.isPaused());
    }

    loadSetting() {
        let settingData = SettingData.getInstance();
        this.playMode = settingData.playMode;
        this.difficulty = settingData.difficulty;
        [this.speedStep, this.intervalOffset] = SettingMap.get(this.difficulty);
        this.interval = this.intervalBase + this.intervalOffset;
        cc.log("[game] playMode", settingData.playMode, typeof(settingData.playMode));
        cc.log("[game] difficulty", settingData.difficulty, typeof(settingData.difficulty));
        cc.log("[game]", this.interval);
        cc.log("[game] interval", this.interval);

    }

    start () {
        this.startGame();
    }

    pauseGame() {
        this.bntPause.node.active = false;
        this.bntResume.node.active = true;
        cc.director.pause();
    }
    
    resumeGame() {
        this.bntPause.node.active = true;
        this.bntResume.node.active = false;
        cc.director.resume();
    }

    startGame() {
        this.isOver = false;
        this.bntPause.node.active = true;
        this.bntResume.node.active = false;
        this.createPipe();
        cc.log("starGame", cc.director.isPaused());
        if (cc.director.isPaused())
            cc.director.resume();
    }

    restartGame() {
        this.bird.reset();
        this.pipePool.reset();
        this.score.reset();
        this.startGame();
    }

    backToMenu() {
        if (cc.director.isPaused())
            cc.director.resume();
        cc.director.loadScene('welcome');
    }

    gameOver() {
        this.isOver = true;
        cc.log("speed", this.speed);
        cc.log("Game Over!");
        this.score.showScoreBoard();
        cc.director.pause();
    }

    createPipe() {
        let node = this.pipePool.getPipe();
        this.node.addChild(node);
    }

    initPhysicsManager() {
        const physicsManager = cc.director.getPhysicsManager();
        // 单人模式开启重力
        if (this.playMode == PlayMode.OnePlayer) {
            physicsManager.enabled = true;
            physicsManager.gravity = this.gravity;
        } else {
            physicsManager.enabled = false;
        }

        const collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
    }

    initListener() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {
            if (this.isOver) return;
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.up:
                    const body = this.bird.getComponent(cc.RigidBody);
                    body.type = cc.RigidBodyType.Static;
                    this.bird.flyUp();
                    body.type = cc.RigidBodyType.Dynamic;
                    break;
                case cc.macro.KEY.s:
                case cc.macro.KEY.down:
                    if (this.playMode == PlayMode.TwoPlayer)
                        this.bird.flyDown();
                    break;
            }
        })
    }

    addScore() {
        cc.log("score + 1");
        this.score.addScore();
        this.speed = Math.min(this.initSpeed + Math.floor(this.score.score / this.speedStep), this.maxSpeed);
        cc.log("speed", this.speed);
    }

}
