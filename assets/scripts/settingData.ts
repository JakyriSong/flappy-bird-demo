import { PlayMode, Difficulty } from './enums';
const {ccclass, property} = cc._decorator;

@ccclass
export default class SettingData extends cc.Component {
    static _instance: SettingData = null;

    playerName: String;
    startTime: number;
    playMode: PlayMode;
    difficulty: Difficulty;
    maxScore: number;

    onLoad() {
        if (SettingData._instance) {
            this.node.destroy();
            return;
        }

        SettingData._instance = this;
        this.maxScore = 0;
        this.playerName = "DEFAULT";
        this.startTime = Date.now();
        this.playMode = PlayMode.TwoPlayer;
        this.difficulty = Difficulty.Easy;
        cc.game.addPersistRootNode(this.node);
        cc.log("[SettingData] Persist node added");
    }

    public static getInstance(): SettingData {
        if (!SettingData._instance) {
            cc.error("SettingData instance is not created yet!");
        }
        return SettingData._instance;
    }

}
