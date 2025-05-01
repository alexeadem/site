---
title: ArgoCD on QBO - Future-Proofing CI/CD with QBO & ArgoCD
---

In today's rapidly evolving cloud-native landscape, flexibility and scalability are non-negotiable. **ArgoCD**, a declarative GitOps continuous delivery tool, is a game-changer for Kubernetes. But when combined with **QBO**, an innovative Kubernetes platform that bridges the gap between on-prem, private, and public cloud environments—including air-gapped deployments—it becomes a powerhouse for modern CI/CD workflows.

In this demo, we’ll explore how QBO enhances ArgoCD by providing **multi-architecture support (arm64 & amd64), seamless portability, and optimized performance on bare-metal infrastructures**. Let’s dive in!

{% youtube D5qQgEttraI %}

---

## Why QBO and ArgoCD Make a Perfect Match

Deploying applications consistently across different infrastructures is a challenge. Whether you're running **on-prem, in a private cloud, a public cloud, or an air-gapped environment**, QBO ensures that ArgoCD operates flawlessly. Here's why QBO stands out:

- **Effortless Cluster Management**: QBO simplifies the Kubernetes lifecycle, making it easy to create, manage, and scale clusters.
- **True Portability**: Deploy anywhere—**on-prem, in private and public clouds, or air-gapped environments**—without reconfiguration headaches.
- **Optimized Performance for Metal**: With **bare-metal optimizations**, QBO delivers maximum efficiency with minimal overhead.
- **Multi-Architecture Support**: Native support for **both arm64 and amd64**, ensuring flexibility across hardware platforms.
- **Seamless CI/CD Integration**: QBO enhances ArgoCD by offering **automated, secure, and scalable** deployments.

Now, let’s walk through a hands-on **demo of ArgoCD on QBO** to unlock these benefits.

## Hands-On: Deploying ArgoCD on QBO

### Step 1: Verify Your QBO Version

```bash
qbo version | jq .version[]?
```

### Step 2: Create a Kubernetes Cluster on QBO

```bash
qbo add cluster $(basename "$PWD") -i hub.docker.com/kindest/node:v1.32.0 | jq
```

### Step 3: Fetch Cluster Nodes

```bash
qbo get nodes $(basename "$PWD") | jq .nodes[]?
```

### Step 4: Configure Kubernetes Context

```bash
qbo get cluster $(basename "$PWD") -k | jq -r '.output[]?.kubeconfig | select( . != null)' > $HOME/.qbo/$(basename "$PWD").conf
export KUBECONFIG=$HOME/.qbo/$(basename "$PWD").conf
```

### Step 5: Verify Kubernetes Nodes

```bash
kubectl get nodes
```

### Step 6: Deploy ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Step 7: Expose ArgoCD via LoadBalancer

```bash
kubectl patch svc argocd-server -n argocd -p '{"spec": {"type": "LoadBalancer"}}'
```

### Step 8: Install the ArgoCD CLI

```bash
cd ~
curl -sSL -o argocd-linux-$(uname -m) https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-$(uname -m)
mkdir -p ~/.local/bin
sudo install -m 555 argocd-linux-$(uname -m) ~/.local/bin/argocd
export PATH="~/.local/bin:$PATH"
```

### Step 9: Retrieve ArgoCD Credentials

```bash
ARGOCD_PASSWORD=$(kubectl get secret -n argocd argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 --decode)
```

### Step 10: Log in to ArgoCD

```bash
LB=$(kubectl get svc argocd-server -n argocd --ignore-not-found -o json | jq -r '.spec.externalIPs[0] | select ( . != null)')
argocd login $LB --username admin --password $ARGOCD_PASSWORD --insecure
```

{% preview 'Screenshot From 2025-01-29 16-41-39.png' %}

### Step 11: Register Your Kubernetes Cluster with ArgoCD

```bash
CONTEXT=$(kubectl config get-contexts -o name)
argocd cluster add $CONTEXT
```

### Step 12: Deploy an Example Application

```bash
argocd app create guestbook --repo https://github.com/argoproj/argocd-example-apps.git --path guestbook --dest-server https://kubernetes.default.svc --dest-namespace default
argocd app sync guestbook
```

### Step 13: Expose the Guestbook UI

```bash
kubectl patch svc guestbook-ui -n default -p '{"spec": {"type": "LoadBalancer"}}'
LB=$(kubectl get svc guestbook-ui -n default --ignore-not-found -o json | jq -r '.spec.externalIPs[0] | select ( . != null)')
```

### Step 14: Access Your Deployed Application

```bash
printf "\033[1m%-8s\033[0m %-22s\n" "URL" "http://$LB"
```

{% preview 'Screenshot From 2025-01-29 16-44-00.png' %}

## Final Notes

Deploying **ArgoCD on QBO** is a game-changer for organizations looking for **scalability, security, and true multi-platform portability**. Whether you're operating **on-prem, in hybrid clouds, air-gapped environments, or on metal-optimized systems**, QBO ensures that your GitOps workflows remain consistent and efficient.

With **native support for arm64 and amd64 architectures**, **seamless CI/CD integration**, and **performance optimizations tailored for bare-metal deployments**, QBO is an ideal platform for **ArgoCD-based continuous delivery**. It removes infrastructure complexity so developers can focus on innovation.

Ready to take your deployments to the next level? Start leveraging **QBO and ArgoCD** today for a future-proof Kubernetes experience!
