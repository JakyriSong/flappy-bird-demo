import Pipe from "./pipe";
import Game from './game'

const {ccclass, property} = cc._decorator;

@ccclass
export default class PipePool extends cc.Component {
    @property(cc.Prefab)
    pipePrefab: Pipe = null;

    game: Game;
    pool: cc.NodePool = null;

    pipeList: cc.Node[] = null;

    init(game: Game) {
        this.game = game;
        this.pool = new cc.NodePool();
        this.pipeList = [];
        let cnt = 5;
        for (let i = 0; i < cnt; i++) {
            let node = cc.instantiate(this.pipePrefab);
            this.pool.put(node);
            this.pipeList.push(node);
        }
    }

    getPipe() {
        let pipe = null;
        if (this.pool.size() > 0) {
            pipe = this.pool.get();
        } else {
            pipe = cc.instantiate(this.pipePrefab);
            this.pool.put(pipe);
            this.pipeList.push(pipe);
        }
        pipe.getComponent("pipe").init(this.game);

        return pipe;
    }

    revert(pipe: cc.Node) {
        this.pool.put(pipe);
    }

    reset() {
        this.pipeList.forEach(node => {
            this.revert(node);
        })
    }
    
}
