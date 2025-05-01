---
title: Nginx Ingress Controller
---

<img src="/demos/images/nginx.svg" width="100">

## Coffee & Tea Demo

### Prerequisites

In this demo we'll deploy a sample coffee & tea application with kubernetes ingress controller in qbo.

| Dependency                                                                   | Validated or Included Version(s)                                                                                      | Notes                                                                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [kubernetes ingress controller](https://github.com/kubernetes/ingress-nginx) | [v1.9.5](https://github.com/kubernetes/ingress-nginx/blob/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml) | [Supported Versions table](https://github.com/kubernetes/ingress-nginx?tab=readme-ov-file#supported-versions-table) |
| kubernetes                                                                   | v1.27.3                                                                                                               |                                                                                                                     |

https://github.com/kubernetes/ingress-nginx?tab=readme-ov-file#supported-versions-table

### QBOT

#### [Install](qbot)

#### Run

```bash
./qbot nginx
```

### Deploy

#### [Kubernetes Cluster](cluster_ops)

#### Ingress Controller

```bash
/usr/bin/kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.9.5/deploy/static/provider/cloud/deploy.yaml
```

#### Coffee & Tea App

```bash
/usr/bin/kubectl apply -f /home/alex/qbo-demo/coffee/ingress-nginx/cafe
```

### Configure

#### Patch Service

> Set [externalTrafficPolicy](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip) to `Cluster`

```bash
 kubectl patch svc  ingress-nginx-controller -p '{"spec":{"externalTrafficPolicy":"Cluster"}}' -n ingress-nginx
 kubectl patch svc ingress-nginx-controller --type='json' -p '[{"op":"replace","path":"/spec/type","value":"NodePort"}]' -n ingress-nginx
```

### Access

> Get Endpoint

#### Linux

```bash
NODEPORT=$(kubectl get svc -n ingress-nginx -o json | jq -r '.items[].spec.ports[]? | select( .port == 443) | select(.nodePort) | .nodePort')
NODELST=$(kubectl get nodes -o json | jq '.items[].status.addresses[] | select(.type=="InternalIP") | .address' | tr -d '\"' | tr '\n' ' ')
```

#### Windows

> (WSL2)

```bash
kubectl patch svc ingress-nginx-controller --type='json' -p '[{"op":"replace","path":"/spec/type","value":"ClusterIP"}]' -n ingress-nginx
kubectl port-forward svc/ingress-nginx-controller -n ingress-nginx 9443:443
```

### Test

> If the response code `200` the deployment was successful.

#### Linux

```bash
for i in $NODELST; do
        curl -kv -H 'host: cafe.example.com' https://$i:$NODEPORT/coffee
done
```

#### Windows

> (WSL2)

```bash
curl -k -m 3 --write-out '%{http_code}' --silent --output /dev/null -H 'host: cafe.example.com'  https://localhost:9443/tea
```

<!-- ## Service Mesh -->
