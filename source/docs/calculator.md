---
title: QBO Metal Node Calculator
---

## Calculator

  
Cloud environments like AWS EKS operate on shared infrastructure. When you're told you have 2426 vCPUs, you aren't guaranteed full access to those resources all the time. Due to noisy neighbors, overcommit, and shared tenancy, sustained usage is often far lower (30–50%). Likewise, RAM allocations are not always 100% available or consistent.

In contrast, QBO metal nodes are fully dedicated, meaning compute and memory availability is stable and predictable. Additionally, because metal eliminates hypervisor overhead, workloads are 20–30% more efficient, needing fewer total cores to achieve the same performance.

This calculator translates your claimed vCPU and RAM allocations in a shared cloud environment into the equivalent number of dedicated QBO metal nodes. It accounts for actual usage, efficiency gains on bare metal, and the capacity of your chosen hardware to provide a realistic comparison.

{% raw %}
<div id="qbo-calculator">
  <style>
    #qbo-calculator {
      font-family: sans-serif;
      max-width: 800px;
      margin: 40px auto;
      line-height: 1.6;
    }

    #qbo-calculator label {
      display: block;
      margin-top: 12px;
      font-weight: bold;
    }

    #qbo-calculator input {
      width: 100%;
      padding: 6px;
      margin-top: 4px;
      border-radius: 5px;
      border-style: solid;
    }

    #qbo-calculator button {
      margin-top: 20px;
      padding: 10px 16px;
      border-radius: 5px;
      background: #4783ef;
      color: white;
      border: 0px;
      transition: background 0.2s ease-in-out;
    }

    #qbo-calculator button:hover {
      background: #3366cc;
      cursor: pointer;
    }

    #qbo-calculator table {
      margin-top: 24px;
      width: 100%;
      border-collapse: collapse;
    }

    #qbo-calculator th, #qbo-calculator td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
      width: 10%;
    }

    #qbo-calculator h2 {
      margin-top: 40px;
    }

    #qbo-calculator #qbo-legend {
      margin-top: 10px;
      font-size: 0.9em;
    }

    #qbo-calculator .qbo-legend-box {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 6px;
      vertical-align: middle;
    }

    #qbo-calculator input[type="number"] {
      -moz-appearance: textfield; /* Firefox */
    }

    #qbo-calculator input[type="number"]::-webkit-inner-spin-button,
    #qbo-calculator input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;  /* Chrome, Safari, Edge */
      margin: 0;
    }

    #qbo-graph-wrapper {
      width: 100%;
      max-width: 700px;
      overflow-x: auto;
    }

    #qbo-graph {
      width: 100%;
      height: auto;
      display: block;
    }
}

  </style>

  <label>
    Claimed vCPUs (EKS)
    <input type="number" id="claimedVCPUs" value="2426">
    <blockquote><p>These are virtual CPUs reported in AWS EKS. They are shared across tenants and not always available 100% of the time.</p></blockquote>
  </label>
  <hr>

  <label>
    Claimed RAM (GB) (EKS)
    <input type="number" id="claimedRAMGB" value="7369">
    <blockquote><p>The RAM allocated in the cloud, subject to variability and sharing.</p></blockquote>
  </label>
  <hr>

  <label>
    Average CPU Utilization (%)
    <input type="number" id="avgCPUUtilPercent" value="35">
    <blockquote><p>Estimate of how much CPU is actually being used over time (e.g. 30% means you’re only getting sustained compute 30% of the time).</p></blockquote>
  </label>
  <hr>

  <label>
    Average RAM Utilization (%)
    <input type="number" id="avgRAMUtilPercent" value="50">
    <blockquote><p>Same as CPU, this is the sustained average use of RAM.</p></blockquote>
  </label>
  <hr>

  <label>
    Bare Metal Efficiency Gain (%)
    <input disabled type="number" id="metalEfficiencyGainPercent" value="25">
    <blockquote><p>Due to dedicated resources and lower virtualization overhead, metal is often 20–30% more efficient.</p></blockquote>
  </label>
  <hr>

  <label>
    Bare Metal Node Cores
    <input disabled type="number" id="metalNodeVCPUs" value="96">
    <blockquote><p>Physical cores available per QBO metal server.</p></blockquote>
  </label>
  <hr>

  <label>
    Bare Metal Node RAM (GB)
    <input disabled type="number" id="metalNodeRAMGB" value="768">
    <blockquote><p>Amount of physical memory per QBO node.</p></blockquote>
  </label>

  <button onclick="qboCalculate()">Calculate</button>

  <div id="qbo-result"></div>


  <h2>Example Comparison: Cloud vs Metal Over Time</h2>
  <table>
    <tr><th>Metric</th><th>AWS EKS (Shared)</th><th>QBO Metal (Dedicated)</th></tr>
    <tr><td>vCPUs</td><td>2426 (shared)</td><td>672 physical cores</td></tr>
    <tr><td>Avg Available CPU</td><td>~849 (35%)</td><td>672 (100%)</td></tr>
    <tr><td>RAM</td><td>7369 GB</td><td>5376 GB</td></tr>
    <tr><td>Avg Available RAM</td><td>3684 GB (50%)</td><td>5376 GB</td></tr>
  </table>

  <div id="qbo-legend">
    <div class="qbo-legend-box" style="background-color: orange;"></div> EKS Shared (fluctuating CPU)<br>
    <div class="qbo-legend-box" style="background-color: green;"></div> QBO Metal (stable CPU)
  </div>

<div id="qbo-graph-wrapper" style="margin-top: 20px; border: 1px solid #ccc;">
  <canvas id="qbo-graph"></canvas>
</div>

  <script>
    function qboCalculate() {
      const claimedVCPUs = +document.getElementById('claimedVCPUs').value;
      const claimedRAMGB = +document.getElementById('claimedRAMGB').value;
      const avgCPUUtilPercent = +document.getElementById('avgCPUUtilPercent').value;
      const avgRAMUtilPercent = +document.getElementById('avgRAMUtilPercent').value;
      const metalEfficiencyGainPercent = +document.getElementById('metalEfficiencyGainPercent').value;
      const metalNodeVCPUs = +document.getElementById('metalNodeVCPUs').value;
      const metalNodeRAMGB = +document.getElementById('metalNodeRAMGB').value;

      const sustainedVCPUs = claimedVCPUs * (avgCPUUtilPercent / 100);
      const sustainedRAM = claimedRAMGB * (avgRAMUtilPercent / 100);

      const adjustedVCPUs = sustainedVCPUs * (1 - metalEfficiencyGainPercent / 100);
      const adjustedRAM = sustainedRAM * (1 - metalEfficiencyGainPercent / 100);

      const nodesByCPU = adjustedVCPUs / metalNodeVCPUs;
      const nodesByRAM = adjustedRAM / metalNodeRAMGB;

      const requiredNodes = Math.ceil(Math.max(nodesByCPU, nodesByRAM));
      const totalCores = requiredNodes * metalNodeVCPUs;
      const totalRAMGB = requiredNodes * metalNodeRAMGB;

      document.getElementById('qbo-result').innerHTML = `
        <table>
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Required Metal Nodes</td><td>${requiredNodes}</td></tr>
          <tr><td>Total Physical Cores</td><td>${totalCores}</td></tr>
          <tr><td>Total RAM</td><td>${totalRAMGB} GB</td></tr>
        </table>
      `;

      drawCanvas(avgCPUUtilPercent);
    }

    function drawCanvas(avgCPUUtilPercent) {
      const canvas = document.getElementById('qbo-graph');
      const ctx = canvas.getContext('2d');

      // Make the canvas responsive
      const width = canvas.clientWidth;
      const height = 240;
      canvas.width = width;
      canvas.height = height;

      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const bgColor = isDark ? '#000' : '#fff';
      const textColor = isDark ? '#fff' : '#000';
      const axisColor = textColor;
      const eksLineColor = 'orange';
      const qboLineColor = 'green';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      // Axes
      const leftPadding = 50;
      const bottomPadding = 20;
      const rightEdge = width - 10;
      const bottomEdge = height - bottomPadding;

      ctx.beginPath();
      ctx.moveTo(leftPadding, 20);
      ctx.lineTo(leftPadding, bottomEdge);
      ctx.lineTo(rightEdge, bottomEdge);
      ctx.strokeStyle = axisColor;
      ctx.stroke();

      // Y-axis labels
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      for (let i = 0; i <= 100; i += 20) {
        const y = bottomEdge - (i * 2);
        ctx.fillText(i + "%", 10, y + 4);
        ctx.beginPath();
        ctx.moveTo(leftPadding - 5, y);
        ctx.lineTo(leftPadding, y);
        ctx.strokeStyle = axisColor;
        ctx.stroke();
      }

      // X-axis labels
      ctx.fillText("Time →", width - 60, height - 5);
      ctx.fillText("CPU Availability (%)", width / 2 - 60, 15);

      // EKS fluctuating line (dashed)
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(leftPadding, bottomEdge - (avgCPUUtilPercent + Math.random() * 5) * 2);
      for (let x = leftPadding + 10; x <= rightEdge; x += 10) {
        const usage = avgCPUUtilPercent + Math.sin(x / 20) * 10 + (Math.random() * 5 - 2.5);
        ctx.lineTo(x, bottomEdge - usage * 2);
      }
      ctx.strokeStyle = eksLineColor;
      ctx.stroke();

      // QBO stable line (solid)
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(leftPadding, 20); // constant line at 100%
      ctx.lineTo(rightEdge, 20);
      ctx.strokeStyle = qboLineColor;
      ctx.stroke();
    }


    // Redraw canvas when theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const avg = +document.getElementById('avgCPUUtilPercent').value || 35;
      drawCanvas(avg);
    });

    window.onload = qboCalculate;
  </script>
</div>

{% endraw %}


## **QBO vs VM-Based Infrastructure Summary**

This document compares QBO on metal with VM-based infrastructure (such as EKS, EC2, or other cloud VMs) across four key operational areas: node draining, autoscaling, spot instance behavior, and container vs VM scaling.

| Aspect | VM-Based Infrastructure (e.g., EKS, EC2) | QBO on Metal |
| :---- | :---- | :---- |
| Node Draining | Can happen unexpectedly due to AWS maintenance or scaling. | You control it. No surprise evictions or reboots. |
| Autoscaling | Scales VMs (EC2/Fargate) which takes 1–3+ minutes. | Scales containers instantly on existing metal. |
| Spot Interruptions | Spot VMs can be interrupted with 2 minutes’ notice. | No spot concept. Your metal is reserved and dedicated. |
| Scaling Target | Scales virtual machines, then schedules containers. | Scales containers (processes) directly on Linux. |
| Latency to Scale | 60–180+ seconds — VMs must boot and join the cluster. | Milliseconds to seconds — containers on demand. |
| Overhead | High — VMs add resource overhead and complexity. | Minimal — no hypervisor, no nested OS. |
| Predictability | Shared environment — susceptible to external events. | Deterministic behavior — you fully control lifecycle. |
| Efficiency | Virtualized, shared CPU/RAM with hypervisor overhead. | Direct use of hardware resources. |
| Cost Consistency | VMs billed by the minute/hour, can spike with autoscale. | Flat cost per metal node — no surprise billing. |
| Best For | General-purpose cloud-native workloads with elasticity. | AI/ML, low-latency workloads, GPU-heavy apps, HPC. |

