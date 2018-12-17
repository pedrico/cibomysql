select * from categoria;
DROP TABLE CatCocinaPlato;
DROP TABLE CatBarBebida;
DROP TABLE CocinaPlatoIngre;
DROP TABLE CatBebidaIngre;


insert into CatCocinaPlato (nombre, descripcion, precio) values ("Con queso", "Hamburguesa", "38.5");
insert into CatCocinaIngre (nombre, descripcion) values ("Queso", "Duro");
insert into CocinaPlatoIngre (idPlato, idIngre) values (12, 1);

select * from CatCocinaPlato;
select * from CatCocinaIngre;
select * from CocinaPlatoIngre;

select id, nombre, descripcion, imagen 
from CocinaPlatoIngre cpl
join CatCocinaIngre cci on cpl.idIngre = cci.id;

select * from CatCocinaIngre;
