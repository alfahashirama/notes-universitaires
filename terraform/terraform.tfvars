# Fichier d'exemple pour terraform.tfvars
# Copiez ce fichier vers terraform.tfvars et remplissez vos valeurs

# Configuration GCP
project_id = "votre-project-id-gcp"
region     = "europe-west1"
zone       = "europe-west1-b"

# Configuration du cluster
cluster_name        = "notes-universitaires-cluster"
environment         = "production"
kubernetes_version  = "latest"

# Configuration des nœuds (si non-Autopilot)
enable_autopilot    = false
node_count          = 3
node_machine_type   = "e2-medium"
disk_size_gb        = 50
min_node_count      = 1
max_node_count      = 5

# Configuration réseau
network_name = "notes-universitaires-vpc"
subnet_name  = "notes-universitaires-subnet"
subnet_cidr  = "10.0.0.0/24"
pods_cidr    = "10.1.0.0/16"
services_cidr = "10.2.0.0/16"

# Sécurité - Restreindre l'accès au master (recommandé en production)
authorized_networks = [
  {
    cidr_block   = "0.0.0.0/0"
    display_name = "All networks"
  }
  # Ajoutez vos IPs spécifiques:
  # {
  #   cidr_block   = "203.0.113.0/24"
  #   display_name = "Office network"
  # }
]

# Configuration privée
enable_private_nodes    = true
enable_private_endpoint = false
master_ipv4_cidr_block  = "172.16.0.0/28"

# Monitoring et logging
enable_monitoring = true
enable_logging    = true

# Labels
labels = {
  application = "notes-universitaires"
  managed_by  = "terraform"
  team        = "devops"
}