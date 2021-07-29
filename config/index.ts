import fs from "fs";
import path from "path";
import yaml from "yaml";

export type DiscordConfig = {
    apiToken: string,
    owner: string,
    prefix: string,
}

export const discordConfig: DiscordConfig = yaml.parse(fs.readFileSync(path.resolve(__dirname, 'discord.yaml'), 'utf-8'));
