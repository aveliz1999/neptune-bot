import {CronJob} from "cron";
import {getAllGames, getGameFromId, updateGame} from "./db";
import {Client} from 'discord.js-commando';
import {TextChannel} from 'discord.js';
import FormData from "form-data";
import {ScanningData} from "./types";
import axios from "axios";


export default function(client: Client) {
    const job = new CronJob('*/5 * * * *', async function() {
        for(let game of getAllGames()) {
            const channel = await client.channels.fetch(game.discordChannelId) as TextChannel;
            const form = new FormData();
            form.append('game_number', game.gameId);
            form.append('code', game.apiKey);
            form.append('api_version', '0.1');
            try{
                const {data}: {data: {scanning_data: ScanningData}} = await axios.post('https://np.ironhelmet.com/api', form, {
                    headers: form.getHeaders()
		});

                if(data.scanning_data.tick === game.lastTick) {
                    continue;
                }

                game.lastTick = data.scanning_data.tick;
                await updateGame(game);

                const message = game.players.reduce(((previousValue, currentValue) => {
                    return previousValue + `<@${currentValue.discordUser}> `
		}), 'Next turn has started!\n') + `\nhttps://np.ironhelmet.com/game/${game.gameId}`;
                await channel.send(message);

            }
            catch(err) {
                throw err;
            }
        }
    }, null, true, 'America/New_York', null, true);
}
