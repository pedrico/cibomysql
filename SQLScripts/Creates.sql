use restaurante;


-- Cocina Ini
create table CatCocinaCategoria(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table CatCocinaPlato(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30),
precio DECIMAL(13,2),
imagen VARCHAR(100),
Categoria smallint,
idCocinaCategoria int NOT NULL,
PRIMARY KEY (id)
);

create table CatCocinaIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table CocinaPlatoIngre(
idPlato int NOT NULL,
idIngre int NOT NULL
);
-- Cocina Fin

-- Bar Ini
create table CatBarCategoria(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table CatBarBebida(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30),
precio DECIMAL(13,2),
imagen VARCHAR(100),
categoria smallint,
idBarCategoria int NOT NULL,
PRIMARY KEY (id)
);

create table CatBarIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table BarBebidaIngre(
idBebida int NOT NULL,
idIngre int NOT NULL
);
-- Bar Fin

create table Mesa(
id int NOT NULL
);

create table Sesion(
-- id int NOT NULL AUTO_INCREMENT,
num int NOT NULL,
idMesa int NOT NULL,
cerrada tinyint
-- PRIMARY KEY (id)
);

create table DetalleOrdenMesa(
id int NOT NULL AUTO_INCREMENT,
idMesa int not null,
numSesion int NOT NULL,
idItem int not null,
categoria smallint,
precio DECIMAL(13,2),
cantidad int not null,
cantidadPagada int default 0,
cantidadEliminada int default 0,
enviada smallint,
fechaInsert datetime,
fechaUpdate datetime,
PRIMARY KEY (id)
);

create table IngreRemovido(
idDetalleOrdenMesa int not null,
idIngre int not null
);

create table CatUsuario(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(50),
apellido CHAR(50),
usuario CHAR(50) NOT NULL,
pass CHAR(50) NOT NULL,
idRol int NOT NULL,
PRIMARY KEY (id)
);

create table Rol(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(150) NOT NULL,
descripcion CHAR(250),
PRIMARY KEY (id)
);

create table RolAcceso(
idRol int NOT NULL,
idAcceso int NOT NULL
);

create table Acceso(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(150) NOT NULL,
descripcion CHAR(250),
PRIMARY KEY (id)
); 





