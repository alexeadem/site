---
title: Nginx Ingress Controller
---

## Coffee & Tea Demo

{% preview "nginx.svg" %}

---

### Prerequisites

This demo deploys a sample Coffee & Tea application using the Kubernetes Ingress NGINX Controller in QBO.

| Dependency                                                                     | Version                                                                                              | Notes                                                                                                               |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Kubernetes Ingress Controller](https://github.com/kubernetes/ingress-nginx)   | [v1.9.5](https://github.com/kubernetes/ingress-nginx/blob/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml) | [Supported Versions](https://github.com/kubernetes/ingress-nginx?tab=readme-ov-file#supported-versions-table) |
| Kubernetes                                                                      | v1.27.3                                                                                               |                                                                                                                     |

---

### Deployment Options

#### Option 1: Deploy with QBOT (One-line)

```bash
./qbot nginx
```

This command sets up the full stack including the cluster, ingress controller, and the Coffee & Tea app.

---

#### Option 2: Manual Step-by-Step Deployment

---

### Step 1: Deploy Kubernetes Cluster

See [Cluster Deployment Guide](/docs/qke#Quick-Start)

---

### Step 2: Install the Ingress Controller

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml
```

---

### Step 3: Deploy the Coffee & Tea App

```bash
kubectl apply -f /home/alex/qbo-demo/coffee/ingress-nginx/cafe
```

---

### Step 4: Patch the Ingress Service

```bash
kubectl patch svc ingress-nginx-controller -n ingress-nginx -p '{"spec":{"externalTrafficPolicy":"Cluster"}}'
kubectl patch svc ingress-nginx-controller -n ingress-nginx --type='json' -p '[{"op":"replace","path":"/spec/type","value":"NodePort"}]'
```

---

### Step 5: Access the App

#### On Linux

```bash
NODEPORT=$(kubectl get svc -n ingress-nginx -o json \
  | jq -r '.items[].spec.ports[]? | select(.port == 443 and .nodePort) | .nodePort')

NODELST=$(kubectl get nodes -o json \
  | jq -r '.items[].status.addresses[] | select(.type=="InternalIP") | .address')

for ip in $NODELST; do
  echo "https://$ip:$NODEPORT"
done
```

#### On Windows (WSL2)

```bash
kubectl patch svc ingress-nginx-controller -n ingress-nginx --type='json' -p '[{"op":"replace","path":"/spec/type","value":"ClusterIP"}]'
kubectl port-forward svc/ingress-nginx-controller -n ingress-nginx 9443:443
```

---

### Step 6: Test

```bash
for ip in $NODELST; do
  curl -kv -H 'host: cafe.example.com' https://$ip:$NODEPORT/coffee
done
```