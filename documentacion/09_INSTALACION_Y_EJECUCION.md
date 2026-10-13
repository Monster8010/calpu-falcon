# Instalación y ejecución

## Requisitos

- Node.js compatible con el proyecto.
- npm.
- Android con Expo Go compatible con Expo SDK 54.
- Teléfono y computadora en la misma red local para cargar QR.
- Carpeta `Documents/UPIICSA_Calpulli_Shared` en el teléfono.

## Instalación

Desde la raíz del proyecto:

```bash
npm install
```

No eliminar ni regenerar el `package-lock.json` sin una decisión explícita. El proyecto usa un único lockfile para el monorepo.

## Verificación técnica

```bash
npm run typecheck
npm test
```

Comandos focalizados:

```bash
npm run test:domain
npm run test:mock-data
npm run test:repositories
npm run test:shared-store
```

## Arranque de la app pública

```bash
npm run start --workspace=@calpulli/calpulli -- --lan --port 8081
```

Escanear el QR con Expo Go.

## Arranque de Gestión

En otra terminal:

```bash
npm run start --workspace=@calpulli/gestion-calpulli -- --lan --port 8082
```

Escanear el segundo QR. Mantener ambos servidores Metro activos durante la demo.

## Primera ejecución

1. Abrir Gestión.
2. Conectar la carpeta `UPIICSA_Calpulli_Shared`.
3. Si está vacía, elegir `Inicializar datos de demostración`.
4. Anotar la revisión del estado compartido.
5. Abrir la app pública.
6. Conectar exactamente la misma carpeta.
7. Confirmar que Inicio carga.

## Diagnóstico rápido

| Síntoma | Revisar |
|---|---|
| App pública sin datos | Misma carpeta SAF, seed inicializado y revisión. |
| Cambios no aparecen | Pull-to-refresh, foreground y URI compartida. |
| Reconexion solicitada | Permiso SAF revocado o URI inválida. |
| Guardado falso | Verificación posterior de `SharedStore` y backup. |
| Error de módulo | Versiones Expo, lockfile y dependencias del workspace. |

## Lo que no se debe hacer

- No iniciar ambas apps en el mismo puerto.
- No seleccionar dos carpetas parecidas.
- No crear un seed desde la app pública.
- No cambiar SAF por una API para resolver un error de integración.
