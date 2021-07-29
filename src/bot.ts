import {Client} from 'discord.js-commando';
import init from './db';
import Register from "./commands/register";
import Shame from "./commands/shame";

const client = new Client({
    owner: '210957367947296768',
    commandPrefix: 'np'
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
});

client.login('ODcwMTExMzA3MTU0NzI2OTYy.YQIATQ.6Vf--9RRdNhYrkU-NW2oVjZkMZQ');
