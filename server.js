const express = require("express");
const server = express();
const db = require("./db")

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

autorization = (req,res,next)=>{
    const authToken = req.headers.autorization.split(' ')[1];
    //const decodedToken = jwt.verify(authToken,secret);
    //req.authInfo = decodedToken
    next();
    
}

server.get("/",()=>{
})
server.post("/login", async(req,res)=>{    
    // const {usename, password} = req.body;
    // const identificaUsuario = await db.sequelize.query('SELECT username, user_id FROM ')
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
server.get("/pedido",autorization, (req,res)=>{
    //Si está logueado muestor los pedidos
    res.send("Pedidos")
    //Si no, mostrar error
})
server.get("/pedido/:id", ()=>{
})
server.put("/pedido/:id", ()=>{
})
server.post("/pedido",()=>{    
})
server.delete("/pedido/:id",()=>{    
})
server.post("/admin",()=>{    
})
server.get("/carrito",()=>{    
})
server.listen(3000, ()=>{
    console.log("Server on port 3000");
})


