# 📚 Notes Universitaires - Plateforme de Gestion

Application web full-stack pour la gestion des notes universitaires, déployée sur Google Kubernetes Engine (GKE) avec un pipeline CI/CD automatisé.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   LoadBalancer       │
              │   (Frontend)         │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐      ┌────────┐      ┌────────┐
    │Frontend│      │Frontend│      │Frontend│
    │  Pod   │      │  Pod   │      │  Pod   │
    └────┬───┘      └────┬───┘      └────┬───┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Backend Service    │
              │   (ClusterIP)        │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
    ┌────────┐      ┌────────┐      ┌────────┐
    │Backend │      │Backend │      │Backend │
    │  Pod   │      │  Pod   │      │  Pod   │
    └────┬───┘      └────┬───┘      └────┬───┘
         │               │               │
         └───────────────┼───────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ PostgreSQL Service   │
              │   (ClusterIP)        │
              └──────────┬───────────┘
                         │
                         ▼
                  ┌────────────┐
                  │ PostgreSQL │
                  │    Pod     │
                  └──────┬─────┘
                         │
                         ▼
              ┌──────────────────────┐
              │ Persistent Volume    │
              │    (GCE Disk)        │
              └──────────────────────┘
```

## 🛠️ Stack Technique

### Frontend
- **Framework:** React + Vite
- **Serveur web:** Nginx
- **Container:** Docker

### Backend
- **Runtime:** Node.js 18
- **Framework:** Express.js
- **API:** RESTful
- **Container:** Docker

### Base de données
- **SGBD:** PostgreSQL 15
- **Storage:** GCE Persistent Disk

### Infrastructure
- **Cloud Provider:** Google Cloud Platform (GCP)
- **Orchestration:** Kubernetes (GKE)
- **IaC:** Terraform
- **CI/CD:** GitHub Actions
- **Registry:** Google Artifact Registry

## 📁 Structure du Projet

```
notes-universitaires/
├── backend/                    # Application backend
│   ├── src/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── frontend/                   # Application frontend
│   ├── src/
│   ├── package.json
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
│
├── k8s/                       # Manifests Kubernetes
│   ├── namespace.yaml
│   ├── postgres-*.yaml
│   ├── backend-*.yaml
│   └── frontend-*.yaml
│
├── terraform/                 # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── provider.tf
│   └── terraform.tfvars
│
├── .github/                   # CI/CD
│   └── workflows/
│       └── deploy-to-gke.yml
│
├── scripts/                   # Scripts utilitaires
│   ├── deploy.sh
│   ├── cleanup.sh
│   └── check-health.sh
│
└── docs/                      # Documentation
    ├── GUIDE_COMPLET_DEPLOIEMENT.md
    └── CHECKLIST.md
```

## 🚀 Démarrage Rapide

### Prérequis

- Docker Desktop
- Google Cloud SDK (gcloud)
- Terraform >= 1.0
- kubectl
- Node.js 18+ (pour le développement local)
- Compte GCP avec facturation activée

### Installation en 5 étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/votre-username/notes-universitaires.git
   cd notes-universitaires
   ```

2. **Configurer GCP**
   ```bash
   gcloud auth login
   gcloud config set project VOTRE_PROJECT_ID
   ```

3. **Déployer l'infrastructure**
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Éditez terraform.tfvars avec vos valeurs
   terraform init
   terraform apply
   ```

4. **Construire et déployer**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

5. **Accéder à l'application**
   ```bash
   kubectl get service frontend-service -n notes-universitaires
   # Ouvrez l'IP externe dans votre navigateur
   ```

Pour une installation détaillée, consultez [GUIDE_COMPLET_DEPLOIEMENT.md](docs/GUIDE_COMPLET_DEPLOIEMENT.md)

## 🔄 Workflow CI/CD

Le pipeline automatique se déclenche sur chaque push vers `main` :

1. **Build** : Construction des images Docker
2. **Push** : Envoi vers Google Artifact Registry
3. **Deploy** : Déploiement sur GKE
4. **Test** : Vérification de la santé
5. **Rollback** : Automatique en cas d'échec

## 📊 Monitoring

### Commandes utiles

```bash
# Vérifier la santé de l'application
./scripts/check-health.sh

# Voir les logs en temps réel
kubectl logs -f deployment/backend -n notes-universitaires
kubectl logs -f deployment/frontend -n notes-universitaires

# Voir l'état des pods
kubectl get pods -n notes-universitaires

# Voir les métriques
kubectl top pods -n notes-universitaires
kubectl top nodes
```

### Dashboards GCP

- **GKE Dashboard:** Console → Kubernetes Engine → Clusters
- **Monitoring:** Console → Monitoring → Dashboards
- **Logs:** Console → Logging → Logs Explorer

## 🔧 Développement Local

### Avec Docker Compose

```bash
# Démarrer tous les services
docker-compose up --build

# L'application sera disponible sur:
# - Frontend: http://localhost
# - Backend: http://localhost:3000
# - PostgreSQL: localhost:5432

# Arrêter
docker-compose down
```

### Sans Docker

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Sécurité

### Secrets Kubernetes

Les secrets sont gérés via Kubernetes Secrets. **Ne jamais** commiter les secrets dans Git.

```bash
# Générer des secrets forts
openssl rand -base64 32  # DB Password
openssl rand -base64 64  # JWT Secret
```

### Bonnes pratiques

- ✅ Nœuds privés activés
- ✅ Network policies configurées
- ✅ RBAC avec permissions minimales
- ✅ Secrets chiffrés au repos
- ✅ Images Docker scannées
- ✅ Workload Identity pour l'authentification

## 📈 Scalabilité

### Horizontal Pod Autoscaling

```bash
# Backend
kubectl autoscale deployment backend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n notes-universitaires

# Frontend
kubectl autoscale deployment frontend \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n notes-universitaires
```

### Cluster Autoscaling

Configuré par défaut dans Terraform (1-5 nœuds).

## 🗑️ Nettoyage

### Supprimer l'application (garder le cluster)

```bash
./scripts/cleanup.sh --keep-cluster
```

### Supprimer toute l'infrastructure

```bash
./scripts/cleanup.sh
```

## 🐛 Dépannage

### Les pods ne démarrent pas

```bash
kubectl describe pod <pod-name> -n notes-universitaires
kubectl logs <pod-name> -n notes-universitaires
```

### PostgreSQL ne se connecte pas

```bash
kubectl exec -it <postgres-pod> -n notes-universitaires -- psql -U postgres
```

### LoadBalancer n'a pas d'IP

Attendez 2-5 minutes. Si le problème persiste :
```bash
kubectl describe service frontend-service -n notes-universitaires
```

### Rollback d'un déploiement

```bash
kubectl rollout undo deployment/backend -n notes-universitaires
```

Pour plus de détails, consultez la section Dépannage du [guide complet](docs/GUIDE_COMPLET_DEPLOIEMENT.md).

## 📚 Documentation

- [Guide Complet de Déploiement](docs/GUIDE_COMPLET_DEPLOIEMENT.md)
- [Checklist de Déploiement](docs/CHECKLIST.md)
- [Documentation GKE](https://cloud.google.com/kubernetes-engine/docs)
- [Documentation Terraform](https://registry.terraform.io/providers/hashicorp/google/latest/docs)

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Auteurs

- **Votre Nom** - *Travail initial*

## 🙏 Remerciements

- Google Cloud Platform pour l'infrastructure
- La communauté Kubernetes
- L'équipe Terraform

---

**⚠️ Note:** Ce projet est à des fins éducatives. Pour une utilisation en production, assurez-vous de suivre toutes les meilleures pratiques de sécurité et de conformité.