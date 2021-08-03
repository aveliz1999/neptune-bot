import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import {Collection, MessageEmbed, MessageReaction, Snowflake} from 'discord.js';
import FormData from "form-data";
import axios from "axios";
import {ScanningData} from "../types";
import {getGameFromId, getGamesForPlayer} from "../db";

export default class Shame extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'shame',
            aliases: ['shameplayers'],
            group: 'neptune',
            memberName: 'shame',
            description: 'Shame the players that haven\'t submitted their turn',
            args: []
        })
    }

    async run(message: CommandoMessage, args: {}, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const games = getGamesForPlayer(message.author.id);
        if(games.length === 0) {
            return message.reply('Not in any active games!');
        }
        if(games.length >= 1) {
            const choiceMessage = new MessageEmbed()
                .setTitle('Select a game');
            const numbers = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣']

            games.forEach((game, index) => {
                choiceMessage.addField(numbers[index], `${game.name} (${game.gameId})`);
            });

            const rmessage = await message.channel.send(choiceMessage);
            const [result] = await Promise.all([
                rmessage.awaitReactions((r, user) => user.id === message.author.id, {
                    time: 10000
                }),
                Promise.all(numbers.filter((n, index) => index < games.length).map(n => rmessage.react(n)))
            ]);
            const reactions = (result as Collection<Snowflake, MessageReaction>);

            for(let r of reactions.array()) {
                const game = games[numbers.indexOf(r.emoji.name)];

                const form = new FormData();
                form.append('game_number', game.gameId);
                form.append('code', game.apiKey);
                form.append('api_version', '0.1');
                try{
                    const {data}: {data: {scanning_data: ScanningData}} = await axios.post('https://np.ironhelmet.com/api', form, {
                        headers: form.getHeaders()
                    });
                    const toShame = Object.values(data.scanning_data.players).filter(player =>
                        !player.ready
                    ).map(p => p.alias);

                    if(toShame.length) {
                        const shameMessage = game.players.filter(p => toShame.includes(p.alias)).reduce(((previousValue, currentValue) => {
                            return previousValue + `<@${currentValue.discordUser}> `
                        }), 'Players who have not submitted their turn:\n');
                        await message.channel.send(shameMessage)
                    }
                    else {
                        return message.channel.send('All linked players have submitted their turns.');
                    }

                }
                catch(err) {
                    throw err;
                }
            }
        }
    }
}
