---
title: NVIDIA GPU Operator on QBO GPU Cloud
---

<!-- <img src="/demos/images/nvidia.svg" width="100"> -->

## Deploy NVIDIA GPU Operator on QBO Kubernetes Engine (QKE)

{% preview "nvidia.svg" %}

NVIDIA GPU Operator plays a crucial role in enabling organizations to harness the power of NVIDIA GPUs for AI and machine learning workloads in Kubernetes environments, leading to faster innovation, improved model performance, and greater efficiency in AI deployments.

QBO provides the ideal runtime environment for the NVIDIA GPU Operator by delivering bare-metal GPU access, container-native orchestration, and automated infrastructure provisioning—without virtualization overhead. By running Kubernetes-in-Docker (KinD), QBO enables the GPU Operator to fully utilize NVIDIA GPUs with high density and low latency, whether deployed on-premises, in the cloud, or in secure, air-gapped environments. This makes QBO a powerful foundation for scalable, GPU-accelerated AI infrastructure.

{% youtube nl7sWLsuDOI %}

## Prerequisites

| Dependency    | Version Included / Validated                                       | Notes           |
| ------------- | ------------------------------------------------------------------ | --------------- |
| Kubernetes    | [v1.32.3](https://github.com/kubernetes/kubernetes/tree/v1.32.3)   |                 |
| GPU Operator  | [v25.3.0](https://github.com/NVIDIA/gpu-operator/tree/v25.3.0)     |                 |
| QBO API       | [v1.5.14](http://docs.qbo.io/news/2025/05/08/api-1-5-14-released/) | Current release |
| NVIDIA Driver | 550.78                                                             |                 |
| CUDA Version  | 12.8                                                               |                 |

## Single Command Install

### [QBOT](qbot)

```bash
./qbot 
```

## Step-by-Step Installation

### 1. Create Kubernetes Cluster

```bash
qbo version | jq .version[]?
qbo add cluster nvidia_gpu_operator -i hub.docker.com/kindest/node:v1.32.3 | jq
qbo get nodes nvidia_gpu_operator | jq .nodes[]?
qbo get cluster nvidia_gpu_operator -k | jq -r '.output[]?.kubeconfig | select( . != null)' > /home/alex/.qbo/nvidia_gpu_operator.conf
export KUBECONFIG=/home/alex/.qbo/nvidia_gpu_operator.conf
kubectl get nodes
```

### 2. Install NVIDIA GPU Operator

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia || true
helm repo update
helm search repo gpu-operator
helm install --wait --generate-name -n gpu-operator --create-namespace nvidia/gpu-operator --set driver.enabled=false --set dcgmExporter.enabled=false
helm list -n gpu-operator
```

### 3. Deploy DCGM Exporter

```bash
cat <<EOF > dcgm.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nvidia-dcgm-exporter
  namespace: gpu-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nvidia-dcgm-exporter
  template:
    metadata:
      labels:
        app: nvidia-dcgm-exporter
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9400"
    spec:
      containers:
      - name: exporter
        image: nvcr.io/nvidia/k8s/dcgm-exporter:3.3.9-3.6.1-ubuntu22.04
        ports:
        - containerPort: 9400
        securityContext:
          privileged: true
          capabilities:
            add:
              - SYS_ADMIN
EOF

kubectl apply -f dcgm.yaml
```

### 4. Run CUDA Sample

```bash
cat <<EOF > cuda/vectoradd.yaml
apiVersion: v1
kind: Pod
metadata:
  name: cuda-vectoradd
spec:
  restartPolicy: OnFailure
  containers:
  - name: cuda-vectoradd
    image: "nvcr.io/nvidia/k8s/cuda-sample:vectoradd-cuda11.7.1-ubuntu20.04"
    resources:
      limits:
        nvidia.com/gpu: 1
EOF

kubectl apply -f cuda/vectoradd.yaml
kubectl logs cuda-vectoradd
```

Expected output:
```text
[Vector addition of 50000 elements]
Copy input data from the host memory to the CUDA device
CUDA kernel launch with 196 blocks of 256 threads
Copy output data from the CUDA device to the host memory
Test PASSED
Done
```