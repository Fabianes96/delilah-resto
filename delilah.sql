-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 02-01-2021 a las 16:16:55
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `delilah`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estadosPedidos`
--

CREATE TABLE `estadosPedidos` (
  `id` int(11) NOT NULL,
  `estado` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estadosPedidos`
--

INSERT INTO `estadosPedidos` (`id`, `estado`) VALUES
(1, 'Nuevo'),
(2, 'Confirmado'),
(3, 'Preparando'),
(4, 'Enviando'),
(5, 'Cancelado'),
(6, 'Entregado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_plato` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`id`, `id_user`, `id_plato`) VALUES
(1, 17, 10),
(2, 17, 2),
(3, 1, 10),
(4, 14, 6),
(5, 10, 9),
(6, 9, 11),
(7, 13, 3),
(8, 8, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formasDePago`
--

CREATE TABLE `formasDePago` (
  `id` int(11) NOT NULL,
  `Forma` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `formasDePago`
--

INSERT INTO `formasDePago` (`id`, `Forma`) VALUES
(1, 'Efectivo'),
(2, 'Tarjeta de crédito'),
(3, 'Tarjeta débito'),
(4, 'Paypal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `estado` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `forma_pago` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id`, `usuario_id`, `estado`, `total`, `forma_pago`, `fecha`) VALUES
(3, 8, 6, 660, 1, '2020-12-01 15:57:31'),
(5, 9, 5, 2520, 2, '2020-11-17 20:58:10'),
(6, 10, 1, 320, 3, '2020-12-27 15:58:10'),
(7, 13, 2, 593, 2, '2020-12-27 16:00:10'),
(8, 17, 4, 849, 4, '2020-12-25 12:00:58'),
(9, 14, 3, 690, 2, '2020-12-27 09:09:16'),
(10, 18, 5, 432, 1, '2020-12-26 23:18:16'),
(11, 15, 6, 120, 1, '2020-12-01 10:04:40'),
(12, 19, 6, 880, 4, '2020-12-15 13:53:00'),
(13, 1, 1, 200, 1, '2020-12-30 00:05:17'),
(15, 20, 2, 1000, 1, '2020-12-30 18:37:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `precio` int(11) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `platos`
--

INSERT INTO `platos` (`id`, `nombre`, `precio`, `imagen`) VALUES
(2, 'Veggie Avocado', 310, './imagenes/avo-sandwich.png'),
(3, 'Bagel de salmón', 425, './imagenes/bagel.jpg'),
(4, 'Hamburguesa clásica', 350, './imagenes/ham_clasica.jpg'),
(5, 'Sandwich veggie', 310, './imagenes/veggie.jpg'),
(6, 'Ensalada veggie', 340, './imagenes/ensalada-detox-veggie.jpg'),
(7, 'Focaccia', 300, './imagenes/focaccia.jpg'),
(8, 'Sandwich focaccia', 440, './imagenes/sand_focaccia.jpg'),
(9, 'Focaccia blanca', 280, './imagenes/focaccia_bianca.jpg'),
(10, 'Ensalada', 340, './imagenes/ensalada.jpg'),
(11, 'Focaccia vegan', 440, './imagenes/focaccia-vegan.jpg'),
(17, 'Milanesa', 540, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platosPorPedidos`
--

CREATE TABLE `platosPorPedidos` (
  `id` int(11) NOT NULL,
  `id_plato` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `platosPorPedidos`
--

INSERT INTO `platosPorPedidos` (`id`, `id_plato`, `id_pedido`, `cantidad`) VALUES
(1, 4, 3, 1),
(2, 5, 3, 1),
(3, 4, 5, 6),
(4, 7, 5, 2),
(5, 8, 5, 2),
(6, 7, 9, 2),
(7, 4, 8, 4),
(8, 2, 12, 1),
(9, 10, 12, 1),
(10, 4, 13, 2),
(11, 6, 13, 1),
(12, 5, 14, 1),
(13, 2, 15, 4),
(14, 5, 15, 1),
(15, 3, 16, 1),
(16, 7, 16, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nickname` varchar(100) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `password` varchar(200) NOT NULL,
  `isAdmin` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nickname`, `nombre`, `apellido`, `telefono`, `direccion`, `password`, `isAdmin`) VALUES
(1, 'Fabianes96', 'Fabian', 'Higuita', '3045602226', 'calle 79b #87-42', '81dc9bdb52d04dc20036dbd8313ed055', 1),
(2, 'usuario_admin', 'admin', 'admin', '+12 34567890', 'Calle 1', '21232f297a57a5a743894a0e4a801fc3', 1),
(3, 'usuario24', 'Prueba', 'Veinticuatro', '23453453', 'Carrera del sol', 'password', 0),
(4, 'usuario1234', 'Usuario', 'de prueba uno', '235353452', 'Calle 46', '1234', 0),
(8, 'queen_freddie', 'Freddie', 'Mercury', '+44 7712345678', '1 Logan PIKensington, London W8 6DE, UK', '04e3ff80228e584881bf1138d7dd0646', 0),
(9, 'JohnS', 'John', 'Smith', '+97 74834723', 'TARDIS ST, 4242, Space 453, Gallifrey', '1b0a3ec526f0fb6755be187bb93d8b57', 0),
(10, 'brian_may', 'Brian', 'May', '+33 2361238', '8236 Bohemian Street, London', '1b0a3ec526f0fb6755be187bb93d8b57', 0),
(11, 'MalinQ', 'Malin', 'Quist', '+37 2398749273', '246 Jeffrey Gateway', '059a02ff8d108bd03040c63c8ef50c3f', 0),
(12, 'jordanna06', 'Jordanna', 'Kitchener', '+1 452363728', '5157 Grady Ridge', 'c218d72376eb474cb262e282f97480c4', 0),
(13, 'iSanders', 'Ivan', 'Sanders', '+1 238726384', '81 Conrad Plain', '38cae950c6c315a5fe16ea522d1978a1', 0),
(14, 'mon_ribeiro', 'Mónica', 'Ribeiro', '+55 04928473422', '98 Brendon Streets Suite 314', 'ca00de8b53cced61badf5adc6cdfcbde', 0),
(15, 'katie_love', 'Katie', 'Love', '+1 2038474234', '245 Turner Spring Apt 010', 'e4a1565d6aca3eb9003e5219cae6cf27', 0),
(16, 'ilya_12', 'Ilya', 'Vasin', '+44 98347243', '3955 Dejon Green Apt. 553', 'e4770655118ae5a179fe7e5dc6aaaeed', 0),
(17, 'anna_fali', 'Anna', 'Fali', '+34 23984724', '539 Dessie Manors', '4c7852f188f233d3bdfd94145cf5a393', 0),
(18, 'daya_chitanis09', 'Daya', 'Chitanis', '+23 23763872', '9178 Reinhold Island', '21b73dbdc0ec01232c360c7e4403becd', 0),
(19, 'benedikt_S', 'Benedikt', 'Safiyulin', '+55 26363872', '821 Hansen Landing Suite 633', '94913859cca913bbece6dede29b88a45', 0),
(20, 'usu09', 'UsuarioPrueba09', 'Prueba', '+34 34534643654', 'Subway 69 London', '8364ca2b45eacc9cdc5b85b14746f09d', 0),
(23, 'usuario_prueba', 'Usuario', 'De Prueba', '+23 32468742342', 'Carrera ficticia 123', 'e807f1fcf82d132f9bb018ca6738a19f', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `estadosPedidos`
--
ALTER TABLE `estadosPedidos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Favoritos` (`id_plato`),
  ADD KEY `Usuarios_favoritos` (`id_user`);

--
-- Indices de la tabla `formasDePago`
--
ALTER TABLE `formasDePago`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comprador` (`usuario_id`),
  ADD KEY `estado_producto` (`estado`),
  ADD KEY `pago` (`forma_pago`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `platosPorPedidos`
--
ALTER TABLE `platosPorPedidos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Pedido` (`id_pedido`),
  ADD KEY `Producto` (`id_plato`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `estadosPedidos`
--
ALTER TABLE `estadosPedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `favoritos`
--
ALTER TABLE `favoritos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `formasDePago`
--
ALTER TABLE `formasDePago`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `platosPorPedidos`
--
ALTER TABLE `platosPorPedidos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `favoritos`
--
ALTER TABLE `favoritos`
  ADD CONSTRAINT `Favoritos` FOREIGN KEY (`id_plato`) REFERENCES `platos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Usuarios_favoritos` FOREIGN KEY (`id_user`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `comprador` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estado_producto` FOREIGN KEY (`estado`) REFERENCES `estadosPedidos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `pago` FOREIGN KEY (`forma_pago`) REFERENCES `formasDePago` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `platosPorPedidos`
--
ALTER TABLE `platosPorPedidos`
  ADD CONSTRAINT `Producto` FOREIGN KEY (`id_plato`) REFERENCES `platos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
