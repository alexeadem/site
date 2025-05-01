---
title: Technology
---

## <i class='bx bxl-docker' ></i> Pure Containers

### VMs VS Containers

In traditional VM environments, kubernetes-based applications must go through multiple layers before they access bare metal resources (OS layer and hypervisor layer). This not only adds complexities to a setup, but causes significant performance impacts that can actually prohibit some applications (e.g. resource intensive ones that access GPUs, Disk I/O, CPU and RAM) from ever being moved to kubernetes in the first place.

Virtual machines also need to boot a complete operating system (OS) instance within the virtualized environment. This involves loading the guest OS kernel and initializing various system services. Booting a virtual machine can take significantly longer compared to starting a Docker container, as it involves more steps and requires more resources.

In contrast, Docker containers share the host's kernel. As a result, Docker containers can directly access CPU and RAM resources on the host machine without the need for virtualization overhead. GPU access from Docker containers can be achieved using the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) or the [NVIDIA GPU Operator](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html) in Kubernetes, which allows Docker containers to access NVIDIA GPUs installed on the host system. This is done through NVIDIA's GPU drivers and container runtime modification.

Docker containers do not require booting a separate OS instance like VMs. Instead, they start by launching the container runtime and the necessary container processes. As a result, they can be launched and started quickly, often in a matter of seconds.

In summary, Docker offers performance comparable to running processes directly on the OS, while also providing the benefits of their efficient isolation mechanisms in compute instances and kubernetes.

{% preview "vms_vs_containers.svg" %}

## <i class='bx bx-cloud'></i> AsyncAPI

QBO AsyncAPI transforms metal into a cloud-native computing platform. It operates on Linux-based commodity servers, overseeing Kubernetes-in-Docker (KinD) deployments within the QBO Kubernetes Engine (QKE).

In this unique setup, the traditional notion of a Kubernetes node, typically associated with a virtual or physical machine, is redefined as a Docker container within the QBO framework. Containerd runs within Docker, facilitating the deployment of an entire Kubernetes infrastructure as a self-contained process directly on the hardware.

Similarly, QBO AsyncAPI empowers Docker-in-Docker (DinD) deployments for compute instances, eliminating the need for conventional virtualization methods.

It leverages kernel technologies to contain external requirements related to networking, load balancing, storage, and security. The QBO realm consists of metal servers connected to a switch fabric without the need for traditional hardware routers, storage, and firewalls. Every single QBO host is capable of meeting these requirements with native kernel technology.

QBO AsyncAPI based on websockets plays a vital role in capturing real-time system states. QBO introduces the concept of 'mirrors' as focal points for websocket messages, enabling observers within the same 'mirror' to receive updates from relevant systems. Regardless of data origin or cloud component — be it Kubernetes, Docker, network, security, storage, registries, DNS etc... — QBO AsyncAPI consolidates pertinent data for mirror observers, ensuring an accurate real-time system represention.

{% preview "asyncapi.svg" %}
