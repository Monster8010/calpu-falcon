# Flujos operativos

## Publicación institucional

1. Seleccionar `Departamento` y un área demo.
2. Crear título, contenido, prioridad y medios.
3. Configurar visibilidad de ubicación, fecha y media.
4. Publicar.
5. Gestión guarda mediante repository y `SharedStore`.
6. App pública relee al refrescar.
7. Moderador puede ocultar o restaurar después.

Los departamentos publican sin aprobación previa. Moderación es posterior, no una cola de aprobación.

## Historias

Una historia puede tener medio, texto y duración simple de 6, 12, 24 o 48 horas. Debe tener título o texto. Su vigencia inicia al guardar y termina en `expiresAt`.

## Feria

1. Administrador cambia `nextDate` si es necesario.
2. Activa una feria `upcoming`.
3. El mapa muestra 40 mesas: 7 superiores y tres ramas de 11.
4. Emprendedor selecciona una mesa disponible.
5. Se crea una solicitud `pending`.
6. Administrador aprueba o rechaza.
7. La aprobación cambia la mesa a `assigned` y vincula el emprendimiento.
8. La app pública relee y muestra avatar, mesa y perfil.

El emprendedor nunca autoaprueba. Finalizar una feria registra `endedAt`, libera mesas y cancela solicitudes activas según las reglas documentadas.

## Marketplace

El emprendedor edita perfil, publicaciones y productos. La app pública los muestra para descubrimiento. No existe carrito, pago, pedido ni checkout.

## Tutorías

El tutor edita perfil, materias, modalidades y disponibilidad textual. El alumno encuentra y abre un contacto externo. No existe agenda, reserva ni chat interno.

## Favoritos

El alumno guarda avisos desde la app pública. El estado vive en AsyncStorage privado de esa app. Cambios administrativos no deben borrar Favoritos.

## Restauración demo

Superadministrador puede restaurar el seed con confirmación. La operación reemplaza el estado compartido y conserva backup. No debe borrar Favoritos privados.
