---
title: MinIO on QBO - Deploying High-Performance Object Storage
---

## **Introduction**

MinIO is a high-performance, S3-compatible object storage system, ideal for cloud-native applications. Running MinIO on **QBO** provides **scalability, multi-architecture support (arm64 & amd64), and high availability**.

QBO's **Kubernetes in Docker** approach enhances **performance and portability**, making it an excellent choice for deploying MinIO. With **bare-metal efficiency, direct resource access, and self-contained cloud environments**, QBO ensures seamless MinIO operation in **private, public, air-gapped, on-prem, or hybrid environments**.

In this **demo**, we will walk through setting up a **distributed MinIO deployment** on QBO, configuring **external access**, and testing **data uploads** using `mc` (MinIO Client).

{% youtube xKMJdhqyuMs %}

---

## **1 Setting Up QBO Cluster**

First, we need a QBO Kubernetes cluster:

```bash
qbo version | jq .version[]?
```

Check if the cluster already exists:

```bash
qbo get cluster $(basename "$PWD") | jq -e '.clusters[]?'
```

If it does not exist, create one:

```bash
qbo add cluster $(basename "$PWD") -n 4 -i hub.docker.com/kindest/node:v1.32.0 | jq
```

Retrieve nodes:

```bash
qbo get nodes $(basename "$PWD") | jq .nodes[]?
```

Set Kubernetes configuration:

```bash
qbo get cluster $(basename "$PWD") -k | jq -r '.output[]?.kubeconfig | select( . != null)' > $HOME/.qbo/$(basename "$PWD").conf
export KUBECONFIG=$HOME/.qbo/$(basename "$PWD").conf
```

Verify nodes:

```bash
kubectl get nodes
```

---

## **2 Deploying Distributed MinIO**

Apply the **MinIO StatefulSet**:

```bash
cat distributed/minio-distributed-statefulset.yaml
kubectl apply -f distributed/minio-distributed-statefulset.yaml
```

Deploy the **headless service**:

```bash
cat distributed/minio-distributed-headless-service.yaml
kubectl apply -f distributed/minio-distributed-headless-service.yaml
```

Deploy the **LoadBalancer service** for external access:

```bash
cat distributed/minio-distributed-service.yaml
kubectl apply -f distributed/minio-distributed-service.yaml
```

Check the deployment:

```bash
kubectl get pods -n default
kubectl describe pod/minio -n default
kubectl logs pod/minio -n default
```

---

## **3 Installing MinIO Client (mc)**

If `mc` is not installed, install it dynamically:

```bash
ARCH=$(uname -m)
if [[ "$ARCH" == "x86_64" ]]; then ARCH="amd64"; elif [[ "$ARCH" == "aarch64" ]]; then ARCH="arm64"; else echo "Unsupported architecture: $ARCH"; exit 1; fi
cd ~
curl -sSL -o mc https://dl.min.io/client/mc/release/linux-$ARCH/mc
mkdir -p ~/.local/bin
sudo install -m 555 mc ~/.local/bin/mc
export PATH="~/.local/bin:$PATH"
```

---

## **4 Validating MinIO Service**

Check if MinIO’s **internal DNS resolution** is working:

```bash
kubectl run busybox --image=busybox:latest --restart=Never -it --rm -- nslookup minio.default.svc.cluster.local
```

Retrieve **external LoadBalancer IP**:

```bash
LB=$(kubectl get svc minio -n default --ignore-not-found -o json | jq -r '.spec.externalIPs[0] | select ( . != null)')
```

Test MinIO API:

```bash
curl -I http://$LB:9000
```

Configure MinIO Client (`mc`):

```bash
mc alias set myminio http://$LB:9000 minio minio123
mc admin info myminio
```

---

## **5 Uploading and Retrieving Data**

Create a new bucket:

```bash
mc mb myminio/mybucket
```

Upload a test file:

```bash
echo "Hello MinIO!" > testfile.txt
mc cp testfile.txt myminio/mybucket/
```

List stored objects:

```bash
mc ls myminio/mybucket/
```

---

## **6 Accessing MinIO Web UI**

MinIO’s **Web UI** runs on port `9001`. Access it via the LoadBalancer:

```
http://$LB:9001
```

Credentials:

- **User**: `minio`
- **Password**: `minio123`

{% preview 'Screenshot From 2025-01-30 01-42-23.png' %}

---

## **7 Why MinIO on QBO? Performance and Portability**

### **Performance Benefits**

- **Bare-Metal Efficiency** - QBO eliminates the overhead of traditional virtualization, ensuring MinIO runs at peak performance.
- **Direct Resource Access** - Containers in QBO get direct access to CPU, RAM, and GPUs, improving performance for data-intensive workloads.

### **Portability Advantages**

- **Versatile Deployment** - MinIO runs seamlessly on **on-prem, cloud, hybrid, and air-gapped environments**.
- **Self-Contained Cloud** - QBO simplifies Kubernetes management, making MinIO deployments more portable and independent.

---

## **8 Conclusion**

By deploying MinIO on QBO, we achieve **scalable, high-performance object storage** with full Kubernetes integration.

QBO’s **Kubernetes in Docker architecture** enhances **performance** and **portability**, making it an ideal choice for cloud-native applications.

Start using MinIO on QBO today for an efficient, high-performance, and scalable storage solution.
