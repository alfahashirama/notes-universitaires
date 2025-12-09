output "project_id" {
  description = "ID du projet GCP"
  value       = var.project_id
}

output "region" {
  description = "Région GCP utilisée"
  value       = var.region
}

output "zone" {
  description = "Zone GCP utilisée"
  value       = var.zone
}

# Informations du cluster GKE
output "cluster_name" {
  description = "Nom du cluster GKE"
  value       = google_container_cluster.primary.name
}

output "cluster_endpoint" {
  description = "Endpoint du cluster GKE"
  value       = google_container_cluster.primary.endpoint
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "Certificat CA du cluster"
  value       = google_container_cluster.primary.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

output "cluster_location" {
  description = "Location du cluster GKE"
  value       = google_container_cluster.primary.location
}

output "cluster_version" {
  description = "Version de Kubernetes du cluster"
  value       = google_container_cluster.primary.master_version
}

# Commande pour se connecter au cluster
output "kubectl_connection_command" {
  description = "Commande pour configurer kubectl"
  value       = "gcloud container clusters get-credentials ${google_container_cluster.primary.name} --region ${var.region} --project ${var.project_id}"
}

# Informations réseau
output "network_name" {
  description = "Nom du réseau VPC"
  value       = google_compute_network.vpc.name
}

output "subnet_name" {
  description = "Nom du sous-réseau"
  value       = google_compute_subnetwork.subnet.name
}

output "nat_ip" {
  description = "Adresse IP NAT externe"
  value       = google_compute_address.nat.address
}

# Service Accounts
output "gke_service_account_email" {
  description = "Email du service account des nœuds GKE"
  value       = google_service_account.gke_nodes.email
}

output "github_actions_service_account_email" {
  description = "Email du service account pour GitHub Actions"
  value       = google_service_account.github_actions.email
}

# Buckets GCS
output "terraform_state_bucket" {
  description = "Nom du bucket pour le state Terraform"
  value       = google_storage_bucket.terraform_state.name
}

output "postgres_backups_bucket" {
  description = "Nom du bucket pour les backups PostgreSQL"
  value       = google_storage_bucket.postgres_backups.name
}

# Artifact Registry
output "artifact_registry_repository" {
  description = "Nom du repository Artifact Registry"
  value       = google_artifact_registry_repository.docker_repo.name
}

output "artifact_registry_location" {
  description = "Location du repository Artifact Registry"
  value       = google_artifact_registry_repository.docker_repo.location
}

output "docker_registry_url" {
  description = "URL du registre Docker"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
}

# Kubernetes namespace
output "kubernetes_namespace" {
  description = "Namespace Kubernetes créé"
  value       = kubernetes_namespace.notes_universitaires.metadata[0].name
}

# Node Pool (si non-Autopilot)
output "node_pool_name" {
  description = "Nom du node pool principal"
  value       = var.enable_autopilot ? "autopilot" : google_container_node_pool.primary_nodes[0].name
}

output "node_pool_machine_type" {
  description = "Type de machine des nœuds"
  value       = var.enable_autopilot ? "autopilot" : var.node_machine_type
}

output "node_pool_size" {
  description = "Configuration d'autoscaling du node pool"
  value = var.enable_autopilot ? "autopilot" : {
    min = var.min_node_count
    max = var.max_node_count
    current = var.node_count
  }
}

# Informations pour GitHub Actions
output "github_actions_setup" {
  description = "Instructions pour configurer GitHub Actions"
  value = <<-EOT
    Pour configurer GitHub Actions:
    
    1. Créer une clé pour le service account:
       gcloud iam service-accounts keys create key.json \
         --iam-account=${google_service_account.github_actions.email}
    
    2. Ajouter les secrets suivants dans GitHub:
       - GCP_PROJECT_ID: ${var.project_id}
       - GCP_SA_KEY: contenu de key.json (en base64)
       - GKE_CLUSTER_NAME: ${google_container_cluster.primary.name}
       - GKE_REGION: ${var.region}
       - ARTIFACT_REGISTRY: ${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}
    
    3. Utiliser Workload Identity (recommandé):
       gcloud iam service-accounts add-iam-policy-binding \
         ${google_service_account.github_actions.email} \
         --role=roles/iam.workloadIdentityUser \
         --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL_ID/attribute.repository/USERNAME/REPO"
  EOT
}

# Résumé de l'infrastructure
output "infrastructure_summary" {
  description = "Résumé de l'infrastructure déployée"
  value = {
    cluster = {
      name     = google_container_cluster.primary.name
      location = google_container_cluster.primary.location
      version  = google_container_cluster.primary.master_version
      mode     = var.enable_autopilot ? "Autopilot" : "Standard"
    }
    network = {
      vpc    = google_compute_network.vpc.name
      subnet = google_compute_subnetwork.subnet.name
    }
    storage = {
      terraform_state = google_storage_bucket.terraform_state.name
      postgres_backup = google_storage_bucket.postgres_backups.name
    }
    registry = {
      name = google_artifact_registry_repository.docker_repo.name
      url  = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.docker_repo.repository_id}"
    }
  }
}