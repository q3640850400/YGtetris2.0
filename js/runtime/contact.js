"use strict"
//var ws;
//var state = 'wait';
//var tetris_20 = null;
var socketState = false;
var emptyseat = new Set([1, 2, 3])
//var Room = new Map()
var map = new Array(21)
for (let i = 0; i < 20; i++) {
  map[i] = 0x801
}
map[20] = 0xfff
//var flueid = parseInt(Math.random() * 1000000000).toString()
export default class contact {
  constructor() {
    this.Room = new Map()
    this.flueid = parseInt(Math.random() * 1000000000).toString()
    //this.state='wait'
  }
  send(outmsg) {
    var msg = {
      data: JSON.stringify(outmsg)
    }
    wx.sendSocketMessage(msg)
  }
  caniget(st) {
    switch (st) {
      case 'state': { return state }
      case 'tetrris_20': { return tetris_20 }
      case 'Room': { return this.Room }
      default: { return }
    }
  }
  setstate(st) {
    state = st
  }
  update(map) {
    if (socketState === true) {
      var outmsg = { code: 'update', data: { flueid: this.flueid, map: map } }
      this.send(outmsg)
    }
  }
  score(sc) {

  }
  link() {
    wx.connectSocket({
      url: 'wss://luif.yxsvip.cn',
      header: { flueid: this.flueid, gamers: 2 }
    })
    wx.onSocketOpen(() => {
      console.log('已连接')
      socketState = true;
      var outmsg = { code: 'ready0' }
      this.send(outmsg)
    })
    wx.onSocketMessage((message) => {
      var immsg = JSON.parse(message.data)
      console.log(immsg)
      switch (immsg.code) {
        case 'join': {
          console.log(`[CLIENT][${immsg.data}]进来了`)
          var player = {
            flueid: immsg.data,//玩家号
            seat: null,
            map: map,//当前的积木池
            score: null,//分数
            state: 'wait'//状态
          }
          emptyseat.forEach((key) => { player.seat = key; emptyseat.delete(key); return; })
          this.Room.set(player.flueid, player)
          player = null
          break
        }
        case 'pool': {
          this.tetris_20 = immsg.data
          this.state = 'pool'
          var outmsg = { code: 'ready1' }
          this.send(outmsg)
          break
        }
        case 'start': {
          this.state = 'start'
          break
        }
        case 'update': {
          console.log(immsg.data.flueid)
          console.log(this.Room)
          this.Room.get(immsg.data.flueid).map = immsg.data.map
          this.Room.get(immsg.data.flueid).state = 'update'
          break
        }
        default: { break }
      }
    })
    wx.onSocketClose((close) => {
      socketState = false
      console.log('连接丢失')
    })

  }
  join() {

  }

}
