# 01 — CONTEXTO MAESTRO DEL PROYECTO

## Nombre del ecosistema

**UPIICSA Calpulli**

## Aplicaciones

### 1. UPIICSA Calpulli

Aplicación pública de consulta.

Características globales:

- React Native.
- Expo.
- TypeScript.
- Expo Router.
- Android/Expo Go como objetivo inmediato.
- Sin login.
- Sin creación de perfil de estudiante.
- Sin necesidad de internet para el MVP.
- Modo claro y oscuro.
- Interfaz moderna con identidad propia.
- Referencias visuales discretas a culturas originarias de México, con especial inspiración mexica.
- Alta predictibilidad de interacción sin copiar la UI exacta de ninguna red social.

Navegación inferior:

1. Inicio.
2. Feria.
3. Marketplace.
4. Tutorías.
5. Favoritos.

### 2. Gestión UPIICSA Calpulli

Aplicación administrativa y de demostración.

Para el MVP:

- Sin login.
- Sin contraseña.
- Sin autenticación.
- La pantalla inicial permite elegir un perfil de demostración.
- Siempre existe una acción visible/discreta para cambiar de perfil.
- Escribe sobre la misma fuente de verdad local que consume UPIICSA Calpulli.

Roles:

1. Superadministrador.
2. Administrador de Feria.
3. Departamento.
4. Emprendedor.
5. Tutor.
6. Moderador.

## Filosofía de interoperabilidad

No son dos apps independientes que casualmente contienen datos iguales.

Ambas forman parte del mismo sistema.

La App de Gestión modifica la fuente compartida.
La App de Consulta interpreta y presenta esa fuente compartida.

Los modelos de dominio deben estar definidos una sola vez dentro de un paquete común.

## Monorepo del MVP

Estructura objetivo:

```text
upiicsa-calpulli/
├── CODEX.md
├── apps/
│   ├── calpulli/
│   └── gestion-calpulli/
├── packages/
│   ├── domain/
│   ├── shared-store/
│   ├── repositories/
│   ├── ui/
│   └── mock-data/
└── docs/
```

## Separación futura

El monorepo se usa para agilizar el MVP y compartir contratos.

Cuando el proyecto incorpore infraestructura real, backend y despliegues independientes, se podrá evaluar separar repositorios sin alterar el dominio conceptual.

No hacer esa separación durante el MVP.

## Departamentos ficticios iniciales

1. Dirección.
2. Gestión Escolar.
3. Biblioteca.
4. Servicio Médico.
5. Cultura.
6. Deportes.
7. Becas.
8. Emprendimiento.
9. Posgrado.
10. Tutorías.

El sistema no debe asumir que solo existirán diez departamentos.

## Feed institucional

El Inicio de UPIICSA Calpulli centraliza avisos/publicaciones de departamentos.

Orden base:

**más nuevo → más antiguo**

Cada publicación puede mostrar:

- logo/avatar del departamento;
- nombre del departamento;
- fecha/hora;
- título;
- contenido;
- imagen;
- galería;
- enlace;
- documento;
- ubicación;
- visualizaciones;
- guardar.

No existen:

- likes;
- comentarios.

Prioridades:

- normal;
- destacada;
- importante;
- urgente.

La prioridad puede afectar tratamiento visual y posicionamiento de acuerdo con las reglas de UI, pero debe conservarse una experiencia predecible.

## Historias institucionales

Existe un carrusel de historias/avisos temporales de departamentos.

Sirve para:

- recordatorios;
- convocatorias;
- avisos breves;
- material visual;
- información temporal.

Sin likes ni comentarios.

Solo puede mostrarse recuento de visualizaciones cuando corresponda.

## Feria de Emprendimiento

Regla habitual:

- aproximadamente cada 15 días;
- día miércoles.

Sin embargo, la próxima fecha siempre es editable por el Administrador de Feria.

Estados públicos del MVP:

- `upcoming`;
- `active`.

Al terminar una feria, el sistema vuelve a `upcoming` con la siguiente fecha configurada.

### Geometría inicial

Fila superior:

- 7 mesas.

De las mesas superiores 3, 5 y 7 nacen columnas hacia abajo.

Cada una de esas tres columnas contiene:

- 11 mesas adicionales.

Total:

- 7 + 33 = 40 stands.

La geometría debe definirse con datos/coordenadas, no con 40 componentes escritos manualmente.

### Estados de stand

- disponible;
- solicitado;
- asignado.

### Selección de stand

El emprendedor:

1. abre el mapa;
2. selecciona un stand disponible;
3. envía solicitud.

El Administrador de Feria:

1. recibe solicitud;
2. aprueba o rechaza;
3. si aprueba, se crea la asociación stand-emprendimiento.

Solo tras aprobación aparece públicamente el emprendimiento en esa mesa.

## Marketplace

No es e-commerce completo.

Para el MVP sirve para descubrir:

- emprendimientos;
- publicaciones;
- productos;
- categorías;
- perfiles.

No hay:

- pagos;
- carrito;
- checkout;
- pedidos.

Los emprendedores no publican en el feed institucional.

## Tutorías

Los alumnos tutores configuran:

- perfil;
- fotografía/avatar;
- descripción;
- materias;
- modalidad;
- contacto externo.

La app pública facilita el descubrimiento.

El contacto se realiza fuera de Calpulli.

## Favoritos

Los favoritos pertenecen solamente al dispositivo/app pública.

No se escriben en la fuente interoperable.

No necesitan perfil.

La pérdida/reinstalación de la app puede eliminar esos favoritos en el MVP.

## Datos ficticios

Toda la información del MVP puede ser ficticia.

El logo definitivo se incorporará posteriormente desde los recursos/fuentes del proyecto.
