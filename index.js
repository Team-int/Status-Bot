// Dependencies
const Discord = require("discord.js");
const fs = require("fs");
const MongoDB = require("mongodb");
const Dokdo = require('dokdo')
const client = new Discord.Client();

// Variables 
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DB_PW = process.env.DB_PW
const token = process.env.TOKEN
const prefix = process.env.PREFIX;
client.status = '오프라인'
client.node = 'hosting'
client.dbstatus = "오프라인"
client.dev = [
  '687866011013218349',
  '745758911012929550',
  '714736989106208791',
  '418677556322107412',
  '552103947662524416',
  '647736678815105037',
  '694131960125325374'
]

// Debug
if(client.node == 'dev') {
	client.on('debug', console.log)
}

// Commands file
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);

    for (const alias of command.aliases) {
        client.aliases.set(alias, command.name);
    }
}


// Database
client.db = undefined;
const DBClient = new MongoDB.MongoClient(`${DB_PW}/status`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

DBClient.connect().then(() => {
	client.db = DBClient.db("main").collection("status");
	
	console.log("[Database] MongoDB Connected.");
});

// Web Server
require("./web")(client, PORT);

// Dokdo
client.on('message', async message => {
    const DokdoHandler = new Dokdo(client, {
        aliases: ['dokdo', 'dok', '독도', '독'],
        prefix: 's.',
        owners: client.dev ,
        noPerm: (message) => message.reply('🚫 해당 명령어는 Team Int 관리자 전용 명령어입니다.')
    })

    DokdoHandler.run(message)
})

// Client Ready Event

client.on("ready", () => {
	client.status = '정상 운영중...'
    console.log(`[Bot] Logged on ${client.user.username}`);
	
    setInterval(() => {
        switch (Math.floor(Math.random() * 6)) {
            case 0:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: `${client.status}`,
                        type: "PLAYING"
                    }
                });
                break;
            case 1:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "이 말은 10초마다 바뀐다는 사실을 아셨나요?",
                        type: "PLAYING"
                    }
                });
                break;
            case 2:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "접두사는 s. 입니다!",
                        type: "PLAYING"
                    }
                });
                break;
            case 3:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "Team Int - We live to code",
                        type: "PLAYING"
                    }
                });
                break;
            case 4:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "피드백은 s.문의 [내용]",
                        type: "PLAYING"
                    }
                });
                break;
            case 5:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "모든 봇들 상태 확인",
                        type: "PLAYING"
                    }
                });
                break;
            case 6:
                client.user.setPresence({
                    status: "online",
                    activity: {
                        name: "s.도움",
                        type: "PLAYING"
                    }
                });
                break;
        }
    }, 10000);
});

client.on('message', async message => {
    if (message.author.bot)    return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = client.commands.get(cmd);
    let aliasesCommand = client.aliases.get(cmd);
    if (command) {
        command.run(client, message, args);
    } else if (aliasesCommand) {
        client.commands.get(aliasesCommand).run(client, message, args);
    }
   
});

// Client Login
client.login(token)