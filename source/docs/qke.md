---
title: Kubernetes Engine (QKE)
---

QKE is qbo's Kubernetes service. Kubernetes has emerged as the industry standard for modern cloud computing, yet its deployment and management complexities are well-known. Traditional approaches often rely on virtual machines, introducing performance challenges and unnecessary overhead.

Enter qbo—the solution that unleashes the true potential of cloud computing. With a single AsyncAPI across clouds and on-prem, qbo streamlines the deployment and management of cloud resources in Kubernetes, all while delivering unparalleled bare metal performance with Docker-in-Docker (DinD) deployments. This approach not only simplifies but also accelerates the adoption of modern cloud computing.

QBO is tailored for the demands of resource-intensive environments, making it an optimal choice for AI and ML workloads. Its commitment to optimized performance ensures that your cloud infrastructure meets the unique requirements of advanced computing applications. Embrace the future of cloud computing effortlessly with qbo.

{% youtube GHWOOimIfkU %}

### Quick Start

#### Get Version

```bash
qbo version | jq .version[]?
```

```json
{
  "qbo_cli": "dev-4.3.0-6efb3214c"
}
{
  "docker_api": "1.41",
  "docker_version": "20.10.23",
  "qbo_api": "cloud-dev-4.3.0-76da24342",
  "host": "lux.cloud.qbo.io"
}
```

#### Add Cluster

```bash
export CLUSTER_NAME=alex
qbo add cluster $CLUSTER_NAME -i hub.docker.com/kindest/node:v1.27.3 | jq
```

#### Get Nodes

```bash
qbo get nodes $CLUSTER_NAME | jq .nodes[]?
```

```json
{
  "name": "control-2b4e4848.localhost",
  "id": "0c20025cd1947252881eaefbbb2ebbd31893c3263fd28826b766fc3ce4fecd7d",
  "image": "kindest/node:v1.28.0",
  "cluster": "alex",
  "state": "ready",
  "address": "172.18.0.3",
  "os": "Debian GNU/Linux 11 (bullseye)",
  "kernel": "6.4.4-200.fc38.x86_64",
  "user": "qbot@qbo.io",
  "cluster_id": "0a3db628-d9d3-46a5-81d8-281e727d8e6c"
}
{
  "name": "node-69fad8d5.localhost",
  "id": "bce293a5bad56200f2c1574919b0a67ce9761e0ee3071dc7530c02fc12f3ae79",
  "image": "kindest/node:v1.28.0",
  "cluster": "alex",
  "state": "ready",
  "address": "172.18.0.4",
  "os": "Debian GNU/Linux 11 (bullseye)",
  "kernel": "6.4.4-200.fc38.x86_64",
  "user": "qbot@qbo.io",
  "cluster_id": "0a3db628-d9d3-46a5-81d8-281e727d8e6c"
}
{
  "name": "node-c0dbf9c8.localhost",
  "id": "2b2c2e39140d1bc61577f16907c93f0703fcc45352433f18578701e3e4c3ec19",
  "image": "kindest/node:v1.28.0",
  "cluster": "alex",
  "state": "ready",
  "address": "172.18.0.5",
  "os": "Debian GNU/Linux 11 (bullseye)",
  "kernel": "6.4.4-200.fc38.x86_64",
  "user": "qbot@qbo.io",
  "cluster_id": "0a3db628-d9d3-46a5-81d8-281e727d8e6c"
}
```

#### Get Kubeconfig

```bash
qbo get cluster $CLUSTER_NAME -k | jq -r '.output[]?.kubeconfig | select( . != null)' > $HOME/.qbo/$CLUSTER_NAME.cfg
export KUBECONFIG=$HOME/.qbo/$CLUSTER_NAME.cfg
```

```bash
kubectl get nodes
```

```
NAME                         STATUS   ROLES           AGE   VERSION
control-2b4e4848.localhost   Ready    control-plane   17m   v1.28.0
node-69fad8d5.localhost      Ready    <none>          16m   v1.28.0
node-c0dbf9c8.localhost      Ready    <none>          16m   v1.28.0
```
