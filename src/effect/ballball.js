import Effect from "./effect"

class Ballball extends Effect {

    colors = ['#ff432e', '#fdef14', '#b1eb00', '#4aa8db', '#ff85cb', '  #f39c12  ']
    defaultCmd = '球球'
    defaultKeyword = '弹幕风暴';

    constructor(ref) {
        super(ref);
        this.defaultKeyword = ref.keyword
        this.reset();
    }
   
    initilize() {
        
        this.circles = [];
        
        let danmu = this.danmu;
        let n = 50;
        if (danmu.length > n) {
            danmu = [...this.danmu].slice(0,n).sort(()=>0.5-Math.random());
        }
        for (let i=0; i<danmu.length; i++) {
            let circle = this.circle();
            circle.danmu = danmu[i];
            this.circles.push(circle)
        }
        
    }

    circle = () => {

        let {colors, ref} = this;
        let {w, h, now} = ref;

        let d = Math.sqrt(w * h)
        
        let padding = Math.round(d * 0.01);
        let pad2 = padding * 2;

        


        let r = (0.5 + Math.random() * 0.5) * d*0.07;
        let x = padding + Math.random() * (w - pad2);
        let y = padding + Math.random() * (h - pad2);
        let color = colors[Math.floor(Math.random()*colors.length)];
        let start = now + Math.random() * 500;
        let time = 250 + Math.random() * 750;
        // time = 1000;

        let circle = {r: 0, x, y, color, alpha: 0}

        let v = 5;
        let vx = (-1 + Math.random() * 2) * v;
        let vy = (-1 + Math.random() * 2) * v;

        let progress;

        circle.update = function() {

            vx *= 0.975;
            vy *= 0.975;

            circle.x += vx;
            circle.y += vy;
            if (ref.now > now + time + 1000) {
                vx *= 1.05
                vy *= 1.05
            }

            progress = (ref.now - start) / time;
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            circle.alpha = progress;
            circle.r = r * progress;

        }

        circle.draw = function() {

            let {ctx} = ref;

            let {x ,y, r, color, alpha} = circle;
            ctx.beginPath();
            ctx.globalAlpha = alpha;
            ctx.translate(x,y);
            ctx.scale(1,1);
            ctx.arc(0, 0, r, 2 * Math.PI, false)
            ctx.fillStyle = color;
            ctx.fill();

            let {username, danmu} = circle.danmu;
            let scale = r / 50;
            ctx.scale(scale, scale);
            ctx.textAlign = 'center';

            if (danmu.length > 30) {
                
                let n = Math.floor(danmu.length / 2);
                let danmuA = danmu.slice(0,n);
                let danmuB = danmu.slice(n);

                ctx.textBaseline = 'bottom';
                ctx.fillStyle = 'black';
                ctx.fillText(username, 2, -27);
                ctx.fillStyle = 'white';
                ctx.fillText(username, 0, -25);

                ctx.fillStyle = 'black'; 
                ctx.textBaseline = 'middle';
                ctx.fillText(danmuA, 0, 0);
                ctx.textBaseline = 'top';
                ctx.fillText(danmuB, 0, 25);

            } else {
                
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = 'black';
                ctx.fillText(username, 2, -7);
                ctx.fillStyle = 'white';
                ctx.fillText(username, 0, -5);
                
                ctx.textBaseline = 'top';
                ctx.fillStyle = 'black';
                ctx.fillText(danmu, 0, 5);
            }


            // ctx.fillText(username+',asdfas\ndf'+danmu, 0, 0)
            ctx.setTransform(1, 0, 0, 1, 0, 0);

        }


        return circle;
    }

    circles = []

    animation() {

        
        switch (this.state) {

            case 'collecting':
                
                let {collected, target} = this;
                if (collected >= target) {
                    
                    this.initilize();
                    this.state = 'animation';
                    
                }
                break;

            case 'animation':

                let {circles, ref} = this;
                let {w, h, ctx} = ref;

                let complete = 0;

                for (let i = 0; i < circles.length; i++) {

                    let circle = circles[i];

                    circle.update();
                    circle.draw();

                    let {x,y} = circle;

                    let R = w + 300;
                    let L = -300;
                    let T = -100;
                    let B = h + 100;

                    if (x > R || x < L || y < T || y > B) complete++;

                }

                if (complete && complete == circles.length) {
                    this.circles = [];
                    this.state = 'collecting';
                    this.nextLvl();
                    
                    this.ref.state = 'normal'
                }

                break;

        }
    
        
        
    
    }
}

export default Ballball;