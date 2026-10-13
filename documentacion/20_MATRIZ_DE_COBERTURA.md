# Matriz de cobertura

## Necesidad de incorporación y documento

| Necesidad | Documento principal | Evidencia fuente |
|---|---|---|
| Entender por qué existe el proyecto | 02 Resumen y contexto | `contexto_upiicsa_calpulli.md` |
| Saber qué producto está construido | 03 Producto y alcance | `docs/00_READ_ME_FIRST.md`, `docs/01_PROJECT_CONTEXT.md` |
| Entender las dos apps | 04 Apps y roles | `docs/04_APP_CALPULLI_UI_FUNCTIONAL.md`, `docs/05_APP_GESTION_UI_FUNCTIONAL.md` |
| Entender arquitectura | 05 Arquitectura técnica | `docs/01_PROJECT_CONTEXT.md`, `docs/12_FOLDER_AND_MODULE_BLUEPRINT.md` |
| Entender persistencia | 06 Interoperabilidad offline | `docs/02_OFFLINE_INTEROPERABILITY.md`, `docs/11_TECHNICAL_NOTES_EXPO_ANDROID.md` |
| Conocer datos | 07 Contratos de datos | `docs/03_DATA_CONTRACTS.md`, `packages/domain/src` |
| Encontrar código | 08 Estructura del repositorio | `CODEX.md`, estructura real del monorepo |
| Ejecutar el proyecto | 09 Instalación y ejecución | `package.json`, `docs/DEMO_GUIDE.md` |
| Operar funciones | 10 Flujos operativos | docs funcionales, repositories y managers |
| Probar calidad | 11 Pruebas y aceptación | `docs/09_ACCEPTANCE_TESTS.md`, `docs/13_STAGE_18_ACCEPTANCE_REPORT.md` |
| Presentar y liberar | 12 Demo y liberación | `docs/DEMO_GUIDE.md`, APKs en `artifacts/android` |
| Proteger datos y marca | 13 Seguridad y privacidad | contexto, decisiones y docs SAES |
| Mantener diseño consistente | 14 Sistema de diseño | `docs/06_DESIGN_SYSTEM.md`, `Identidad de Imagen` |
| Evitar alcance accidental | 15 Decisiones y fuera de alcance | `docs/10_DECISIONS_AND_OUT_OF_SCOPE.md` |
| Entender SAES | 16 Extensión SAES | `Saes/README.md`, `Saes/docs/` |
| Conocer riesgos reales | 17 Riesgos y pendientes | `docs/13_STAGE_18_ACCEPTANCE_REPORT.md` |
| Mantener el proyecto | 18 Gobernanza y mantenimiento | `CODEX.md` y reglas de etapa |
| Resolver dudas | 19 Glosario y FAQ | contratos, docs funcionales y contexto |

## Cobertura funcional

```text
Contexto de comunidad
  ├── Producto y alcance
  ├── App pública
  ├── Gestión por roles
  └── Comunicación segura

Arquitectura MVP
  ├── Monorepo
  ├── Domain
  ├── Repositories
  ├── SharedStore + SAF
  ├── Mock data
  └── UI compartida

Calidad
  ├── Tests automatizados
  ├── Aceptación Android
  ├── Demo offline
  └── Validación de APKs

Producto relacionado
  └── Extensión visual SAES
```

## Hallazgos de análisis

- El proyecto no es una sola app: tiene dos apps móviles y una extensión web relacionada.
- La interoperabilidad local es la decisión técnica central.
- Existe una separación explícita entre lógica validada y prueba manual pendiente.
- La documentación fuente es amplia, pero estaba distribuida entre contexto, docs, código, artefactos y SAES.
- La nueva carpeta consolida esa información para incorporación sin editar las fuentes de referencia.
