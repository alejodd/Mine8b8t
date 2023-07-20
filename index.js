// zerordia
const mineflayer = require('mineflayer');
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const { username, prefix, password } = require('./config.json');
const ms = require('ms');

console.log('\x1b[33m%s\x1b[0m','[Console] Creating bot...');

const config = require('./botsettings.json');

// inicio plugins/librerias
const pvp = require('mineflayer-pvp').plugin
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder')
var tpsPlugin = require('mineflayer-tps')(mineflayer)
const armorManager = require('mineflayer-armor-manager')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const botArgs = { // Se crea el bot y se conecta
    host: '15.204.88.232',
    port: '25565',
    username: username,
    version: '1.12.2'
};

const initBot = () => {

    
    let bot = mineflayer.createBot(botArgs);


    // Carga mineflayer
    bot.loadPlugin(tpsPlugin)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(pvp)

    console.log('\x1b[33m%s\x1b[0m',`[Console] Loggin as ${username}`);

    if (config.prismarineviewer.enabled) {
    bot.once('spawn', () => {
      console.log('\x1b[33m%s\x1b[0m','[Viewer] Viewer listing puerto 8080')
      mineflayerViewer(bot, { port: 8080, firstPerson: true })
    })
  };

    bot.on('message', message => { // logs login
        console.log('\x1b[36m%s\x1b[0m', '[CHAT]' + '\x1b[0m', '' + message.toString());
            if (message.toString() === ("[8b8t] Please, login with the command: /login <password>")) {
                bot.chat(`/login ` + password) } 
                if (message.toString() === ("[8b8t] Please register to play 8b8t /register <password>")) {
                bot.chat(`/register ` + password) } 
            if (message.toString() === ("Successful login!")) {
                console.log('\x1b[33m%s\x1b[0m','[Console] Bot has joined the server!') } // Bot has joined the server
            if (message.toString() === ("Successfully registered!")) {
                console.log('\x1b[33m%s\x1b[0m','[Console] Bot has successfully registered to the server!') } // huhu   
      });
    
    bot.armorManager.equipAll()

    if (config.chatfeatures['spammer'].enabled) { 
      console.log('\x1b[33m%s\x1b[0m',`[Console] Spammer is enabled.`);

      let messages = config.chatfeatures['spammer']['messages'];

      if (config.chatfeatures['spammer'].repeat) {
         let delay = config.chatfeatures['spammer']['delay']; 
         let meow = 0;

         setInterval(() => {
            bot.chat(`${messages[meow]}`);

            if (meow + 1 === messages.length) {
              meow = 0;
            } else meow++;
         }, delay * 1000);
      } else {
         messages.forEach((msg) => {
            bot.chat(msg);
         });
      }
   }

    if (config.friendlymode.enabled) {  // no usar con pvp mode
      console.log('\x1b[33m%s\x1b[0m',`[Console] Friendly Mode enabled (DO NOT ENABLE PVP MODE IF THIS FEATURE IS ENABLED)`);

      bot.on("move", ()=>{ 
        const playerFilter = (entity) => entity.type === 'player' 
        let player = bot.nearestEntity(playerFilter);
    
        if (player) {
            bot.lookAt(player.position.offset(0, player.height, 0))
            bot.swingArm('right')
            setInterval(() => {
               bot.setControlState('sneak', true)
           }, 450);
           setInterval(() => {
            bot.setControlState('sneak', false)
        }, 200); 
      }
    })
  };

  if (config.pvpmode.enabled) {  // no usar con friendly mode
    console.log('\x1b[33m%s\x1b[0m',`[Console] PVP mode enabled (DO NOT ENABLE FRIENDLY MODE IF THIS FEATURE IS ENABLED)`);
      bot.on('chat', (username, message) => {
        if (message === prefix + 'pvp') {
        bot.chat("estas muerto :DD te matare!!")
        const player = bot.players[username]
  
        if (!player) {
          bot.chat("Tu no estas en mi rango, porfavor buscame una armadura, una espada y pideme pvp nuevamente :D")
        return
      }
  
      bot.pvp.attack(player.entity)
    }

      if (message === prefix + 'stop') {
        bot.chat("ok ok!! Dejare de hacerte daño :(")
        bot.pvp.stop()
      }
    })
  };

        bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'help') {
              bot.chat('Comandos : help, info, estado, ping, serverstatus, kill (Comandos practice: pvp, stop))')
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto el comando help!`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'info') {
              bot.chat(`${bot.username} Bot de JFCQ.`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto el comando info!`)
            }
          });
          
          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'estado') {
              bot.chat(`${bot.username} actualmente tengo ${bot.health}hp y ${bot.food} muslos.`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto el comando estado!`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'ping') {
              bot.chat(`Tu ping: ${bot.player.ping}ms`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto el comando ping!`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'kill') {
              bot.chat(`/kill`) 
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} mato al bot con /kill!`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'serverstatus') {
            bot.chat(`TPS: ${bot.getTps()} | Jugadores: ${Object.values(bot.players).map(player => player.username).length}`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto el comando serverstatus!`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'tpazerordia') {
              bot.chat(`/tpa zerordia`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto tp a zerordia! (DIRECTO)`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return
            if (message === prefix + 'tpyzerordia') {
              bot.chat(`/tpy zerordia`)
              console.log('\x1b[33m%s\x1b[0m',`[Consola] ${username} ejecuto tpy a zerordia! (DIRECTO)`)
            }
          });

          bot.on('chat', (username, message) => {
            if (username === bot.username) return;
            if (message === prefix + 'gokit') {
              bot.chat(`/tpa ${username}`);
              bot.chat(`/msg ${username} Pon /tpy, acepta rapido que en 10s me matare.`);
              bot.chat(`/msg ${username} Gracias! :D`);
          
              // Retraso de 10s antes de ejecutar /kill
              setTimeout(() => {
                bot.chat(`/kill`);
                console.log('\x1b[32m%s\x1b[0m', `[DELIVERY] ${username} finalizo su delivery!`);
              }, 10000);
            }
          });
          
          
          
                                          // mensajes de error//

    
    bot.on('death', () => {
        console.log('\x1b[33m%s\x1b[0m',
           `Bot Asesinado.. respawneando en base..`
        );
     });

    bot.on('end', () => { // RECONECTAR POR SI BOT ES KICKEADO
        console.log('\x1b[33m%s\x1b[0m',`Bot descoenctado.. reconectando`);

        // Attempt to reconnect
        setTimeout(initBot, 5000); // reconnect
    });

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log('\x1b[33m%s\x1b[0m',`Can't connect to : ${err.address}:${err.port}`)
        }
        else {
            console.log('\x1b[33m%s\x1b[0m',`Unhandled error: ${err}`);
        }
    });
};

initBot();
