DROP TABLE IF EXISTS roles CASCADE;
create TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);


DROP TABLE IF EXISTS user_has_roles CASCADE;
CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (id_user, id_rol)

);


INSERT INTO roles(
	name,
	route,
	image,
	created_at,
	updated_at
)
VALUES(
	'CLIENTE',
	'cliente/home',
	'https://www.clipartmax.com/png/middle/205-2050330_user-icon-user-icon-ico.png',
	'2024-10-04',
	'2024-10-04'
);


INSERT INTO roles(
	name,
	route,
	image,
	created_at,
	updated_at
)
VALUES(
	'RESTAURANTE',
	'restaurant/home',
	'https://static.vecteezy.com/system/resources/previews/015/079/413/non_2x/fast-food-restaurant-png.png',
	'2024-10-04',
	'2024-10-04'
);



INSERT INTO roles(
	name,
	route,
	image,
	created_at,
	updated_at
)
VALUES(
	'REPARTIDOR',
	'delivery/home',
	'https://static.vecteezy.com/system/resources/thumbnails/008/492/236/small/delivery-cartoon-illustration-png.png',
	'2024-10-04',
	'2024-10-04'
);


drop table if exists categories CASCADE;
create table categories (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);



drop table if exists products CASCADE;
create table products (
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	description VARCHAR(255) NOT NULL,
	price DECIMAL DEFAULT 0,
	image1 VARCHAR(255) NOT NULL,
	image2 VARCHAR(255) NULL,
	image3 VARCHAR(255) NULL,
	id_category BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_category) REFERENCEs categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);


drop table if exists address CASCADE;
create table address (
	id BIGSERIAL PRIMARY KEY,
	id_user BIGINT NOT NULL, -- un usuario puede tener varias direcciones
	address VARCHAR(255) NOT NULL,
	neighborhood VARCHAR(255) NOT NULL,
	lat DECIMAL DEFAULT 0,
	lng DECIMAL DEFAULT 0,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE

);

drop table if exists orders CASCADE;
create table orders (
	id BIGSERIAL PRIMARY KEY,
	id_client BIGINT NOT NULL, 
	id_delivery BIGINT NOT NULL, 
	id_address BIGINT NOT NULL,
	lat DECIMAL DEFAULT 0, -- para saber posicion real del repartidor
	lng DECIMAL DEFAULT 0,
	status VARCHAR(90) NOT NULL, -- pagado, despachado, en camino, entregado
	timestamp BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE
);


DROP TABLE IF EXISTS order_has_products CASCADE;
CREATE TABLE order_has_products(
	id_order BIGINT NOT NULL,
	id_product BIGINT NOT NULL,
	quantity BIGINT NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (id_order, id_product) -- en una orden no puede haber un mismo producto

);