import './reset.css';
import './style.css';
import Ballball from './effect/ballball';
import StateCheck from './stateCheck'
import config from './config'



let ref = {
    roomid: config.roomid,
    keyword: config.keyword,
    state: 'normal',
    w: window.innerWidth,
    h: window.innerHeight,
    env: process.env.NODE_ENV,
    now: performance.now(),
    effects: {}
}
const stateCheck = StateCheck(ref);
ref.effects.ballball = new Ballball(ref);

const { KeepLiveWS } = require('bilibili-live-ws')
const live = new KeepLiveWS(ref.roomid)

live.on('open', () => console.log(`Connection to room ${ref.roomid} established!`))
live.on('live', () => {

    live.on('DANMU_MSG', result => {
        
        let info = result.info;
        let danmu = info[1];
        let username = info[2][1];

        for (let key in ref.effects) {
            let effect = ref.effects[key];
            if (danmu.match(effect.keyword)) {
                effect.danmu.push({username, danmu})
            }
        }

    })

})

let c = document.createElement('canvas');
let ctx = c.getContext('2d');
c.width = ref.w;
c.height = ref.h;
document.body.appendChild(c);

ref.c = c;
ref.ctx = ctx;



const animate = function() {

    ref.now = performance.now();

    let {w, h, ctx, effects, state, env} = ref;
    ctx.clearRect(0, 0, w, h);

    stateCheck();

    let effect = effects[state];
    if (effect) effect.animation();

    requestAnimationFrame(animate);

};





animate();

if (ref.env == 'development') {

    let danmu = (n) => {
        for (let i = 0; i < n; i++) {
    
            let list = [
                'a', '用户', '用户名', '叫啥好呢', '这里五个字',
                '随便改个名字', '想不出来名字了', '还有什么id可以用',
                'longUserName', 'EnglishName', '哈'
            ]
            let username = list[Math.floor(Math.random() * list.length)];
            let danmu = '哈'.repeat(Math.ceil(Math.random()*20));
    
            ref.effects.ballball.danmu.push({username, danmu});
        
        }
        
    }
    
    let addButton = (text, onclick) => {
        let btn = document.createElement('button');
        btn.textContent = text;
        btn.onclick = onclick;
        document.body.append(btn);
    }
    addButton('+1', () => danmu(1) )
    addButton('+10', () => danmu(10) )
    addButton('+50', () => danmu(50) )
    addButton('reset', () => {
        for (let key in ref.effects) {
            ref.effects[key].reset();
        }
        ref.state = 'normal';
    })
    addButton('球球', () => {ref.effects.ballball.reset(); danmu(50)})
    addButton('stat', () => console.log(ref.state, ref.effects[ref.state]))

    danmu(500);
    ref.effects.ballball.nextLvl();
    let danmus = require('./danmu-samples.json')
    ref.effects.ballball.danmu = danmus;
    
    let buttons = document.querySelectorAll('button')
    buttons.forEach(btn => btn.style.display = 'none')

    
}


