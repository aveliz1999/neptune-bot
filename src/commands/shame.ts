import {ArgumentCollectorResult, Client, Command, CommandoMessage} from "discord.js-commando";
import FormData from "form-data";
import axios from "axios";
import {ScanningData} from "../types";
import {getGameFromId} from "../db";

export default class Shame extends Command {
    constructor(client: Client) {
        super(client, {
            name: 'shame',
            aliases: ['shameplayers'],
            group: 'neptune',
            memberName: 'shame',
            description: 'Shame the players that haven\'t submitted their turn',
            args: [
                {
                    key: 'gameId',
                    prompt: 'What is the game ID?',
                    type: 'string'
                }
            ]
        })
    }

    async run(message: CommandoMessage, args: {
        gameId: string
    }, fromPattern: boolean, result?: ArgumentCollectorResult): Promise<any> | null {
        const game = getGameFromId(args.gameId);
        const form = new FormData();
        form.append('game_number', args.gameId);
        form.append('code', game.apiKey);
        form.append('api_version', '0.1');
        try{
            const {data}: {data: {scanning_data: ScanningData}} = await axios.post('https://np.ironhelmet.com/api', form, {
                headers: form.getHeaders()
            });
            const toShame = Object.values(data.scanning_data.players).filter(player =>
                !player.ready
            ).map(p => p.alias);

            const shameMessage = game.players.filter(p => toShame.includes(p.alias)).reduce(((previousValue, currentValue) => {
                return previousValue + `<@${currentValue.discordUser}> `
            }), 'Players who have not submitted their turn:!\n');
            await message.channel.send(shameMessage)
        }
        catch(err) {
            throw err;
        }
    }
}
