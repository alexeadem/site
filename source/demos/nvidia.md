---
title: NVIDIA GPU Operator
---

<!-- <img src="/demos/images/nvidia.svg" width="100"> -->

> AI & ML

NVIDIA GPU Operator plays a crucial role in enabling organizations to harness the power of NVIDIA GPUs for AI and machine learning workloads in Kubernetes environments, leading to faster innovation, improved model performance, and greater efficiency in AI deployments.

QBO Kubernetes Engine (QKE) offers unparalleled performance for any ML and AI workloads, bypassing the constraints of traditional virtual machines. By deploying Kubernetes components using Docker-in-Docker technology, it grants direct access to hardware resources. This approach delivers the agility of the cloud while maintaining optimal performance.

[![QKE + NVIDIA GPU Operator + Kubernetes-in-Docker + Cgroups v2 - Part 1](https://i.ytimg.com/vi/nl7sWLsuDOI/hqdefault.jpg)](https://youtu.be/nl7sWLsuDOI)

## Prerequsites

| Dependency                                                                                                              | Validated or Included Version(s)                                                                                                                          | Notes |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| [Kubernetes](https://kubernetes.io/docs/home/)                                                                          | [v1.25.11](https://github.com/kubernetes/kubernetes/tree/release-1.25)                                                                                    |       |
| [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) | [v1.14.3](https://github.com/NVIDIA/nvidia-container-toolkit/releases/tag/v1.14.3)                                                                        |       |
| [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html)                   | [v23.9.1](https://github.com/NVIDIA/gpu-operator/releases/tag/v23.9.1)                                                                                    |       |
| NVIDIA Driver                                                                                                           | [535.129.03](https://www.nvidia.com/download/driverResults.aspx/213194/en-us/) [546.01](https://www.nvidia.com/download/driverResults.aspx/216365/en-us/) |       |
| [NVIDIA CUDA](https://docs.nvidia.com/cuda/)                                                                            | [12.2](https://developer.nvidia.com/cuda-12-2-0-download-archive)                                                                                         |       |
| OS                                                                                                                      | Linux, Windows 10, 11 (WSL2)                                                                                                                              |       |

## QBOT

### [Install](qbot)

### Run

```bash
./qbot gpu-operator
```

## Deploy

#### Kubernetes Cluster

> For this tutorial we are using `nvidia` as our cluster name

```bash
export NAME=nvidia
```

> Get qbo version to make sure we have access to qbo API

```bash
qbo version | jq .version[]?
```

> Add a K8s cluster with image v1.25.11. See [Kubeflow compatibility](ai_and_ml?id=kubeflow)

```bash
qbo add cluster $NAME -i hub.docker.com/kindest/node:v1.25.11 | jq
```

> Get nodes information using qbo API

```bash
qbo get nodes $NAME | jq .nodes[]?
```

> Configure kubectl

```bash
export KUBECONFIG=$HOME/.qbo/$NAME.cfg
```

> Get nodes with kubectl

```bash
kubectl get nodes
```

#### Nvidia GPU Operator

> Helm Chart

```bash
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia || true
helm repo update
helm install --wait --generate-name -n gpu-operator --create-namespace nvidia/gpu-operator --set driver.enabled=false

```

### Configure

#### Windows

> WSL2

###### PCI Labels

```bash
for i in $(kubectl get no --selector '!node-role.kubernetes.io/control-plane' -o json | jq -r '.items[].metadata.name'); do
        kubectl label node $i feature.node.kubernetes.io/pci-10de.present=true
done
```

###### Chart Templates

```bash
git clone https://github.com/alexeadem/qbot
cd qbot/gpu-operator
OUT=templates
kubectl apply -f $OUT/gpu-operator/crds.yaml
kubectl apply -f $OUT/gpu-operator/templates/
kubectl apply -f $OUT/gpu-operator/charts/node-feature-discovery/templates/
watch kubectl get pods

```

#### Vector Addition

##### Deploy

```
cat cuda/vectoradd.yaml
```

```yaml
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
```

```bash
kubectl apply -f cuda/vectoradd.yaml
```

##### Test

```bash
kubectl logs cuda-vectoradd
```

```
[Vector addition of 50000 elements]
Copy input data from the host memory to the CUDA device
CUDA kernel launch with 196 blocks of 256 threads
Copy output data from the CUDA device to the host memory
Test PASSED
Done
```
