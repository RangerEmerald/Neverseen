const mysql = require('mysql2');
let cacheQueue = new Map();
const { Queue } = require('./queueTemplate');

const con = mysql.createConnection({
    host: "localhost",
    supportBigNumbers: true,
    user: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

async function musicCache() {
    con.query(`SELECT * FROM savedqueue`, (error, result) => {
        if (error) throw error;
        for (i in result) cacheQueue.set(result[i].id, new Queue(result[i].discordid, result[i].name, result[i].queue));
    });
}

async function addDatabase(message, name, queue) {
    const id = makeid(24);
    con.query(`INSERT INTO savedqueue (id, discordid, name, queue) VALUES ('${id}', ${message.author.id}, '${name}', '${queue}')`, (error, result) => {
        if (error) throw error;
        cacheQueue.set(id, new Queue(message.author.id, name, queue));
        message.channel.send(`You have added a playlist called \`${name}\` under the discord id \`${message.author.id}\`. The playlist id is \`${id}\`. The playlist id is important if you want to play the playlist, or if you want to delete the playlist`); 
    });
}

async function deletefrom(id, message, name) {
    if (id) {
        con.query(`DELETE FROM savedqueue WHERE id = '${id}' AND discordid = ${message.author.id}`, (error, result) => {
            if (error) throw error;
            if (!result.affectedRows) return message.channel.send(`You do not own a playlist under the id \`${id}\`!`);
            cacheQueue.delete(id);
            message.channel.send(`You have deleted playlist \`${id}\``);
        });
    } else {
        con.query(`DELETE FROM savedqueue WHERE discordid = ${message.author.id} AND name = '${name}'`, (error, result) => {
            if (error) throw error;
            cacheQueue = new Map();
            cache();
        });
    }
}

async function returnPlaylists(message, Discord) {
    con.query(`SELECT * FROM savedqueue WHERE discordid = ${message.author.id}`, (error, result) => {
        if (error) throw error;
        embedArray = [];
        for (i in result) embedArray.push(`**Playlist ID:** ${result[i].id} | **Playlist Name:** ${result[i].name}`);
        if (!embedArray.length) embedArray.push("You don't have any saved playlists!");
        const playlistEmbed = new Discord.MessageEmbed()
            .setTitle(`${message.author.tag}'s Playlist List`)
            .setColor("RANDOM")
            .setDescription(embedArray.join("\n"))
            .setFooter(`Requested by ${message.author.id}`)
            .setTimestamp();

        message.channel.send(playlistEmbed);
    });
}

module.exports = { musicCache, addDatabase, deletefrom, returnPlaylists, cacheQueue };