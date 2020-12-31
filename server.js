//Declaraciones
const express = require("express");
const server = express();
const db = require("./db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const utils = require("./utils.js")
const secret = "jfausifuasoifjaewwtgc";

//Middlewares
server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

authorization = (req, res, next) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(authToken, secret);
    req.authInfo = decodedToken;
    next();
  } catch (error) {
    res.status(401);
    res.send("Error de autenticación");
  }
};
isAdmin = (req, res, next) => {
  try {
    const admin = req.authInfo;
    if (admin.isAdmin == 0) {
      res.status(403);
      res.json("No puede realizar esta acción");
    } else {
      res.status(200);
      next();
    }
  } catch (error) {
    console.log(error);
    res.end();
  }
};
noUserNoAdmin = (req, res, next) => {
  try {    
    const id = req.params.id;    
    if (id != req.authInfo.id && req.authInfo.isAdmin !== 1) {
      res.status(401);
      res.json("No puede realizar esta acción");
    } else {
      res.status(200);
      next();
    }
  } catch (error) {
    console.log(error);
    res.end();
  }
};
//Enpoints
server.get("/", (req,res) => {
  res.status(200);
  res.json("Delilah resto");  
});
//Login
server.post("/login", async (req, res) => {
  try {
    const { nickname, password } = req.body;    
    const pass = utils.MD5(password);
    const identificaUsuario = await db.sequelize.query(
      "SELECT id, nickname, isAdmin FROM `usuarios` WHERE nickname = :nickname AND password = :password",
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: {
          nickname: nickname,
          password: pass,
        },
      }
    );
    if (identificaUsuario.length !== 0) {      
      const token = jwt.sign(identificaUsuario[0], secret);
      console.log("Bienvenido", nickname);
      res.status(200);
      res.json(token);
    } else {
      res.status(401);
      res.send("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    console.log(error);
    res.end();
  }
});
//Registro
server.post("/registro", async (req, res) => {
  const {nickname,nombre,apellido,telefono,direccion,password,} = req.body;  
  console.log(await utils.isNicknameAvailable(nickname));
  if (nickname.length < 3 || nickname.length > 25) {
    res.status(400);
    res.json("Nombre de usuario incorrecto (Muy corto o muy largo)");
    return;
  } else if (nickname == "" || !nickname) {
    res.status(400);
    res.json("Debe ingresar su nombre de usuario");
    return;
  } else if(await utils.isNicknameAvailable(nickname) === false){    
    res.status(400);
    res.json("El usuario ingresado ya existe. Pruebe con otro");
    return
  }
  if (!nombre || nombre == "") {
    res.status(400);
    res.json("Debe ingresar su nombre");
    return;
  }
  if (!apellido || apellido == "") {
    res.status(400);
    res.json("Debe ingresar su apellido");
    return;
  }
  if (!telefono || telefono == "") {
    res.status(400);
    res.json("Debe ingresar su número telefonico");
    return;
  }
  if (!direccion || direccion == "Debe ingresar su dirección de envío") {
    res.status(400);
    res.json("Debe ingresar su dirección de envío");
    return;
  }
  if (!password || password == "") {
    res.status(400);
    res.json("Debe ingresar una contraseña");
    return;
  } else if (password.length < 4) {
    res.status(400);
    res.json("La contraseña es muy corta");
    return;
  }
  try {
    const pass = utils.MD5(password);    
    var respuesta = await db.sequelize.query(
      "INSERT INTO usuarios (nickname, nombre, apellido, telefono, direccion, password, isAdmin) VALUES (:nickname, :nombre, :apellido, :telefono, :direccion, :password, 0)",
      {
        replacements: {
          nickname: nickname,
          nombre: nombre,
          apellido: apellido,
          telefono: telefono,
          direccion: direccion,
          password: pass,
        },
      }
    );
    res.status(201);
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
//Pedidos
server.get("/pedidos", authorization, isAdmin, async (req, res) => {
  try {
    let consulta = await db.sequelize.query(
      `
        SELECT estadosPedidos.estado,
            fecha,
            pedidos.id AS numero,
            GROUP_CONCAT(CONCAT(cantidad, 'X ', plato.nombre) SEPARATOR ',') AS detalle,
            Forma AS forma_de_pago,
            total,
            CONCAT(usuarios.nombre, ' ', apellido) AS usuario,            
            direccion            
            FROM pedidos
            JOIN usuarios 
            ON pedidos.usuario_id = usuarios.id
            JOIN formasDePago
            ON forma_pago = formasDePago.id
            JOIN estadosPedidos
            ON pedidos.estado = estadosPedidos.id
            JOIN platosPorPedidos
            ON pedidos.id = platosPorPedidos.id_pedido 
            JOIN plato
            ON plato.id = platosPorPedidos.id_plato
            GROUP BY numero            
        `,
      {
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    console.log("Lista de pedidos");
    res.status(200);
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.get("/pedidos/:id", authorization, async (req, res) => {
  try {
    const id = req.params.id;    
    let consultaPedido = await db.sequelize.query("SELECT usuario_id FROM pedidos WHERE id = :id",{
      replacements: {
        id:id
      },type: db.sequelize.QueryTypes.SELECT
    })    
    if(consultaPedido[0].usuario_id != req.authInfo.id && req.authInfo.isAdmin !== 1){
      res.status(403);
      res.json("No puede realizar esta acción");
      return
    }
    let consulta = await db.sequelize.query(
      `
        SELECT estadosPedidos.estado,
            fecha,
            pedidos.id AS numero,
            GROUP_CONCAT(CONCAT(cantidad, 'X ', plato.nombre) SEPARATOR ',') AS detalle,
            Forma AS forma_de_pago,
            total,
            CONCAT(usuarios.nombre, ' ', apellido) AS usuario,            
            direccion            
            FROM pedidos
            JOIN usuarios 
            ON pedidos.usuario_id = usuarios.id
            JOIN formasDePago
            ON forma_pago = formasDePago.id
            JOIN estadosPedidos
            ON pedidos.estado = estadosPedidos.id
            JOIN platosPorPedidos
            ON pedidos.id = platosPorPedidos.id_pedido 
            JOIN plato
            ON plato.id = platosPorPedidos.id_plato
            WHERE pedidos.id = :id
            GROUP BY numero
        `,
      {
        replacements: {
          id: id,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    
    console.log("Pedido #", id);
    res.status(200);
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.post("/pedidos", authorization, async (req, res) => {
  try {
    const { detalle, forma_pago, total } = req.body;
    let pad = function (num) {
      return ("00" + num).slice(-2);
    };
    let date;
    date = new Date();
    date =
      date.getFullYear() +
      "-" +
      pad(date.getMonth() + 1) +
      "-" +
      pad(date.getDate()) +
      " " +
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds());

    let consulta = await db.sequelize.query(
      "INSERT INTO pedidos (usuario_id, estado, total, forma_pago, fecha) VALUES (:usuario_id, 1, :total, :forma_pago,:fecha)",
      {
        replacements: {
          usuario_id: req.authInfo.id,
          total: total,
          forma_pago: forma_pago,
          fecha: date,
        },
      }
    );
    const id_pedido = consulta[0];
    detalle.forEach(async (plato) => {
      await db.sequelize.query(
        "INSERT INTO platosPorPedidos (id_plato,id_pedido,cantidad) VALUES (:id_plato, :id_pedido, :cantidad)",
        {
          replacements: {
            id_plato: plato.id_plato,
            id_pedido: id_pedido,
            cantidad: plato.cantidad,
          },
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
    });
    console.log("Pedido realizado con exito");
    res.status(201);
    res.json(consulta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.patch("/pedidos/:id", authorization, isAdmin, async(req,res) => {
    try {
        const id = req.params.id;
        const estado = req.body.estado
        if(isNaN(estado)){
            res.status(400);
            res.json("Estado debe ser un valor númerico")
            return
        }
        let consulta = await db.sequelize.query("UPDATE pedidos SET estado = :estado WHERE id = :id ",{
            replacements:{
                id: id,
                estado: estado
            }, type: db.sequelize.QueryTypes.UPDATE
        });
        res.status(200);
        res.json(consulta);        
    } catch (error) {
        console.log(error);
        res.end();
    }    
});
server.delete("/pedidos/:id",authorization,isAdmin, async(req,res) => {
    try {        
        const id = req.params.id;
        let consulta = await db.sequelize.query("DELETE FROM pedidos WHERE id = :id",{
            replacements:{
                id: id
            },type: db.sequelize.QueryTypes.DELETE
        });
        res.status(200);
        res.json(consulta);
    } catch (error) {
        console.log(error);
        res.status(500);
        res.json("Ha ocurrido un error inesperado");
    }
});

//Productos o platos
server.get("/platos", async (req, res) => {
  try {
    let response = await db.sequelize.query(
      "SELECT nombre, precio, imagen FROM plato",
      { type: db.sequelize.QueryTypes.SELECT }
    );
    res.json(response);
  } catch (error) {
    console.log(error);
    res.end();
  }
});
server.get("/platos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    let respuesta = await db.sequelize.query(
      "SELECT nombre, precio, imagen FROM plato WHERE id = :id",
      {
        replacements: {
          id: id,
        },
        type: db.sequelize.QueryTypes.SELECT,
      }
    );
    res.status(200);
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");    
  }
});
server.post("/platos", authorization, isAdmin, async (req, res) => {
  try {
    const { nombre, precio, imagen } = req.body;
    if (!nombre || nombre === "") {
      res.status(400);
      res.json("Debe ingresar un nombre");
      return
    }
    if (nombre.length > 99) {
      res.status(400);
      res.json("Nombre demasiado largo");
      return
    }
    if(!precio){
      res.status(400);
      res.json("Debe ingresar un precio");
      return
    } else if (isNaN(precio) || precio < 0) {
      res.status(400);
      res.json("Debe ingresar un número para el precio valido");
      return
    }
    if (imagen !== "" && imagen !== undefined) {
      let consulta = await db.sequelize.query(
        "INSERT INTO plato (nombre, precio, imagen) VALUES (:nombre, :precio, :imagen)",
        {
          replacements: {
            nombre: nombre,
            precio: precio,
            imagen: imagen,
          },
          type: db.sequelize.QueryTypes.INSERT,
        }
      );
      res.status(201);
      res.json(consulta);
    } else {
      let consulta = await db.sequelize.query(
        "INSERT INTO plato (nombre, precio) VALUES (:nombre, :precio)",
        {
          replacements: {
            nombre: nombre,
            precio: precio,
            type: db.sequelize.QueryTypes.INSERT,
          },
        }
      );
      res.status(201);
      res.json(consulta);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.delete("/platos/:id", authorization, isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    let respuesta = db.sequelize.query("DELETE FROM plato WHERE id = :id", {
      replacements: {
        id: id,
      },
      type: db.sequelize.QueryTypes.DELETE,
    });
    res.status(200);
    console.log("Plato borrado");
    res.json(respuesta);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.patch("/platos/:id", authorization, isAdmin, async (req, res) => {
  try {
    const { nombre, precio, imagen } = req.body;
    if(!nombre && !precio && !imagen){
      res.status(400);
      res.json("Debe ingresar el nombre, precio o imagen");
      return
    }
    const consulta = db.sequelize;
    const id = req.params.id;
    const consultaInicio = "UPDATE plato SET";
    const consultaFin = " WHERE id = :id";
    if (nombre && precio && imagen) {
      let respuesta = consulta.query(
        consultaInicio
          .concat(" nombre = :nombre, precio = :precio, imagen = :imagen")
          .concat(consultaFin),
        {
          replacements: {
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (nombre && precio) {
      let respuesta = consulta.query(
        consultaInicio
          .concat(" nombre = :nombre, precio = :precio")
          .concat(consultaFin),
        {
          replacements: {
            id: id,
            nombre: nombre,
            precio: precio,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (nombre && imagen) {
      let respuesta = consulta.query(
        consultaInicio
          .concat(" nombre = :nombre, imagen = :imagen")
          .concat(consultaFin),
        {
          replacements: {
            id: id,
            nombre: nombre,
            imagen: imagen,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (nombre) {
      let respuesta = consulta.query(
        consultaInicio.concat(" nombre = :nombre").concat(consultaFin),
        {
          replacements: {
            id: id,
            nombre: nombre,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (precio && imagen) {
      let respuesta = consulta.query(
        consultaInicio
          .concat(" precio = :precio, imagen = :imagen")
          .concat(consultaFin),
        {
          replacements: {
            id: id,
            precio: precio,
            imagen: imagen,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (precio) {
      let respuesta = consulta.query(
        consultaInicio.concat(" precio = :precio").concat(consultaFin),
        {
          replacements: {
            id: id,
            precio: precio,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    } else if (imagen) {
      let respuesta = consulta.query(
        consultaInicio.concat(" imagen = :imagen").concat(consultaFin),
        {
          replacements: {
            id: id,
            imagen: imagen,
          },
          type: db.sequelize.QueryTypes.UPDATE,
        }
      );
      res.status(200);
      res.json(respuesta);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
//Usuarios
server.get("/usuarios", authorization, isAdmin, async (req, res) => {
  try {
    let response = await db.sequelize.query("SELECT * FROM usuarios", {
      type: db.sequelize.QueryTypes.SELECT,
    });
    console.log("Lista de usuarios");
    res.status(200);
    res.json(response);    
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");    
  }
});
server.get("/usuarios/:id", authorization, noUserNoAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (req.authInfo.isAdmin === 1) {
      let consulta = await db.sequelize.query(
        "SELECT * FROM usuarios WHERE id = :id",
        {
          replacements: {
            id: id,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200);
      console.log("Usuario devuelto con exito");
      res.json(consulta);
    } else {
      let consulta = await db.sequelize.query(
        "SELECT nickname, nombre, apellido, telefono, direccion FROM usuarios WHERE id = :id",
        {
          replacements: {
            id: id,
          },
          type: db.sequelize.QueryTypes.SELECT,
        }
      );
      res.status(200);
      res.json(consulta);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json("Ha ocurrido un error inesperado");
  }
});
server.patch("/usuarios/:id",authorization,noUserNoAdmin,async (req, res) => {
    try {
      const id = req.params.id;
      const {nickname,nombre,apellido,telefono,direccion,password,isAdmin} = req.body;
      if (!nickname || nickname.length < 3) {
        res.status(400);
        res.json("Nickname no ingresado o demasiado corto");
        return;
      } else if(await utils.isNicknameAvailable(nickname) === false){    
        res.status(400);
        res.json("El usuario ingresado ya existe. Pruebe con otro");
        return
      }
      if (!nombre || nombre === "") {
        res.status(400);
        res.json("Debe ingresar el nombre");
        return;
      }
      if (!apellido || apellido === "") {
        res.status(400);
        res.json("Debe ingresar el apellido");
        return;
      }
      if (!telefono || telefono === "") {
        res.status(400);
        res.json("Debe ingresar el teléfono");
        return;
      }      
      if (!direccion || direccion === "") {
        res.status(400);
        res.json("Debe ingresar la dirección");
        return;
      }
      if (!password || password === "") {
        res.status(400);
        res.json("Debe ingresar la contraseña");
        return;
      } else if (password.length < 4) {
        res.status(400);
        res.json("La contraseña es muy corta");
        return;
      }
      const pass = utils.MD5(password);
      if (req.isAdmin === 1) {
        if (!isAdmin) {
          res.status(400);
          res.json(
            "Debe asignar un valor para determinar si el usuario es administrador o no"
          );
          return;
        }
        if (isNaN(isAdmin)) {
          res.status(400);
          res.json(
            "Debe asignar un valor numerico para determinar si el usuario es administrador o no"
          );
          return;
        }
        let consulta = await db.sequelize.query(
          "UPDATE usuarios SET nickname = :nickname, nombre = :nombre, apellido = :apellido, telefono = :telefono, direccion = :direccion, password = :password, isAdmin = :isAdmin WHERE id = :id ",
          {
            replacements: {
              nickname: nickname,
              nombre: nombre,
              apellido: apellido,
              telefono: telefono,
              direccion: direccion,
              password: pass,
              isAdmin: isAdmin,
            },
            type: db.sequelize.QueryTypes.UPDATE,
          }
        );
        res.status(200);
        console.log("Usuario actualizado correctamente");
        res.json(consulta);
      } else {
        let consulta = await db.sequelize.query(
          "UPDATE usuarios SET nickname = :nickname, nombre = :nombre, apellido = :apellido, telefono = :telefono, direccion = :direccion, password = :password WHERE id = :id ",
          {
            replacements: {
              id: id,
              nickname: nickname,
              nombre: nombre,
              apellido: apellido,
              telefono: telefono,
              direccion: direccion,
              password: pass,
            },
            type: db.sequelize.QueryTypes.UPDATE,
          }
        );
        res.status(200);
        console.log("Usuario actualizado correctamente");
        res.json(consulta);
      }
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json("Ha ocurrido un error inesperado");
    }
  }
);
server.delete("/usuarios/:id",authorization,noUserNoAdmin,async (req, res) => {
    try {
      const id = req.params.id;
      let consulta = await db.sequelize.query(
        "DELETE FROM usuarios WHERE id = :id",
        {
          replacements: {
            id: id,
          },
          type: db.sequelize.QueryTypes.DELETE,
        }
      );
      res.status(200);
      console.log("Usuario eliminado");
      res.json(consulta);
    } catch (error) {
      console.log(error);
      res.status(500);
      res.json("Ha ocurrido un error inesperado");
    }
  }
);

server.listen(process.env.PORT || 3000, () => {
  console.log("Server on port 3000");
});