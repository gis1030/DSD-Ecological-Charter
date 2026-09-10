# DSD Ecological Charter — Registro de sesión

> Archivo de continuidad. Objetivo: poder retomar el trabajo en este proyecto sin perder el contexto de lo que se hizo, por qué, y qué queda pendiente. Actualizar este archivo a medida que se avance.

**Última actualización:** 2026-09-10

## Contexto del proyecto

Sitio estático (Leaflet / qgis2web) con mapas de estudios sobre Schaerbeek (código postal 1030), publicado como páginas HTML independientes enlazadas desde un `index.html` raíz.

**Objetivo real del proyecto**: `DSD-Ecological-Charter` es un **hub que consolida bajo una estructura uniforme** un subconjunto de cartas/bases de datos elegidas por el cliente, tomadas de la familia de repos separados en `https://github.com/gis1030` (13 repos públicos disponibles — no se integrarán los 13, solo los que el cliente decida) **y también bases de datos completamente nuevas que aún no existen en ningún repo** (ej. datos de Bruxelles Environnement, árboles). Cada carta que se agregue debe encajar en el mismo esqueleto/plantilla. Ver [leaflet/RECOMENDACIONES.md](leaflet/RECOMENDACIONES.md) para el análisis de esa familia de repos.

`index.html` refleja este objetivo: ya no se presenta como un estudio demográfico puntual, sino como el hub de la **Charte Écologique** de Schaerbeek (título, introducción y sección "Cartographies thématiques" actualizados en esta sesión — 2026-09-09).

## Páginas activas

- `index.html` — portada del hub, con enlaces a las 8 cartas activas, **reorganizado por el usuario el 2026-09-10** en 5 secciones temáticas (Population, Primes Verts, Cadastre, Maillage Vert, Réseaux de Mobilité) en vez de una lista plana.
- `Ecological-Charter-1030/PopulationDistribution1030.html` — distribution de la population.
- `Ecological-Charter-1030/HouseholdsNumbers1030.html` — nombre de ménages.
- `Ecological-Charter-1030/PrimesDSD1030.html` — primes vélo / façade vert / compostière.
- `Ecological-Charter-1030/BuildingCadastreAddresses1030.html` — cadastre des bâtiments (URBIS), parcelles cadastrales, adresses. *(nueva, 2026-09-09)*
- `Ecological-Charter-1030/SidewalksBuildingAddresses1030.html` — trottoirs disponibles pour la végétalisation des façades (título de pestaña: "BXLEnvironnement 1030"). *(nueva, 2026-09-09)*
- `Ecological-Charter-1030/BXLEnvironment1030.html` — "Maillage Vert 1030": arbres, espaces verts, diagnostic environnemental. *(nueva, 2026-09-09)*
- `Ecological-Charter-1030/StreetSurfacesNodes1030.html` — "Street-Surfaces-Nodes 1030": réseau viaire (référentiel URBIS-OSIRIS) + trottoirs clasificados por tipo de voirie. *(nueva, 2026-09-10)*
- `Ecological-Charter-1030/ChartGreen1030_base.html` — gabarit base (solo Schaerbeek/BlockParcel + basemaps), usado como punto de partida para nuevas cartas.

## Sesión 2026-09-09 — resumen de lo hecho

### 1. `BuildingCadastreAddresses1030.html` (nueva)
Página creada desde cero siguiendo el mismo esqueleto Leaflet/qgis2web que las páginas existentes. Capas:
- **Bâtiments 1030** → Cadastre des bâtiments (URBIS_Buildings_BlockQuartier_Schaerbeek1030.js, 22.899 polígonos).
- **Cadastre 1030** → Parcelles cadastrales (URBIS_Cadastre_BlockQuartier_Schaerbeek1030.js, 29.507 polígonos), relleno lavanda translúcido tipo Google Maps.
- **Adresses 1030** → URBIS_AdrsssesParcel_BlockQuartier_Schaerbeek1030.js (versión liviana, 34.554 puntos; se descartó la versión completa de 71.808 puntos/78MB por peso).
- **Schaerbeek** → Limites Scaherbeek / Limites Schaerbeek Quartiers (radio button) + Google Satellite agregado como capa base.
- Botón "Home" (ícono casa) debajo de la lupa de búsqueda, resetea a la vista inicial.
- **Patrón clave**: Bâtiments, Cadastre y Adresses comparten un único `L.canvas()` (`canvas_Buildings1030`) sobre una única pane — necesario porque si cada capa tiene su propio canvas en panes distintas, la de mayor z-index bloquea los clics de las de abajo aunque esté vacía en ese punto (el canvas cubre toda el área del mapa, no solo donde hay geometría dibujada). El orden de `map.addLayer()` determina qué capa "gana" el clic donde se superponen.

### 2. `SidewalksBuildingAddresses1030.html` (nueva, copia de la anterior)
- Cadastre de parcelles → reemplazado por **Trottoirs** (URBIS_Sidewalk_BlockQuartier_Schaerbeek1030.js, 5.416 polígonos), luego subdividido en 4 capas filtradas por la propiedad `possibility_vertical_facade` (usando `filter` de L.geoJson sobre el mismo JSON): `conditioned` (#eed323), `ineligible` (#e66a45), `restricted` (#1e88e5, cambiado desde violeta para no chocar con BlockParcel), `valid` (#44ec4c). Checkboxes independientes + checkbox "seleccionar todo" a nivel de grupo (`selectAllCheckbox: true`).
- Se agregó **Contour des îlots (BlockParcel)** (`data/SchaerbekBorders/BlockParcelSchaerbeek_Contour_V3.js`, 440 polígonos) dentro del grupo Schaerbeek, como checkbox independiente (no radio). Estilo final: relleno lavanda `#987db7` (fillOpacity 0.25) + borde `#6f4f97` (opacity 0.9) — imita el estilo "área administrativa" de Google Maps. Pane propia con zIndex 402, por debajo de Bâtiments.
- Se agregó **Façades vertes existantes** (`data/Primes1030/Primes1030_DSD_FacadeVert.js`, 301 puntos) como capa de referencia — **ojo**: este JSON viene como FeatureCollection anidada, hay que pasar `json_PrimesFacadeVert1030.features[0]` a `L.geoJson`, no el objeto raíz.
- Trottoirs es la capa "principal" de esta carta: Bâtiments quedó con opacidad reducida (borde `rgba(96,66,26,0.7)`, relleno 0.25) para no competir visualmente; el peso de línea (`weight`) de los trottoirs se subió a 1.8.
- Color de "Limites Schaerbeek Quartiers" cambiado a `#ca6ed3` (antes verde), peso reducido de 4.0 a 2.0.
- Por defecto activas: Trottoirs (las 4 categorías) y Façades vertes existantes. Bâtiments y Adresses desactivadas.
- Nombre de la carta (h2): "Trottoirs disponibles pour la végétalisation des façades". Título de pestaña: **"BXLEnvironnement 1030"**.

### 3. `BXLEnvironment1030.html` (nueva, copia de la anterior)
Primero se **redujo** a solo Bâtiments (Cadastre) + Schaerbeek (Limites/Quartiers/Contour îlots) + basemaps (se quitó todo lo de Trottoirs/Adresses/Façades vertes). Luego se reconstruyó agregando:

- **Grupo "Bruxelles Environnement 1030"** (checkbox de selección global), con dos subcarpetas anidadas (los checkboxes anidados SÍ están soportados por L.Control.Layers.Tree, simplemente anidando `{label, children}` dentro de `children`):
  - **Infrastructures vertes**: Places (26 pts/polígonos, `BXLEnvironments_Places1030.js` — mezcla Point/MultiPolygon según `geometry_disponible`), Parcs (17, `BXLEnvironment_Parcs1030.js`), Espaces verts publics (112, `BXLEnvironments_PublicGreenSpaces1030.js`, popup muy completo: type/quartier/surface/propriétaire/infrastructure/jeux/chiens/sport/toilettes/compost/potager/eau potable).
  - **Diagnostic et intervention nécessaires**: Zones prioritaires de végétalisation (2 polígonos, `BXLEnvironments_PriorityGreeningZone99_1030.js`), Zones de carence en espaces verts (35, `BXLEnvironments_GreenSpaceDeficiencyZone1030.js`).
  - En ambas capas de diagnóstico, los polígonos con `Localite === 'Dehors1030'` (fuera del perímetro de Schaerbeek) se estilizan casi invisibles (opacity ~0.25, fillOpacity ~0.06-0.08) porque solo interesa lo que cae dentro de Schaerbeek.
  - Popups con campo técnico `gml_id` etiquetado siempre como **"BXLEnvironment ID"** (convención unificada).
  - Todas activas por defecto.

- **Grupo "Arbres 1030"** (checkbox de selección global), 6 subcapas, todas en tonos de verde distinguibles y activas por defecto:
  - **Arbres Schaerbeek** (`Schaerbeek1030_Arbres.js`, 11.369 pts — el dataset más grande del proyecto) — `#4caf50`.
  - **Arbres d'Alignement STIB** (`STIB1030_Arbres.js`, 2.364 pts) — `#8bc34a`.
  - **Cimetière de Saint-Josse-ten-Noode** (1.232), **Parc Walkiers** (1.251), **Espace Gaucheret** (45), **Parc Maximilien** (179) — las 4 son `BXLEnvironments_Tree1030.js` (2.707 pts totales) filtradas por la propiedad `site` (mismo patrón `filter` que las categorías de trottoirs). Colores `#1b5e20` / `#2e7d32` / `#33691e` / `#558b2f`.
  - **Popups unificados** (a pedido del cliente, para que todos den la misma información):
    - BXLEnvironment (4 capas de sitio): espèce (`essence`) + quartier (`Quartier`) + site (`site`).
    - Arbres d'Alignement STIB: espèce (`tree_species`) + quartier (`Quartier`) + gestion = **"STIB"** (valor fijo, no viene del dato).
    - Arbres Schaerbeek: espèce (`tree_species`) + quartier (`Quartier`) + gestion = **"Schaerbeek 1030"** (valor fijo).
  - Radio de los círculos: **4px** (se subió de 3px porque al hacer zoom el punto no escala — es tamaño fijo en píxeles de pantalla — y se volvía muy difícil de clickear; se probó 5px y se ajustó a 4px).
  - **Pane exclusiva `pane_Arbres1030`** con el zIndex más alto de todo el mapa (411) y su propio `canvas_Arbres1030` compartido entre las 6 subcapas — necesario para que los árboles respondan siempre al clic por encima de cualquier otra capa (mismo patrón de canvas compartido que en `BuildingCadastreAddresses1030.html`, aplicado aquí porque las capas de Bruxelles Environnement usan SVG en panes de mayor z-index y bloqueaban los clics del canvas de árboles que estaba debajo).
  - Grupo "Arbres 1030" ubicado **antes** que "Bruxelles Environnement 1030" en el árbol de capas.

- Nombre de la carta (h2) y título de pestaña: **"Maillage Vert 1030"** (pasó por "Bruxelles Environnement 1030" antes de este nombre final). Ícono "i" actualizado para describir el contenido real.
- Bâtiments (Cadastre) queda desactivado por defecto.

### 4. `index.html`
- Se agregaron los 3 enlaces nuevos (`BuildingCadastreAddresses1030.html`, `SidewalksBuildingAddresses1030.html`, `BXLEnvironment1030.html`).
- Título, `<h1>`, introducción y `<h2>` de la sección de enlaces reescritos: ya no se presentan como "estudio demográfico" sino como el hub de la Charte Écologique (población, cadastre, primas, végétalisation, maillage vert).

## Sesión 2026-09-10 — resumen de lo hecho

### 1. `StreetSurfacesNodes1030.html` (nueva carta)
Basada en `ChartGreen1030_base.html`. Usa los datos de `data/Mobilite1030/` (referencial URBIS-OSIRIS de voirie), 5 archivos con distinto nivel de agregación:
- **02** `OnlyStreetSurfaces` (tronçons individuales, tabla oficial de segments) — **usa la versión `_COR`** (corregida), no la `06_...Segments.geojson` sin corregir: se comparó byte a byte y la única diferencia es el campo `id_street` mal asignado en 240/1113 segmentos en la versión sin corregir (ej. la E40 quedaba partida en 3 "calles" distintas en vez de una). El archivo `06_...` sin corregir se descartó, no se convirtió a `.js`.
- **04** `GroupStreet` (rue completa, tronçons fusionados por `id_street`) y **01** `GroupStreet_OnlyNodes` (caso límite: calles sin tronçon propio, solo un nodo).
- **03** `SharedStreetNodes` (nodos por solapamiento geométrico, calculados) y **05** `GroupNodes` (intersections oficiales del referencial, con `index_int`).
- Subgrupos en el árbol de capas: "Tronçons de rue" / "Rues complètes" / "Intersections / Nœuds", cada uno con su propio "seleccionar todo", anidado bajo "Voirie URBIS-OSIRIS 1030" (grupo en primera posición del árbol). Por defecto activos: Tronçons de rue + Nœuds partagés.
- Se agregó también la capa **Trottoirs 1030** (mismo dataset que `SidewalksBuildingAddresses1030.html`, `URBIS_Sidewalk_BlockQuartier_Schaerbeek1030.js`), pero **reclasificada por `sidewalk_label_fr`** (3 valores: Tronçon de rue 3026, Carrefour 2387, Chemin/ruelle/venelle 3) en vez de `possibility_vertical_facade` (que no clasifica el tipo de acera) ni `ssft_description` (que clasifica la vía asociada, no la acera — 11 valores, se descartó tras probarlo). Popup de Trottoirs reducido a 4 campos (rue FR, type, surface, type de voirie) con el mismo estilo `th`/`td` que las intersections.
- **Bug de canvas compartido descubierto y corregido**: al agregar Trottoirs con su propio `L.canvas()` en un pane de mayor z-index, los popups de Tronçons/Nœuds (SVG, panes inferiores) dejaron de abrir **en todo el mapa**, no solo donde se superponían — un `<canvas>` intercepta clics en toda su bounding box aunque esté vacío en ese punto. Fix: quitar el canvas dedicado de Trottoirs y usar SVG por defecto (igual que el resto de capas de la página). Ver patrón consolidado #7 abajo.
- Dimensiones (`longueur (m)`, `surface (m2)`, etc.) redondeadas a 2 decimales con `Number(...).toFixed(2)` en vez de `.toLocaleString()` sobre el string crudo.

### 2. Unificación de popups (las 8 páginas)
A pedido del cliente ("todos los popups deben ser visualmente iguales"), se comparó contra `github.com/gis1030/DSD-Cycloparking1030` y se aplicaron dos cambios:
- **Estilo CSS compartido** en `Ecological-Charter-1030/css/qgis2web.css`: líneas separadoras grises entre filas (`border-bottom: 1px solid #e0e0e0`), tabla más compacta (`font-size: 11px`), `th` sin salto de línea, `td` con `word-break`. Antes solo había `min-width` en th/td.
- **Estructura HTML unificada**: se convirtieron **299 filas de popup** (en 8 archivos) del patrón antiguo `<td colspan="2"><strong>Label</strong><br/>Valor</td>` al patrón `<th scope="row">Label</th><td>Valor</td>` (etiqueta izquierda, valor derecha), usando un script Node con regex (no edición manual, dado el volumen). 2 casos especiales en `BXLEnvironment1030.html` (campo "gestion" con valor fijo "STIB"/"Schaerbeek 1030", sin `id`/`class`) no calzaban el regex y se corrigieron a mano.

### 3. Auditoría de estructura base (las 8 páginas)
El cliente pidió verificar que todas las páginas tuvieran el mismo set de capas base (Limites Scaherbeek, Limites Schaerbeek Quartiers, Contour des îlots/BlockParcel, Google Terrain, Google Satellite, OpenStreet Map). Faltantes encontrados y agregados:
- **BlockParcel**: faltaba en PopulationDistribution1030, HouseholdsNumbers1030, PrimesDSD1030, BuildingCadastreAddresses1030.
- **Google Satellite**: faltaba en PopulationDistribution1030, HouseholdsNumbers1030, PrimesDSD1030.
- **PrimesDSD1030.html** era la outlier: variables/labels con nombres distintos al resto (`layer_limitesschaerbeek_3` en vez de `layer_LimitesScaherbeek_3`, label "Limites de schaerbeek" en vez de "Limites Scaherbeek", sin `radioGroup`, basemaps con `radioGroup: 'bt'` en vez de `'bm'`, "OpenStreetMap" sin espacio, grupos "Périmètre de Schaerbeek"/"Tiles" anidados dentro de "Primes DSD" en vez de ser hermanos de primer nivel). Se corrigieron las etiquetas/radioGroup y se sacaron esos 2 grupos a nivel raíz del `overlaysTree`, sin renombrar las variables JS internas (cosmético, no afecta al usuario final).

### 4. Unificación JS/CSS — `js/common.js` (nuevo archivo)
A pedido del cliente ("separar los scripts globales de los particulares"), se auditó qué bloques eran idénticos en las 8 páginas y se extrajeron a `Ecological-Charter-1030/js/common.js` (cargado vía `<script src="js/common.js">` después de `leaflet.js`, antes del script principal de cada página):
- `highlightFeature`, `removeEmptyRowsFromPopupContent`, `addClassToPopupIfMedia` (funciones, sin efectos al cargar).
- `initTitleControl(map, html)` / `initAbstractControl(map, html)` — parametrizadas por texto, cada página solo pasa su título/abstract.
- `initBasemaps(map)` — crea los 3 basemaps (OSM/Terrain/Satellite) y activa Terrain por defecto; devuelve `{osm, terrain, satellite}`.
- `initSearchControl(map)` — todo el bloque de búsqueda Photon (Nominatim/BAN) + botón de colapso.
- `HomeControl`, `MyControlClass` (menu principal), `L.Control.Watermark` — definiciones de clase; cada página decide cuándo instanciarlas (`new HomeControl().addTo(map)`, etc.).
- `initFooterControls(map)` — instancia MyControlClass + Watermark de una sola llamada.
- `initFeedbackButton(map, subject)` — **nuevo**, botón de e-mail (`fa-envelope`, `mailto:info@1030.be?subject=...`), agregado a las 8 páginas (antes solo existía, con otro texto, en PrimesDSD1030).
- Listener de `DOMContentLoaded` que ajusta la altura del panel de capas — se registra solo con incluir el archivo, no necesita llamada.

Cada página quedó con: creación del mapa, textos propios, sus capas de datos (`pop_X`/`style_X`/`layer_X`), su `overlaysTree`, y llamadas a las funciones compartidas. Se redujeron entre 40 y 90 líneas repetidas por archivo.

**Bugs corregidos como efecto secundario** (confirmados con el usuario antes de aplicar):
- `PrimesDSD1030.html` tenía `abstract.addTo(map)` comentado (el botón "i" no aparecía) — corregido, ahora usa `initAbstractControl` igual que el resto.
- `PrimesDSD1030.html` tenía el basemap OSM en `http://` sin `minNativeZoom`/`maxNativeZoom` — corregido automáticamente al usar `initBasemaps()` compartido.
- Botón "Home" agregado a PopulationDistribution1030, HouseholdsNumbers1030 y PrimesDSD1030 (antes solo 5/8 páginas lo tenían).

**Bug post-refactor detectado y corregido**: al agregar `easy-button.css` a las 8 páginas (para el botón de feedback), su regla `.leaflet-touch .leaflet-bar button{width:30px;height:30px;...}` empata en especificidad con la regla de corrección `.leaflet-bar button.my-button-class{all:revert;}` y gana por orden de cascada (viene después en el `<head>`), aplastando el botón "menu principal" a un cuadrado de 30×30 sin texto visible. Fix: agregar `!important` a la regla de corrección, centralizada en `qgis2web.css` (afecta a las 8 páginas a la vez).

### 5. Limpieza de código muerto: `bounds_group` / `setBounds()`
Confirmado que `bounds_group` (un `L.featureGroup` que acumulaba todas las capas vía `bounds_group.addLayer(layer_X)`) nunca se usaba para nada — `setBounds()` estaba vacío en las 8 páginas, y el encuadre inicial real lo da el `.fitBounds([[...]])` fijo al crear el mapa. Se eliminó la definición de `common.js` y las ~82 líneas `bounds_group.addLayer(...)` + las 8 llamadas `setBounds();`, con un script de regex + verificación de sintaxis/render en cada archivo.

### 6. Atribución del mapa unificada
`map.attributionControl.setPrefix(...)` — se quitaron los créditos a "qgis2web" y "QGIS" en las 8 páginas, dejando solo `©GeoData1030 · Commune de Schaerbeek · Leaflet`.

### 7. Trabajo del usuario (fuera de esta sesión de IA)
El usuario reorganizó manualmente `index.html`: pasó de una sola sección "Cartographies thématiques" con las 8 cartas en lista plana a **5 secciones temáticas** (Population de Schaerbeek, Primes Verts de Schaerbeek, Cadastre des bâtiments de Schaerbeek, Maillage Vert 1030, Reseaux de Mobilite 1030), dejando `index_OLD.html` como respaldo de la versión anterior. También reemplazó `README.md` (eliminado) por `LICENSE.md` en la raíz (además del `LICENSE` existente, ambos EUPL-1.2).

### 8. `README.md` (nuevo, no commiteado)
Creado siguiendo estructura/estilo de `github.com/gis1030/DSD-Cycloparking1030/README.md` (adaptado): tabla de acceso rápido a las 8 cartas, secciones por tema, tecnologías (mencionando `js/common.js` como arquitectura propia), estructura del repo, changelog con fechas reales de `DSD_EcoChart.md`, fuentes de datos, sección de protección de datos en versión corta (nuestros datos son agregados/públicos, no hay registros individuales identificables como en Cycloparking), autor (de `author.txt`), licencia EUPL-1.2.

## Patrones técnicos consolidados esta sesión (para reutilizar en próximas cartas)

1. **Canvas compartido para prioridad de clic**: cuando varias capas deben responder a clics simultáneamente y pueden superponerse, deben compartir el mismo `L.canvas()` + pane. Si cada una tiene su propio canvas en panes distintas, la de mayor z-index bloquea los clics de las de abajo aunque esté vacía en ese punto (el canvas cubre toda el área del mapa). El **orden de inserción** (`map.addLayer`) determina qué capa gana el clic donde se superponen — la última agregada gana.
2. **Filtrado de una misma fuente en varias capas visuales**: `new L.geoJson(jsonVar, { filter: function(feature){ return feature.properties['X'] === 'valor'; }, ... })` — usado para categorías de trottoirs y sitios de árboles. Más eficiente y más simple que la técnica qgis2web original (estilo condicional que devuelve geometría invisible).
3. **Checkboxes anidados**: L.Control.Layers.Tree soporta anidar `{label, children}` dentro de `children` sin límite de profundidad demostrado (se usó 2 niveles). `selectAllCheckbox: true` agrega un checkbox de "seleccionar todos" a ese grupo.
4. **Swatches de color en vez de imágenes de leyenda**: reemplazar `<img src="legend/X.png">` por `<span style="...background:#color...">` evita mantener imágenes de leyenda sincronizadas con el color real del estilo.
5. **FeatureCollection anidada**: algunos datasets (ej. `Primes1030_DSD_FacadeVert.js`) tienen la estructura `{features: [{type: "FeatureCollection", features: [...]}]}` — hay que pasar `json_X.features[0]` a `L.geoJson`, no el objeto raíz.
6. **Automatización/QA de estas páginas** (browser-automation): los clics directos por selector sobre checkboxes anidados del árbol de capas son propensos a fallar con "element not attached to DOM" (el panel recalcula su altura tras cargar). Preferir locators de Playwright con reintento o clics por grilla sobre el mapa leyendo el contenido del popup resultante. La lectura de píxeles vía `canvas.getImageData()` **no es confiable** en este entorno de automatización (da resultados vacíos aunque el render visual sea correcto, probablemente por protecciones anti-fingerprint del navegador headless) — no usar esa técnica para validar, confiar en capturas de pantalla + clics reales.
7. **Nunca dar a una capa nueva su propio `L.canvas()` dedicado si ya hay otras capas interactivas SVG en la página**: un `<canvas>` intercepta clics/hover en TODA su bounding box (todo el mapa), no solo donde hay geometría dibujada — si queda en un pane de mayor z-index, bloquea los popups de las capas SVG de abajo en cualquier punto del mapa, no solo donde se superponen visualmente. Por defecto usar SVG (no pasar `renderer:`) salvo que el volumen de features realmente lo justifique (miles de puntos, ej. Arbres/Adresses) — y en ese caso, compartir un único canvas entre todas las capas que deban convivir (patrón #1).
8. **Ediciones mecánicas repetidas en muchos archivos** (popups, código muerto, boilerplate): cuando el mismo patrón se repite decenas/cientos de veces de forma *verificablemente idéntica* (confirmado antes con grep/diff, no asumido), conviene un script Node con regex sobre los archivos en vez de `Edit` uno por uno — mucho más rápido y menos propenso a error humano. Siempre verificar después con `node --check`/`new Function(...)` por archivo y con un QA real en navegador (popup abierto, sin errores de consola) antes de dar por terminado.
9. **CSS con `!important` necesario al mezclar hojas de terceros**: si dos reglas de distintas hojas de estilo tienen la misma especificidad, gana la que carga después en el `<head>`, sin importar cuál "parezca" más específica por su comentario/intención. Un `all: revert` sin `!important` puede perder ese empate silenciosamente. Cuando se agrega una librería de terceros (ej. `easy-button.css`) a páginas que ya tenían una regla de corrección para otro conflicto, hay que re-verificar que esa corrección siga ganando.
10. **En JS clásico (no módulos), `var`/`function`/`let` de nivel superior en un `<script src="...">` externo son globales compartidos con el resto de `<script>` de la página** — es lo que permite que `js/common.js` defina `bounds_group`, funciones de popup, etc. y que el script principal de cada página los use sin import/export. Pero esto también significa que un nombre repetido en dos archivos se pisa silenciosamente — hay que evitar duplicar nombres entre `common.js` y el script de cada página.

## Estado pendiente en git

**Un commit local ya hecho** (sesión 2026-09-09): `6820dbf` — rename `Population-1030`→`Ecological-Charter-1030`, 3 cartas nuevas (cadastre, trottoirs, maillage vert), reescritura del hub. Identidad configurada localmente (no global) para este repo: `user.name=gis1030`, `user.email=geodata.gis1030@gmail.com`.

**Todo lo de la sesión 2026-09-10 sigue sin commitear** (~26 archivos entre modificados/nuevos/eliminados):
- Modificados: las 8 páginas HTML (unificación JS/CSS, popups, atribución), `Ecological-Charter-1030/css/qgis2web.css`, `index.html` (reorganización del usuario), `LICENSE` (por el usuario), `README.md` (reescrito).
- Nuevos sin trackear: `Ecological-Charter-1030/StreetSurfacesNodes1030.html`, `Ecological-Charter-1030/js/common.js`, `Ecological-Charter-1030/data/Mobilite1030/*.js` (5 archivos + subcarpeta `geojson/`), `LICENSE.md` (del usuario).
- Eliminados (reemplazados por sus `.js`): los 6 `.geojson` originales de `data/Mobilite1030/` (`01`–`06`, incluido el `06_...Segments.geojson` sin corregir que se descartó a propósito, ver sesión 09-10 punto 1).
- **Recordatorio explícito del usuario**: no hacer `push` ni tocar el remoto bajo ninguna circunstancia sin pedirlo de nuevo cada vez — el plan de publicación bajo `github.com/gis1030` sigue sin definir. Commits locales sí están permitidos cuando se piden.

## Próximos pasos sugeridos (no ejecutados, a definir con el usuario)

- Decidir cómo confirmar en git todo el trabajo de la sesión 2026-09-10 — commit único o varios.
- `data/URBIS1030/URBIS_Parking_Schaerbeek1030.js` y `data/URBIS1030/URBIS_URBADM_SSR_Schaerbeek1030.js` están descargados pero **no integrados** en ninguna página todavía.
- Las carpetas `geojson/` (dentro de `Arbres1030`, `BXLEnvironment1030`, `Mobilite1030`) son los archivos fuente antes de convertirse a `.js` — verificar si conviene limpiarlos o dejarlos como respaldo.
- El campo `gml_id` en las capas "Bruxelles Environnement" se etiqueta como "BXLEnvironment ID" en todos lados excepto quizás quede pendiente revisar Parcs/Places/PublicGreenSpaces (esas no tienen `gml_id` en el popup actualmente, no se pidió agregarlo).
- `PrimesDSD1030.html` conserva nombres de variables JS internas distintos al resto (`layer_limitesschaerbeek_3`, `layer_quartiers1030_2`, etc.) — cosmético/interno, no afecta al usuario, pendiente si se quiere renombrar para full consistencia.
- Evaluar si conviene redondear a 2 decimales las dimensiones que faltan en páginas no tocadas en esa tarea puntual (ver sesión anterior).
- Decidir si/cuándo publicar el repo bajo `github.com/gis1030` y cómo reconciliar con el remoto `origin` actual (`POP-Demographic-Schaerbeek`, usado solo como referencia).
