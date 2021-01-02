# Delilah Resto

**Acamica DWFS.**

Este proyecto plantea el backend para un sistema de pedidos de un restaurante, que permite realizar las operaciones CRUD sobre los endpoints (especificados en el archivo spec.yml) a través de una API.
La creación de la API se hizo mediante Node.js, Express.js, MySQL (utilizando el gestor de base de datos XAMPP) y sequelize ORM. Se usó Postman para realizar las pruebas y Swagger para documentación. 

Para probar la API se debe contar principalmente con Node.js y MySQL en el entorno local. Primero se debe importar la base de datos 'delilah.sql' incluida en los ficheros. El script crea la base de datos si no existe, y la utiliza con el nombre de 'delilah' por lo que se recomienda no tener otra base de datos con el mismo nombre. Usando XAMPP se puede importar la base, accediendo a http://localhost/phpmyadmin/ en la pestaña 'importar' o directamete en la ruta http://localhost/phpmyadmin/server_import.php. Una vez allí, dar clic en 'Seleccionar archivo' y ubicar el archivo sql.
Finalmente dar clic en 'Continuar'.

![screenshot1](https://user-images.githubusercontent.com/42284483/103461969-084c1d00-4cf0-11eb-9e38-585c6ef9852c.jpg)

Para inicializar el servidor primero se deben instalar las dependencias necesarias. Por tanto es necesario ejecutar el comando `npm install` por medio de una terminal ubicando la ruta donde se encuentra el proyecto.  
Luego de instalar las dependecias se puede proceder a ejecutar el servidor por medio del comando `node server.js`. El servidor estará escuchando entonces las conexiones a través del puerto 3000.
Finalmente con el servidor inicializado y con phpmyadmin ejecutándose se tiene todo preparado para realizar las pruebas sobre los endpoints utilizando postman en la ruta http://localhost:3000/.
Para la autenticación de usuarios se utilizó JWT, por lo que si se quiere probar los endpoints con un usuario administrador se puede utilizar el JWT correspondiente, al loguearse con las siguientes credenciales: { "nickname": "usuario_admin", "password": "admin" }.
Este JWT se debe escribir en el campo de las cabeceras de la petición (Headers) añadiendo una _key_ 'Authorization' con _value_ Bearer + el JWT correspondiente.

![screenjwt](https://user-images.githubusercontent.com/42284483/103463863-91b61c00-4cfd-11eb-8f79-bce433ec3f02.png)
