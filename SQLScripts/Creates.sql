use restaurante;

-- Cocina Ini
create table CatCocinaPlato(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
precio DECIMAL(13,2),
imagen VARCHAR(100),
categoria smallint,
PRIMARY KEY (id)
);

create table CatCocinaIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table CocinaPlatoIngre(
idPlato int NOT NULL NOT NULL,
idIngre int NOT NULL NOT NULL
);
-- Cocina Fin

-- Bar Ini
create table CatBarBebida(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
precio DECIMAL(13,2),
imagen VARCHAR(100),
categoria smallint,
PRIMARY KEY (id)
);

create table CatBarIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table BarBebidaIngre(
idBebida int NOT NULL NOT NULL,
idIngre int NOT NULL NOT NULL
);
-- Bar Fin

create table Mesa(
id int NOT NULL
);

create table Sesion(
id int NOT NULL AUTO_INCREMENT,
num int NOT NULL,
idMesa int NOT NULL,
cerrada tinyint,
PRIMARY KEY (id)
);

create table DetalleOrdenMesa(
idSesion int NOT NULL,
idItem int not null,
categoria smallint,
precio DECIMAL(13,2),
enviada smallint,
fechaInsert datetime,
fechaUpdate datetime
);
