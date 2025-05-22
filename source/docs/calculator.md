---
title: QBO Metal Node Calculator
---

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

  <h2>Explanation</h2>
  <p>
    Cloud environments like AWS EKS operate on <strong>shared infrastructure</strong>. When you're told you have 2426 vCPUs, you aren't guaranteed full access to those resources all the time. Due to noisy neighbors, overcommit, and shared tenancy, <strong>sustained usage</strong> is often far lower (30–50%). Likewise, RAM allocations are not always 100% available or consistent.
  </p>
  <p>
    In contrast, <strong>QBO metal nodes are fully dedicated</strong>, meaning compute and memory availability is stable and predictable. Additionally, because metal eliminates hypervisor overhead, workloads are <strong>20–30% more efficient</strong>, needing fewer total cores to achieve the same performance.
  </p>

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

  <canvas id="qbo-graph" width="700" height="240" style="margin-top: 20px; border: 1px solid #ccc;"></canvas>

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
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const bgColor = isDark ? '#000' : '#fff';
      const textColor = isDark ? '#fff' : '#000';
      const axisColor = textColor;
      const eksLineColor = 'orange';
      const qboLineColor = 'green';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.moveTo(50, 20);
      ctx.lineTo(50, 220);
      ctx.lineTo(690, 220);
      ctx.strokeStyle = axisColor;
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      for (let i = 0; i <= 100; i += 20) {
        const y = 220 - (i * 2);
        ctx.fillText(i + "%", 10, y + 4);
        ctx.beginPath();
        ctx.moveTo(45, y);
        ctx.lineTo(50, y);
        ctx.strokeStyle = axisColor;
        ctx.stroke();
      }

      ctx.fillText("Time →", 640, 235);
      ctx.fillText("CPU Availability (%)", 260, 15);

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(50, 220 - (avgCPUUtilPercent + Math.random() * 5) * 2);
      for (let x = 60; x <= 680; x += 10) {
        const usage = avgCPUUtilPercent + Math.sin(x / 20) * 10 + (Math.random() * 5 - 2.5);
        ctx.lineTo(x, 220 - usage * 2);
      }
      ctx.strokeStyle = eksLineColor;
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(50, 20);
      ctx.lineTo(680, 20);
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
