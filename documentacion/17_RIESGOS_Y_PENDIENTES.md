# Riesgos y pendientes

## Pendientes críticos

| Pendiente | Impacto | Criterio de cierre |
|---|---|---|
| Prueba manual Android A1–H3 | No se ha demostrado interoperabilidad física completa. | Ejecutar en Expo Go y registrar evidencia por caso. |
| Prueba entre dos APKs | Expo Go no sustituye permisos entre binarios independientes. | Instalar ambos APK y repetir flujo crítico. |
| Nombre Calpulli/Calpolli | Puede fragmentar marca, rutas y paquetes. | Elegir una escritura oficial y migrar referencias. |
| Autoridad institucional | No está confirmada. | Validar titularidad, créditos y lenguaje público. |
| Estado de producción | SAF es solución de MVP. | Diseñar backend, seguridad, roles y migraciones antes de publicar. |

## Riesgos técnicos

- URI SAF revocada o inválida.
- Corrupción del JSON compartido.
- Escrituras concurrentes entre apps.
- Medios compartidos no legibles desde la otra app.
- Cambios de Expo o Android que afecten APIs SAF.
- Diferencias entre validación automatizada y layout real.
- Rutas o selectores SAES que cambien en el portal.

## Riesgos de producto

- Confundir demo con autenticación real.
- Presentar información ficticia como institucional.
- Prometer e-commerce, trámites o integración SAES que no existen.
- Mezclar el alcance de Calpulli con la extensión SAES.

## Estado de validación reconstruido

El reporte de Etapa 18 documenta typecheck, 131 pruebas, bundles Android, auditoría estática y resolución de rutas. También marca la columna manual pendiente por ausencia de emulador y dispositivo conectado en el entorno de ejecución.

## Prioridad sugerida

1. Cerrar nomenclatura y autoridad de comunicación.
2. Ejecutar pruebas manuales en Android.
3. Validar dos APKs con la misma carpeta.
4. Corregir hallazgos de accesibilidad y presentación.
5. Definir si el proyecto sigue como demo, piloto o producto institucional.
