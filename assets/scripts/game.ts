import Bird from "./bird";
import Ground from "./ground";
import PipePool from "./pipePool";
import Score from "./score";
import SettingData from "./settingData";

import { PlayMode, Difficulty } from './enums';

const {ccclass, property} = cc._decorator;

const SettingMap: Map<Difficulty, [number, number]> = new Map<Difficulty, [number, number]>(
    [
        // speed, interval
        [Difficulty.Practice, [90, 0]],
        [Difficulty.Easy, [90, 256]],
        [Difficulty.Hard, [120, 128]]
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
    canvasWidth: number;

    pipeBeginPosX: number;
    intervalBase: number;
    intervalOffset: number;
    interval: number;

    gravity: cc.Vec2 = cc.v2(0, -12);

    maxSpeed: number = 150;
    initSpeed: number;
    speed: number;
    speedStep: number = 2;

    isOver: boolean = false;
    playerName: String;
    startTime: number;
    playMode: PlayMode;
    difficulty: Difficulty;

    onLoad () {
        this.canvasHeight = cc.Canvas.instance.node.height;
        this.canvasWidth = cc.Canvas.instance.node.width;
        this.pipeBeginPosX = this.canvasWidth / 1.5 ;
        this.intervalBase = this.canvasWidth/3;

        this.loadSetting();

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
        this.initPhysicsManager();
        this.initListener();
        cc.log("isPaused", cc.director.isPaused());
    }

    loadSetting() {
        let settingData = SettingData.getInstance();
        this.playerName = settingData.playerName;
        this.startTime = settingData.startTime;
        this.playMode = settingData.playMode;
        this.difficulty = settingData.difficulty;
        [this.initSpeed, this.intervalOffset] = SettingMap.get(this.difficulty);
        this.speed = this.initSpeed;
        this.interval = this.intervalBase + this.intervalOffset;
        cc.log("[game] playMode", settingData.playMode, typeof(settingData.playMode));
        cc.log("[game] difficulty", settingData.difficulty, typeof(settingData.difficulty));
        cc.log("[game] interval", this.interval);

    }

    start () {
        this.startGame();
    }

    pauseGame() {
        if (this.difficulty == Difficulty.Practice) {
            this.gameOver();
        } else {
            this.bntPause.node.active = false;
            this.bntResume.node.active = true;
            cc.director.pause();
        }
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
        if (this.difficulty != Difficulty.Practice) {
            this.createPipe();
        }
        cc.log("starGame", cc.director.isPaused());
        if (cc.director.isPaused())
            cc.director.resume();
    }

    restartGame() {
        cc.log("is native", cc.sys.isNative);
        if (cc.sys.isNative && this.difficulty != Difficulty.Practice) {
            this.writeFile();
        }
        this.pipePool.reset();
        this.score.reset();
        this.bird.reset();
        this.startGame();
    }

    writeFile() {
        const filePath = jsb.fileUtils.getWritablePath()
            + this.playerName + "_" + this.startTime.toString() + ".txt";
        let content = '';
        if (jsb.fileUtils.isFileExist(filePath)) {
            content = jsb.fileUtils.getStringFromFile(filePath);
        }

        let scores = [];
        let maxScore = 0;
        const lines = content.split("\n");
        for (let i = 1; i < lines.length; i++) {
            if (lines[i]) {
                scores.push(parseInt(lines[i], 10));
            }
        }
        scores.push(this.score.score);
        for (let i = 0; i < scores.length; i++) {
            if (scores[i] > maxScore) {
                maxScore = scores[i];
            }
        }
        let writeContent = `ID: ${this.playerName}\tTimes: ${scores.length}\tMax: ${maxScore}\n`;
        scores.forEach(score => {
            writeContent += `${score}\n`;
        });
        jsb.fileUtils.writeStringToFile(writeContent, filePath);
        cc.log("game data updated to :", filePath);
    }

    backToMenu() {
        if (cc.director.isPaused())
            cc.director.resume();
        cc.director.loadScene('welcome');
    }

    gameOver() {
        this.isOver = true;
        this.bntPause.node.active = false;
        this.bntResume.node.active = false;
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
            const body = this.bird.getComponent(cc.RigidBody);
            switch (event.keyCode) {
                case cc.macro.KEY.w:
                case cc.macro.KEY.up:
                    body.type = cc.RigidBodyType.Static;
                    this.bird.flyUp();
                    body.type = cc.RigidBodyType.Dynamic;
                    break;
                case cc.macro.KEY.s:
                case cc.macro.KEY.down:
                    if (this.playMode == PlayMode.TwoPlayer){
                        body.type = cc.RigidBodyType.Static;
                        this.bird.flyDown();
                        body.type = cc.RigidBodyType.Dynamic;
                    }
                    break;
            }
        })
    }

    addScore() {
        cc.log("score + 1");
        this.score.addScore();
        this.speed = Math.min(this.initSpeed + (this.score.score * this.speedStep), this.maxSpeed);
        cc.log("speed", this.speed);
    }

}
