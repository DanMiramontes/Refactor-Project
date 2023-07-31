import "reflect-metadata";
import app from "./app";
import  AppDataSource  from './db'


async function main() {
    await AppDataSource.initialize().then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
    app.listen(3000);
    console.log('Server is listening on port', 3000);
};
main();