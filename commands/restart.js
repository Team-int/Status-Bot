const Discord = require('discord.js');
const fs = require('fs');
module.exports = {
    name: '배포',
    aliases: ['restart', 'bay'],
    description: '와 샌즈',
    usage: 's.post [ID] [Token] [강도] [Incidents] ',
    run: async (client, message, args) => {
		if (!client.dev.includes(message.author.id))
            return message.channel.send("🚫 해당 명령어는 Team Int 개발자 전용 명령어입니다.")
        const embed = new Discord.MessageEmbed()
            .setTitle(`${client.emojis.cache.find(x => x.name == 'loadingCirclebar')} 재시작 중`)
            .setColor(0xffff00)
            .setThumbnail(client.user.displayAvatarURL({
                dynamic: true
            }))
            .addField('진행 상황', '환경 확인 중')
            .setFooter(message.author.tag, message.author.avatarURL({
                dynamic: true
            }))
            .setTimestamp()
        let m = await message.channel.send(embed);
        if (process.platform == 'linux' || client.shard) {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 재시작 중`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '재시작 파일 수정 중')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const restart = require('../restart.json');
            restart.bool = true;
            restart.channel = message.channel.id;
            fs.writeFile('./restart.json', JSON.stringify(restart), function (err) {
                if (err) console.log(err);
                const ymbed = new Discord.MessageEmbed()
                    .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 재시작 됨`)
                    .setColor("GREEN")
                    .setThumbnail(client.user.displayAvatarURL({
                        dynamic: true
                    }))
                    .addField('진행 상황', '재시작 완료')
                    .setFooter(message.author.tag, message.author.avatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                m.edit(ymbed).then(function () {
                    process.exit();
                });
            });
        } else {
            const imbed = new Discord.MessageEmbed()
                .setTitle(`${client.emojis.cache.find(x => x.name == 'loading')} 종료 중...`)
                .setColor(0xffff00)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .addField('진행 상황', '재시작 중...')
                .setFooter(message.author.tag, message.author.avatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(imbed);
            const ymbed = new Discord.MessageEmbed()
                .setTitle('봇이 종료되었어요.')
                .setColor(0x00ffff)
                .setThumbnail(client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setFooter(client.user.tag, client.user.displayAvatarURL({
                    dynamic: true
                }))
                .setTimestamp()
            m.edit(ymbed).then(function () {
                console.clear().then(function () {
                    process.exit();
                });
            });
        }
    }
}