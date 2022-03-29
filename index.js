const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080

app.get('/',(req,res) => {
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
const w = new Wsend(process.env.web_to_url)
const ChangeToView = require('./lib.js')
//const Keyv = require('keyv')
//const db = new Keyv('sqlite://earthquake_database.sqlite', {
//  table: 'earthquakes'
//})
const Database = require('@replit/database')
const db = new Database()
const client = new Client(option)
const c = new ChangeToView()
client.on('ready',() => {
client.user.setActivity({
  name : "P2P地震情報とにらめっこ中"
  })
})
const { WebSocket } = require('ws')
const ws = new WebSocket('wss://api.p2pquake.net/v2/ws')
const request = require('request')
const path = require('path')
const favicon = require('serve-favicon');

app.get('/test',(req,res) => {
  if(req || res){
    //w.send('Request!')
    res.send('nueb')
     client.channels.cache.get('951418875847786496').send('指定チャンネルにメッセージ送信!!!')
  }
})
//const { areacode } = require('./area_change_to_string/index.js')
app.use(favicon(path.join(__dirname, 'favicon.ico')));
    app.get('/earthquake', function(req,res){
      let size = ""
      let button = '<a href="/earthquake?size=1" class="button is-danger is-outlined">文字が大きいバージョン</a>'
      if(req.query.size){ size = ".new{font-size:30;} .old{font-size:30;} .subtitle{font-size:35}"
                        button = '<a href="/earthquake" class="button is-danger is-outlined">元のサイズ</a>'}
      request.get('https://api.p2pquake.net/v2/jma/quake?limit=100', (reqs, ress, bodys) => {
        const o = JSON.parse(bodys);
    let basyo = " "
    let basyo1 = " "
    let time = 0
    for(i of o[0].points){
          basyo += "</br>《"+i.pref+"》[震度"+c.shindo(i.scale)+"]"+i.addr
        }
    for(i of o[1].points){
          basyo1 += "</br>《"+i.pref+"》[震度"+c.shindo(i.scale)+"]"+i.addr
        }
    res.send(`<title>p2pEq API / 非公式りーどあぶるサービス </title>
<link rel="shortcut icon" href="https://akikaki-bot.github.io/cdn-priceless-web/favicon.ico" type="image/vnd.microsoft.icon">
<link rel="icon" href="https://akikaki-bot.github.io/cdn-priceless-web/favicon.ico" type="image/vnd.microsoft.icon">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js"></script>
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
<style>${size}
@media screen and (max-width:480px) {
 	.new {
		width: 120%;
	}
 	.old {
		width: 120%;
	}
  .box {
   width:360px;
  }
}
.box {
margin:5px; padding:10px; border:1px solid black;
}
.big {
font-size:3rem;
}
.mid {
font-size:2rem;
}
.warning {
background-color:#ffff00
}
  
  .new{background-color:#ffc998;font-family: "Roboto"} .old{background-color:ffc9c0;font-family: "Roboto"}
</style>
<div class="container">
  <div class="new">
    [最新の地震情報]
    \n
    <div class="box warning">
    <h2>最大震度 <big>${c.shindo(o[time].earthquake.maxScale)}</big><br>マグニチュード <big>${o[time].earthquake.hypocenter.magnitude}</big></h2>
    </div>
    <div class="box">
    <h2>発生時刻 <big>${o[time].earthquake.time}</big></h2>
    <h2>震源 <big> ${o[time].earthquake.hypocenter.name}</big></h2>
    <h2>深さ <big>${o[time].earthquake.hypocenter.depth}km</big></h2>
    <h2>津波の心配 <big>${c.tsunami(o[time].earthquake.domesticTsunami)}</big></h2>
</div>
    </hr>
    <h1 class="title">各地の震度</h1>
    <hr>
    <h3>${basyo}</h3><br>${button}</div>
    <div class="old">[ひとつ前の地震情報]
    <div class="box warning">
    <h2>最大震度 <big>${c.shindo(o[1].earthquake.maxScale)}</big><br>マグニチュード <big>${o[1].earthquake.hypocenter.magnitude}</big> 
    </h2>
</div>
<div class="box">
    <h2>発生時刻 <big>${o[1].earthquake.time}</big></h2>
    <h2>震源 <big> ${o[1].earthquake.hypocenter.name}</big></h2>
    <h2>深さ <big>${o[1].earthquake.hypocenter.depth}km</big></h2>
    <h2>津波の心配 <big>${c.tsunami(o[1].earthquake.domesticTsunami)}</big></h2>
</div>
    <h1 class="title">各地の震度</h1>
    <hr>
    <h3>${basyo1}</h3>
${button}
  </div>

</div>`)
  })
})

client.login(process.env.token)
ws.onmessage = async (data) => {
  db.set('datas',data.data)
  const o = JSON.parse(data.data)  
  console.log("Response P2P WebSocketServer. Code :"+o.code)
  console.log(o)
  if(o.code === 9611){
  /*  let areas = ""
    if(o.area_confidences.length === 0){
      areas = "[情報なし]"
    }else {
    for(i of o.area_confidences){
      areas +=`\n ${o.area_confidences}`
    }  */  
   // w.send(`【地震感知情報】UserQuakeInfo\n\n感知件数 : ${o.count}\n\n開始時刻 : ${o.started_at} 更新時刻 : ${o.updated_at} \n\n Id : ${o._id}`)
    }

    if(o.code === 551){
      db.set('new',o.data)
    let msindo = c.shindo(o.earthquake.maxScale)
    let atime = o.earthquake.time
    let domesticTsunami = o.earthquake.domesticTsunami
    let depth = o.earthquake.hypocenter.depth
    let magunitude = o.earthquake.hypocenter.magnitude
    let hyposentername = o.earthquake.hypocenter.name
    let pointskazu = o.points.length
    let eq = ""
    let info = ""
    let tsunamiwarning = ""

    if(depth === -1) return depth = "[不明]"
    if(magunitude === -1) return magunitude = "[不明]"
    if(hyposentername === undefined) return hyposentername = "[不明]"

    if(domesticTsunami === "Warning") tsunamiwarning = "現在、津波警報が発表されています。"
    else tsunamiwarning = "津波の心配はありません。"

     if(pointskazu > 50){
        for(var i of o.points){ 
          if(i.scale >= 30){ 
           eq += "\n["+i.pref+"] 震度"+c.shindo(i.scale)+" "+i.addr
            info = "今回の情報では揺れの強かった地域を抜粋してお送りしています。"
          }
        }
      } else if(pointskazu > 0 ){  
        for(var i of o.points){
           eq += "\n["+i.pref+"] 震度"+c.shindo(i.scale)+" "+i.addr
        }
      } else {      
           eq = "\n[観測した揺れはありません。]"
      }
      
      console.log(pointskazu) 
    	client.channels.cache.get('951418875847786496').send(`EarthQuakeInfo\n・最大震度${msindo} | 深さ${depth}km | M${magunitude}\n・震源 《${hyposentername}》\n・発生時間 ${atime}\n《詳細情報》${eq}\n\n${tsunamiwarning}(${info})\nId ${o._id}`).catch(e => {})
    }

  if(o.code === 554){
    client.channels.cache.get('951418875847786496').send('[緊急地震速報]\n強い揺れに警戒してください。身の安全を図ってください。\n\nid `'+o._id+'`').catch(e => {})
  }
}
