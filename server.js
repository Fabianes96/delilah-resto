const express = require("express");
const server = express();
const db = require("./db")
const jwt = require("jsonwebtoken");
const secret = "secretoDelCodigo";

server.use(express.json());
server.use(express.urlencoded({extended: false}));

var users = [
    {
        nombreUsuario: "Fabianes96",
        nombre: "Fabian Esteban",
        apellido: "Higuita Alvarez",
        telefono: 3045602226,
        dirEnvio: "Calle 79B #87-42",
        password: "1234"

    },
    {
        nombreUsuario: "usuario123",
        nombre: "Usuario",
        apellido: "de prueba uno",
        telefono: 235353452,
        dirEnvio: "Calle 46",
        password: "1234"

    }
]

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
server.get("/pedidos",authorization, (req,res)=>{
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
server.get("/platos", authorization, isAdmin, (req,res)=>{
    //Si está logueado muestro lista de platos
    res.send("Lista de platos");
});
server.get("/platos/:id", (req,res)=>{
    res.send(`Producto: ${req.params.id}`);
});
server.post("/platos",(req,res)=>{
    res.send("Plato creado");
});
server.delete("/platos/:id",(req,res)=>{
    res.send(`Plato ${req.params.id} borrado`);
});
server.patch("/platos/:id",(req,res)=>{
    res.send(`Plato ${req.params.id} actualizado`);
})

server.post("/admin",()=>{    
})
server.get("/carrito",()=>{    
})
server.listen(3000, ()=>{
    console.log("Server on port 3000");
})


