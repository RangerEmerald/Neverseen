//SET UP
require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ fetchAllMembers: true });

//GET FILES
const { list, replylist, trivia } = require('./resources/randomwords');
const { private } = require('./resources/private');
const similarity = require('./resources/isMessageAlike');
const { music } = require('./music/music.js');
const { musicCache } = require('./databases/SQLQueries/queries');
const { addScore,  scoreCache, scoreMapCache, deleteScore } = require('./databases/SQLite/queries');

//SET UP VARIABLES
const token = process.env.BOT_TOKEN;
const prefix = "nvsn."

//PLAY VARIABLES
const timer = 1000 * 60 * 5; //Milliseconds
let lastmessage = {};
let triviaMain = {};

//INIT VARIABLES
for (guild in private.randommessages) {
    lastmessage[guild] = new Date().getTime() + timer;
    triviaMain[guild] = {triviaAnswer: null, triviaNumber: null, triviaMessage: null, users: []};
}

//PLAY FUNCTIONS
async function intervalMessage() {
    setInterval(() => {
        for (guild in private.randommessages) {
            if (new Date().getTime() - lastmessage[guild] < timer-2000) {
                try {
                    client.channels.cache.get(private.randommessages[guild]).send(list[Math.round(Math.random() * (list.length - 1))]);
                } catch (error) { }
            }
        }
    }, timer);
}

async function randomTrivia() {
    setInterval(async () => {
        for (guild in private.randommessages) {
            if (triviaMain[guild].triviaMessage != null) return;
            else if (new Date().getTime() - lastmessage[guild] > timer) return;
            else if (triviaMain[guild].users.length >= 2) {
                triviaMain[guild].triviaNumber = Math.round(Math.random() * (trivia.length - 1));
                triviaMain[guild].triviaAnswer = trivia[triviaMain[guild].triviaNumber].answer;
    
                let embed = new Discord.MessageEmbed()
                    .setColor("RED")
                    .setTitle("NEW RANDOM TRIVIA!")
                    .setDescription(trivia[triviaMain[guild].triviaNumber].question)
                    .setFooter("To guess, do nvsn.guess [answer]")
                    .setTimestamp();

                if (trivia[triviaMain[guild].triviaNumber].image) embed.setImage(trivia[triviaMain[guild].triviaNumber].image);
    
                try {
                    triviaMain[guild].triviaMessage = await client.channels.cache.get(private.randommessages[guild]).send(embed);
                } catch (error) { }
            }
        }
    }, 1000 * 60 * (Math.random() * (15 - 10) + 10));
}

//BOT 
client.on('ready', () =>{ 
    musicCache();
    scoreCache();
    console.log(`${client.user.tag} has logged in`); 
    intervalMessage();
    randomTrivia();
});

client.on('message', async message => {
    if (message.author.bot) return;
    else if (message.content.startsWith(prefix)) {
        const args = message.content.toLowerCase().replace(/\s+/g,' ').trim().slice(prefix.length).split(" ");
        switch (args[0]) {
            case "music":
                music(message, args, client, Discord);
                break;
            case "guess":
                if (!triviaMain[guild].triviaMessage) return message.reply('There is no trivia right now!');
                else {
                    const answer = message.content.slice(message.content.indexOf("guess") + 6).toLowerCase();
                    if (answer == triviaMain[guild].triviaAnswer) {
                        await addScore(message.author.id);
                        await message.delete();
                        await triviaMain[guild].triviaMessage.delete();
                        triviaMain[guild].triviaMessage = null;
                        const reply = await message.reply(`You got the answer!`)
                            .then(setTimeout(() => reply.delete(), 60000));

                        triviaMain[guild].users = [];
                    } else {
                        message.delete();
                        const reply = await message.reply(`That is not the answer!`)
                            .then(setTimeout(() => reply.delete(), 60000));
                    }
                }
                break;
            case "lb":
            case "leaderboard":
            case "leaderboards":
                const sortedScoremap = new Map([...scoreMapCache.entries()].sort((a, b) => b[1] - a[1]));
                const leaderboardArray = [];
                let iteration = 1;
                let userplace = null;
                let points = 0;
                sortedScoremap.forEach(function (value, key) {
                    if (key == message.author.id) {
                        userplace = iteration;
                        points = value;
                    }
                    else iteration++;
                    if (leaderboardArray.length < 10) leaderboardArray.push(`**${leaderboardArray.length+1}.** <@!${key}> score: ${value}`);
                })

                const embed = new Discord.MessageEmbed()
                    .setTitle("Top Ten Answered Correct Trivia Players")
                    .setColor("GREEN")
                    .setDescription(leaderboardArray.join("\n"))
                    .setFooter(`Your position is: ${userplace} with ${points} points`)
                    .setTimestamp();
                
                message.channel.send(embed);
                break;
            case "points":
                if (message.member.roles.cache.get(private.control)) {
                    switch(args[1]) {
                        case "remove": {
                            if (isNaN(args[2])) return message.channel.send("The format is `nvsn.points remove [number] [user/s]`");
                            let rpmessage = await message.channel.send("Please wait...");
                            let mentions = message.mentions.users;
                            if (args[3] == "@everyone") mentions = client.guilds.cache.get(message.guild.id).members.cache;
                            mentions.forEach(async function (user, key){
                                const member = client.guilds.cache.get(message.guild.id).members.cache.get(key).displayName;
                                await rpmessage.edit(`Removing ${args[2]} of ${member}'s points...`);
                                await deleteScore(key, args[2]);
                            })
                            await rpmessage.edit("Done.");
                            break;
                        }
                        case "add": {
                            if (isNaN(args[2])) return message.channel.send(`The format is \`nvsn.points add [number] [user/s]\``);
                            let rpmessage = await message.channel.send("Please wait...");
                            let mentions = message.mentions.users;
                            if (args[3] == "@everyone") mentions = client.guilds.cache.get(message.guild.id).members.cache;
                            mentions.forEach(async function (user, key){
                                const member = client.guilds.cache.get(message.guild.id).members.cache.get(key).displayName;
                                await rpmessage.edit(`Adding ${args[2]} to ${member}'s points...`);
                                await addScore(key, args[2]);
                            })
                            await rpmessage.edit("Done.");
                            break;
                        }
                        case "wipe": {
                            let rpmessage = await message.channel.send("Please wait...");
                            let mentions = message.mentions.users;
                            if (args[2] == "@everyone") mentions = client.guilds.cache.get(message.guild.id).members.cache;
                            mentions.forEach(async function (user, key){
                                const member = client.guilds.cache.get(message.guild.id).members.cache.get(key).displayName;
                                await rpmessage.edit(`Wiping ${member}'s points...`);
                                await deleteScore(key, null);
                            })
                            await rpmessage.edit("Done.");
                            break;
                        }
                    }
                }
                break;
        }
    }
    if (private.randommessages[message.guild.id] && private.randommessages[message.guild.id] == message.channel.id) {
        if (!triviaMain[message.guild.id].users.includes(message.author.id) || triviaMain[message.guild.id].users.length == 0) await triviaMain[message.guild.id].users.push(message.author.id);
            lastmessage[message.guild.id] = message.createdTimestamp;
    }
    for (i in replylist) {
        if (similarity.similarity(replylist[i][0], message.content.toLowerCase()) > 0.69) return message.channel.send(replylist[i][1]);
        else if (similarity.similarity(replylist[i][0].replace(/[ ]/g, ''), message.content.toLowerCase().replace(/[ ]/g, '')) > 0.69) return message.channel.send(replylist[i][1]);
        else if (message.content.toLowerCase().indexOf(replylist[i][0]) != -1) return message.channel.send(replylist[i][1]);
    }
});

client.login(token);