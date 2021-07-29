import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import {addGame} from "../db";
import FormData from "form-data";
import axios from "axios";
import {ScanningData} from "../types";

export default class Register extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'register',
            aliases: ['registergame'],
            group: 'neptune',
            memberName: 'register',
            description: 'Register a new game',
            args: [
                {
                    key: 'apiKey',
                    prompt: 'What is the API key?',
                    type: 'string'
                },
                {
                    key: 'gameId',
                    prompt: 'What is the game ID?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: {
        apiKey: string,
        gameId: string
    }, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const form = new FormData();
        form.append('game_number', args.gameId);
        form.append('code', args.apiKey);
        form.append('api_version', '0.1');
        try{
            const {data}: {data: {scanning_data: ScanningData}} = await axios.post('https://np.ironhelmet.com/api', form, {
                headers: form.getHeaders()
            });

            const game = {
                gameId: args.gameId,
                apiKey: args.apiKey,
                players: []
            };

            const playerNames = Object.values(data.scanning_data.players).map(p => p.alias);
            for(let name of playerNames) {
                message.reply(`Mention the discord user that is assigned to the player ${name}?\nReply with -1 to skip this player.`);
                let reply;
                try {
                    reply = await message.channel.awaitMessages(m => m.author.id === message.author.id, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    });
                }
                catch(err) {
                    console.error(err);
                }
                if(!reply.size) {
                    return message.reply('No response for this player. Aborting the game addition.');
                }
                const replyMessage = reply.first();
                if(replyMessage.content === '-1') {
                    continue;
                }
                const mention = replyMessage.mentions.users.first();
                if(!mention) {
                    return message.reply('No response for this player. Aborting the game addition.');
                }

                game.players.push({
                    alias: name,
                    discordUser: mention.id
                });
            }
            await addGame(game);

            return message.reply('Added that match.');
        }
        catch(err) {
            throw err;
        }
    }
}
