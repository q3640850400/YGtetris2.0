import Player from './player/index'
import Enemy from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo from './runtime/gameinfo'
import Music from './runtime/music'
import DataBus from './databus'
import contact_ from './runtime/contact'
let ctx = canvas.getContext('2d')
var longtap=false

/**
 * 地图
 */
var map = new Array(21)
for (let i = 0; i < 20; i++) {
  map[i] = 0x801
}
map[20]=0xfff
var color=new Array(21)
for(let i=0;i<21;i++){
  color[i]=new Array(12)
  for(let j=0;j<12;j++){
    color[i][j]=2
  }
}

/**
 * 俄罗斯方块OISZLJT
 */
var tetris = [[0x0660], [0x2222, 0xf00], [0xc600, 0x2640], [0x6c00, 0x4620], [0x4460, 0x2e0, 0x6220, 0x740], [0x2260, 0xe20, 0x6440, 0x4700], [0x2620, 0x720, 0x2320, 0x2700]]
var dia, pos, bak, run,sd,cot,rst,gst;
/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()
  }
  newatetris(){
    cot = ~~(Math.random() * 7)
    dia = tetris[cot];
    pos = { fk: [], y: 0, x: 4, s: ~~(Math.random() * 4) };
    bak = { fk: pos.fk.slice(0), y: pos.y, x: pos.x, s: pos.s }
    this.rotate(0);
  }
  start0() {
    this.contact.link()
    gst=window.setInterval(this.start1.bind(this),500)
    //this.start1()
  }
  start1(){
    if(this.contact.state==='start'){
      this.newatetris()
      if (run) { window.clearInterval(run); }
      run = window.setInterval(this.down.bind(this), 2000);
      if (sd) { window.clearInterval(sd); }
      sd = window.setInterval(this.straightdown.bind(this), 100);
      if (rst) { window.clearInterval(rst); }

      this.contact.state = 'wait'
      window.clearInterval(gst)
    }
  }
  iscan() {
    for (var i = 0; i < 4; i++)
      if ((pos.fk[i] & map[pos.y + i]) != 0) {console.log('hit!');return (pos = bak);}
  }
  rotate(r) {
    var f = dia[pos.s = (pos.s + r) % dia.length];
    for (var i = 0; i < 4; i++){
      pos.fk[i] = (((f >> ((4-i-1) * 4)) & 15)<<(8-pos.x));
    }
    this.update(this.iscan());
  }
  straightdown(){
    if(longtap){
      this.down()
    }
  }
  down() {
    ++pos.y;
    if (this.iscan()) {
      for (var i = 0; (i < 4) && ((pos.y + i) < 20); i++){
        if ((map[pos.y + i] |= pos.fk[i]) == 0xfff){
          map.splice(pos.y + i, 1)
          map.unshift(0x801)
          }
      }
      if (map[0] != 0x801) return this.over();
      this.newatetris();
    }
    this.update(0);
  }
  move(t, k) {
    pos.x += k;
    for (var i = 0; i < 4; i++)pos.fk[i] *= t;
    this.update(this.iscan());
    //console.log(cot, bak, pos)
  }
  over() {
    document.onkeydown = null;
    clearInterval(run);
    clearInterval(sd);

    //alert("GAME OVER");
  }
  update(t) {
    bak = { fk: pos.fk.slice(0), y: pos.y, x: pos.x, s: pos.s }
    
    if (t) return;
    this.render()
  }
  restart() {
    /**
     * 添加方块操控按键监听
     */
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaReady

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY) {
        this.start0();
      }
      

    }).bind(this))
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaLeft

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY){
        console.log('left!')
        this.move(2,-1)}

    }).bind(this))
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaRight

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY){
        console.log('right!')
        this.move(0.5,1)}

    }).bind(this))
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaDown

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY){
        longtap=true
        console.log('down!')
        }
        

    }).bind(this))
    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
        longtap = false
    }).bind(this))
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaUp

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY){
        console.log('up!')
        }
        

    }).bind(this))
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()

      let x = e.touches[0].clientX
      let y = e.touches[0].clientY

      let area = this.gameinfo.btnAreaTurn

      if (x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY){
        this.rotate(1)
        console.log('turn!')
        }
        

    }).bind(this))

    this.bg = new BackGround(ctx)
    this.player = new Player(ctx)
    this.gameinfo = new GameInfo()
    this.music = new Music()
    this.contact = new contact_()
    rst = window.setInterval(this.renderbase.bind(this), 100);
    //this.start();
    
    /*window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )*/
  }
  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  renderbase(){
    this.bg.render(ctx)
    this.gameinfo.renderGameBtn(ctx)
    this.gameinfo.renderTetrispool(ctx, map, color)
  }
  render() {
    //ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.bg.render(ctx)
    this.gameinfo.renderGameScore(ctx, 999)
    this.gameinfo.renderGameBtn(ctx)
    this.gameinfo.renderTetris(ctx,cot,bak)
    this.gameinfo.renderTetrispool(ctx,map,color)
    this.gameinfo.renderOthers(ctx, map, color)
  }


  // 游戏逻辑更新主函数
  /*update() {
    this.bg.update()
  }*/

  // 实现游戏帧循环
  /*loop() {

    this.update()
    this.render()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }*/
}