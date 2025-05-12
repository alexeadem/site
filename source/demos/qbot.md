---
title: Demos
---

## QBO Demo Runner (`qbot`)

{% preview "qbot.svg" %}

QBO provides a demo repository containing ready-to-run examples that can be deployed directly into your QBO environment. These demos are executed using an interactive typing bot named `qbot`.

When you launch `qbot`, it will type out each command as if you were entering it manually—executing real commands in real time. This makes it easy to follow along and understand the steps involved, while safely automating the setup of each demo.

---

### Installation

Clone the demo repository and navigate into it:

```bash
git clone https://github.com/alexeadem/qbot
cd qbot
```

---

### Running a Demo

To start the qbot run:

```bash
./qbot
```

Just press `Enter` to proceed through each step as `qbot` types out the commands for you.

---

### Available Demos

- `istio` — Deploy Istio Service Mesh
- `nginx` — Deploy a sample NGINX workload
- `kubeconfig` — Set up and manage kubeconfig access
- `nvidia` — Deploy NVIDIA GPU Operator
- `kubeflow` — Deploy the Kubeflow AI/ML platform

---

> All commands executed by `qbot` are real—nothing is simulated. You can stop at any time and inspect each command before it runs.
