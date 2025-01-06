import Ground from "./ground";
import SettingData from "./settingData";

import { PlayMode, Difficulty } from './enums';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Welcome extends cc.Component {
    @property(cc.Component)
    ground: Ground = null;

    speed: number = 150;

    nameInput: cc.Node;
    playModeNode: cc.Node;
    difficultyNode: cc.Node;
    startNode: cc.Node;

    onLoad () {
        let setting = cc.find('setting');
        this.nameInput = setting.getChildByName('nameInput');
        this.nameInput.active = true;
        this.playModeNode = setting.getChildByName('playMode');
        this.playModeNode.active = true;
        this.difficultyNode = setting.getChildByName('difficulty');
        this.difficultyNode.active = false;
        this.startNode = setting.getChildByName('start');
        this.startNode.active = false;
    }

    setPlayerName(editbox: cc.EditBox) {
        let settingData = SettingData.getInstance();
        let newName = editbox.string;
        if (newName != settingData.playerName) {
            settingData.playerName = newName;
            settingData.startTime = Date.now();
            cc.log("[welcome] change player name", newName);
        }
    }

    setPlayMode(event: cc.Event, mode: string) {
        let settingData = SettingData.getInstance();
        settingData.playMode = Number(mode);
        this.nameInput.active = false;
        this.playModeNode.active = false;
        this.difficultyNode.active = true;
        cc.log("[welcome] player playmode", settingData.playMode, typeof(settingData.playMode));
    }

    setDifficulty(event: cc.Event, diff: string) {
        let settingData = SettingData.getInstance();
        settingData.difficulty = Number(diff);
        this.startNode.active = true;
        cc.log("[welcome] difficulty", settingData.difficulty, typeof(settingData.difficulty));
    }

    startGame() {
        let settingData = SettingData.getInstance();
        cc.log("[welcome] startGame: playMode", settingData.playMode, "difficulty", settingData.difficulty);
        cc.director.loadScene('game');
    }

    // update (dt) {}
}
