import dotenv from 'dotenv';
dotenv.config();

interface ENV {
    PORT: number;
    SECRET : string ;
    KEY : string ;
    HOSTDB: string;
    PORTDB : number;
    USERDB : string;
    password : string;
    database : string;


}

interface Config {
    PORT: number;
    SECRET : string;
    KEY : string ;
    HOSTDB: string;
    PORTDB : number;
    USERDB : string;
    password : string;
    database : string;

}


const ConfigEnv = (): ENV =>{
  return {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    SECRET: process.env.SECRET || "",
    KEY: process.env.keys || "",
    HOSTDB: process.env.HOST || "",
    PORTDB : process.env.PORTDB ? Number(process.env.PORTDB) : 5434,
    USERDB : process.env.USERDB || "",
    password : process.env.password || "",
    database : process.env.database || "",
    }
}

const getConfig = (config:ENV):Config =>{
    for(const[key,value] of Object.entries(config)){
        if(value === undefined){
            throw new Error(`Missing key ${key} in index.env`)
        }
    }
    return config as Config;
}

const config = ConfigEnv();
const keyConfig = getConfig(config);


export default keyConfig;