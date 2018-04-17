const screenWidth = window.innerWidth
const screenHeight = window.innerHeight
const btnCTRL = 80 //按钮大小
const mapcol = 12 //地图的总列数
const pix = screenWidth /2 / mapcol //每个方块格的长度
const screenleft=screenWidth/8 //地图左边距
const screenup = screenWidth / 5 //地图上边距
const headleft = screenWidth / 10; const headup = screenHeight / 40; //头像位置
const pix_mini = pix / 2//小方格的长度
const screenleft_mini = screenWidth - pix_mini*13//小地图左边距
const screenup_mini = screenHeight*1/3 //小地图上边距
let atlas = new Image()
atlas.src = 'images/Common.png'
let image_tetris= new Image()
image_tetris.src='images/tetris.png'
var tetris = [[0x0660], [0x2222, 0xf00], [0xc600, 0x2640], [0x6c00, 0x4620], [0x4460, 0x2e0, 0x6220, 0x740], [0x2260, 0xe20, 0x6440, 0x4700], [0x2620, 0x720, 0x2320, 0x2700]]
var oiszlvt = new Array(7)
for (let i = 0; i < 7; i++) {
  oiszlvt[i] = new Image()
}
oiszlvt[0].src = 'images/O.png'
oiszlvt[1].src = 'images/I.png'
oiszlvt[2].src = 'images/Z.png'
oiszlvt[3].src = 'images/Z.png'
oiszlvt[4].src = 'images/L.png'
oiszlvt[5].src = 'images/L.png'
oiszlvt[6].src = 'images/T.png'

export default class GameInfo {
  renderGameScore(ctx, score) {
    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"
    ctx.fillText(
      score,
      10,
      30
    )
  }
  /**
   * 下落方块渲染
   */
  renderTetris(ctx, cot, bak) {
    let t = 0x8000  //定义一个最高位为1的16位16进制数，和方块逐位作与运算，大于0的就画出相应的方块粒
    for(let i=0;i<4;i++){
      for (let j = 0; j < 4;j++){
        //console.log(t & tetris[cot][bak.s], j, i)
        if ((t & tetris[cot][bak.s]) >0) {
          ctx.drawImage(image_tetris, 48*cot, 0, 48, 48, screenleft + (bak.x+j) * pix, screenup + (bak.y+i) * pix, pix, pix) 
        }
        t >>= 1
      }
    }
    //ctx.drawImage(oiszlvt[cot], 0, 0, 1000, 1000, screenleft+bak.x*pix, screenup+bak.y*pix, pix*4, pix*4)
  }
  /**
   * 堆叠方块渲染
   */
  renderTetrispool(ctx,map,color){
    for (let i = 0; i < 21; i++) {
      let t = 0x800
      for (let j = 0; j < mapcol; j++) {
        //console.log(t & tetris[cot][bak.s], j, i)
        if ((t & map[i]) > 0) {
          ctx.drawImage(image_tetris, 48 * color[i][j], 0, 48, 48, screenleft + j * pix, screenup + i * pix, pix, pix)
        }
        t >>= 1
      }
    } 
  }
  /**
   * 其他玩家渲染
   */
  renderOthers(ctx, map, color) {
    for (let i = 0; i < 21; i++) {
      let t = 0x800
      for (let j = 0; j < mapcol; j++) {
        //console.log(t & tetris[cot][bak.s], j, i)
        if ((t & map[i]) > 0) {
          ctx.drawImage(image_tetris, 48 * color[i][j], 0, 48, 48, screenleft_mini + j * pix_mini, screenup_mini + i * pix_mini, pix_mini, pix_mini)
        }
        t >>= 1
      }
    }
  }
  renderGameBtn(ctx) {
    this.btnAreaReady = {
      startX: screenWidth - btnCTRL,
      startY: btnCTRL,
      endX: screenWidth,
      endY: btnCTRL + btnCTRL
    }
    this.btnAreaLeft = {
      startX: 0,
      startY: screenHeight - btnCTRL * 2,
      endX: 0 + btnCTRL,
      endY: screenHeight - btnCTRL
    }
    this.btnAreaRight = {
      startX: screenWidth - btnCTRL,
      startY: screenHeight - btnCTRL * 2,
      endX: screenWidth,
      endY: screenHeight - btnCTRL
    }
    this.btnAreaDown = {
      startX: screenWidth / 2 - btnCTRL / 2,
      startY: screenHeight - btnCTRL + 0,
      endX: screenWidth / 2 + btnCTRL / 2,
      endY: screenHeight + 0
    }
    this.btnAreaUp = {
      startX: screenWidth / 2 - btnCTRL / 2,
      startY: screenHeight - btnCTRL - btnCTRL * 2,
      endX: screenWidth / 2 + btnCTRL / 2,
      endY: screenHeight - btnCTRL - btnCTRL
    }
    this.btnAreaTurn = {
      startX: screenWidth / 2 - btnCTRL / 2,
      startY: screenHeight - btnCTRL - btnCTRL,
      endX: screenWidth / 2 + btnCTRL / 2,
      endY: screenHeight - btnCTRL
    }
    ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaReady.startX, this.btnAreaReady.startY, btnCTRL, btnCTRL)
    ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaLeft.startX, this.btnAreaLeft.startY, btnCTRL, btnCTRL)
    ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaRight.startX, this.btnAreaRight.startY, btnCTRL, btnCTRL)
    ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaDown.startX, this.btnAreaDown.startY, btnCTRL, btnCTRL)
    //ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaUp.startX, this.btnAreaUp.startY, btnCTRL, btnCTRL)
    ctx.drawImage(atlas, 120, 6, 39, 24, this.btnAreaTurn.startX, this.btnAreaTurn.startY, btnCTRL, btnCTRL)
  }

  renderGameOver(ctx, score) {
    ctx.drawImage(atlas, 0, 0, 119, 108, screenWidth / 2 - 150, screenHeight / 2 - 100, 300, 300)

    ctx.fillStyle = "#ffffff"
    ctx.font = "20px Arial"

    ctx.fillText(
      '游戏结束',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 50
    )

    ctx.fillText(
      '得分: ' + score,
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 130
    )

    ctx.drawImage(
      atlas,
      120, 6, 39, 24,
      screenWidth / 2 - 60,
      screenHeight / 2 - 100 + 180,
      120, 40
    )

    ctx.fillText(
      '重新开始',
      screenWidth / 2 - 40,
      screenHeight / 2 - 100 + 205
    )

    /**
     * 重新开始按钮区域
     * 方便简易判断按钮点击
     */
    /*this.btnArea = {
      startX: screenWidth / 2 - 40,
      startY: screenHeight / 2 - 100 + 180,
      endX: screenWidth / 2 + 50,
      endY: screenHeight / 2 - 100 + 255
    }*/

  }
}

