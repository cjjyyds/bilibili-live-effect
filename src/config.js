
let config = {
    roomid: 21721813, // 冯提莫
    danmu: '弹幕风暴'
}


let query = new URLSearchParams(location.search)

let roomid = Number(query.get('roomid')) || config.roomid;
let keyword = query.get('danmu') || config.danmu;

export default {
    roomid, keyword
};