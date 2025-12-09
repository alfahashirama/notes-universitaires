# ====================================
# ACTIVATION DES APIs GCP
# ====================================
resource "google_project_service" "required_apis" {
  for_each = toset([
    "container.googleapis.com",
    "compute.googleapis.com",
    "servicenetworking.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "artifactregistry.googleapis.com",
    "storage-api.googleapis.com",
  ])

  service            = each.value
  project            = var.project_id
  disable_on_destroy = false
}

# ====================================
# RÉSEAU VPC
# ====================================
resource "google_compute_network" "vpc" {
  name                    = var.network_name
  auto_create_subnetworks = false
  project                 = var.project_id

  depends_on = [google_project_service.required_apis]
}

# Sous-réseau avec plages secondaires pour les pods et services
resource "google_compute_subnetwork" "subnet" {
  name          = var.subnet_name
  ip_cidr_range = var.subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = var.pods_cidr
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = var.services_cidr
  }

  private_ip_google_access = true
}

# ====================================
# CLOUD NAT POUR ACCÈS INTERNET
# ====================================
resource "google_compute_address" "nat" {
  name    = "${var.cluster_name}-nat-ip"
  region  = var.region
  project = var.project_id

  depends_on = [google_project_service.required_apis]
}

resource "google_compute_router" "router" {
  name    = "${var.cluster_name}-router"
  region  = var.region
  network = google_compute_network.vpc.id
  project = var.project_id
}

resource "google_compute_router_nat" "nat" {
  name                               = "${var.cluster_name}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  nat_ip_allocate_option             = "MANUAL_ONLY"
  nat_ips                            = [google_compute_address.nat.self_link]
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# ====================================
# SERVICE ACCOUNTS
# ====================================

# Service Account pour les nœuds GKE
resource "google_service_account" "gke_nodes" {
  account_id   = "${var.cluster_name}-nodes-sa"
  display_name = "Service Account for GKE nodes"
  project      = var.project_id

  depends_on = [google_project_service.required_apis]
}

# Rôles IAM pour le Service Account des nœuds
resource "google_project_iam_member" "gke_node_roles" {
  for_each = toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/artifactregistry.reader",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.gke_nodes.email}"
}

# Service Account pour GitHub Actions
resource "google_service_account" "github_actions" {
  account_id   = "github-actions-deployer"
  display_name = "Service Account for GitHub Actions CI/CD"
  project      = var.project_id

  depends_on = [google_project_service.required_apis]
}

# Rôles IAM pour GitHub Actions
resource "google_project_iam_member" "github_actions_roles" {
  for_each = toset([
    "roles/container.developer",
    "roles/artifactregistry.writer",
    "roles/storage.objectAdmin",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.github_actions.email}"
}

# ====================================
# CLUSTER GKE
# ====================================
resource "google_container_cluster" "primary" {
  name     = var.cluster_name
  location = var.region
  project  = var.project_id

  # Supprimer le node pool par défaut
  remove_default_node_pool = true
  initial_node_count       = 1

  # Version de Kubernetes
  min_master_version = var.kubernetes_version

  # Réseau
  network    = google_compute_network.vpc.name
  subnetwork = google_compute_subnetwork.subnet.name

  # Configuration IP
  ip_allocation_policy {
    cluster_secondary_range_name  = "pods"
    services_secondary_range_name = "services"
  }

  # Configuration privée
  private_cluster_config {
    enable_private_nodes    = var.enable_private_nodes
    enable_private_endpoint = var.enable_private_endpoint
    master_ipv4_cidr_block  = var.master_ipv4_cidr_block
  }

  # Réseaux autorisés pour accéder au master
  master_authorized_networks_config {
    dynamic "cidr_blocks" {
      for_each = var.authorized_networks
      content {
        cidr_block   = cidr_blocks.value.cidr_block
        display_name = cidr_blocks.value.display_name
      }
    }
  }

  # Workload Identity
  workload_identity_config {
    workload_pool = "${var.project_id}.svc.id.goog"
  }

  # Addons
  addons_config {
    http_load_balancing {
      disabled = false
    }
    horizontal_pod_autoscaling {
      disabled = false
    }
    network_policy_config {
      disabled = false
    }
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }
  }

  # Network Policy
  network_policy {
    enabled  = true
    provider = "PROVIDER_UNSPECIFIED"
  }

  # Maintenance window
  maintenance_policy {
    daily_maintenance_window {
      start_time = "03:00"
    }
  }

  # Monitoring
  monitoring_config {
    enable_components = var.enable_monitoring ? ["SYSTEM_COMPONENTS", "WORKLOADS"] : []
    
    managed_prometheus {
      enabled = var.enable_monitoring
    }
  }

  # Logging
  logging_config {
    enable_components = var.enable_logging ? ["SYSTEM_COMPONENTS", "WORKLOADS"] : []
  }

  # Labels
  resource_labels = merge(var.labels, {
    environment = var.environment
  })

  depends_on = [
    google_project_service.required_apis,
    google_compute_subnetwork.subnet,
    google_service_account.gke_nodes,
  ]
}

# ====================================
# NODE POOL
# ====================================
resource "google_container_node_pool" "primary_nodes" {
  name       = "${var.cluster_name}-node-pool"
  location   = var.region
  cluster    = google_container_cluster.primary.name
  project    = var.project_id
  node_count = var.node_count

  # Autoscaling
  autoscaling {
    min_node_count = var.min_node_count
    max_node_count = var.max_node_count
  }

  # Node configuration
  node_config {
    preemptible  = var.use_preemptible_nodes
    machine_type = var.node_machine_type
    disk_size_gb = var.disk_size_gb
    disk_type    = "pd-standard"

    service_account = google_service_account.gke_nodes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]

    labels = merge(var.labels, {
      environment = var.environment
    })

    tags = ["gke-node", "${var.cluster_name}-node"]

    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    metadata = {
      disable-legacy-endpoints = "true"
    }
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }

  upgrade_settings {
    max_surge       = 1
    max_unavailable = 0
  }

  depends_on = [google_container_cluster.primary]
}

# ====================================
# ARTIFACT REGISTRY
# ====================================
resource "google_artifact_registry_repository" "docker_repo" {
  location      = var.region
  repository_id = "notes-universitaires"
  description   = "Docker repository for notes-universitaires application"
  format        = "DOCKER"
  project       = var.project_id

  depends_on = [google_project_service.required_apis]
}

# ====================================
# BUCKETS GCS
# ====================================

# Bucket pour le state Terraform
resource "google_storage_bucket" "terraform_state" {
  name          = "${var.project_id}-terraform-state"
  location      = var.region
  project       = var.project_id
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      num_newer_versions = 5
    }
    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.required_apis]
}

# Bucket pour les backups PostgreSQL
resource "google_storage_bucket" "postgres_backups" {
  name          = "${var.project_id}-postgres-backups"
  location      = var.region
  project       = var.project_id
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }

  depends_on = [google_project_service.required_apis]
}

# ====================================
# CONFIGURATION KUBERNETES
# ====================================

# Namespace
resource "kubernetes_namespace" "notes_universitaires" {
  metadata {
    name = "notes-universitaires"
    labels = {
      name        = "notes-universitaires"
      environment = var.environment
    }
  }

  depends_on = [
    google_container_cluster.primary,
    google_container_node_pool.primary_nodes
  ]
}

# StorageClass pour les PV
resource "kubernetes_storage_class" "standard" {
  metadata {
    name = "standard"
  }

  storage_provisioner = "kubernetes.io/gce-pd"
  reclaim_policy      = "Retain"
  
  parameters = {
    type             = "pd-standard"
    replication-type = "none"
  }

  allow_volume_expansion = true

  depends_on = [
    google_container_cluster.primary,
    google_container_node_pool.primary_nodes
  ]
}