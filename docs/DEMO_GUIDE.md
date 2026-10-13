# GUÍA DE DEMOSTRACIÓN — UPIICSA CALPULLI

Esta guía prepara y ejecuta un recorrido estable de aproximadamente cinco minutos con las dos experiencias Expo en un mismo Android.

## Requisitos previos

- Android con Expo Go compatible con Expo SDK 54.
- Teléfono y computadora en la misma red local para cargar los bundles por QR.
- Carpeta `Documents/UPIICSA_Calpulli_Shared` creada en el teléfono.
- Wi-Fi y datos pueden desactivarse después de que ambas experiencias hayan cargado su bundle para comprobar el comportamiento offline.
- No cerrar los dos servidores Metro durante la prueba.

La interoperabilidad usa SAF y no depende de Metro. Metro sólo entrega el código JavaScript a Expo Go durante desarrollo.

## Levantar ambas experiencias

Usar dos terminales desde la raíz del repositorio.

Terminal 1 — app pública:

```bash
npm run start --workspace=@calpulli/calpulli -- --lan --port 8081
```

Terminal 2 — Gestión:

```bash
npm run start --workspace=@calpulli/gestion-calpulli -- --lan --port 8082
```

Escanear cada QR desde Expo Go. El slug visible permite distinguir `UPIICSA Calpulli` de `Gestión UPIICSA Calpulli`.

## Preparación segura

1. Abrir Gestión y conectar `UPIICSA_Calpulli_Shared`.
2. Si la carpeta está vacía, pulsar `Inicializar datos de demostración`.
3. Si contiene cambios de una prueba anterior, elegir `Superadministrador` → `Datos de demostración` → `Restaurar datos de demostración` y confirmar.
4. Anotar la revisión compartida que muestra Gestión.
5. Abrir la app pública, conectar exactamente la misma carpeta y confirmar que entra a Inicio.
6. Regresar a Gestión. `Cambiar perfil demo` debe permanecer visible en todos los dashboards.

Restaurar el seed elimina cambios administrativos de la demo, pero no borra los Favoritos privados de la app pública.

## Recorrido de cinco minutos

### 0:00–0:45 — Sistema local compartido

En Gestión, entrar como `Superadministrador`.

- Mostrar métricas generales.
- Abrir `Datos de demostración`.
- Señalar conexión SAF, revisión, schema y último escritor.
- Explicar que no hay login ni backend en el MVP.

### 0:45–1:40 — Publicación institucional

1. Pulsar `Cambiar perfil demo`.
2. Elegir `Departamento` → `Gestión Escolar`.
3. Crear una publicación breve y marcar prioridad `Urgente`.
4. Escribir una ubicación, pero desactivar `Mostrar ubicación`.
5. Publicar y esperar el mensaje de guardado verificado.
6. Cambiar a la app pública, abrir Inicio y refrescar.

Resultado esperado:

- el aviso aparece con tratamiento urgente;
- la ubicación no aparece;
- no existe aprobación previa del Moderador.

Guardar el aviso en Favoritos para demostrar estado privado local.

### 1:40–3:40 — Feria y asignación de mesa

1. En Gestión, cambiar a `Administrador de Feria`.
2. Si la feria está `Próxima`, pulsar `Activar feria` y confirmar.
3. Cambiar a `Emprendedor` → `Quetzal Café`.
4. Abrir Feria, tocar una mesa disponible y pulsar `Solicitar esta mesa`.
5. Confirmar el mensaje `Solicitud enviada` y que no existe acción para autoaprobar.
6. Cambiar a `Administrador de Feria` → `Ver solicitudes`.
7. Abrir la solicitud de Quetzal Café, pulsar `Aprobar` y confirmar.
8. Volver a la app pública, abrir Feria y refrescar.

Resultado esperado:

- la feria activa muestra 40 mesas;
- la mesa aprobada muestra la identidad de Quetzal Café;
- tocarla abre el detalle y permite ver el perfil del emprendimiento.

### 3:40–4:25 — Marketplace y Tutorías

En la app pública:

- abrir Marketplace y entrar a un producto de Quetzal Café;
- confirmar que no hay carrito, pago ni checkout;
- abrir Tutorías, buscar `Cálculo` y entrar al perfil de Ana Torres;
- mostrar que el CTA de contacto es externo y no existe chat interno.

### 4:25–5:00 — Moderación y Favoritos

1. En Gestión, cambiar a `Moderador`.
2. Ocultar la publicación urgente recién creada y confirmar.
3. En la app pública, refrescar Inicio: el aviso debe desaparecer.
4. Regresar a Gestión, restaurarlo y confirmar.
5. Refrescar Inicio: el aviso debe volver.
6. Abrir Favoritos: el guardado sigue siendo local aunque cambiaron datos administrativos.

## Prueba offline final

Después de abrir una vez ambas experiencias:

1. Desactivar Wi-Fi y datos móviles.
2. Alternar entre Inicio, Feria, Marketplace, Tutorías y Favoritos.
3. En Gestión, editar un título o una materia y guardar.
4. Regresar a la app pública y refrescar la sección correspondiente.

La escritura y lectura compartidas deben continuar porque utilizan SAF. Un enlace de contacto externo puede no abrir contenido remoto sin red; eso no afecta la operación local del MVP.

## Lista de aceptación antes del APK

Ejecutar todos los casos A1–H3 de `docs/09_ACCEPTANCE_TESTS.md` y completar la columna manual de `docs/13_STAGE_18_ACCEPTANCE_REPORT.md`.

No generar APK si ocurre cualquiera de estos problemas:

- una experiencia seleccionó una carpeta diferente;
- la revisión no coincide;
- una mutación muestra éxito pero desaparece al refrescar;
- el backup no recupera un JSON principal dañado;
- el mapa no contiene 40 mesas;
- el emprendedor puede autoaprobar;
- hay crash, ruta rota, warning de keys o contenido ilegible en tema claro/oscuro.

## Entrega APK

Sólo después de la confirmación del usuario:

1. fijar identificadores Android distintos para ambas apps;
2. generar un APK instalable por experiencia;
3. conservar los mismos contratos, seed y arquitectura SAF;
4. instalar ambos APK en el dispositivo;
5. volver a conceder acceso a la misma carpeta desde cada binario;
6. repetir el flujo crítico de publicación y asignación de stand.

Expo Go comparte un único host nativo; los APK serán la primera comprobación de permisos SAF entre dos binarios Android realmente independientes.
