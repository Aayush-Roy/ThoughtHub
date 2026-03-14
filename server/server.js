import "dotenv/config";
import express from "express";
import cors from "cors";
const app = express()
import router from "./routes/index.js";
const PORT = process.env.PORT
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/api", router);

app.get("/test",(req,res)=>{
    res.json({msg:"route working...."})
})
app.listen(PORT,()=>{
    console.log(`app listening on ${PORT}`)
})