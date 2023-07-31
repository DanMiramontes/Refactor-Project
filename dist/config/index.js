"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ConfigEnv = () => {
    return {
        PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
        SECRET: process.env.SECRET || "",
        KEY: process.env.keys || "",
        HOSTDB: process.env.HOST || "",
        PORTDB: process.env.PORTDB ? Number(process.env.PORTDB) : 5434,
        USERDB: process.env.USERDB || "",
        password: process.env.password || "",
        database: process.env.database || "",
    };
};
const getConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in index.env`);
        }
    }
    return config;
};
const config = ConfigEnv();
const keyConfig = getConfig(config);
exports.default = keyConfig;
