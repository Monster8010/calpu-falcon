# Auditoría del repositorio

Fecha de corte: 12 de octubre de 2026  
Alcance: auditoría documental, técnica y de publicabilidad; sin cambios funcionales.

## Estado Git

Los comandos iniciales `git status`, `git branch --show-current`, `git log --oneline --decorate -15` y `git remote -v` devolvieron que `Calpolli_Upiicsa` no era un repositorio Git. No existe historial previo que permita atribuir cambios o validar una base. Después de la auditoría se inicializó Git localmente, sin commit y sin remoto, para verificar exclusiones y candidatos de publicación.

## Rama actual

Rama local actual: `docs/github-initial-publication`. No tiene commits.

## Remotos

No hay remotos configurados. El destino definido posteriormente es `https://github.com/Monster8010/upiicsa-calpulli`, con visibilidad privada y publicación inicial exclusiva de `docs/github-initial-publication`.

GitHub CLI (`gh`) no está instalado y no se instaló. Una comprobación con `git ls-remote` devolvió `Repository not found`; el navegador no pudo confirmar el resultado por tiempo de espera de red. El remote no se añadirá hasta que el usuario confirme que creó el repositorio vacío.

## Estructura

- `apps/`: dos aplicaciones Expo.
- `packages/`: cinco workspaces compartidos.
- `docs/`: especificación original, etapas, aceptación y guía de demo.
- `documentacion/`: capa consolidada de incorporación y operación.
- `Saes/`: extensión visual relacionada y snapshot privado de referencia.
- `artifacts/android/`: dos APK de demostración y su nota local.
- `Identidad de Imagen/`: recursos gráficos locales con permisos de publicación pendientes.

## Aplicaciones detectadas

| Aplicación | Paquete | Estado observado |
|---|---|---|
| UPIICSA Calpulli | `@calpulli/calpulli` | Rutas Expo Router, consulta pública y favoritos locales |
| Gestión UPIICSA Calpulli | `@calpulli/gestion-calpulli` | Rutas por perfil demo y flujos administrativos |

`Saes/extension` es una extensión Manifest V3 separada. No forma parte del flujo de persistencia Calpulli.

## Packages/workspaces

| Workspace | Responsabilidad verificada |
|---|---|
| `@calpulli/domain` | Contratos, utilidades de fecha, reglas y validadores |
| `@calpulli/shared-store` | SAF, lectura/escritura, backup, revisión, validación y medios |
| `@calpulli/repositories` | Selectores y repositorios de lectura/mutación |
| `@calpulli/ui` | Tokens, temas y componentes compartidos |
| `@calpulli/mock-data` | Seed y datos ficticios |

## Tecnologías verificadas

- TypeScript `~5.9.2` declarado y 5.9.3 resuelto por el lockfile.
- React 19.1.0.
- React Native 0.81.5.
- Expo 54.0.36.
- Expo Router 6.0.24.
- npm workspaces.
- `expo-file-system` 19.0.23 para SAF.
- AsyncStorage 2.2.0.
- JSON como formato del estado compartido.
- Manifest V3 en la extensión SAES.

No se localizaron clientes HTTP, backend independiente, SQLite, PostgreSQL o autenticación productiva como parte del AS-IS documentado.

## Persistencia verificada

La ruta de código coincide con la arquitectura documentada:

```text
Pantalla → hook/servicio → repository → SharedStore → SAF/JSON
```

`SharedStore` lee el estado, clona y aplica una operación, incrementa `revision`, valida el contrato, detecta conflictos y escribe un conjunto verificado. Los archivos definidos son `calpulli-state.json`, `calpulli-state.backup.json` y `shared-meta.json`. Favoritos y URI SAF permanecen en almacenamiento privado de cada app.

## Scripts disponibles

| Script raíz | Uso |
|---|---|
| `npm run start:calpulli` | Inicia la app pública |
| `npm run start:gestion` | Inicia Gestión |
| `npm run android:calpulli` | Abre el flujo Android de la app pública |
| `npm run android:gestion` | Abre el flujo Android de Gestión |
| `npm run typecheck` | Ejecuta TypeScript en workspaces que lo definen |
| `npm test` | Ejecuta pruebas en workspaces que las definen |
| `npm run test:domain` | Pruebas de dominio |
| `npm run test:mock-data` | Pruebas del seed |
| `npm run test:repositories` | Pruebas de repositorios |
| `npm run test:shared-store` | Pruebas de almacenamiento compartido |

No existen scripts raíz `lint` ni `build`.

## Documentación existente

- `docs/00_READ_ME_FIRST.md` a `docs/13_STAGE_18_ACCEPTANCE_REPORT.md` y `docs/DEMO_GUIDE.md`.
- `documentacion/00_INDICE.md` a `documentacion/20_MATRIZ_DE_COBERTURA.md`.
- `Saes/docs/` para la extensión y el portal observado.
- Auditoría, trazabilidad, matriz de requerimientos y continuidad conservadas bajo `docs/audit/` y `docs/requirements/`.
- Fuentes e imágenes de diagramas conservadas en `diagramas/`.

## Riesgos

1. No hay historial Git: no puede verificarse autoría, rama base ni cambios previos.
2. La aceptación manual Android A1–H3 permanece pendiente.
3. SAF es una solución de MVP local; no resuelve producción multiusuario.
4. Los perfiles de Gestión son demostrativos, no autenticación.
5. La extensión SAES depende de selectores y comportamiento de un portal externo.
6. La nomenclatura `Calpulli`/`Calpolli` no está resuelta.
7. Los permisos de uso público de la identidad visual institucional no están confirmados.
8. Backend, base de datos y sincronización pertenecen al TO-BE y contienen decisiones contradictorias.

## Archivos sensibles

La búsqueda incluyó patrones de contraseñas, tokens, API keys, claves privadas, encabezados de autorización y archivos de entorno.

- No se detectaron firmas de secretos reales en código o documentación publicable.
- No se localizaron archivos `.env`, claves privadas, keystores o cuentas de servicio fuera de dependencias.
- `Saes/saes-source-snapshot/saes-page-source*.html` contiene campos de sesión Web Forms y un identificador estudiantil. La carpeta se declara privada y queda ignorada por Git.
- Dos pruebas contienen un teléfono y correos de ejemplo como fixtures explícitos. Se revisaron como datos ficticios, no como datos personales reales.
- La identidad local de este repositorio se configuró como `Antonio Alvarado San Juan` y `132991385+Monster8010@users.noreply.github.com`; la configuración global no se modificó.
- La auditoría no sustituye un escáner de secretos en CI.

## Archivos grandes

| Ruta | Tamaño aproximado | Decisión inicial |
|---|---:|---|
| `artifacts/android/Gestion-UPIICSA-Calpulli-0.1.0.apk` | 63.72 MiB | Excluido; no publicar ni crear Release sin autorización |
| `artifacts/android/UPIICSA-Calpulli-0.1.0.apk` | 62.76 MiB | Excluido; no publicar ni crear Release sin autorización |
| `Identidad de Imagen/potada.png` | 2.75 MiB | Local; excluida hasta aclarar derechos |
| `Identidad de Imagen/iconClaro.png` | 1.53 MiB | Local; excluida hasta aclarar derechos |
| `Identidad de Imagen/IconObscuro.png` | 1.50 MiB | Local; excluida hasta aclarar derechos |

No se configuró Git LFS.

Después de aplicar `.gitignore`, Git identifica 375 archivos candidatos y ninguno alcanza 5 MiB. Los APK, dependencias, snapshot privado y recursos de identidad no aparecen entre esos candidatos.

## Validaciones

| Validación | Resultado actual |
|---|---|
| Instalación | `npm install`: correcta después de repetir fuera del sandbox; 26 paquetes agregados, 50 cambiados y 720 auditados. `package-lock.json` fue actualizado por npm |
| Lint | No disponible: no existe script |
| Typecheck | `npm run typecheck`: correcto en 7/7 workspaces |
| Tests | `npm test`: 131/131 pruebas aprobadas |
| Build | No disponible: no existe script raíz |
| Android manual | Pendiente; requiere dispositivo/Expo Go |

`npm ls --depth=0` terminó correctamente y confirmó el árbol de workspaces. `npm audit --omit=dev` reportó 45 vulnerabilidades transitivas: 14 moderadas, 30 altas y 1 crítica. No se ejecutó `npm audit fix`: varias correcciones propuestas implican cambios mayores incompatibles con Expo SDK 54 y exceden el alcance documental. Este riesgo debe evaluarse en una actualización de dependencias separada.

## Pendientes

- Crear manualmente el repositorio vacío `Monster8010/upiicsa-calpulli` con visibilidad privada, sin README, `.gitignore` ni licencia generados por GitHub.
- Confirmar un mecanismo de autenticación Git/Git Credential Manager antes del push.
- Resolver si los recursos de identidad pueden publicarse y bajo qué créditos/licencia.
- Mantener fuera del repositorio público el snapshot privado de SAES y los APK, salvo decisión explícita posterior.
- Definir una licencia; actualmente no existe.
- Ejecutar la aceptación manual Android y registrar evidencia nueva.
- Revisar las 45 alertas de dependencias en una tarea técnica controlada, sin aplicar `--force`.

## Conclusión de publicabilidad

La documentación y el código fuente están preparados para commits locales. **El remote y el push deben detenerse** hasta que el repositorio privado y vacío exista en GitHub. Los recursos de identidad, el snapshot privado de SAES y los APK no forman parte de los candidatos de publicación inicial.
