const Discord = require("discord.js");

module.exports = {
    name: '배포',
    aliases: ['post'],
    description: '와 샌즈',
    usage: 's.post [ID] [Token] [강도] [Incidents] ',
    run: async (client, message, args) => {
        if (!client.dev.includes(message.author.id))
            return message.channel.send("🚫 해당 명령어는 Team Int 개발자 전용 명령어입니다.")
		if (!args[0] || !args[1] || !args[2] || !args[3])
			return message.channel.send("사용 방법 : `s.post [ID] [Token] [강도] [Incidents]`")
		
		if (!args[2] == '없음' || !args[2] == '취소' || !args[2] == '약함' || !args[2] == '강함')
			return message.channel.send("[강도] == 없음(취소), 약함, 강함 에 한개만 고르세")
	    
        const bot_id = args[0];
		const token = args[1]
		const level = args[2]
        const description = args.slice(3).join(' ');
        
        let statusDB = await client.db.findOne({_id: bot_id});
		let checkToken = await client.db.findOne({token : token})

        console.log(bot_id, token, level, args)
        
        if (!statusDB)
            return message.channel.send("[404] 봇이 존재하지 않습니다.");
		if (!checkToken)
			return message.channel.send("[403] 접근할 토큰이 올바르지 않습니다.")
		if (!message.channel.type == 'dm')
			return message.channel.send("[401] 보안 관련 문제로 공개 채널에서는 이 명령어를 사용할수 없습니다.")
        
        const chkPost = new Discord.MessageEmbed()
			.setTitle('🧾API 에 배포될 항목')
			.addField('표시될 문제', description, true)
			.setTimestamp()
			.setColor('YELLOW')
			.setFooter(
				`${message.author.tag}\u200b`,
				message.author.displayAvatarURL({
					dynamic: true,
				})
			);
        
		const ask = await message.channel.send(chkPost);
		const filter = (reaction, u) => reaction.emoji.name === '✅' && u.id === message.author.id;
        client.db.updateOne({_id: bot_id}, {
            $set: {
                status: 'idle',
            },
            $push: {
                event: {
                    text: description,
                    date: Date.now(),
                }
            },
        })
	}
}