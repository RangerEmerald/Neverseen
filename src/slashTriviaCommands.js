const { addScore, scoreMapCache } = require('./databases/SQLite/queries');

async function guess(args, triviaMain, interaction) {
    if (!triviaMain[interaction.guild_id].triviaMessage) {
        return {type: 'message', content: 'There is no trivia right now!'};
    } else {
        if (triviaMain[interaction.guild_id].triviaAnswer.includes(args.guess)) {
            await triviaMain[interaction.guild_id].triviaMessage.delete().catch(error => console.log(`An error has occured --- ${error}`));
            triviaMain[interaction.guild_id].triviaMessage = null;
            if (interaction.guild_id != "709195031822598255") await addScore(message.author.id);
            triviaMain[interaction.guild_id].users.clear();
            return {type: 'message', content: `You got the answer!`};
        } else return {type: 'message', content: `That is not the answer!`};
    }
}

async function leaderboards(args, client, Discord, interaction) {
    let userid = interaction.member.user.id;
    let person = "Your";

    if (args.user) {
        let iuser;
        const user = client.users.cache.get(args.user);
        const mentioned = client.users.cache.get(args.user.replace(/[!\<\>@]/g, ''));
        if (user) iuser = user;
        else if (mentioned) iuser = mentioned;

        if (iuser) {
            userid = iuser.id;
            person = `${iuser.tag}'s`;
        } else return {type: 'message', content: `I cannot find user \`${args.user}\`!`};
    }

    const sortedScoremap = new Map([...scoreMapCache.entries()].sort((a, b) => b[1] - a[1]));
    const leaderboardArray = [];
    let iteration = 1;
    let userplace = null;
    let points = 0;
    sortedScoremap.forEach(function (value, key) {
        if (key == userid) {
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
        .setFooter(`${person} position is: ${userplace} with ${points} points`)
        .setTimestamp();
        
    return {type: 'embed', content: embed};
}


module.exports = {guess, leaderboards};