"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./entities/User.entity");
const Role_entity_1 = require("./entities/Role.entity");
const config_1 = __importDefault(require("./config"));
const AppDataSource = new typeorm_1.DataSource({
    //  host: config.HOSTDB,
    //  port: config.PORTDB,
    //  username: config.USERDB,
    //  password: config.password,
    //  database: config.database,
    //  entities: [Role, User],
    //  synchronize: false
    type: "postgres",
    host: config_1.default.HOSTDB,
    port: config_1.default.PORTDB,
    username: config_1.default.USERDB,
    password: config_1.default.password,
    database: config_1.default.database,
    synchronize: false,
    logging: false,
    entities: [Role_entity_1.Role, User_entity_1.User],
    migrations: [],
    subscribers: [],
});
exports.default = AppDataSource;
