# SytSaS - API de Gestion de Salle de Sport

SytSaS (Système de gestion de Salle de Sport) est une API RESTful développée avec Node.js, Express et MongoDB pour gérer un réseau de salles de sport.

## Fonctionnalités

- Gestion des adhérents (membres du club)
- Gestion des entraîneurs
- Gestion des salles de sport
- Gestion des équipements
- Gestion des abonnements
- Gestion des horaires de cours
- Gestion des disponibilités des entraîneurs
- Suivi des carrières des entraîneurs
- Suivi des progrès des adhérents (poids, etc.)

## Prérequis

- Node.js (v14+)
- MongoDB (v4+)

## Installation

1. Cloner le dépôt
```
git clone <repository-url>
cd api-projet-nosql
```

2. Installer les dépendances
```
npm install
```

3. Configurer la connexion à MongoDB
Modifiez le fichier `config/database.js` pour configurer la connexion à votre base de données MongoDB.

4. Démarrer le serveur
```
npm start
```

Pour le développement, vous pouvez utiliser nodemon :
```
npm run dev
```

## Structure du projet

```
api-projet-nosql/
├── config/             # Configuration (base de données, etc.)
├── controllers/        # Contrôleurs pour gérer la logique métier
├── models/             # Modèles Mongoose
├── routes/             # Routes API
├── index.js            # Point d'entrée de l'application
└── package.json
```

## Points de terminaison API

### Adhérents

- `GET /api/adherents` - Récupérer tous les adhérents
- `POST /api/adherents` - Créer un nouvel adhérent
- `GET /api/adherents/:id` - Récupérer un adhérent spécifique
- `PATCH /api/adherents/:id` - Mettre à jour un adhérent
- `DELETE /api/adherents/:id` - Supprimer un adhérent
- `GET /api/adherents/:id/abonnements` - Récupérer les abonnements d'un adhérent
- `GET /api/adherents/:id/suivi-poids` - Obtenir l'historique du suivi de poids
- `POST /api/adherents/:id/suivi-poids` - Ajouter un suivi de poids
- `GET /api/adherents/with-active-subscriptions` - Récupérer les adhérents avec abonnements actifs

### Entraîneurs

- `GET /api/entraineurs` - Récupérer tous les entraîneurs
- `POST /api/entraineurs` - Créer un nouvel entraîneur
- `GET /api/entraineurs/:id` - Récupérer un entraîneur spécifique
- `PATCH /api/entraineurs/:id` - Mettre à jour un entraîneur
- `DELETE /api/entraineurs/:id` - Supprimer un entraîneur
- `GET /api/entraineurs/:id/horaires` - Récupérer les horaires d'un entraîneur
- `GET /api/entraineurs/:id/disponibilites` - Récupérer les disponibilités d'un entraîneur
- `GET /api/entraineurs/:id/carrieres` - Récupérer la carrière d'un entraîneur
- `POST /api/entraineurs/:id/disponibilites` - Créer une disponibilité
- `GET /api/entraineurs/disponibles` - Récupérer les entraîneurs disponibles

### Salles

- `GET /api/salles` - Récupérer toutes les salles
- `POST /api/salles` - Créer une nouvelle salle
- `GET /api/salles/:id` - Récupérer une salle spécifique
- `PATCH /api/salles/:id` - Mettre à jour une salle
- `DELETE /api/salles/:id` - Supprimer une salle
- `GET /api/salles/:id/equipements` - Récupérer les équipements d'une salle
- `GET /api/salles/:id/abonnements` - Récupérer les abonnements actifs d'une salle
- `GET /api/salles/:id/entraineurs` - Récupérer les entraîneurs d'une salle
- `GET /api/salles/:id/taux-occupation` - Récupérer le taux d'occupation
- `POST /api/salles/:id/equipements` - Ajouter un équipement à une salle

### Equipements

- `GET /api/equipements` - Récupérer tous les équipements
- `POST /api/equipements` - Créer un nouvel équipement
- `GET /api/equipements/:id` - Récupérer un équipement spécifique
- `PATCH /api/equipements/:id` - Mettre à jour un équipement
- `DELETE /api/equipements/:id` - Supprimer un équipement
- `GET /api/equipements/disponibles` - Récupérer les équipements disponibles
- `GET /api/equipements/fonction/:fonction` - Récupérer les équipements par fonction
- `PATCH /api/equipements/:id/signaler` - Signaler un équipement à réparer
- `PATCH /api/equipements/:id/reparer` - Marquer un équipement comme réparé

### Abonnements

- `GET /api/abonnements` - Récupérer tous les abonnements
- `POST /api/abonnements` - Créer un nouvel abonnement
- `GET /api/abonnements/:id` - Récupérer un abonnement spécifique
- `PATCH /api/abonnements/:id` - Mettre à jour un abonnement
- `DELETE /api/abonnements/:id` - Supprimer un abonnement
- `GET /api/abonnements/actifs` - Récupérer tous les abonnements actifs
- `POST /api/abonnements/souscrire` - Souscrire à un abonnement
- `PATCH /api/abonnements/:id/renouveler` - Renouveler un abonnement
- `PATCH /api/abonnements/:id/resilier` - Résilier un abonnement

### Horaires

- `GET /api/horaires` - Récupérer tous les horaires
- `POST /api/horaires` - Créer un nouvel horaire
- `GET /api/horaires/:id` - Récupérer un horaire spécifique
- `PATCH /api/horaires/:id` - Mettre à jour un horaire
- `DELETE /api/horaires/:id` - Supprimer un horaire
- `GET /api/horaires/salle/:salleId` - Récupérer les horaires par salle
- `GET /api/horaires/jour/:jour` - Récupérer les horaires par jour
- `PATCH /api/horaires/:id/activer` - Activer un horaire
- `PATCH /api/horaires/:id/desactiver` - Désactiver un horaire

### Disponibilités

- `GET /api/disponibilites` - Récupérer toutes les disponibilités
- `POST /api/disponibilites` - Créer une nouvelle disponibilité
- `GET /api/disponibilites/:id` - Récupérer une disponibilité spécifique
- `PATCH /api/disponibilites/:id` - Mettre à jour une disponibilité
- `DELETE /api/disponibilites/:id` - Supprimer une disponibilité
- `GET /api/disponibilites/date/:date` - Récupérer les disponibilités par date
- `PATCH /api/disponibilites/:id/reserver` - Réserver une disponibilité
- `PATCH /api/disponibilites/:id/annuler` - Annuler une réservation
- `POST /api/disponibilites/recurrence` - Créer des disponibilités récurrentes

### Carrières

- `GET /api/carrieres` - Récupérer toutes les carrières
- `POST /api/carrieres` - Créer une nouvelle carrière
- `GET /api/carrieres/:id` - Récupérer une carrière spécifique
- `PATCH /api/carrieres/:id` - Mettre à jour une carrière
- `DELETE /api/carrieres/:id` - Supprimer une carrière
- `GET /api/carrieres/actives` - Récupérer les carrières actives
- `PATCH /api/carrieres/:id/terminer` - Terminer une carrière
- `POST /api/carrieres/:id/performance` - Ajouter une performance
- `GET /api/carrieres/:id/performances` - Récupérer les performances

## Modèles de données

- **Personne** : Classe générique avec informations personnelles (nom, prénom, adresse, etc.)
  - **Adhérent** : Membre inscrit à une salle de sport
  - **Entraîneur** : Personne qui donne des cours dans une salle
- **Salle** : Représente une salle de sport physique
- **Abonnement** : Lien entre un adhérent et une salle
- **Equipement** : Matériel disponible dans une salle
- **Horaire** : Créneau pour un cours donné par un entraîneur
- **Disponibilité** : Créneau libre d'un entraîneur
- **Carriere** : Période d'activité d'un entraîneur dans une salle

## Licence

Ce projet est sous licence ISC.
