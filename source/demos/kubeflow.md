---
title: Kubeflow
---

<!-- <img src="/demos/images/kubeflow.svg" width="100"> -->

Kubeflow plays a crucial role in democratizing AI by providing a unified, open-source platform that enables organizations to efficiently develop, deploy, and manage AI applications at scale. It abstracts the complexity of the machine learning lifecycle — from data processing to model serving — within a Kubernetes-native environment, making advanced AI workflows more accessible to teams of all sizes.

QBO complements this by democratizing the cloud itself. It gives organizations full control over their infrastructure — whether on-premises, in the cloud, or at the edge — with bare-metal GPU performance, simplified orchestration, and dramatically lower cost. By running Kubernetes-in-Docker (KinD) instead of relying on traditional virtualization, QBO eliminates overhead, enabling Kubeflow to launch faster, run more efficiently, and scale further — all without the complexity of hyperscalers.

{% youtube nl7sWLsuDOI %}

## Prerequisites

| Dependency   | Version Included / Validated                                                 | Notes           |
| ------------ | ---------------------------------------------------------------------------- | --------------- |
| Kubernetes   | [v1.32.3](https://github.com/kubernetes/kubernetes/tree/v1.32.3)             |                 |
| Kubeflow     | [v1.10.0](https://www.kubeflow.org/docs/releases/kubeflow-1.10/)             |                 |
| GPU Operator | [v25.3.0](https://github.com/NVIDIA/gpu-operator/tree/v25.3.0)               |                 |
| QBO API      | [v1.5.14](http://docs.qbo.io/news/2025/05/08/api-1-5-14-released/)           | Current release |
| Kustomize    | [v5.6.0](https://github.com/kubernetes-sigs/kustomize/tree/kustomize/v5.6.0) |                 |

## Single Command Install

### [QBOT](qbot)

```bash
./qbot 
```

> The following Kubeflow versions are supported for installation with qbot:

- `v1.7.0`
- `v1.8.0`
- `v1.9.0-rc.0`
- `v1.9.0-rc.2`
- `v1.10.0-rc.2`
- `v1.10.0`

## Step-by-Step Installation    

### 1. Create Kubernetes Cluster

```bash
qbo version | jq .version[]?
qbo add cluster kubeflow_v1_10_0_nvidia 
qbo add cluster kubeflow_v1_10_0_nvidia -i hub.docker.com/kindest/node:v1.32.3 | jq
qbo get nodes kubeflow_v1_10_0_nvidia | jq .nodes[]?
qbo get cluster kubeflow_v1_10_0_nvidia -k | jq -r '.output[]?.kubeconfig | select( . != null)' > /home/alex/.qbo/kubeflow_v1_10_0_nvidia.conf
export KUBECONFIG=/home/alex/.qbo/kubeflow_v1_10_0_nvidia.conf
kubectl get nodes
```

### 2. Install [NVIDIA GPU Operator](nvidia)

(Refer to QBO GPU documentation or use `qbot gpu install` if applicable.)

### 3. Install Kubeflow

```bash
cd $HOME
git clone https://github.com/kubeflow/manifests.git
cd manifests/
git fetch --all
git checkout v1.10.0
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
```

Apply the manifests:

```bash
while ! ./kustomize build example | kubectl apply --server-side --force-conflicts -f -; do echo "Retrying to apply resources"; sleep 20; done

./kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user | kubectl apply -f -
```

### 4. Configure Istio Ingress Gateway

```bash
kubectl patch svc istio-ingressgateway --type='json' -p '[{"op":"replace","path":"/spec/type","value":"LoadBalancer"}]' -n istio-system
```

Extract TLS certs:

```bash
kubectl get secret kubeflow-ingressgateway-certs -n istio-system -o jsonpath="{.data.tls\.crt}" | base64 -d
kubectl get secret kubeflow-ingressgateway-certs -n istio-system -o jsonpath="{.data.tls\.key}" | base64 -d
```

Apply RBAC and Gateway config:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: istio-ingressgateway-sds
  namespace: istio-system
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: istio-ingressgateway-sds
  namespace: istio-system
subjects:
- kind: ServiceAccount
  name: istio-ingressgateway-service-account
  namespace: istio-system
roleRef:
  kind: Role
  name: istio-ingressgateway-sds
  apiGroup: rbac.authorization.k8s.io
---
apiVersion: networking.istio.io/v1
kind: Gateway
metadata:
  name: kubeflow-gateway
  namespace: kubeflow
spec:
  selector:
    istio: ingressgateway
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "*"
  - port:
      number: 443
      name: https
      protocol: HTTPS
    tls:
      mode: SIMPLE
      credentialName: kubeflow-ingressgateway-certs
    hosts:
    - "*"
EOF
```

### 5. Final Steps

```bash
kubectl apply -f gateway.yaml
```

If `htpasswd` is not found:

```bash
sudo apt install apache2-utils
```

Restart Dex and patch password secret:

```bash
secret/dex-passwords patched
deployment.apps/dex restarted
```

## Access Your Kubeflow Dashboard

- **URL:** https://kubeflow.cloud.eadem.com  
- **Username:** `user@example.com`  
- **Password:** `20a67a9c-0a0d-11f0-b8a6-3e4691a9b80b`

> Open your browser and navigate to the URL above to log in with the default credentials.