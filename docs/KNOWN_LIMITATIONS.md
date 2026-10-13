# Limitaciones conocidas y contradicciones abiertas

Fecha de corte: 12 de octubre de 2026.

## Implementación actual

- El MVP opera localmente en Android mediante SAF y JSON; no existe backend independiente.
- No existen API REST, servidor HTTP, sincronización por Internet ni base de datos central implementados.
- SQLite y PostgreSQL aparecen en documentos académicos como propuestas, no como tecnologías AS-IS.
- La app pública no tiene login y Gestión usa perfiles de demostración, no autenticación ni autorización productiva.
- Favoritos y configuración privada dependen del almacenamiento local de cada aplicación.
- Marketplace no incluye pagos, carrito, checkout ni pedidos.
- Tutorías usa contactos externos y no incluye chat ni agenda.

## Validación pendiente

- La matriz manual A1–H3 no se completó en un dispositivo Android durante el reporte de Etapa 18.
- Expo Go no demuestra por sí solo que dos APK independientes conservarán permisos SAF compatibles.
- Los APK existentes son artefactos de demostración; no prueban aceptación, distribución ni publicación productiva.
- Los resultados históricos de 7/7 workspaces y 131/131 pruebas deben distinguirse de una ejecución fresca.
- La ejecución fresca del 12 de octubre de 2026 confirmó 7/7 workspaces y 131/131 pruebas, pero `npm audit --omit=dev` reportó 45 vulnerabilidades transitivas (14 moderadas, 30 altas y 1 crítica). No se aplicaron correcciones automáticas porque algunas propuestas son incompatibles con el stack actual.

## Arquitectura TO-BE sin decisión

- La tecnología de backend está pendiente. Los documentos históricos mencionan Node.js y Python/FastAPI sin una decisión final.
- La persistencia futura menciona SQLite y PostgreSQL en contextos distintos; ninguna está implementada en el MVP.
- Autenticación, autorización, cifrado, auditoría, multiusuario y sincronización requieren diseño de producción.

## Mapas y cartografía

- El mapa implementado corresponde a las 40 mesas de la feria.
- No existe cartografía institucional completa, navegación de edificios ni rutas de salones.
- El diagrama de consulta/localización de salón es TO-BE y no debe presentarse como funcionalidad actual.

## Producto, marca y comunicación

- No hay evidencia de aprobación institucional formal.
- La escritura `Calpulli`/`Calpolli` no está normalizada en todos los nombres históricos.
- La titularidad, los créditos y el permiso de publicación de los recursos de identidad deben confirmarse.
- El repositorio no tiene una licencia definida.

## Documentación académica

- Existe una discrepancia histórica entre 84 y 86 respuestas de cuestionario. La evidencia consolidada identifica 86 en la fuente corregida; la cifra 84 se conserva como contradicción documental histórica.
- Las prioridades de los RF no están definidas de forma uniforme.
- El flujo actual permite publicación departamental con moderación posterior; documentos anteriores describen validación previa. El código actual prevalece como AS-IS.

## Publicación inicial

- `Saes/saes-source-snapshot/` es privado y contiene datos de sesión Web Forms y un identificador estudiantil; no debe publicarse.
- Los APK se excluyen del control de versiones inicial.
- Los recursos de identidad se excluyen hasta resolver permisos.
- El destino está definido como `Monster8010/upiicsa-calpulli` privado, pero el repositorio remoto vacío aún debe crearse y confirmarse.
