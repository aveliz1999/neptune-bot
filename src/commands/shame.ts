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
            );

            for(let player of toShame) {
                const foundPlayer = game.players.find(p => p.alias === player.alias);
                if(!foundPlayer) {
                    continue;
                }
                const discordUser = foundPlayer.discordUser;
                const user = await message.guild.members.fetch(discordUser);
                await message.channel.send(`${user} has not submitted their turn yet!`);
            }
        }
        catch(err) {
            throw err;
        }
    }
}
