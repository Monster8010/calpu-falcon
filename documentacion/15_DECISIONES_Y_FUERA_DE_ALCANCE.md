# Decisiones y fuera de alcance

## Decisiones cerradas principales

1. Ecosistema: `UPIICSA Calpulli`.
2. Dos apps Expo dentro de un monorepo.
3. App pública sin login.
4. Gestión sin login durante demo.
5. Selector directo de roles.
6. Interoperabilidad local Android mediante SAF.
7. Sin API HTTP, servidor local ni nube en el MVP.
8. Dominio compartido en `packages/domain`.
9. Favoritos privados de la app pública.
10. Feed sin likes ni comentarios.
11. Departamentos publican sin aprobación previa.
12. Moderación posterior.
13. Feria con 40 mesas.
14. Emprendedor solicita; Administrador de Feria aprueba.
15. Marketplace sin transacciones.
16. Tutorías con contacto externo.
17. Tema claro y oscuro.
18. Datos ficticios para demo.
19. Expo SDK 54 y React Native 0.81.5 como base inmediata.
20. Un `package-lock.json` para npm workspaces.

El detalle completo y numerado está en `docs/10_DECISIONS_AND_OUT_OF_SCOPE.md`.

## Fuera de alcance

- autenticación real;
- backend, nube, API y sincronización;
- multiusuario, multidispositivo y cifrado completo;
- notificaciones push;
- pagos, carrito y checkout;
- chat, comentarios y likes;
- ranking, IA y moderación automática;
- histórico complejo de ferias;
- producción iOS y Play Store.

## Cómo proponer un cambio

Registrar la idea con:

- problema que resuelve;
- usuario afectado;
- impacto en contratos y arquitectura;
- impacto en privacidad y seguridad;
- pruebas nuevas;
- costo y dependencia;
- decisión: aceptar, posponer o rechazar.

No borrar decisiones anteriores. Añadir una nueva entrada que explique la sustitución.
