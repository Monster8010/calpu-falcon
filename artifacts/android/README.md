# APK de demostración Android

Estos APK incluyen el bundle JavaScript y funcionan sin Metro ni Expo Go.

| Aplicación | Archivo | Paquete Android | Versión | SHA-256 |
| --- | --- | --- | --- | --- |
| UPIICSA Calpulli | `UPIICSA-Calpulli-0.1.0.apk` | `mx.ipn.upiicsa.calpulli` | `0.1.0` (`versionCode` 1) | `ac257246cf86b352008c616c49762ff114f27912e6fe37ae8b0d3b0fee20532c` |
| Gestión UPIICSA Calpulli | `Gestion-UPIICSA-Calpulli-0.1.0.apk` | `mx.ipn.upiicsa.calpulli.gestion` | `0.1.0` (`versionCode` 1) | `6016632be90c43ec83c8b244a7110b53405edbd2369053c30ed3797dc1e46226` |

## Instalación

1. Copia esta carpeta al dispositivo Android.
2. Abre cada archivo APK desde el administrador de archivos.
3. Si Android lo solicita, permite a ese administrador instalar aplicaciones desconocidas.
4. Instala ambos APK. Sus paquetes son distintos, por lo que pueden coexistir.

Requieren Android 7.0 o posterior (API 24). Son APK universales para `arm64-v8a`, `armeabi-v7a`, `x86` y `x86_64`.

## Firma

Son builds `release` de demostración firmados con una clave Android de desarrollo. La firma APK v2 fue verificada. No están destinados a publicación en Google Play; una entrega de producción debe usar una clave privada de producción administrada de forma segura.
