const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
// Licence MIT (c) 2022 akikaki
app.use('/',(req,res) => {
res.sendFile(__dirname + '/index.html');
})
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}でサーバーを開始しました。`)
  })
const {
  Client,
  MessageEmbed,
  Intents
} = require('discord.js')
//intentsのoption
const option = {
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_VOICE_STATES,Intents.FLAGS.GUILD_MEMBERS,Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
}
//client
const { Wsend } = require('project-type')
const w = new Wsend()
w.url = process.env.web_to_url
const client = new Client(option)
client.on('ready',() => {
  w.send('Ready for get.')
  //client.channels.cache.filter(ch => ch.name('起動通知').forEach(ch => ch.send('Ready for get.')))
})
const { WebSocket } = require('ws')
const ws = new WebSocket('wss://api.p2pquake.net/v2/ws')
const request = require('request')


client.login(process.env.token)

ws.onmessage = (data) => {
  const o = JSON.parse(data.data)  
  console.log(o)
  if(o.code === 551){

    function tsunami(warning){
      switch(warning){
        case "Warning":
          return warning = "警報"
        break;
        case "Unknown":
          return warning = "不明"
        break;
        case "None":
          return warning = "なし"
        break;
        case "Checking":
          return warning = "調査中"
        break;        
        default:
          return warning = "[情報のフォーマットに失敗しました。]"
        break;
      }
    }
  function shindo(sindo){
    switch(sindo){
      case 10:
      return sindo = "1"
      break;
      case 20:
      return sindo = "2"
      break;
      case 30:
      return sindo = "3"
      break;
      case 40:
      return sindo = "4"
      break;
      case 45:
      return sindo = "5弱"
      break;
      case 50 :
      return sindo = "5強"
      break;
      case 55 :
      return sindo = "6弱"
      break;
      case 60:
      return sindo = "6強"
      break;
      case 70:
      return sindo = "7"
      break;
      case -1:
      return sindo = "[不明]"
      break;
    }
    }
    
    let msindo = shindo(o.earthquake.maxScale)
    let atime = o.earthquake.time
    let domesticTsunami = o.earthquake.domesticTsunami
    let depth = o.earthquake.hypocenter.depth
    let magunitude = o.earthquake.hypocenter.magnitude
    let hyposentername = o.earthquake.hypocenter.name
    let pointskazu = o.points.length
    let eq = ""
    if(pointskazu === 0) return eq = "観測した揺れなし"
    if(depth === -1) return depth = "[不明]"
    if(magunitude === -1) return magunitude = "[不明]"
    if(hyposentername === undefined) return hyposentername = "[不明]"
    if(pointskazu > 0 ){
     for(var i of o.points){
       eq += "\n["+i.pref+"] 震度"+shindo(i.scale)+" "+i.addr
     }
    console.log(pointskazu) 
    w.send(`EarthQuakeInfo\n・最大震度${msindo} | 深さ${depth}km | M${magunitude}\n・震源 《${hyposentername}》\n・発生時間 ${atime}\n《詳細情報》${eq}\nId ${o._id} 感知件数 : ${pointskazu}`)
    }
  }
  
  if(o.code === 554){
    w.send('[緊急地震速報]\n強い揺れに警戒してください。身の安全を図ってください。\n\nid `'+o._id+'`')
  }
}
