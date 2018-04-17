import './js/libs/weapp-adapter'
import './js/libs/symbol'

import Main from './js/main'


var game=new Main()
wx.onShow(()=>{
  //game.restart()
  console.log('restart')
})
