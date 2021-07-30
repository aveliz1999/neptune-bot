import {Client} from 'discord.js-commando';
import init from './db';
import turnHandler from "./turnHandler";
import {discordConfig} from "../config";
import Register from "./commands/register";
import Shame from "./commands/shame";

const client = new Client({
    owner: discordConfig.owner,
    commandPrefix: discordConfig.prefix
});

client.registry
    .registerGroups([
        ['neptune', 'Neptune\'s Pride']
    ])
    .registerDefaults()
    .registerCommands([
        Register,
        Shame
    ])

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    await init();
    await turnHandler(client);
});

client.login(discordConfig.apiToken);
