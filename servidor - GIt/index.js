const express = require("express"); 
const app =express(); 
const mysql = require("mysql")
const cors = require("cors")

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "Mercurio2025",
    database: "posm_inventario"
}); 

app.post("/create", (req,res)=>{
    const id_planta = req.body.id_planta;
    const especie = req.body.especie;
    const siembra= req.body.siembra;
    const fase = req.body.fase;
    const estado = req.body.estado;
    const costo= req.body.costo;
    
    db.query("INSERT INTO viver_planta(id_planta,Especie,Siembra,Fase,Estado,Costo) VALUES(?,?,?,?,?,?))",(id_planta,especie,siembra,fase,estado,costo),(err,result)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Planta creada con exito"); 
                        }
                    }
                );  
            });

app.get("/read",(req,res)=>{
    db.query("SELECT * FROM viver_planta", (err,result)=> {
                        if(err){
                            console.log(err);
                        }else{
                            res.send(result); 
                        }
                    });
});

app.listen(3305, ()=>{
    console.log("Puerto 3305")
});
