# Recomendaciones — hacia un skill/plantilla uniforme para nuevas cartas

**v2 — 2026-09-07.** Reemplaza la v1: esta versión está fundamentada con evidencia real de los repositorios públicos de `gis1030` (https://github.com/gis1030?tab=repositories), no solo en teoría.

> Documento de reflexión, no de ejecución. Objetivo: decidir más adelante, con calma, cómo convertir el contenido de `leaflet/` en una herramienta real que permita crear futuras cartas (mapas) de este proyecto — con una estructura uniforme y sin repetir los bugs que ya encontramos y corregimos en `PrimesDSD1030.html`.

## 0. Lo nuevo en esta versión: el documento Word se inspiró en una familia real de 13 repos

`https://github.com/gis1030?tab=repositories` no es una idea abstracta — es una familia de **13 repositorios públicos, todos JavaScript/HTML, todos cartas de la commune de Schaerbeek (1030)**:

| Prefijo | Repos | Tema |
|---|---|---|
| `POP-` | POP-Demographic-Schaerbeek | Demografía (base de nuestras 2 primeras cartas) |
| `DSD-` | DSD-Primes1030, DSD-Cycloparking1030, DSD-OffstreetParking1030 | Développement Stratégique et Durable |
| `INF-` | INF-Chantiers1030, INF-Voirie-ProjectsChantiers-1030, INF-Paves-Mosaiques-1030_V2, INF-SPEV-BancsJosaphat-1030 | Infraestructura / vía pública |
| `AG-` | AG-AdministrativeSanctions-SAC-1030 | Sanciones administrativas |
| `FIN-` | FIN-BCE1030-HorecaCommerce, FIN-BCE1030-NACE2008 | Empresas/comercio (BCE) |
| — | Bilan-SPEV1030, **PlanCanicule1030** | Limpieza pública / **plan de calor** |

Inspeccioné dos en detalle (vía la API pública de GitHub, sin clonar nada):

### `DSD-Primes1030` es literalmente el origen de nuestra `PrimesDSD1030.html`
Mismo título exacto ("Primes Octrayes par la Direction de Développement Stratégique et Durable..."), mismos nombres de archivo de datos (`Primes1030_DSD_Compostiere.js`, `_FacadeVert.js`, `_Velos.js`), el mismo `index_charts.html` al que apuntaba nuestro botón muerto "Affichage des statistiques globales". Esto confirma que nuestra página fue copiada/adaptada desde ese repo — y explica **por qué** faltaban cosas: al traerla a `Ecological-Charter-1030/` no se copiaron todos los archivos.

**Hallazgo importante que corrige mi diagnóstico anterior**: revisé el contenido real de `data/SchaerbekBorders/LimitesSchaerbeek.js` y `LimitesSchaerbeekQuartiers.js` en `DSD-Primes1030` — ahí las variables **NO tienen sufijo** (`var json_LimitesSchaerbeek`, `var json_LimitesSchaerbeekQuartiers`, sin `_2`/`_3`). Es decir: el HTML que copiamos estaba bien escrito desde el origen. Vale aclarar qué es qgis2web para que esto no se lea como una crítica al plugin: **es la herramienta de QGIS que genera el boceto inicial de la página web** a partir de un proyecto QGIS — cada exportación es un boceto independiente, y el nombre de variable que asigna a cada capa depende del orden/índice de esa capa dentro de *ese* proyecto QGIS puntual (por eso puede o no llevar sufijo numérico). No es una inconsistencia del plugin, es simplemente que dos bocetos distintos (el de Población y el de Primes) nombraron su capa de límites de forma diferente porque partieron de proyectos QGIS distintos. El problema apareció recién **al construir `Ecological-Charter-1030/data/SchaerbekBorders/` y reusar ahí los archivos de límites del boceto de Población en vez de los del boceto de `DSD-Primes1030`**, sin reconciliar los nombres entre ambos. La lección real es más específica y más útil: **al combinar bocetos qgis2web de proyectos QGIS distintos, nunca compartir/fusionar sus carpetas de datos sin verificar que los nombres de variable coincidan** — o simplemente mantener una copia de límites por carta.

Además, `DSD-Primes1030/markers/` **sí existe y tiene los 19 PNG reales** que a nosotros nos faltaban: `CM_00–05.png`, `FV_00–05.png`, `PV_00–05.png`, `ICON_00.png`. Y `legend/PrimeCompostiere.png`, `PrimeFacadeVert.png`, `PrimesVelo.png`, `limitesschaerbeek_3.png`, `quartiers1030_2.png` también existen ahí. Es decir: **los íconos "definitivos" que dejamos pendientes (reemplazados por círculos de color a tu pedido) ya existen y se pueden traer del repo origen si en algún momento se prefiere usarlos en vez de los círculos.** Lo dejo como opción abierta en la sección 5, no lo hice porque cambiaría una decisión que ya tomaste.

### `PlanCanicule1030` es el "plan climático" del documento Word — y ya existe, en Leaflet vanilla
El Word que inspiró `leaflet/` habla de un futuro "mapa climático" con islas de calor/participación ciudadana. Ese mapa **ya existe** como repo separado: capas de `cimetieres`, `espacesouverts`, `fontainesdeaupotable`, `jardins`, `parcsetdessquares`, `placesetparcs`, `ruesfortementarbores` (calles muy arboladas), `squares`, `voies`, `zonescyclables`. Mismo stack exacto que el nuestro: `js/leaflet.js`, `qgis2web_expressions.js`, `L.Control.Layers.Tree`, sin rastro de React/Next.js.

**Esto refuerza con evidencia dura (no solo mi opinión) la recomendación de la v1**: toda la familia real de cartas de esta commune —incluida la que inspiró el pedido de un "skill de Leaflet"— está construida en Leaflet vanilla + qgis2web. Portar el código React de `skills_leaflet_all.md` no solo sería incompatible con nuestro repo: sería incompatible con **los 13 repos que le dieron origen a la idea**.

## 1. Diagnóstico de lo que ya hay en `leaflet/`

- **`promp_leaflet.md`**: resumen de un documento generado por otra IA (aparentemente desde el móvil), inspirado en la página de repos de gis1030. Buena intención estratégica; instrucciones técnicas (`.claude/skills/skills_leaflet.md`, comando `/reload-skills`) que no corresponden a cómo funciona Claude Code realmente — no hay que seguirlas literalmente.
- **`skills_leaflet.md`** / **`skills_leaflet_all.md`**: casi idénticos entre sí (v1.1.0 vs v1.2.0). Buenas ideas de arquitectura GIS en general (clustering para datasets grandes, choropleth por indicador, popups dinámicos, anchors de íconos precisos), pero el código está en **React + react-leaflet + Next.js** — un stack ajeno no solo a este repo, sino a los 13 repos reales de la familia gis1030 (ver sección 0).

**Conclusión**: el valor de estos 3 archivos es *conceptual*, no el código en sí.

## 2. Lo que ya sabemos que funciona (extraído de las 3 cartas reales de este repo)

- **`<head>`**: mismos 5-6 `<link rel="stylesheet">` (`leaflet.css`, `L.Control.Layers.Tree.css`, `qgis2web.css`, `fontawesome-all.min.css`, `leaflet.photon.css`, + `easy-button.css` si la carta usa botón de email), mismo `<style>` inline para `html, body, #map { width/height:100% }`.
- **`<body>`**: un único `<div id="map"></div>` — sin sidebars, sin `#Region00/01/04`.
- **Bloque de scripts core**: mismo orden de `<script src>` (`qgis2web_expressions.js`, `leaflet.js`, `L.Control.Layers.Tree.min.js`, `leaflet.rotatedMarker.js`, `leaflet.pattern.js`, `leaflet-hash.js`, `Autolinker.min.js`, `rbush.min.js`, `labelgun.min.js`, `labels.js`, `leaflet.photon.js`, + `easy-button.js` si aplica).
- **Funciones helper repetidas literalmente en las 3 páginas**: `highlightFeature`, `removeEmptyRowsFromPopupContent`, `addClassToPopupIfMedia`. Candidatas a vivir en un solo archivo (`js/qgis2web-common.js`).
- **Controles Leaflet repetidos**: `title` (bottomleft), `abstract` ("i" info box, casi siempre comentado), `zoomControl`, watermark (`L.Control.Watermark`), botón `MyControlClass` ("menu principal" → `../index.html`).
- **`L.control.layers.tree(null, overlaysTree, {...})`**: siempre con `collapsed: false` y `namedToggle`/`selectorBack`/`closedSymbol`/`openedSymbol` comentados.
- **`circleIcon(color)`** (creado esta sesión en `PrimesDSD1030.html`): helper basado en `L.divIcon` que dibuja un círculo de color vía CSS, sin depender de ningún PNG. Alternativa deliberada a los PNG reales de `DSD-Primes1030/markers/` (ver sección 0) — más liviana y fácil de recolorear, a costa de no tener forma/silueta propia por categoría.

## 3. Bugs reales que un skill/plantilla debería prevenir automáticamente

1. **Combinar bocetos qgis2web de proyectos QGIS distintos sin verificar el nombre de variable exportado.** No es una falla del plugin — cada exportación qgis2web es un boceto legítimo e independiente, y el nombre de variable que le asigna a una capa depende del proyecto QGIS de origen. El problema surge al **fusionar/reusar archivos de dos bocetos distintos** (Población vs Primes) que nombraron su capa de forma diferente sin reconciliarlos. Como `L.geoJson(undefined, {...})` no lanza excepción, la capa queda vacía sin ningún error visible.
   - *Regla para el skill*: antes de reusar un archivo de datos "compartido" entre cartas, comparar con `grep "^var json_"` el nombre real en cada copia candidata — y si difieren, no compartir el archivo (mejor una copia por carta que un nombre mal alineado).
2. **CSS de un plugin nuevo puede "contaminar" elementos de otro.** `easy-button.css` usa el selector genérico `.leaflet-bar button`, que también capturó el botón "menu principal".
   - *Regla*: al vendorizar un plugin, revisar sus selectores en busca de reglas genéricas (`.leaflet-bar button/a`) y neutralizar colisiones con `all: revert` sobre el elemento propio, en vez de tocar el CSS vendorizado.
3. **Opciones de plugin que rompen visualmente sin lanzar error** (`namedToggle: true` deja el botón de reapertura del árbol de capas en 0×0).
4. **Rutas rotas al mover/reorganizar carpetas**, o al copiar una carta desde su repo origen sin traer todos sus archivos (exactamente lo que pasó al traer `PrimesDSD1030.html` sin `markers/`, sin `legend/Prime*.png`, sin `js/leaflet-search.js`).
   - *Regla*: al portar una carta desde uno de los 13 repos de gis1030, copiar la carpeta completa primero y recién después empezar a limpiar lo no usado — no reescribir referencias "a mano" contra una carpeta ya podada.
5. **Autocontención**: nada fuera de `DSD-Ecological-Charter/` salvo servicios en vivo esperados (teselas OSM/Google, buscador Nominatim).

## 4. Cómo lo convertiría en herramienta reutilizable

Dos piezas complementarias:

### a) Una plantilla física en el repo
Un archivo `_template1030.html` con el esqueleto de la sección 2 ya armado y comentado con marcadores (`{{TITULO}}`, `{{DATA_SCRIPTS}}`, `{{OVERLAYS_TREE}}`). Determinista, no depende de que el modelo "recuerde" el patrón cada vez.

### b) Un skill de proyecto real (`.claude/skills/leaflet-carta/SKILL.md`)
Con frontmatter correcto para ser invocable. Instrucción principal: *"parte siempre de `_template1030.html`; si la carta se porta desde un repo de gis1030, copiar la carpeta completa antes de podar; correr la checklist de la sección 3 antes de dar por terminada."*

Los 3 archivos de `leaflet/` (más este documento) pasan a ser **material de referencia**, no la fuente del código del skill.

## 5. Preguntas abiertas para decidir juntos

- ¿El nombre de la herramienta/skill?
- ¿La plantilla vive como archivo físico, o el skill la reconstruye cada vez? (recomiendo el archivo físico).
- **Nuevo**: para `PrimesDSD1030.html`, ¿mantenemos los círculos de color que ya implementamos, o preferís que traiga los 19 PNG reales de `DSD-Primes1030/markers/` (con forma/silueta propia por categoría) y los combine con los colores que ya elegiste? Son compatibles entre sí — no es una decisión de "uno u otro" obligatoriamente.
- ¿Quién decide la paleta de colores por carta nueva — la defines vos cada vez, o el skill propone una por defecto?
- ¿Vale la pena mover `highlightFeature`/`removeEmptyRowsFromPopupContent`/`addClassToPopupIfMedia`/`circleIcon` a un `js/qgis2web-common.js` compartido ahora, o esperar a la próxima carta?
- ¿Conviene revisar `PlanCanicule1030` con más detalle (ya confirmado como Leaflet vanilla) como referencia concreta para cuando se aborde el "plan climático" que menciona el Word original?
