import { DataSource } from 'typeorm';
import { User } from './entities/User.entity';
import { Role } from './entities/Role.entity';
import config from './config';

const AppDataSource = new DataSource({
//  host: config.HOSTDB,
//  port: config.PORTDB,
//  username: config.USERDB,
//  password: config.password,
//  database: config.database,
//  entities: [Role, User],
//  synchronize: false
    type: "postgres",
    host: config.HOSTDB,
    port: config.PORTDB,
    username: config.USERDB,
    password: config.password,
    database: config.database,
    synchronize: false,
    logging: false,
    entities: [Role, User],
    migrations: [],
    subscribers: [],
});




export default AppDataSource;