# Gobernanza y mantenimiento

## Responsabilidades sugeridas

| Área | Responsabilidad |
|---|---|
| Producto | Alcance, usuarios, prioridades y comunicación. |
| Dominio | Contratos, estados y validaciones. |
| Persistencia | SAF, backup, revisión, migraciones y medios. |
| Apps | Rutas, pantallas, hooks y flujos por rol. |
| Diseño | Tokens, componentes, accesibilidad e identidad. |
| QA | Tests, aceptación manual y evidencia de release. |
| Comunicación | Nombre, créditos, permisos y mensajes públicos. |
| SAES | Extensión, contrato de no interferencia y compatibilidad Web Forms. |

## Regla para cambios de código

Antes de modificar código:

1. leer `CODEX.md`;
2. leer los documentos base de `docs/00` a `docs/03`;
3. leer el documento funcional de la app afectada;
4. revisar sistema de diseño;
5. revisar etapa activa;
6. revisar pruebas de aceptación;
7. implementar en la capa correcta;
8. actualizar pruebas y documentación;
9. registrar pendientes.

## Regla para cambios de documentación

Toda documentación debe indicar:

- fecha de actualización;
- estado de evidencia;
- responsable;
- fuentes revisadas;
- decisiones relacionadas;
- pendientes abiertos.

## Revisión de incorporación

Una persona nueva está incorporada cuando puede:

- explicar las dos apps y sus límites;
- arrancar ambas apps;
- conectar la misma carpeta SAF;
- ejecutar el flujo publicación → refresco;
- explicar por qué no hay login ni backend;
- ejecutar tests;
- identificar evidencia manual pendiente;
- distinguir Calpulli de la extensión SAES.

## Conservación de referencias

`docs/` y `Saes/docs/` son las fuentes de especificación originales. `documentacion/` es la capa de orientación. Si existe conflicto, registrar la discrepancia y resolverla mediante una decisión explícita; no ocultarla editando silenciosamente el resumen.
