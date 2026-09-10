# 🌱 Charte Écologique — Schaerbeek 1030

> Hub cartographique consolidant les études et bases de données de la Charte Écologique de la commune de Schaerbeek (1030) · Dernière mise à jour septembre 2026

---

## 🔗 Accès rapide

| Carte | Description | Lien |
|---|---|---|
| 🏠 **Page d'accueil** | Portail du hub, 8 cartes regroupées par thème | [index.html](index.html) |
| 👥 **Distribution de la population** | Population par zone géographique (Registre national) | [carte](Ecological-Charter-1030/PopulationDistribution1030.html) |
| 🏘️ **Nombre de ménages** | Ménages par zone géographique (Registre national) | [carte](Ecological-Charter-1030/HouseholdsNumbers1030.html) |
| 💶 **Primes DSD** | Primes vélo, façade vert, compostière | [carte](Ecological-Charter-1030/PrimesDSD1030.html) |
| 🏛️ **Cadastre des bâtiments** | Bâtiments, parcelles et adresses (URBIS) | [carte](Ecological-Charter-1030/BuildingCadastreAddresses1030.html) |
| 🌳 **Maillage Vert 1030** | Arbres, espaces verts, diagnostic environnemental | [carte](Ecological-Charter-1030/BXLEnvironment1030.html) |
| 🚶 **Trottoirs — végétalisation des façades** | Potentiel de végétalisation verticale des façades | [carte](Ecological-Charter-1030/SidewalksBuildingAddresses1030.html) |
| 🛣️ **Street-Surfaces-Nodes 1030** | Réseau viaire (référentiel URBIS-OSIRIS) et trottoirs par type de voirie | [carte](Ecological-Charter-1030/StreetSurfacesNodes1030.html) |

---

## 📋 À propos du projet

Ce site consolide, sous une structure cartographique uniforme, les études et bases de données retenues pour la **Charte Écologique de Schaerbeek** : la population et les ménages, le patrimoine bâti et le parcellaire, les primes communales, la végétalisation des façades, le maillage vert et le réseau viaire.

Une partie des cartes provient de la famille de dépôts [`github.com/gis1030`](https://github.com/gis1030), retravaillée sous un gabarit commun ; d'autres reposent sur des bases de données entièrement nouvelles (Bruxelles Environnement, arbres, référentiel URBIS-OSIRIS). D'autres cartes viendront progressivement enrichir cette charte.

Application 100 % côté client — aucune installation ni serveur requis.

---

## 🧭 Contenu

### 👥 Population de Schaerbeek
Statistiques démographiques (Registre national) : distribution de la population et nombre de ménages par zone géographique.

### 💶 Primes Verts de Schaerbeek
Primes octroyées par la Direction du Développement Stratégique et Durable : vélo, façade vert, compostière — par période.

### 🏛️ Cadastre des bâtiments de Schaerbeek
Cadastre URBIS des bâtiments, parcelles cadastrales et adresses, découpés par îlot urbanistique et quartier.

### 🌳 Maillage Vert 1030
Arbres de voirie, d'alignement STIB et de sites remarquables ; infrastructures vertes (parcs, places, espaces verts publics) ; diagnostic environnemental (zones de carence et zones prioritaires de végétalisation) — données Bruxelles Environnement. Inclut les trottoirs évalués pour la végétalisation verticale des façades, avec les façades déjà végétalisées comme référence.

### 🛣️ Réseaux de Mobilité 1030
Réseau viaire de Schaerbeek (référentiel URBIS-OSIRIS) : tronçons de rue, rues complètes, intersections calculées et officielles, et trottoirs classés par type de voirie (tronçon, carrefour, chemin/ruelle).

**Couches de référence** (disponibles sur chaque carte) — Limites de Schaerbeek, limites des quartiers, contour des îlots (BlockParcel).
**Fonds de carte** — Google Terrain (par défaut) · Google Satellite · OpenStreetMap.

---

## 🛠️ Technologies

- **Leaflet.js** — cartographie interactive
- **L.Control.Layers.Tree** — arbre de couches avec cases à cocher imbriquées et groupes de sélection exclusive
- **Leaflet Photon** — recherche d'adresse (Nominatim / BAN)
- **easy-button** — bouton de retour (feedback) par e-mail
- **Autolinker** — mise en forme du contenu des popups
- **qgis2web** — génération initiale des cartes depuis QGIS
- **`js/common.js`** — logique partagée entre les 8 cartes (contrôles communs, fonds de carte, recherche, popups, bouton de retour) ; chaque page ne conserve que ses propres couches de données
- **GitHub Pages** — hébergement statique (à venir)

---

## 🌐 Compatibilité

Compatible avec les versions récentes de **Firefox**, **Chrome** et **Edge**.

---

## 📁 Structure du dépôt

```
DSD-Ecological-Charter/
├── index.html                              # Hub — portail principal
├── LICENSE / LICENSE.md                    # EUPL-1.2
├── DSD_EcoChart.md                         # Journal de continuité du projet
├── css/
│   ├── style.css                           # Style du hub (index.html)
│   └── images/                             # Logos, favicon
├── leaflet/                                # Notes techniques et recommandations
└── Ecological-Charter-1030/
    ├── PopulationDistribution1030.html
    ├── HouseholdsNumbers1030.html
    ├── PrimesDSD1030.html
    ├── BuildingCadastreAddresses1030.html
    ├── SidewalksBuildingAddresses1030.html
    ├── BXLEnvironment1030.html
    ├── StreetSurfacesNodes1030.html
    ├── ChartGreen1030_base.html            # Gabarit de base pour les nouvelles cartes
    ├── css/
    │   └── qgis2web.css                    # Styles partagés (popups, contrôles, fonds de carte)
    ├── js/
    │   ├── common.js                       # Logique partagée entre les 8 cartes
    │   └── ...                             # Librairies Leaflet tierces
    ├── data/
    │   ├── Population1030/
    │   ├── Primes1030/
    │   ├── URBIS1030/
    │   ├── BXLEnvironment1030/
    │   ├── Arbres1030/
    │   ├── Mobilite1030/
    │   └── SchaerbekBorders/
    ├── legend/                             # Légendes (images)
    └── webfonts/                           # FontAwesome
```

---

## 📅 Changelog

| Date | Description |
|---|---|
| Septembre 2026 | Ajout de la carte Street-Surfaces-Nodes 1030 (réseau viaire URBIS-OSIRIS, trottoirs classés par type de voirie) |
| Septembre 2026 | Unification du code partagé des 8 cartes dans `js/common.js` et `css/qgis2web.css` (contrôles, fonds de carte, recherche, popups) ; ajout du bouton de retour (feedback) sur toutes les cartes |
| Septembre 2026 | Ajout des cartes Cadastre des bâtiments, Trottoirs (végétalisation des façades) et Maillage Vert 1030 (Bruxelles Environnement) |
| Septembre 2026 | Restructuration du hub en Charte Écologique (auparavant étude démographique ponctuelle) |

---

## 📄 Sources des données

| Jeu de données | Source | 
|---|---|
| Population / ménages | Registre national belge (agrégé par îlot) |
| Cadastre, bâtiments, adresses | URBIS® — SPW-SPF Finances / Bruxelles UrbIS |
| Primes vélo, façade vert, compostière | Commune de Schaerbeek — Direction du Développement Stratégique et Durable |
| Espaces verts, diagnostic environnemental, arbres | Bruxelles Environnement · Commune de Schaerbeek · STIB |
| Réseau viaire, trottoirs | Référentiel URBIS-OSIRIS |

Les données sont converties en fichiers GeoJSON statiques (format JS) pour un rendu entièrement côté client — aucune requête serveur n'est effectuée à l'exécution.

---

## 🔒 Protection des données

Les jeux de données publiés sur ce site sont **agrégés ou publics** : statistiques démographiques agrégées par îlot urbanistique (aucun enregistrement individuel identifiable), cadastre URBIS public, infrastructures et diagnostic environnemental de Bruxelles Environnement, référentiel de voirie URBIS-OSIRIS. Aucune donnée à caractère personnel identifiable n'est publiée.

---

## 👤 Auteur

**I.H. Hilal, Dr. Eng.** — Responsable de l'analyse de données pour la Commune de Schaerbeek (DSI). Révision et transformation des données brutes, développement de modèles prédictifs, conception d'algorithmes, contrôle de l'information exploitable pour l'aide à la décision stratégique.

---

## 📄 Licence

Ce projet est distribué sous licence **European Union Public Licence v. 1.2 (EUPL-1.2)**.
Voir le fichier [LICENSE](LICENSE) pour le texte complet.

[![License: EUPL-1.2](https://img.shields.io/badge/License-EUPL%201.2-blue.svg)](https://eupl.eu/1.2/en/)

> © 2024–2026 Direction des Systèmes d'Information (DSI) · Commune de Schaerbeek · 1030 Bruxelles, Belgique

---

*Commune de Schaerbeek · Direction des Systèmes d'Information (DSI) · 1030 Bruxelles, Belgique*
