#!/bin/bash

# Script de vérification de la santé de l'application
# Usage: ./scripts/check-health.sh

set -e

# Couleurs
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo "======================================"
    echo -e "${BLUE}$1${NC}"
    echo "======================================"
}

print_ok() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_fail() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Récupérer le projet
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    print_fail "Aucun projet GCP configuré"
    exit 1
fi

print_header "VÉRIFICATION DE LA SANTÉ - Notes Universitaires"

# 1. Vérifier la connexion au cluster
print_header "1. Cluster Kubernetes"

if kubectl cluster-info >/dev/null 2>&1; then
    print_ok "Connexion au cluster réussie"
    kubectl get nodes
else
    print_fail "Impossible de se connecter au cluster"
    echo "Exécutez: cd terraform && \$(terraform output -raw kubectl_connection_command)"
    exit 1
fi

# 2. Vérifier le namespace
print_header "2. Namespace"

if kubectl get namespace notes-universitaires >/dev/null 2>&1; then
    print_ok "Namespace 'notes-universitaires' existe"
else
    print_fail "Namespace 'notes-universitaires' introuvable"
    exit 1
fi

# 3. Vérifier PostgreSQL
print_header "3. PostgreSQL"

POSTGRES_READY=$(kubectl get pods -n notes-universitaires -l app=postgres -o jsonpath='{.items[*].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "False")

if [ "$POSTGRES_READY" = "True" ]; then
    print_ok "PostgreSQL est opérationnel"
    
    # Tester la connexion
    POSTGRES_POD=$(kubectl get pod -l app=postgres -n notes-universitaires -o jsonpath='{.items[0].metadata.name}')
    if kubectl exec $POSTGRES_POD -n notes-universitaires -- pg_isready -U postgres >/dev/null 2>&1; then
        print_ok "PostgreSQL accepte les connexions"
    else
        print_warning "PostgreSQL ne répond pas aux requêtes"
    fi
else
    print_fail "PostgreSQL n'est pas prêt"
    kubectl get pods -l app=postgres -n notes-universitaires
fi

# 4. Vérifier le Backend
print_header "4. Backend"

BACKEND_READY=$(kubectl get pods -n notes-universitaires -l app=backend -o jsonpath='{.items[*].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "")

if echo "$BACKEND_READY" | grep -q "True"; then
    BACKEND_COUNT=$(echo "$BACKEND_READY" | wc -w)
    print_ok "Backend opérationnel ($BACKEND_COUNT pods)"
    
    # Tester le health endpoint
    BACKEND_POD=$(kubectl get pod -l app=backend -n notes-universitaires -o jsonpath='{.items[0].metadata.name}')
    if kubectl exec $BACKEND_POD -n notes-universitaires -- wget -q -O- http://localhost:3000/health >/dev/null 2>&1; then
        print_ok "Backend health endpoint répond"
    else
        print_warning "Backend health endpoint ne répond pas"
    fi
else
    print_fail "Backend n'est pas prêt"
    kubectl get pods -l app=backend -n notes-universitaires
fi

# 5. Vérifier le Frontend
print_header "5. Frontend"

FRONTEND_READY=$(kubectl get pods -n notes-universitaires -l app=frontend -o jsonpath='{.items[*].status.conditions[?(@.type=="Ready")].status}' 2>/dev/null || echo "")

if echo "$FRONTEND_READY" | grep -q "True"; then
    FRONTEND_COUNT=$(echo "$FRONTEND_READY" | wc -w)
    print_ok "Frontend opérationnel ($FRONTEND_COUNT pods)"
else
    print_fail "Frontend n'est pas prêt"
    kubectl get pods -l app=frontend -n notes-universitaires
fi

# 6. Vérifier le LoadBalancer
print_header "6. LoadBalancer et accès externe"

EXTERNAL_IP=$(kubectl get service frontend-service -n notes-universitaires -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")

if [ -n "$EXTERNAL_IP" ]; then
    print_ok "LoadBalancer IP: $EXTERNAL_IP"
    
    # Tester l'accès HTTP
    if curl -s -o /dev/null -w "%{http_code}" "http://$EXTERNAL_IP" | grep -q "200"; then
        print_ok "Application accessible via HTTP"
    else
        print_warning "Application ne répond pas via HTTP"
    fi
else
    print_fail "LoadBalancer IP non attribuée"
fi

# 7. Vérifier les ressources
print_header "7. Utilisation des ressources"

echo ""
echo "Nœuds du cluster:"
kubectl top nodes 2>/dev/null || print_warning "Metrics server non disponible"

echo ""
echo "Pods du namespace:"
kubectl top pods -n notes-universitaires 2>/dev/null || print_warning "Metrics server non disponible"

# 8. Événements récents
print_header "8. Événements récents"

kubectl get events -n notes-universitaires --sort-by='.lastTimestamp' | tail -10

# 9. Résumé
print_header "RÉSUMÉ"

echo ""
kubectl get all -n notes-universitaires

echo ""
if [ -n "$EXTERNAL_IP" ]; then
    echo "======================================"
    echo -e "${GREEN}🌐 Application accessible à:${NC}"
    echo "   http://$EXTERNAL_IP"
    echo "======================================"
fi

echo ""
print_ok "Vérification terminée"