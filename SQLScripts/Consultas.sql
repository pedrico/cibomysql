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
-- DROP TABLE Login;

DELETE from DetalleOrdenMesa;
DELETE FROM Sesion;
DELETE FROM Mesa;



insert into CatCocinaPlato (nombre, descripcion, precio) values ("Con queso", "Hamburguesa", "38.5");
insert into CatCocinaIngre (nombre, descripcion) values ("Queso", "Duro");
insert into CocinaPlatoIngre (idPlato, idIngre) values (12, 1);

select * from CatCocinaCategoria;
select * from CatCocinaPlato;
select * from CatCocinaIngre;
select * from CocinaPlatoIngre;
select * from Sesion;
select * from DetalleOrdenMesa where idItem = 1 and categoria = 1;
select * from IngreRemovido;
select * from DetalleOrdenMesa;

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


select dom.id as idDetalleOrdenMesa, dom.fechaUpdate, CONVERT_TZ(dom.fechaUpdate,'+00:00','+00:00') as fechaTZ, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal from 
    Mesa m
    join Sesion s on m.id = s.IdMesa
    join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
    join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1 
    where dom.Enviada = 4
    and dom.fechaUpdate >= '2019-01-03 01:30:00'
    and dom.fechaUpdate <= '2019-01-03 23:30:00'
    order by dom.fechaUpdate;




select dom.id as idDetalleOrdenMesa, dom.fechaUpdate, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal from 
    Mesa m
    join Sesion s on m.id = s.IdMesa
    join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
    join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1 
    where dom.Enviada = 4
    and dom.fechaUpdate >= 'Wed Jan 02 2019 01:50:00 GMT-0600 (CST)'
    and dom.fechaUpdate <= 'algo'
    order by dom.fechaUpdate;
    
    
select * from Mesa m
join Sesion s on m.id = s.idmesa
where s.cerrada = 0;


select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio as subtotal,cbb.id, cbb.nombre, cbb.descripcion , cbb.precio as subtotal 
from 
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        left join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
        left join CatBarBebida cbb on dom.IdItem = cbb.Id and dom.Categoria = 2 
        where m.id = 14
        and s.num = 2
        and s.Cerrada = 0
        and dom.Enviada = 2
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion;
        
select m.id as idDetalleOrdenMesa, sum(dom.precio) as subtotal
from 
Mesa m
join Sesion s on m.id = s.IdMesa
join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
left join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
left join CatBarBebida cbb on dom.IdItem = cbb.Id and dom.Categoria = 2 
where 
s.Cerrada = 0
and dom.Enviada = 2
group by m.id;    




select dom.id as idDetalleOrdenMesa, dom.fechaUpdate, ccp.id, ccp.nombre, ccp.descripcion , ccp.precio from
    Mesa m
    join Sesion s on m.id = s.IdMesa
    join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
    join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
    where dom.Enviada = 4
    and dom.fechaUpdate >= '2019-1-24 23:49:00'
    and dom.fechaUpdate <= '2019-1-26 23:49:00'
    order by dom.fechaUpdate;    
    
    
    
select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.precio * dom.cantidad as subtotal, ccc.nombre as categoria
	from 
	Mesa m
	join Sesion s on m.id = s.IdMesa
	join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
	join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
	left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
	where m.id = 
	and s.num = ${NumeroSesion}
	and s.Cerrada = 0
	and dom.Enviada = 2
	or dom.Enviada = 4
	group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;    
    
    
    

 select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.precio * dom.cantidad as subtotal, ccc.nombre as categoria
        from
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
        left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
        where m.id = 11
        and s.num = 4
        and s.Cerrada = 0
        and dom.Enviada = 2
        or dom.Enviada = 4
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;    
        

UPDATE DetalleOrdenMesa AS a 
JOIN DetalleOrdenMesa AS b on a.id = b.id
SET a.cantidadPagada = b.cantidadPagada + 1
    , a.Enviada = 4, a.fechaUpdate = '2019-02-11 17:17:19' WHERE a.id = 1;

update DetalleOrdenMesa set cantidadPagada = cantidadPagada + 1, Enviada = 4, fechaUpdate = '2019-02-11 17:17:19' WHERE id = 1;
    
    
select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.cantidadEliminada,
        dom.precio * (dom.cantidad -dom.cantidadEliminada) as subtotal, ccc.nombre as categoria
        from
        Mesa m
        join Sesion s on m.id = s.IdMesa
        join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
        join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1
        left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
        where m.id = 11
        and s.num = 4
        and s.Cerrada = 0
        and dom.Enviada = 2
        or dom.Enviada = 4
        group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad;    


select * from DetalleOrdenMesa;

update DetalleOrdenMesa set cantidadPagada = cantidad where id in (1,3);
        
use restaurante;        

select m.id, sum(dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada)) as Total
from 
Mesa m
join Sesion s on m.id = s.IdMesa
join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion

where    
s.Cerrada = 0
and (dom.Enviada = 2 or dom.Enviada = 4)
group by m.id;


select * from DetalleOrdenMesa order by fechainsert desc;    

select 'hola';
select idMesa from Sesion group by idMesa;

select count(1) cantidad from DetalleOrdenMesa 
where idMesa = 14
and numSesion = 4 
and idItem = 100;




		(select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.cantidadEliminada,
            dom.precio * (dom.cantidad - dom.cantidadEliminada - dom.cantidadPagada) as subtotal, ccc.nombre as categoria
            from 
            Mesa m
            join Sesion s on m.id = s.IdMesa
            join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
            join CatCocinaPlato ccp on dom.IdItem = ccp.Id and dom.Categoria = 1        
            left join CatCocinaCategoria ccc on ccc.id = ccp.idCocinaCategoria
            where m.id = 14
            and s.num = 5
            and s.Cerrada = 0
            and (dom.Enviada = 2 or dom.Enviada = 4)
            group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad)
                    union
                    (select dom.id as idDetalleOrdenMesa, ccp.id, ccp.nombre, ccp.descripcion, dom.precio, dom.cantidad, dom.cantidadPagada, dom.cantidadEliminada,
                    dom.precio * (dom.cantidad -dom.cantidadEliminada - dom.cantidadPagada) as subtotal, cbc.nombre as categoria
                    from 
                    Mesa m
                    join Sesion s on m.id = s.IdMesa
                    join DetalleOrdenMesa dom on s.IdMesa = dom.IdMesa and s.Num = dom.numSesion
                    join CatBarBebida ccp on dom.IdItem = ccp.Id and dom.Categoria = 2       
                    left join CatBarCategoria cbc on cbc.id = ccp.idBarCategoria
                    where m.id = 14
                    and s.num = 5
                    and s.Cerrada = 0
                    and (dom.Enviada = 2 or dom.Enviada = 4)
                    group by dom.id, ccp.id, ccp.Nombre, ccp.descripcion, dom.cantidad);
                    
                    
use restaurante;                    
select * from CatBarIngre;
select * from CatCocinaIngre;

-- DROP TABLE CatUsuario;
-- delete from CatUsuario;
SELECT * FROM CatUsuario;
INSERT INTO CatUsuario (id, nombre, apellido, usuario, pass, idRol) values (null, 'Francisco', 'Juarez', 'admin', '123', 3);
INSERT INTO CatUsuario (id, nombre, apellido, usuario, pass, idRol) values (null, 'Ramiro', 'Leon', 'rleonel', '123', 2);
INSERT INTO CatUsuario (id, nombre, apellido, usuario, pass, idRol) values (null, 'Jairo', 'Fuentes', 'jfuentes', '123', 3);


INSERT INTO Rol (nombre, descripcion) values ('Administrador', 'Acceso a todo el sistema.');
INSERT INTO Rol (nombre, descripcion) values ('Cajero', 'Acceso a orden, mesas y cuenta. Restricción de catálogos y eliminación de items de cuentas.');
INSERT INTO Rol (nombre, descripcion) values ('Mesero', 'Acceso a orden y visualización de cuenta. Restricción de catálogos, y eliminación de items de cuentas.');

select * from RolAcceso;
select * from Acceso;

INSERT INTO Acceso (nombre, descripcion) values ('');

delete from Acceso;
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (1, 0, 'Cocina', 'Menú catálogo de cocina.');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (2, 1, 'Cocina Platos', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (3, 1, 'Cocina Categorías', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (4, 1, 'Cocina Ingredientes', '');

INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (5, 0, 'Bar', 'Menú catálogo de bar.');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (6, 5, 'Bar Bebidas', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (7, 5, 'Bar Categorías', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (8, 5, 'Bar Ingredientes', '');

INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (9, 0, 'Seleccion Mesa', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (10, 9, 'Seleccion Cocina', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (11, 10, 'Seleccion Ingre Cocina', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (12, 9, 'Seleccion Bar', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (13, 12, 'Seleccion Ingre Bar', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (14, 9, 'Resumen Orden', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (15, 14, 'Resumen Orden Eliminar', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (16, 9, 'Cuenta', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (17, 16, 'Cuenta Pagar', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (18, 16, 'Cuenta Eliminar', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (19, 16, 'Cuenta Ticket', '');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (20, 0, 'Reporte Ventas', '');


INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (21, 0, 'Usuario', 'Menú catálogo de usuarios.');
INSERT INTO Acceso (id, idPadre, nombre, descripcion) values (22, 0, 'Mesas Ocupadas', '');




-- Admin
INSERT INTO RolAcceso (idRol, idAcceso) values(1,1);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,2);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,3);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,4);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,5);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,6);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,7);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,8);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,9);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,10);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,11);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,12);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,13);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,14);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,15);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,16);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,17);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,18);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,19);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,20);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,21);
INSERT INTO RolAcceso (idRol, idAcceso) values(1,22);

-- Cajero
INSERT INTO RolAcceso (idRol, idAcceso) values(2,9);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,10);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,11);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,12);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,13);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,14);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,15);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,16);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,17);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,18);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,19);
INSERT INTO RolAcceso (idRol, idAcceso) values(2,22);


-- Mesero
INSERT INTO RolAcceso (idRol, idAcceso) values(3,9);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,10);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,11);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,12);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,13);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,14);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,15);
INSERT INTO RolAcceso (idRol, idAcceso) values(3,16);


select * from CatUsuario;

select a.id from CatUsuario cu 
join Rol r on cu.idRol = r.id
join RolAcceso ra on r.id = ra.idRol
join Acceso a on ra.idAcceso = a.id
where cu.id = 1;


update CatUsuario set idRol = 1 where id = 1;

-- delete from RolAcceso;
select * from Acceso;
select * from RolAcceso;
Select * from Rol;

select * from Mesa;
select * from Sesion;
select * from DetalleOrdenMesa;
select * from CatUsuario;