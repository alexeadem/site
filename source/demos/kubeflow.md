---
title: Kubeflow
---

<!-- <img src="/demos/images/kubeflow.svg" width="100"> -->

##

Kubeflow plays a crucial role in democratizing AI by providing a unified platform that enables organizations to efficiently develop, deploy, and manage AI applications at scale.

QBO Kubernetes Engine (QKE) offers unparalleled performance for any ML and AI workloads, bypassing the constraints of traditional virtual machines. By deploying Kubernetes components using Docker-in-Docker technology, it grants direct access to hardware resources. This approach delivers the agility of the cloud while maintaining optimal performance.

{% youtube nl7sWLsuDOI %}

> The following instructions use the upstream Kubeflow project with `platform-agnostic-multi-user-pns` pipelines.

## Prerequisites

> Kubeflow v1.7.0 with Nvidia GPU support

| Dependency                                                           | Validated or Included Version(s) | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Kubernetes](https://github.com/kubernetes/kubernetes/tree/v1.25.11) | v1.25.11                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [Kubeflow](https://www.kubeflow.org/docs/releases/kubeflow-1.7/)     | v1.7.0                           | The autoscaling/v2beta2 API version of HorizontalPodAutoscaler is no longer served as of v1.26.Migrate manifests and API clients to use the autoscaling/v2 API version, available since v1.23. All existing persisted objects are accessible via the new API v1.25 [HorizontalPodAutoscaler not found on minikube when installing kubeflow](https://stackoverflow.com/questions/76502195/horizontalpodautoscaler-not-found-on-minikube-when-installing-kubeflow) |
| OS                                                                   | Linux, Windows 10, 11 (WSL2)     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

> Kubeflow v1.8.0 with Nvidia GPU support

| Dependency                                                           | Validated or Included Version(s) | Notes                                                                                    |
| -------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- |
| [Kubernetes](https://github.com/kubernetes/kubernetes/tree/v1.25.11) | v1.25.11                         |                                                                                          |
| [Kubeflow](https://www.kubeflow.org/docs/releases/kubeflow-1.8/)     | v1.8.0                           | [GPU Vendor not available error #7273](https://github.com/kubeflow/kubeflow/issues/7273) |
| OS                                                                   | Linux, Windows 10, 11 (WSL2)     |                                                                                          |

## QBOT

### [Install](qbot)

### Run

```bash
./qbot kubeflow help
Usage:
./qbot kubeflow {v1.7.0 | v1.8.0}
```

## Install

### [Nvidia GPU Operator](ai_and_ml?id=nvidia-gpu-operator)

### Kubeflow

```bash
cd $HOME
git clone https://github.com/kubeflow/manifests.git
cd manifests/
```

```bash
export KUBEFLOW_VERSION=v1.7.0
```

> `export KUBEFLOW_VERSION=v1.8.0` for version v1.8.0

```bash
git checkout $KUBEFLOW_VERSION
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash
while ! ./kustomize build example | kubectl apply -f -; do echo "Retrying to apply resources"; sleep 10; done
```

## Configure

### Kubeflow

### Patch Deployment

> Once this finishes we also need to patch the Kubeflow Pipelines service to not use Docker, otherwise our pipelines will get stuck and report Docker socket errors. This happens because despite us using Docker the Docker docket isn’t made available inside the kind cluster. So from Kubeflow’s perspective we are using containerd directly instead of Docker.

```bash
./kustomize build apps/pipeline/upstream/env/platform-agnostic-multi-user-pns | kubectl apply -f -
watch kubectl get pods -A
```

## Access

> Port forward

```bash
kubectl port-forward svc/istio-ingressgateway -n istio-system 8080:80

```

#### Linux

> You can then open your browser and navigate to http://127.0.0.1:8080 and login with the default credentials

#### Windows

> (WSL2)

> Under Windows Subsystem for Linux (WSL) you can install Google Chrome to access the product page

```bash
wget -O $HOME/google-chrome-stable_current_amd64.deb https://dl.>google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install $HOME/google-chrome-stable_current_amd64.deb
```

```
wsl.exe -e google-chrome http://127.0.0.1:8080
```

#### Kubeflow UI

> Default Credentials
>
> username: `user@example.com`
>
> password: `12341234`

<!-- ![kubeflow nvidia-smi](img/kubeflow_nvidia_smi.png) -->

### Related Content

[Unlocking AI & ML Metal Performance with QBO Kubernetes Engine (QKE) Part I - Deploying Nvidia GPU Operator](/blogs/nvidia_kubeflow_1)
[Unlocking AI & ML Metal Performance with QBO Kubernetes Engine (QKE) Part II - Deploying Kubeflow](/blogs/nvidia_kubeflow_2)

[Running Kubeflow inside Kind with GPU support](https://jacobtomlinson.dev/posts/2022/running-kubeflow-inside-kind-with-gpu-support/)
