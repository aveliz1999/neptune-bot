export type ScanningData = {
    fleet_speed: number,
    paused: boolean,
    productions: number,
    tick_fragment: number,
    now: number,
    tick_rate: number,
    production_rate: number,
    stars_for_victory: number,
    game_over: number,
    started: boolean,
    start_time: number,
    total_stars: number,
    production_counter: number,
    trade_scanned: number,
    tick: number,
    trade_cost: number,
    name: string,
    player_uid: number,
    admin: number,
    turn_based: number,
    war: number,
    turn_based_time_out: number,

    fleets: {
        [key: string]: {
            l: number,
            lx: string,
            ly: string,
            n: string,
            o: any,
            puid: number,
            st: number,
            uid: number,
            w: number,
            x: string,
            y: string
        }
    },
    players: {
        [key: string]: {
            ai: number,
            alias: string,
            avatar: number,
            conceded: number,
            huid: number,
            karma_to_give: number,
            missed_turns: number,
            ready: number,
            regard: number,
            tech: {
                [key in 'banking' | 'manufacturing' | 'propulsion' | 'research' | 'scanning' | 'terraforming' | 'weapons']: {
                    value: number,
                    level: number
                }
            },
            total_economy: number,
            total_fleets: number,
            total_industry: number,
            total_science: number,
            total_stars: number,
            total_strength: number
        }
    },
    stars: {
        [key: string]: {
            n: string,
            puid: number,
            uid: number,
            v: string,
            x: string,
            y: string
        }
    },
}
