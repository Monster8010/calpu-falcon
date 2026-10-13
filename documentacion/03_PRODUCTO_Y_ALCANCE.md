# Producto y alcance

## Qué incluye el MVP

### Consulta pública

- Inicio con feed institucional.
- Filtro por departamentos.
- Historias temporales.
- Feria de Emprendimiento.
- Marketplace de descubrimiento.
- Tutorías con contacto externo.
- Favoritos locales.
- Tema claro y oscuro.

### Gestión y demostración

- selector de seis perfiles demo;
- gestión de departamentos y publicaciones;
- gestión de historias;
- gestión de feria, mesas y solicitudes;
- perfiles, publicaciones y productos de emprendedores;
- perfiles y ofertas de tutores;
- moderación posterior;
- configuración y restauración de datos demo.

## Qué no incluye

- login real o cuentas de estudiantes;
- matrícula, OAuth, LDAP o integración con IPN;
- backend, nube, API HTTP o sincronización remota;
- multiusuario y multidispositivo;
- notificaciones push;
- pagos, carrito, checkout o pedidos;
- chat interno;
- likes, comentarios o ranking;
- GPS, rutas en tiempo real o reservas;
- analítica remota;
- moderación automática;
- producción iOS o publicación en Play Store.

## Alcance funcional por módulo

| Módulo | Valor | Límite actual |
|---|---|---|
| Inicio | Encontrar avisos institucionales | No reemplaza canales oficiales. |
| Feria | Ver mesas y descubrir emprendimientos | No gestiona pagos ni histórico complejo. |
| Marketplace | Descubrir productos y perfiles | No es comercio electrónico. |
| Tutorías | Encontrar tutores y materias | El contacto ocurre fuera de Calpulli. |
| Favoritos | Guardar avisos en el dispositivo | No se sincronizan entre dispositivos. |
| Gestión | Modificar seed compartido y demostrar roles | El selector de rol no es autenticación. |

## Criterio de cambio de alcance

Una idea nueva debe registrarse primero en `docs/10_DECISIONS_AND_OUT_OF_SCOPE.md`, con motivación, impacto en arquitectura, riesgos, pruebas y decisión explícita. No agregar funcionalidad directamente desde una conversación o mockup.
