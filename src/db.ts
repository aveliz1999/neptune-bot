import {join} from 'path';
import fs from 'fs';

export type GameType = {
    apiKey: string,
    gameId: string,
    players: {
        alias: string,
        discordUser: string
    }[],
    lastTick: number,
    discordGuildId: string,
    discordChannelId: string,
    name: string
}

const file = join(__dirname, '..', 'db.json');
let db: GameType[] = [];

async function save() {
    await fs.promises.writeFile(file, JSON.stringify(db));
}

export function getGameFromId(id: string): GameType | undefined {
    return db.find(g => g.gameId === id);
}

export function getGamesForPlayer(discordId: string) {
    return db.filter(g => !!(g.players.find(p => p.discordUser === discordId)))
}

export function getAllGames() {
    return [...db]
}

export async function updateGame(game: GameType) {
    db = db.map(g => {
        if(g.gameId === game.gameId && g.apiKey === game.apiKey) {
            return game;
        }
        return g;
    });
    return save();
}

export function addGame(game: GameType) {
    db.push(game);
    return save();
}

export function removeGame(game: GameType) {
    db = db.filter(g => g.gameId === game.gameId && g.discordGuildId === game.discordGuildId)
    return save();
}

export default async function() {
    try {
        const tempdb = await fs.promises.readFile(file, {encoding: 'utf-8'});
        if(tempdb) {
            db = JSON.parse(tempdb) as GameType[];
        }
    }
    catch(err) {
        if(!(err.code === 'ENOENT')) {
            console.error(err);
        }
    }
}
