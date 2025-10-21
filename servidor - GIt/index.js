const express = require("express");
const app = express();
const mysql = require("mysql")
const cors = require("cors")

app.use(cors())
app.use(express.json())

// Donde esta el servidor, toca cambiarlo cuando este Rails funcionando o se cree una forma de crear
// la base de datos 


const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "Mercurio2025",
    database: "posm_inventario"
});

// Agregar un item 

app.post("/api/updateitem", (req,res)=>{
    const id_Producto = req.body.idProducto;
    const id_Categoria = req.body.idCategoria;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const costo= req.body.costo;
    const stock= req.body.stock;
    const unidadMedida = req.body.unidadMedida;
    const estado = req.body.estado;
    const fechaRegistro = req.body.fechaRegistro;
    
    
    db.query("INSERT INTO Producto(idProducto,idCategoria,nombre,descripcion,precio,stock,unidad_medida,estado,fecha_registro) VALUES(?,?,?,?,?,?,?,?,?))",+
        (id_Producto,id_Categoria,nombre,descripcion,costo,stock,unidadMedida,estado,fechaRegistro),(err,res)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Objeto creado con exito"); 
                        }
                    }
                );  
            });

// Eliminar un producto

app.delete("/api/delete/_id", (req,res) => {
    const id = req.params.id;
    db.query("DELETE FROM Producto WHERE id = ?"),(err,res)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Objeto eliminado con exito"); 
                        }}



});

//Añadir un movimiento

app.post("api/updatemove", (req, res) => {
    const producto = req.body.idProducto;
    const tipo = req.body.tipo;
    const cantidad = req.body.cantidad;
    const proveedor = req.body.proveedor;

    db.query("INSERT INTO MovimentoInventario(idProducto,tipo,cantidad,proveedor) VALUES(?,?,?,?))",+
        (producto,tipo,cantidad,proveedor)),(err,res)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Movimiento creado con exito"); 
                        }}
});


// Añadir un proveedor
app.post("/api/updateitem", (req,res)=>{
    const id_Proveedor = req.body.idProveedor;
    const nombre = req.body.nombre;
    const contacto = req.body.contacto;
    const telefono= req.body.telefono;
    const correo= req.body.correo;
    const direccion = req.body.direccion;

    
    
    db.query("INSERT INTO Proveedor(idProveedor,nombre,contacto,telefono,correo,direccion) VALUES(?,?,?,?,?,?))",+
        (id_Proveedor,nombre,contacto,telefono,correo,direccion),(err,res)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Proveedor creado con exito"); 
                        }
                    }
                );  
            });


// Eliminar un proveedor

app.delete("/api/delete/_id", (req,res) => {
    const id = req.params.id;
    db.query("DELETE FROM Proveedor WHERE id = ?"),(err,res)=>{
                        if(err){
                            console.log(err);
                        }else{
                            res.send("Proveedor eliminado con exito"); 
                        }}



});

// Visualizar la tabla 

app.get("/api/read",(req,res)=>{
    db.query("SELECT * FROM Producto", (err,result)=> {
                        if(err){
                            console.log(err);
                        }else{
                            res.send(result); 
                        }
                    });
});

//Log in 

let UserData =prompt("Escriba su contraseña")

app.get("/api/login", (req,res)=> [
    Code = db.query("SELECT clave FROM Usuarios", (err,result)=> {
                        if(err){
                            console.log(err);
                        }else{
                            res.send(result); 
                        }
                    }) 
]);

const Check = UserData === Code; 


//Puertos 

const port = process.env.PORT || 3000
app.listen(port, () => console.log('Lisenting on port'));