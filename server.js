const express = require("express");
const server = express();
const db = require("./db")
const jwt = require("jsonwebtoken");
const cors = require("cors");
const secret = "secretoDelCodigo";

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: false}));

authorization = (req,res,next)=>{
    try {
        const authToken = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(authToken,secret);
        req.authInfo = decodedToken;        
        next();        
    } catch (error) {        
        res.status(401);
        res.send("Error de autenticación");
    }    
}
isAdmin = (req,res,next)=>{
    try {
        const admin = req.authInfo        
        if(admin.isAdmin == 0){
            res.status(403)
            res.send("No eres admin");            
        }else{
            res.status(200);            
            next();
        }        
    } catch (error) {
        res.end();
    }
}

server.get("/",()=>{
})
server.post("/login", async(req,res)=>{    
    try {        
        const {nickname, password} = req.body;
        const identificaUsuario = await db.sequelize.query("SELECT id, nickname, isAdmin FROM `usuarios` WHERE nickname = :nickname AND password = :password",{
            type: db.sequelize.QueryTypes.SELECT,
            replacements:{
                nickname: nickname,
                password: password
            }        
        })
        if(identificaUsuario.length !== 0){
            console.log(identificaUsuario);
            const token = jwt.sign(identificaUsuario[0],secret);
            res.status(200);
            res.json(token);
        } else{
            res.status(401);
            res.send("Usuario o contraseña incorrectos")
        }
    } catch (error) {
        console.log(error);
        res.end();
    }
    
})
server.post("/registro", async(req,res)=>{    
    const {nickname, nombre, apellido, telefono, direccion, password} = req.body
    if(nickname.length < 3 || nickname.length >25 ){
        res.status(400);
        res.json("Nombre de usuario incorrecto");
        return
    }else if(nickname == ""){
        res.status(400);
        res.json("Debe ingresar su nombre de usuario");
        return
    }
    if(nombre == ""){
        res.status(400);
        res.json("Debe ingresar su nombre");
        return
    }
    if(apellido == ""){
        res.status(400);
        res.json("Debe ingresar su apellido");    
        return
    }
    if(telefono == ""){
        res.status(400);
        res.json("Debe ingresar su número telefonico");
        return
    }
    if(direccion == "Debe ingresar su dirección de envío"){
        res.status(400);
        res.json("Debe ingresar su dirección de envío");
        return
    }
    if(password == ""){
        res.status(400);
        res.json("Debe ingresar una contraseña");
        return
    } else if(password.length < 4){
        res.status(400);
        res.json("La contraseña es muy corta");
        return
    }       
    try {        
      var respuesta = await db.sequelize.query("INSERT INTO usuarios (nickname, nombre, apellido, telefono, direccion, password) VALUES (:nickname, :nombre, :apellido, :telefono, :direccion, :password)",{
            replacements: {nickname: nickname,
                nombre: nombre,
                apellido: apellido,
                telefono: telefono,
                direccion: direccion,
                password: password
            }    
        })
        res.status(201);        
        res.json(respuesta);
    } catch (error) {
        console.log(error);        
        res.end();       
    }   
})
server.get("/pedidos",authorization, isAdmin, (req,res)=>{
    //INSERT INTO pedidos 
    res.send("Pedidos")    
});
server.get("/pedidos/:id", ()=>{
});
server.patch("/pedidos/:id", ()=>{
});
server.post("/pedidos",()=>{    
});
server.delete("/pedidos/:id",()=>{    
});
server.get("/platos", async(req,res)=>{    
    try {        
        let response = await db.sequelize.query("SELECT nombre, precio, imagen FROM plato", {type: db.sequelize.QueryTypes.SELECT})        
        res.json(response)
    } catch (error) {
        console.log(error);
        res.end();
    }
});
server.get("/platos/:id", async (req,res)=>{
    try {
        const id = req.params.id;
        let respuesta = await db.sequelize.query("SELECT nombre, precio, imagen FROM plato WHERE id = :id",{
            replacements:{
                id: id
            },
            type: db.sequelize.QueryTypes.SELECT
        });
        res.status(200);
        res.json(respuesta);
        
    } catch (error) {
        console.log(error);
        res.end();
    }    
});
server.post("/platos",authorization, isAdmin, async(req,res)=>{
    try {
        const {nombre, precio, imagen} = req.body;
        if(nombre === ""){
            res.status(400);
            res.json("Debe ingresar un nombre");
        }
        if(nombre.length > 99){
            res.status(400);
            res.json("Nombre demasiado largo");
        }        
        if(isNaN(precio) || precio < 0){
            res.status(400);
            res.json("Debe ingresar un número valido")
        }
        if(imagen !== "" && imagen !== undefined)
        {            
            let consulta = await db.sequelize.query("INSERT INTO plato (nombre, precio, imagen) VALUES (:nombre, :precio, :imagen)",{
                replacements:{
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen
                },
                type: db.sequelize.QueryTypes.INSERT
            })
            res.status(201);
            res.json(consulta);
        }else{
            let consulta = await db.sequelize.query("INSERT INTO plato (nombre, precio) VALUES (:nombre, :precio)",{
                replacements:{
                    nombre: nombre,
                    precio: precio,                    
                    type: db.sequelize.QueryTypes.INSERT
                }, 
            });
            res.status(201);
            res.json(consulta);
        }
        
    } catch (error) {
        console.log(error);        
        res.end();
    }
})
server.delete("/platos/:id",authorization,isAdmin,async(req,res)=>{
    try {
        const id = req.params.id;
        let respuesta = db.sequelize.query("DELETE FROM plato WHERE id = :id",{
            replacements: {
                id: id
            },
            type: db.sequelize.QueryTypes.DELETE
        });
        res.status(200);
        console.log("Plato borrado");
        res.json(respuesta);
    } catch (error) {
        console.log(error);
        res.end();
    }        
});
server.patch("/platos/:id",authorization, isAdmin, async (req,res)=>{
    try {        
        const {nombre, precio, imagen} = req.body;
        const consulta = db.sequelize;
        const id = req.params.id;
        const consultaInicio = "UPDATE plato SET";
        const consultaFin = " WHERE id = :id"        
        if(nombre && precio && imagen){
            let respuesta = consulta.query(consultaInicio.concat(" nombre = :nombre, precio = :precio, imagen = :imagen").concat(consultaFin),{
                replacements:{
                    id: id,
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(nombre && precio){ 
            let respuesta = consulta.query(consultaInicio.concat(" nombre = :nombre, precio = :precio").concat(consultaFin),{
                replacements:{
                    id: id,
                    nombre: nombre,
                    precio: precio,                    
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(nombre && imagen){
            let respuesta = consulta.query(consultaInicio.concat(" nombre = :nombre, imagen = :imagen").concat(consultaFin),{
                replacements:{
                    id: id,
                    nombre: nombre,               
                    imagen: imagen
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(nombre){
            let respuesta = consulta.query(consultaInicio.concat(" nombre = :nombre").concat(consultaFin),{
                replacements:{
                    id: id,
                    nombre: nombre,                                   
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(precio && imagen){
            let respuesta = consulta.query(consultaInicio.concat(" precio = :precio, imagen = :imagen").concat(consultaFin),{
                replacements:{
                    id: id,
                    precio: precio,
                    imagen: imagen
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(precio){
            let respuesta = consulta.query(consultaInicio.concat(" precio = :precio").concat(consultaFin),{
                replacements:{
                    id: id,
                    precio: precio
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }else if(imagen){
            let respuesta = consulta.query(consultaInicio.concat(" imagen = :imagen").concat(consultaFin),{
                replacements:{
                    id: id,
                    imagen: imagen
                },
                type: db.sequelize.QueryTypes.UPDATE
            });
            res.status(200);
            res.json(respuesta);
        }
    } catch (error) {
        console.log(error);
        res.end();
    }

})

server.get("/usuarios", async(req,res)=>{
    let response = await db.sequelize.query("SELECT * FROM usuarios",{type: db.sequelize.QueryTypes.SELECT});
    console.log(response);
    res.send("Lista de usuarios")
})
server.post("/admin",()=>{    
})
server.get("/carrito",()=>{    
})
server.listen(3000, ()=>{
    console.log("Server on port 3000");
})


