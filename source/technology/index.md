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

<!-- {% preview "vms_vs_containers.svg" %} -->
{% raw %}
<div class="technology-main-div">
<main>
  <div class="virtual-mac-header">
    <h1>Virtual Machines vs Containers within Containers</h1>
    <p>Architectural Differences and Performance Impact</p>
  </div>

  <div class="befor-after-main-div">
    <div class="before-impact">

      <div class="before-div-height" data-type="Application software">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line"/>
          <span class="dot"></span>
        </div>
        <h2 class="div-height">Application Software</h2>
      </div>

      <div class="before-div-height os-block" data-type="OS">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot"></span>
        </div>
        <h2 class="div-height">OS</h2>
      </div>

      <div class="before-div-height hypervisor-block" data-type="Hypervisor">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot"></span>
        </div>
        <h2 class="div-height">Hypervisor</h2>
      </div>

      <div class="before-div-height os-scnd-block" data-type="OS">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot"></span>
        </div>
        <h2 class="div-height">OS</h2>
      </div>

      <div class="before-div-height Bare-block" data-type="Bare Metal">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot"></span>
        </div>
        <h2 class="div-height">Bare Metal</h2>
        <span>GPU</span><br>
        <span>CPU</span><br>
        <span>Memory</span><br>
        <span>Disk</span><br>
      </div>
    </div>

    <div>
      <img 
        id="mainImage" 
        src="/images/Clip path group-1.svg" 
        alt="Architecture Diagram"
      >
    </div>

    <div class="after-impact">

      <div class="after-div-height" data-type="Application software">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot-left"></span>
        </div>
        <h2 class="div-height">Application Software</h2>
      </div>

      <div class="after-div-height r-os-block" data-type="OS">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot-left"></span>
        </div>
        <h2 class="div-height">OS</h2>
      </div>

      <div class="after-div-height last-Bare-block" data-type="Bare Metal">
        <div class="horizontal-line-with-dot">
          <hr class="custom-line">
          <span class="dot-left"></span>
        </div>
        <h2 class="div-height">Bare Metal</h2>
        <span>GPU</span><br>
        <span>CPU</span><br>
        <span>Memory</span><br>
        <span>Disk</span><br>
      </div>

    </div>
  </div>

  <div class="footer-content">
    <h2>BEFORE</h2>
    <h2>AFTER</h2>
  </div>
</main>
</div>
<script>
  const image = document.getElementById('mainImage');
  const blocks = document.querySelectorAll('.before-div-height, .after-div-height');
  const headingElements = document.querySelectorAll('.div-height');
  const customLines = document.querySelectorAll('.custom-line');
  const spanElements = document.querySelectorAll('.before-div-height span, .after-div-height span');

  function changeImage(type) {
    switch (type.toLowerCase()) {
      case 'application software':
        image.src = "/images/Clip path group.svg";
        break;
      case 'os':
        image.src = "/images/Clip path group (1).svg";
        break;
      case 'bare metal':
        image.src = "/images/bare matel.svg";
        break;
      case 'hypervisor':
        image.src = "/images/Clip path hyper.svg";
        break;
    }
  }

  function resetImage() {
    image.src = "/images/Clip path group-1.svg";
  }

  blocks.forEach(block => {
    const type = block.getAttribute('data-type').trim();

    block.addEventListener('mouseenter', () => {
      image.classList.add("zoom-in");
      changeImage(type);

      // Dim all
      headingElements.forEach(el => el.style.opacity = "0.2");
      customLines.forEach(line => line.style.opacity = "0.2");
      spanElements.forEach(span => span.style.opacity = "0.2");

      // Highlight all matching blocks
      headingElements.forEach(el => {
        if (el.textContent.trim().toLowerCase() === type.toLowerCase()) {
          el.style.opacity = "1";

          const line = el.previousElementSibling?.querySelector('.custom-line');
          if (line) line.style.opacity = "1";

          const spans = el.parentElement.querySelectorAll('span');
          spans.forEach(span => span.style.opacity = "1");
        }
      });
    });

    block.addEventListener('mouseleave', () => {
      image.classList.remove("zoom-in");
      resetImage();

      // Reset all
      headingElements.forEach(el => el.style.opacity = "1");
      customLines.forEach(line => line.style.opacity = "1");
      spanElements.forEach(span => span.style.opacity = "1");
    });
  });
</script>
{% endraw %}
## <i class='bx bx-cloud'></i> AsyncAPI

QBO AsyncAPI transforms metal into a cloud-native computing platform. It operates on Linux-based commodity servers, overseeing Kubernetes-in-Docker (KinD) deployments within the QBO Kubernetes Engine (QKE).

In this unique setup, the traditional notion of a Kubernetes node, typically associated with a virtual or physical machine, is redefined as a Docker container within the QBO framework. Containerd runs within Docker, facilitating the deployment of an entire Kubernetes infrastructure as a self-contained process directly on the hardware.

Similarly, QBO AsyncAPI empowers Docker-in-Docker (DinD) deployments for compute instances, eliminating the need for conventional virtualization methods.

It leverages kernel technologies to contain external requirements related to networking, load balancing, storage, and security. The QBO realm consists of metal servers connected to a switch fabric without the need for traditional hardware routers, storage, and firewalls. Every single QBO host is capable of meeting these requirements with native kernel technology.

QBO AsyncAPI based on websockets plays a vital role in capturing real-time system states. QBO introduces the concept of 'mirrors' as focal points for websocket messages, enabling observers within the same 'mirror' to receive updates from relevant systems. Regardless of data origin or cloud component — be it Kubernetes, Docker, network, security, storage, registries, DNS etc... — QBO AsyncAPI consolidates pertinent data for mirror observers, ensuring an accurate real-time system represention.
{% raw %}
 <div class="section-1">
         <div class="container">
            <div class="animation-img-main">
               <div class="engine-img">
                  <div class="engine-img-1">
                     <img src="/images/Main-Image-New.svg" alt="main-image">
                  </div>
                  <div class="engine-img-2">
                     <img src="/images/Main-Image-New-01.svg" alt="qke-image">
                  </div>
                  <div class="engine-img-3">
                     <img src="/images/Main-Image-New-02.svg" alt="qce-image">  
                  </div>
               </div>
               <div class="tab-image-main">
                  <div class="qke-col">
                     <img src="/images/QKE-New.svg" alt="main-image">
                  </div>
                  <div class="qke-col">
                     <img src="/images/QCE-New.svg" alt="main-image">
                  </div>
               </div>
            </div>
         </div>
      </div>
      <script>     

        document.addEventListener("DOMContentLoaded", function () {
         const images = document.querySelectorAll('.qke-col');

      images.forEach(item => {
      item.addEventListener('mouseover', function(event) {
         images.forEach(el => {
            el.style.opacity = (el === item) ? '1' : '0.2';
         });
      });

      item.addEventListener('mouseout', function(event) {
         images.forEach(el => {
            el.style.opacity = '1';
         });
      });
      });

       
   const engineImgs = {
      default: document.querySelector('.engine-img-1'),
      qke: document.querySelector('.engine-img-2'),
      qce: document.querySelector('.engine-img-3')
   };
 
   const qkeCols = document.querySelectorAll('.qke-col');
 
   function showImage(type) {
      Object.values(engineImgs).forEach(img => img.classList.remove('active'));
 
      if (type === 'qke') {
         engineImgs.qke.classList.add('active');
      } else if (type === 'qce') {
         engineImgs.qce.classList.add('active');
      } else {
         engineImgs.default.classList.add('active');
      }
   }
 
   showImage('default'); // Set initial
 
   qkeCols[0].addEventListener('mouseenter', () => showImage('qke'));
   qkeCols[1].addEventListener('mouseenter', () => showImage('qce'));
 
   qkeCols[0].addEventListener('mouseleave', () => showImage('default'));
   qkeCols[1].addEventListener('mouseleave', () => showImage('default'));
});


 
      </script>
{% endraw %}
<!-- {% preview "asyncapi.svg" %} -->
