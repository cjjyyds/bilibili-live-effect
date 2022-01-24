let ref;

const stateCheck = function() {

    let {w, h, effects, ctx} = ref;

    let keys = Object.keys(effects);
    for (let i = 0; i < keys.length; i++) {
        
        let key = keys[i];
        let effect = effects[key];
        let {keyword, collected, target, enable, progress, displayProgress, lvl} = effect;

        if (!enable) continue;

        let barW = 300;
        let barH = 50;
        let pad = 20;
        let left = pad;
        let bottom = h - pad;

        let x = left + barW/2;
        let y = bottom - barH/2 - i * barH * 1.5;

        if (progress != displayProgress) {
            
            let i = displayProgress;
            let f = progress;

            let d = f - i;
            let minD = Math.sign(d) * 1 / target;
            if (Math.abs(d) < Math.abs(minD)) d = minD;
            
            let next = i + d / (60 * 0.25); // 0.25s
            if (next > 1) next = 1;
            
            displayProgress = next;
            effect.displayProgress = next;
        }
        
        ctx.scale(1,1)
        ctx.globalAlpha = 1;
        
        ctx.beginPath();
        
        // background color
        ctx.fillStyle = ' #ecf5ff ';
        ctx.fillRect(left, y - barH/2, barW, barH)
        // progress bar color
        ctx.fillStyle = '#bfe7ff';
        ctx.fillRect(left, y - barH/2, displayProgress * barW, barH);
    
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#005282';
        ctx.strokeRect(left, y - barH/2, barW, barH);
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black'
        ctx.font = '25px bold Arial'
        if (effect.state == 'complete') {
            ctx.fillText(`★${keyword}★ ${collected}/${target}`, x, y, barW - pad);
        } else {
            ctx.fillText(`lv${lvl}. ${keyword} ${collected}/${target}`, x, y, barW - pad);
        }

        if (displayProgress == 1 && ref.state == 'normal') {
            ref.state = key;
        }
        
    }

}



let main = function(indexRef) {
    ref = indexRef;
    return stateCheck
}

export default main;