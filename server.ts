//server creation

import express, { Application, Request, Response } from "express";
import dotenv from "dotenv"
import { DBUtil } from "./util/DBUtil"; 
import { error } from "console";
import contactRouter from "./router/contactRouter";
import groupRouter from "./router/groupRouter";

const app: Application = express();

/**
 * configure express to receive the form data
 */
app.use(express.json())

/**
 * configure dot-env file
 */
dotenv.config({
    path:'./.env'
})
// const hostName:string|undefined=process.env.EXPRESS_HOST_NAME
const port:number|string = process.env.PORT||9999
const dbUrl:string | undefined =process.env.MONGO_DB_CLOUD_URL  
const dbName:string | undefined =process.env.MONGO_DB_DATABASE  

app.get("/", (request:Request, response:Response )=> {
    response.status(200);
    response.json({
        msg:"Welcome to Express Js"
    })
})

//configure the routers
app.use("/contacts", contactRouter)
app.use("/groups", groupRouter)


if (port) {
    app.listen(Number(port),  () => {
        if (dbUrl && dbName) {
            DBUtil.connectToDB(dbUrl, dbName).then((dbResponse) => {
                console.log(dbResponse)
            }).catch((error) => {
                console.log(error)
                process.exit(0)//force stop express server
            })
        }
        console.log(`Express server is started at ${port}`)
       
    })
}
 