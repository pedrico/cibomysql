use restaurante;
select * from categoria;

create table CatCocinaPlato(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
precio DECIMAL(13,2),
imagen VARCHAR(100),
PRIMARY KEY (id)
);

DROP TABLE CatCocinaPlato;

insert into CatCocinaPlato (nombre, descripcion, precio) values ("Con queso", "Hamburguesa", "38.5");

select * from CatCocinaPlato;


create table CatCocinaIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);

create table CatCocinaIngre(
id int NOT NULL AUTO_INCREMENT,
nombre CHAR(30) NOT NULL,
descripcion CHAR(30) NOT NULL,
imagen VARCHAR(100),
PRIMARY KEY (id)
);
