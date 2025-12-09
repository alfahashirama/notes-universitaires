# ✅ Checklist de Déploiement

Utilisez cette checklist pour suivre votre progression lors du déploiement.

## 📦 Phase 1 : Préparation

- [ ] Installer tous les outils requis
  - [ ] Docker Desktop
  - [ ] Google Cloud SDK (gcloud)
  - [ ] Terraform
  - [ ] kubectl
  - [ ] Git

- [ ] Créer la structure de fichiers
  ```
  notes-universitaires/
  ├── backend/
  │   ├── Dockerfile ✅
  │   ├── .dockerignore ⬅️
  │   └── ...
  ├── frontend/
  │   ├── Dockerfile ✅
  │   ├── .dockerignore ⬅️
  │   ├── nginx.conf ⬅️
  │   └── ...
  ├── k8s/ ✅
  ├── terraform/ ⬅️
  ├── .github/workflows/ ⬅️
  └── scripts/ ⬅️
  ```

- [ ] Copier tous les fichiers fournis
  - [ ] `backend/.dockerignore`
  - [ ] `frontend/.dockerignore`
  - [ ] `frontend/nginx.conf`
  - [ ] `terraform/main.tf`
  - [ ] `terraform/variables.tf`
  - [ ] `terraform/outputs.tf`
  - [ ] `terraform/provider.tf`
  - [ ] `.github/workflows/deploy-to-gke.yml`
  - [ ] `scripts/deploy.sh`
  - [ ] `scripts/cleanup.sh`
  - [ ] `scripts/check-health.sh`

## 🧪 Phase 2 : Tests locaux

- [ ] Créer `docker-compose.yml`
- [ ] Tester localement
  ```bash
  docker-compose up --build
  ```
- [ ] Vérifier que tout fonctionne
  - [ ] PostgreSQL se connecte
  - [ ] Backend démarre et répond
  - [ ] Frontend s'affiche
- [ ] Nettoyer
  ```bash
  docker-compose down -v
  ```

## ☁️ Phase 3 : Configuration GCP

- [ ] Se connecter à GCP
  ```bash
  gcloud auth login
  ```

- [ ] Créer le projet
  ```bash
  export PROJECT_ID="notes-universitaires-prod"
  gcloud projects create $PROJECT_ID --name="Notes Universitaires"
  gcloud config set project $PROJECT_ID
  ```

- [ ] Lier la facturation
  ```bash
  # Trouver votre Billing Account ID
  gcloud billing accounts list
  
  # Lier le projet
  gcloud billing projects link $PROJECT_ID \
    --billing-account=VOTRE_BILLING_ACCOUNT_ID
  ```

- [ ] Activer les APIs
  ```bash
  gcloud services enable \
    container.googleapis.com \
    compute.googleapis.com \
    servicenetworking.googleapis.com \
    cloudresourcemanager.googleapis.com \
    iam.googleapis.com \
    artifactregistry.googleapis.com \
    storage-api.googleapis.com
  ```

- [ ] Configurer l'authentification
  ```bash
  gcloud auth application-default login
  ```

## 🏗️ Phase 4 : Infrastructure Terraform

- [ ] Créer le bucket GCS pour le state
  ```bash
  gsutil mb -p $PROJECT_ID -l europe-west1 \
    gs://${PROJECT_ID}-terraform-state/
  gsutil versioning set on gs://${PROJECT_ID}-terraform-state/
  ```

- [ ] Créer `terraform/terraform.tfvars`
  - [ ] Remplir `project_id`
  - [ ] Configurer `region` et `zone`
  - [ ] Ajuster les paramètres du cluster

- [ ] Commenter temporairement le backend dans `provider.tf`

- [ ] Initialiser et déployer
  ```bash
  cd terraform
  terraform init
  terraform plan
  terraform apply
  ```
  ⏱️ Attendre 10-15 minutes

- [ ] Décommenter le backend dans `provider.tf`

- [ ] Migrer le state vers GCS
  ```bash
  terraform init -migrate-state
  ```

- [ ] Sauvegarder les outputs
  ```bash
  terraform output > ../terraform-outputs.txt
  ```

- [ ] Se connecter au cluster
  ```bash
  $(terraform output -raw kubectl_connection_command)
  kubectl cluster-info
  ```

## 🔐 Phase 5 : Sécurisation

- [ ] Générer des secrets forts
  ```bash
  # PostgreSQL password
  DB_PASSWORD=$(openssl rand -base64 32)
  echo "DB_PASSWORD: $DB_PASSWORD" >> secrets.txt
  
  # JWT secret
  JWT_SECRET=$(openssl rand -base64 64)
  echo "JWT_SECRET: $JWT_SECRET" >> secrets.txt
  ```

- [ ] Mettre à jour `k8s/postgres-config.yaml`
  - [ ] Remplacer le mot de passe PostgreSQL

- [ ] Mettre à jour `k8s/backend-config.yaml`
  - [ ] Remplacer le mot de passe DB
  - [ ] Remplacer le JWT secret

- [ ] ⚠️ **Sauvegarder `secrets.txt` dans un endroit sûr**
- [ ] ⚠️ **Ne JAMAIS commiter `secrets.txt` dans Git**

## 🎨 Phase 6 : Configuration des images Docker

- [ ] Récupérer l'URL du registre
  ```bash
  cd terraform
  REGISTRY=$(terraform output -raw docker_registry_url)
  echo $REGISTRY
  cd ..
  ```

- [ ] Mettre à jour `k8s/backend-deployment.yaml`
  ```yaml
  image: europe-west1-docker.pkg.dev/VOTRE_PROJECT_ID/notes-universitaires/backend:latest
  ```

- [ ] Mettre à jour `k8s/frontend-deployment.yaml`
  ```yaml
  image: europe-west1-docker.pkg.dev/VOTRE_PROJECT_ID/notes-universitaires/frontend:latest
  ```

## 🐳 Phase 7 : Build et Push des images

- [ ] Configurer Docker pour Artifact Registry
  ```bash
  gcloud auth configure-docker europe-west1-docker.pkg.dev
  ```

- [ ] Build et push Backend
  ```bash
  cd backend
  REGISTRY="europe-west1-docker.pkg.dev/$PROJECT_ID/notes-universitaires"
  docker build -t $REGISTRY/backend:latest .
  docker push $REGISTRY/backend:latest
  cd ..
  ```

- [ ] Build et push Frontend
  ```bash
  cd frontend
  docker build -t $REGISTRY/frontend:latest .
  docker push $REGISTRY/frontend:latest
  cd ..
  ```

- [ ] Vérifier les images dans Artifact Registry
  ```bash
  gcloud artifacts docker images list \
    europe-west1-docker.pkg.dev/$PROJECT_ID/notes-universitaires
  ```

## 🚀 Phase 8 : Déploiement sur Kubernetes

### Option A : Déploiement manuel

- [ ] Déployer dans l'ordre
  ```bash
  kubectl apply -f k8s/namespace.yaml
  kubectl apply -f k8s/postgres-config.yaml
  kubectl apply -f k8s/postgres-pv.yaml
  kubectl apply -f k8s/postgres-pvc.yaml
  kubectl apply -f k8s/postgres-deployment.yaml
  kubectl apply -f k8s/postgres-service.yaml
  
  # Attendre PostgreSQL
  kubectl wait --for=condition=ready pod -l app=postgres \
    -n notes-universitaires --timeout=300s
  sleep 30
  
  kubectl apply -f k8s/backend-config.yaml
  kubectl apply -f k8s/backend-deployment.yaml
  kubectl apply -f k8s/backend-service.yaml
  
  # Attendre Backend
  kubectl rollout status deployment/backend \
    -n notes-universitaires --timeout=300s
  
  kubectl apply -f k8s/frontend-deployment.yaml
  kubectl apply -f k8s/frontend-service.yaml
  
  # Attendre Frontend
  kubectl rollout status deployment/frontend \
    -n notes-universitaires --timeout=300s
  ```

### Option B : Script automatique

- [ ] Rendre les scripts exécutables
  ```bash
  chmod +x scripts/*.sh
  ```

- [ ] Lancer le déploiement
  ```bash
  ./scripts/deploy.sh
  ```

## 🔍 Phase 9 : Vérification

- [ ] Vérifier que tous les pods sont Running
  ```bash
  kubectl get pods -n notes-universitaires
  ```

- [ ] Récupérer l'IP externe
  ```bash
  kubectl get service frontend-service -n notes-universitaires
  ```

- [ ] Tester l'application
  ```bash
  # Backend
  curl http://EXTERNAL_IP/api/health
  
  # Frontend
  curl http://EXTERNAL_IP/
  ```

- [ ] Ouvrir dans le navigateur
  ```
  http://EXTERNAL_IP
  ```

- [ ] Vérifier les logs
  ```bash
  kubectl logs -f deployment/backend -n notes-universitaires
  kubectl logs -f deployment/frontend -n notes-universitaires
  kubectl logs -f deployment/postgres -n notes-universitaires
  ```

- [ ] Exécuter le script de santé
  ```bash
  ./scripts/check-health.sh
  ```

## 🤖 Phase 10 : Configuration CI/CD

- [ ] Créer une clé de service account
  ```bash
  cd terraform
  SA_EMAIL=$(terraform output -raw github_actions_service_account_email)
  gcloud iam service-accounts keys create ../github-actions-key.json \
    --iam-account=$SA_EMAIL
  cat ../github-actions-key.json | base64 > ../github-actions-key-base64.txt
  cd ..
  ```

- [ ] Configurer les secrets GitHub
  - [ ] Aller sur GitHub → Settings → Secrets and variables → Actions
  - [ ] Ajouter `GCP_PROJECT_ID`
  - [ ] Ajouter `GCP_SA_KEY` (contenu de github-actions-key-base64.txt)
  - [ ] Ajouter `GKE_CLUSTER_NAME`
  - [ ] Ajouter `GKE_REGION`

- [ ] Supprimer les fichiers de clés localement
  ```bash
  rm github-actions-key.json
  rm github-actions-key-base64.txt
  ```

- [ ] Commit et push le workflow
  ```bash
  git add .github/workflows/deploy-to-gke.yml
  git add terraform/
  git add k8s/
  git add scripts/
  git commit -m "Add complete CI/CD configuration"
  git push origin main
  ```

- [ ] Vérifier que le workflow s'exécute
  - [ ] Aller sur GitHub → Actions
  - [ ] Vérifier que le workflow "Deploy to GKE" s'exécute
  - [ ] Attendre la fin du déploiement

## ✅ Phase 11 : Post-déploiement

- [ ] Sauvegarder les informations importantes
  - [ ] URL de l'application
  - [ ] Credentials PostgreSQL (dans `secrets.txt`)
  - [ ] Commande de connexion au cluster
  - [ ] Email du service account GitHub Actions

- [ ] Configurer les alertes dans GCP
  - [ ] Console → Monitoring → Alerting

- [ ] Configurer les backups PostgreSQL
  - [ ] Planifier des snapshots réguliers

- [ ] Documenter pour l'équipe
  - [ ] URL de l'application
  - [ ] Procédure de rollback
  - [ ] Contacts en cas d'incident

## 🎉 Déploiement terminé !

Votre application est maintenant en production avec CI/CD automatique.

### Prochaines étapes recommandées

- [ ] Configurer un nom de domaine personnalisé
- [ ] Ajouter un certificat SSL (Let's Encrypt + Cert-Manager)
- [ ] Mettre en place le monitoring avancé
- [ ] Configurer les alertes
- [ ] Implémenter les backups automatiques
- [ ] Tester le processus de rollback
- [ ] Documenter les runbooks pour l'équipe
- [ ] Effectuer un drill de disaster recovery

---

## 🆘 En cas de problème

1. **Vérifier les logs**
   ```bash
   ./scripts/check-health.sh
   kubectl logs -f deployment/<app> -n notes-universitaires
   ```

2. **Consulter les événements**
   ```bash
   kubectl get events -n notes-universitaires --sort-by='.lastTimestamp'
   ```

3. **Rollback si nécessaire**
   ```bash
   kubectl rollout undo deployment/<app> -n notes-universitaires
   ```

4. **Nettoyer et recommencer**
   ```bash
   ./scripts/cleanup.sh --keep-cluster
   ./scripts/deploy.sh --skip-terraform
   ```

---

**📝 Note:** Sauvegardez cette checklist et les fichiers `secrets.txt` et `terraform-outputs.txt` dans un endroit sûr et sécurisé !