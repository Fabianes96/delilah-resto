const express = require("express");
const server = express();
const db = require("./db")

server.use(express.json());
server.use(express.urlencoded({extended: false}));


autorization = (req,res,next)=>{
    const authToken = req.headers.autorization.split(' ')[1];
    //const decodedToken = jwt.verify(authToken,secret);
    //req.authInfo = decodedToken
    next();
    
}

server.get("/",()=>{

})
server.post("/login", async(req,res)=>{    
    const {usename, password} = req.body;
    const identificaUsuario = await db.sequelize.query('SELECT username, user_id FROM ')
})
server.post("/registro", ()=>{    
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


