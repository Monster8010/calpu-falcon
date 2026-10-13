# 09 — PRUEBAS DE ACEPTACIÓN

No declarar una etapa completa hasta pasar sus pruebas relevantes.

# A. STORAGE

## A1 — Conectar carpeta

En App pública:

- pulsar Conectar;
- seleccionar `UPIICSA_Calpulli_Shared`;
- estado Connected.

En Gestión:

- seleccionar exactamente la misma;
- estado Connected.

PASS:
ambas leen la misma revisión.

## A2 — Sin conexión

Desactivar Wi‑Fi y datos móviles.

PASS:
las funciones principales siguen operando.

## A3 — URI inválida

Simular permiso/carpeta inválida.

PASS:
no crashea;
solicita reconectar.

## A4 — JSON dañado

Probar copia dañada durante desarrollo.

PASS:
recupera backup o muestra error seguro;
no borra silenciosamente todos los datos.

---

# B. FEED

## B1
Crear publicación desde Gestión Escolar.

PASS:
aparece tras refresh en Inicio.

## B2
Editar título.

PASS:
se actualiza.

## B3
Ocultar ubicación.

PASS:
app pública no muestra ubicación.

## B4
Urgente.

PASS:
tratamiento urgente correcto.

## B5
Guardar.

PASS:
aparece en Favoritos.

## B6
Cambiar datos administrativos.

PASS:
Favoritos siguen siendo locales.

---

# C. DEPARTAMENTOS E HISTORIAS

## C1
Filtrar por Cultura.

PASS:
solo posts de Cultura.

## C2
Todos.

PASS:
feed completo.

## C3
Historia expirada.

PASS:
no aparece.

## C4
Muchos departamentos.

PASS:
rail hace scroll sin romper layout.

---

# D. FERIA

## D1
Estado upcoming.

PASS:
countdown visible.

## D2
Cambiar próxima fecha desde Gestión.

PASS:
countdown cambia al refrescar.

## D3
Activar.

PASS:
mapa aparece.

## D4
Geometría.

PASS:
40 stands;
7 arriba;
11 debajo de 3;
11 debajo de 5;
11 debajo de 7.

## D5
Stand disponible.

PASS:
no muestra emprendedor.

---

# E. SOLICITUD DE STAND

## E1
Emprendedor selecciona disponible.

PASS:
se crea pending.

## E2
Emprendedor intenta autoaprobar.

PASS:
no existe acción.

## E3
Admin aprueba.

PASS:
request approved;
stand assigned;
entrepreneur vinculado.

## E4
App pública.

PASS:
refrescar muestra avatar/sticker en stand.

## E5
Admin libera.

PASS:
stand vuelve a estado coherente.

---

# F. MARKETPLACE

## F1
Editar producto desde Emprendedor.

PASS:
Marketplace refleja tras refresh.

## F2
Desactivar producto.

PASS:
no aparece público.

## F3
Abrir perfil.

PASS:
se muestran galería/posts/productos.

No hay carrito/pago.

---

# G. TUTORÍAS

## G1
Editar materia.

PASS:
refrescar público muestra cambio.

## G2
Tutor inactivo.

PASS:
no aparece.

## G3
Contacto.

PASS:
se muestra CTA externo;
no aparece chat interno.

---

# H. MODERACIÓN

## H1
Ocultar post.

PASS:
no público.

## H2
Restaurar.

PASS:
vuelve.

## H3
Departamento crea post.

PASS:
no requiere aprobación del moderador.

---

# I. ROLES

Cambiar:

- superadmin;
- fair admin;
- department;
- entrepreneur;
- tutor;
- moderator.

PASS:
sin login;
sin reiniciar;
sin mezclar estado UI de un rol con otro.

---

# J. TEMA

Light.

PASS:
legible.

Dark.

PASS:
legible.

Sistema.

PASS:
sigue configuración cuando aplique.

---

# K. PRESENTACIÓN

Con Wi‑Fi apagado:

1. Gestión → Departamento → crear urgente.
2. Pública → refresh → ver.
3. Gestión → Feria → cambiar fecha/activar.
4. Pública → Feria → ver mapa.
5. Gestión → Emprendedor → solicitar.
6. Gestión → Admin Feria → aprobar.
7. Pública → refresh → abrir stand.
8. Gestión → Tutor → editar materia.
9. Pública → Tutorías → refresh.
10. Pública → guardar favorito.

PASS:
recorrido completo sin red, sin Mac y sin servidor.
