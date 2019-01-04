use restaurante;
select * from categoria;
-- DROP TABLE CatCocinaPlato;
-- DROP TABLE CatCocinaIngre;
-- DROP TABLE CatBarBebida;
-- DROP TABLE CatBarIngre;
-- DROP TABLE CocinaPlatoIngre;
-- DROP TABLE CatBebidaIngre;
-- DROP TABLE Sesion;
-- DROP TABLE DetalleOrdenMesa;




insert into CatCocinaPlato (nombre, descripcion, precio) values ("Con queso", "Hamburguesa", "38.5");
insert into CatCocinaIngre (nombre, descripcion) values ("Queso", "Duro");
insert into CocinaPlatoIngre (idPlato, idIngre) values (12, 1);

select * from CatCocinaPlato;
select * from CatCocinaIngre;
select * from CocinaPlatoIngre;
select * from Sesion;
select * from DetalleOrdenMesa where idItem = 1 and categoria = 1;
select * from IngreRemovido;

select id, nombre, descripcion, imagen 
from CocinaPlatoIngre cpl
join CatCocinaIngre cci on cpl.idIngre = cci.id;

select * from CatCocinaIngre;

select * from Mesa m
join Sesion s on m.id = s.IdMesa
where m.id = 1;

select * from DetalleOrdenMesa;
select * from Mesa;
select * from Sesion;

select * from Sesion
where idMesa = 2
and num = (select max(num)  as num
	from Sesion 
	where idMesa = 2);

select idMesa, max(num) as num, cerrada from Sesion
where idMesa = 2 and cerrada = 0;

    
delete from Sesion where num = 2 and idMesa = 2;


select dom.id as idDetalleOrdenMesa, ccp.id, ccp.Nombre, ccp.descripcion, GROUP_CONCAT(cci.nombre SEPARATOR ', ') as ingre from 
Mesa m
join Sesion s on m.id = s.IdMesa
join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
join CatCocinaIngre cci on ir.idIngre = cci.id
where m.id = 14
and s.num = 1
and s.Cerrada = 0
group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;

select * from 


join CatBarBebida cbb on dom.IdItem = cbb.Id and dom.Categoria = 2 ;

select * from CatCocinaIngre;

select id, nombre, descripcion, imagen 
                from CocinaPlatoIngre cpl
                join CatCocinaIngre cci on cpl.idIngre = cci.id
                where idPlato = 2
                and  idIngre not in (1,4);



select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, GROUP_CONCAT(cci.nombre SEPARATOR ', ') as ingre from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2
        left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
        left join CatBarIngre cci on ir.idIngre = cci.id
        where m.id = 14
        and s.num = 1
        and s.Cerrada = 0
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;
        

select * from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2
        left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
        left join CatBarIngre cci on ir.idIngre = cci.id
        where m.id = 14
        and s.num = 1
        and s.Cerrada = 0;
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;        


select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, GROUP_CONCAT(cci.nombre SEPARATOR ' - ') as ingre from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        left join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2
        left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
        left join CatBarIngre cci on ir.idIngre = cci.id
        where m.id = 14
        and s.num = 1
        and s.Cerrada = 0
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;

        
        
        select * from DetalleOrdenMesa where idmesa = 14 and numsesion = 1;


select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
        where m.id = 14
        and s.num = 1
        and s.Cerrada = 0
        and dom.Enviada = 1
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;
        
        
        
select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, GROUP_CONCAT(cci.nombre SEPARATOR ' - ') as ingre from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
        left join IngreRemovido ir on dom.Id = ir.idDetalleOrdenMesa
        left join CatCocinaIngre cci on ir.idIngre = cci.id
        where s.Cerrada = 0
        and dom.Enviada = 2
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion
        order by dom.fechaUpdate desc
        limit 10;


