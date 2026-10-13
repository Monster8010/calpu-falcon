# Auditoría documental — UPIICSA Calpulli

> Corte de auditoría: 5 de octubre de 2026. Universo cerrado: archivos proporcionados y repositorio local. No se utilizaron fuentes externas.

## Inventario y autoridad

| Documento | Propósito | Uso | Huella / estado |
|---|---|---|---|
| 2027_1_DisProy_Ctrl+Z_P1.docx | Documento principal académico y fuente de portada | Contenido base; requisitos; fuentes originales | 4a2fa4ada896bcccc7a109df66628e1c327254658c809491f94fd287060b1757 |
| UPIICSA_Calpulli_Documentacion_Fusionada.docx | Consolidación previa | Corrección estadística y separación AS-IS/TO-BE | 9a0eaa1ea6df5e6c81d15bbc8d6dee158ee3d213b028da26731b655898ec8136 |
| UPIICSA_Calpulli_Documentacion_Corregida.docx | Auditoría/corrección previa | Evidencia técnica, Canvas y contradicciones | 544e7b989381e0ca49d219bfb16a183419eb3411ffca78262f65d19234060ca0 |
| Desafio Google.csv.zip | Cuestionario exploratorio | Estructura de 13 preguntas y 10 registros; sin exponer datos personales | ea3685ca34c22ab3c8b0a175eeb35350d346353976681cb973a1583424661418 |
| Calpolli_Upiicsa/ | Código y documentación técnica | Verificación AS-IS del MVP | Árbol local |
| Estudio_de_caso_F3_3CM32.docx | Formato solicitado | NO DISPONIBLE | No localizado |
| Ctrl+z_ProyectoF1.pptx | Presentación referenciada | NO DISPONIBLE | No localizado en la ruta indicada |
| Desafio Google.csv (1).zip | Cuestionario referenciado previamente | NO DISPONIBLE | El ZIP disponible es Desafio Google.csv.zip |

## Matriz de auditoría

| Apartado | Información encontrada | Documento origen | Estado | Observaciones |
|---|---|---|---|---|
| Documento principal y portada | Portada institucional, equipo Ctrl + Z, grupo, profesor, fecha y título. | 2027_1_DisProy_Ctrl+Z_P1.docx | VALIDADO | Se conserva sin rediseño en ambos Word generados. |
| Introducción | Aplicación móvil para reunir información y servicios; orientación, gestión y conectividad limitada. | Ctrl+Z; Fusionada | PARCIAL | Se conserva la intención y se separa lo implementado de lo propuesto. |
| Contexto y antecedentes | Información distribuida, orientación difícil y conectividad limitada. | Ctrl+Z; Fusionada | VALIDADO | No se añaden antecedentes históricos externos. |
| Planteamiento del problema | Dispersión, fricción, desorientación y continuidad. | Ctrl+Z | VALIDADO | Reorganizado en situación, causas, problema, consecuencias y necesidad. |
| Objetivos | Un objetivo general y nueve específicos. | Ctrl+Z | VALIDADO | Se corrige redacción sin cambiar intención. |
| Metodología cuantitativa | Cuestionario a estudiantes; muestra de conveniencia. | Ctrl+Z; Fusionada; Corregida; ZIP Desafio Google.csv | PARCIAL | Existen dos instrumentos: uno exploratorio abierto con 10 registros y otro específico de Calpulli resumido con 86 respuestas. |
| Resultados del cuestionario Calpulli | El Ctrl+Z indica 84; Fusionada y Corregida indican 86 con conteos y porcentajes. | Tres documentos Word | CONTRADICTORIO | Se adopta el corte corregido de 86 por ser la versión posterior; la base CSV específica de 86 no está disponible en el conjunto actual. |
| Cuestionario exploratorio | CSV con 10 respuestas y 13 columnas de preguntas abiertas. | Desafio Google.csv.zip | VALIDADO | Se documenta su estructura; no se publican nombres de usuario ni respuestas individuales. |
| Fuentes del Ctrl+Z | Texto de fuente de primer nivel y enlace de Google Forms. | Ctrl+Z, Fuentes de información | VALIDADO | Fuente existente: requiere validación. Se conserva literalmente y sin sustitución externa. |
| Hallazgos y conclusiones empíricas | El Ctrl+Z contiene un apartado de hallazgos. | Ctrl+Z | DUPLICADO | Omitido del consolidado por instrucción expresa; no se reutiliza como sección. |
| Entrevistas | Solo se menciona como fuente prevista. | Ctrl+Z; Fusionada | NO DOCUMENTADO | Pendiente / no desarrollado en esta etapa. |
| Análisis de necesidades | Necesidades de consulta, orientación, conectividad, gestión, actualización y control. | Ctrl+Z; Fusionada; documentación del proyecto | VALIDADO | Se crea una matriz necesidad-función. |
| Requerimientos funcionales | Diez requerimientos enumerados. | Ctrl+Z; documentación técnica | PARCIAL | Se conservan los diez; varios son TO-BE o parciales frente al MVP. |
| Requerimientos no funcionales | Ocho restricciones o atributos. | Ctrl+Z | PARCIAL | No contienen métricas; seguridad por roles y validación previa no están implementadas productivamente. |
| RF08 validación previa | El requisito exige validar antes de publicar; el MVP permite a Departamento publicar sin aprobación previa y moderar después. | Ctrl+Z; documentacion/04_APPS_Y_ROLES.md | CONTRADICTORIO | Se conserva como requisito documentado y se marca no implementado. |
| Mapa mental | Existe imagen en Ctrl+Z y descripciones AS-IS/TO-BE en Corregida. | Ctrl+Z; Corregida | PARCIAL | Se genera un mapa nuevo basado solo en elementos sustentados y se etiqueta AS-IS/TO-BE. |
| Herramientas y stack | React Native, Expo, TypeScript, Expo Router, npm workspaces, Android SAF, JSON. | package.json; documentacion/05_ARQUITECTURA_TECNICA.md | VALIDADO | Se clasifican lenguaje, framework, herramienta, librería y persistencia. |
| Backend | Ctrl+Z propone Node.js y también Python/FastAPI; el código actual no contiene backend independiente. | Ctrl+Z; Fusionada; Corregida; repositorio | CONTRADICTORIO | Estado AS-IS: no existe. Alternativa TO-BE: pendiente de decisión. |
| Bases de datos | Ctrl+Z propone SQLite y PostgreSQL; el MVP usa JSON/SAF y AsyncStorage para favoritos. | Ctrl+Z; docs/02_OFFLINE_INTEROPERABILITY.md | CONTRADICTORIO | SQLite y PostgreSQL se presentan solo como propuesta futura. |
| Arquitectura actual | Pantalla → Hook/caso de uso → Repository → SharedStore → SAF/JSON; dos apps comparten estado local. | docs/02_OFFLINE_INTEROPERABILITY.md; documentacion/05_ARQUITECTURA_TECNICA.md | VALIDADO | No se dibuja servidor dentro del AS-IS. |
| Arquitectura futura | API, backend, base central, sincronización y autenticación se describen como evolución. | Ctrl+Z; Fusionada; Corregida | PENDIENTE DE DEFINIR | Node.js frente a Python/FastAPI y el SMBD definitivo no están decididos. |
| Modelo Canvas | Propuesta de valor, segmentos, canales, relación, actividades, recursos, aliados y costos en distinto grado. | Corregida, Modelo Canvas | PARCIAL | Fuentes de ingreso no documentadas; aliados y costos pendientes. |
| Plan de trabajo y cronograma | Aparecen en documentos corregidos. | Corregida; Fusionada | DUPLICADO | Omitidos por instrucción expresa. |
| Formato Estudio_de_caso_F3_3CM32 | Archivo no localizado en los archivos proporcionados ni en el alcance accesible. | No disponible | NO DOCUMENTADO | Se usa exclusivamente la estructura de campos indicada en el encargo; no se reutiliza contenido SAES. |
| Presentación Ctrl+z_ProyectoF1 | Archivo referenciado en el historial de la solicitud, pero no localizado en la ruta indicada. | No disponible | NO DOCUMENTADO | No se atribuye contenido ni se usa como evidencia. |

## Contradicciones consolidadas

1. **Muestra:** Ctrl+Z documenta 84; Fusionada y Corregida documentan un corte posterior de 86. Se conserva el registro histórico de 84 en la auditoría y se utiliza 86 en la consolidación por provenir de la versión corregida. La base CSV específica de 86 no está presente en el conjunto actual.
2. **Instrumentos:** `Desafio Google.csv.zip` contiene otro cuestionario exploratorio, abierto, con 10 registros. No se mezcla con el cuestionario específico de Calpulli de 86 respuestas.
3. **Backend:** Ctrl+Z menciona Node.js y, en otro apartado, Python/FastAPI. No hay backend independiente implementado; la decisión tecnológica queda pendiente.
4. **Persistencia:** Ctrl+Z propone SQLite/PostgreSQL; el MVP verificado usa JSON compartido mediante SAF y AsyncStorage solo para favoritos.
5. **Validación previa:** RF08/RNF07 requieren validación antes de publicar; el flujo actual de Departamento publica sin aprobación previa y Moderador actúa después.
6. **Mapa y salones:** son alcance del producto objetivo; el mapa existente del MVP corresponde a stands de feria, no al campus.

## Información faltante

- Archivo `Estudio_de_caso_F3_3CM32.docx` para replicar su apariencia exacta.
- Presentación `Ctrl+z_ProyectoF1.pptx`, referenciada en el historial pero no disponible en la ruta indicada.
- Archivo `Desafio Google.csv (1).zip`, referenciado previamente pero no disponible en la ruta indicada.
- Base CSV o exportación verificable del cuestionario específico de 86 respuestas.
- Fuentes institucionales validadas para cartografía, salones, directorio y vigencias.
- Decisión de backend, API, autenticación, base central y resolución de conflictos.
- Métricas de aceptación para RNF01, RNF03, RNF05, RNF06, RNF07 y RNF08.
- Prioridad documentada para los diez requerimientos funcionales.
- Fuentes de ingreso del Business Model Canvas.

## Control de conservación

Las fuentes existentes del documento Ctrl + Z fueron conservadas sin modificaciones. El texto y el enlace originales aparecen literalmente en la sección 18 del documento consolidado.

El documento `Estudio_de_caso_F3_3CM32.docx` no estuvo disponible. Por ello no se utilizó como fuente funcional ni estructural directa; se siguió únicamente la estructura obligatoria de campos indicada en el encargo.

La presentación `Ctrl+z_ProyectoF1.pptx` y el archivo `Desafio Google.csv (1).zip` fueron referenciados, pero no estuvieron disponibles en las rutas indicadas. No se les atribuyó contenido.
