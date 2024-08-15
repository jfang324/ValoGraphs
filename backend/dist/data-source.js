import { DataSource } from 'typeorm';
import 'reflect-metadata';
import 'dotenv/config';
import { MatchStat } from './entities/MatchStat.js';
import { Player } from './entities/Player.js';
/**
 * Configure DataSource to connect to the database
 */
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: ['error'],
    entities: [MatchStat, Player],
    subscribers: [],
    migrations: [],
    ssl: {
        rejectUnauthorized: false,
    },
});
