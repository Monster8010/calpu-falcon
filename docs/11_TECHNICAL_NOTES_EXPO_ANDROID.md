# 11 — NOTAS TÉCNICAS: EXPO + ANDROID

## Verificación de arquitectura

La documentación actual de Expo indica que dentro de Expo Go cada proyecto tiene un filesystem separado y no puede acceder al filesystem privado de otros proyectos.

Por ese motivo el proyecto NO debe basar interoperabilidad en el `documentDirectory` privado.

Expo FileSystem mantiene compatibilidad Android con Storage Access Framework (SAF), incluyendo solicitud de acceso a un directorio seleccionado por el usuario y operaciones sobre URIs SAF.

Android SAF permite que el usuario otorgue acceso de lectura/escritura a un árbol/directorio escogido mediante el selector del sistema.

## Implicación para Calpulli

Ambas experiencias deben:

1. solicitar acceso;
2. seleccionar la misma carpeta;
3. conservar la URI para su propio uso;
4. leer/escribir el mismo estado compartido.

## Restricciones Android modernas

No intentar usar como carpeta de interoperabilidad:

- raíz del almacenamiento;
- `Android/data`;
- `Android/obb`;
- raíz de Downloads.

Usar una subcarpeta explícita como:

`Documents/UPIICSA_Calpulli_Shared`

## API

La documentación de Expo expone `StorageAccessFramework` dentro de la API legacy compatible de `expo-file-system`.

El código debe revisar la versión instalada en el proyecto antes de importar.

No copiar imports de documentación sin comprobar la versión efectiva de Expo SDK.

## Expo Go

Mantener compatibilidad con Expo Go mientras sea requisito de presentación.

Si una funcionalidad futura necesita código nativo que Expo Go no incluya:

- no degradar la arquitectura;
- documentar el requisito;
- migrar posteriormente a Development Build.

## Persistencia de permisos

El MVP debe validar el permiso/URI al iniciar.

Aunque la URI se guarde localmente, nunca asumir que sigue siendo válida para siempre.

Si falla:

- reconectar carpeta;
- conservar datos compartidos;
- no inicializar estado nuevo encima del existente.

## Fuentes técnicas verificadas

- Expo Documentation — FileSystem / FileSystem legacy / Store data.
- Android Developers — Storage Access Framework / shared documents and files.

Verificadas para preparar esta especificación en agosto de 2026.
