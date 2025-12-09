# ====================================
# CONFIGURATION GCP DE BASE
# ====================================

variable "project_id" {
  description = "ID du projet GCP"
  type        = string
}

variable "region" {
  description = "Région GCP pour les ressources"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "Zone GCP pour les ressources"
  type        = string
  default     = "europe-west1-b"
}

variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
  default     = "production"
}

# ====================================
# CONFIGURATION CLUSTER GKE
# ====================================

variable "cluster_name" {
  description = "Nom du cluster GKE"
  type        = string
  default     = "notes-universitaires-cluster"
}

variable "kubernetes_version" {
  description = "Version de Kubernetes pour le cluster GKE (utilisez 'latest' pour la dernière version stable)"
  type        = string
  default     = "latest"
}

# ====================================
# CONFIGURATION DES NŒUDS
# ====================================

variable "node_count" {
  description = "Nombre de nœuds dans le node pool par défaut"
  type        = number
  default     = 3
}

variable "node_machine_type" {
  description = "Type de machine pour les nœuds (e2-medium = 2 vCPU, 4GB RAM)"
  type        = string
  default     = "e2-medium"
  
  validation {
    condition     = can(regex("^(e2-|n1-|n2-|n2d-)", var.node_machine_type))
    error_message = "Le type de machine doit être un type valide GCP (e2-medium, n1-standard-2, etc.)"
  }
}

variable "disk_size_gb" {
  description = "Taille du disque pour chaque nœud en GB"
  type        = number
  default     = 50
  
  validation {
    condition     = var.disk_size_gb >= 20 && var.disk_size_gb <= 1000
    error_message = "La taille du disque doit être entre 20 et 1000 GB"
  }
}

variable "use_preemptible_nodes" {
  description = "Utiliser des nœuds préemptibles (moins chers mais peuvent être arrêtés)"
  type        = bool
  default     = false
}

# ====================================
# AUTOSCALING
# ====================================

variable "min_node_count" {
  description = "Nombre minimum de nœuds pour l'autoscaling"
  type        = number
  default     = 1
  
  validation {
    condition     = var.min_node_count >= 1
    error_message = "Le nombre minimum de nœuds doit être au moins 1"
  }
}

variable "max_node_count" {
  description = "Nombre maximum de nœuds pour l'autoscaling"
  type        = number
  default     = 5
  
  validation {
    condition     = var.max_node_count >= 1
    error_message = "Le nombre maximum de nœuds doit être au moins 1"
  }
}

# ====================================
# CONFIGURATION RÉSEAU
# ====================================

variable "network_name" {
  description = "Nom du réseau VPC"
  type        = string
  default     = "notes-universitaires-vpc"
}

variable "subnet_name" {
  description = "Nom du sous-réseau"
  type        = string
  default     = "notes-universitaires-subnet"
}

variable "subnet_cidr" {
  description = "Plage CIDR pour le sous-réseau (10.0.0.0/24 = 256 IPs)"
  type        = string
  default     = "10.0.0.0/24"
  
  validation {
    condition     = can(cidrhost(var.subnet_cidr, 0))
    error_message = "Le subnet_cidr doit être une plage CIDR valide"
  }
}

variable "pods_cidr" {
  description = "Plage CIDR secondaire pour les pods (10.1.0.0/16 = 65536 IPs)"
  type        = string
  default     = "10.1.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.pods_cidr, 0))
    error_message = "Le pods_cidr doit être une plage CIDR valide"
  }
}

variable "services_cidr" {
  description = "Plage CIDR secondaire pour les services (10.2.0.0/16 = 65536 IPs)"
  type        = string
  default     = "10.2.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.services_cidr, 0))
    error_message = "Le services_cidr doit être une plage CIDR valide"
  }
}

# ====================================
# SÉCURITÉ
# ====================================

variable "authorized_networks" {
  description = "Liste des réseaux autorisés à accéder au master Kubernetes"
  type = list(object({
    cidr_block   = string
    display_name = string
  }))
  default = [
    {
      cidr_block   = "0.0.0.0/0"
      display_name = "All networks"
    }
  ]
  
  # Pour production, limitez l'accès :
  # default = [
  #   {
  #     cidr_block   = "203.0.113.0/24"
  #     display_name = "Office network"
  #   }
  # ]
}

variable "enable_private_nodes" {
  description = "Activer les nœuds privés (pas d'IP publique)"
  type        = bool
  default     = true
}

variable "enable_private_endpoint" {
  description = "Activer le endpoint privé (master accessible uniquement via IP privée)"
  type        = bool
  default     = false
}

variable "master_ipv4_cidr_block" {
  description = "CIDR pour le master privé (/28 minimum)"
  type        = string
  default     = "172.16.0.0/28"
  
  validation {
    condition     = can(cidrhost(var.master_ipv4_cidr_block, 0))
    error_message = "Le master_ipv4_cidr_block doit être une plage CIDR valide"
  }
}

# ====================================
# MONITORING ET LOGGING
# ====================================

variable "enable_monitoring" {
  description = "Activer Cloud Monitoring (surveillance des ressources)"
  type        = bool
  default     = true
}

variable "enable_logging" {
  description = "Activer Cloud Logging (collecte des logs)"
  type        = bool
  default     = true
}

# ====================================
# LABELS ET TAGS
# ====================================

variable "labels" {
  description = "Labels à appliquer aux ressources GCP"
  type        = map(string)
  default = {
    application = "notes-universitaires"
    managed_by  = "terraform"
  }
}