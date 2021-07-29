import {join} from 'path';
import fs from 'fs';

type GameType = {
    apiKey: string,
    gameId: string,
    players: {
        alias: string,
        discordUser: string
    }[]
}

const file = join(__dirname, '..', 'db.json');
let db: GameType[] = [];

async function save() {
    await fs.promises.writeFile(file, JSON.stringify(db));
}

export function getGameFromId(id: string): GameType | undefined {
    return db.find(g => g.gameId === id);
}

export function addGame(game: {
    gameId: string,
    apiKey: string,
    players: {
        alias: string,
        discordUser: string
    }[]
}) {
    db.push(game);
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
