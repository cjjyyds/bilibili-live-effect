class Effect {

    defaultCmd = '测试'
    defaultKeyword = '测试弹幕'

    constructor(ref) {
        this.ref = ref;
        this.reset();
    }

    reset() {
        this.cmd = this.defaultCmd + '';
        this.keyword = this.defaultKeyword + '';
        this.enable = true;
        this.lvl = 1;
        this.targets = [8, 28, 88, 188, 288, 888];
        this.displayProgress = 0;
        this.danmu = [];
        this.state = 'collecting';
    }

    nextLvl() {

        let {lvl, targets, collected} = this;
        
        lvl = 1;
        for (let i = 0; i < targets.length; i++) {
            let target = targets[i];
            if (collected >= target) lvl = i+2;
        }
        this.lvl = lvl;

        if (lvl == targets.length + 1) {
            this.lvl = targets.length;
            this.state = 'complete';
            return;
        }

        



        
        
    }

    get target() {
        let {lvl, targets} = this;
        let i = lvl - 1;
        return targets[i];
    }
    get collected() {
        return this.danmu.length;
    }
    get progress() {
        let {lvl, targets, collected, target} = this;
        let adjust = targets[lvl-2] || 0;
        let p = (collected - adjust) / (target - adjust);
        if (p > 1) p = 1;
        return p;
    }
}

export default Effect;