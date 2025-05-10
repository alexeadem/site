---
title: Istio
---

## Bookstore Demo

{% preview "istio.svg" %}

---

### 1. Install Istio (Demo Profile with Tracing)

```bash
ISTIOCTL=$PWD/bin/istioctl

$ISTIOCTL install \
  --set profile=demo \
  --set meshConfig.defaultConfig.tracing.zipkin.address=splunk-otel-collector.istio-system.svc.cluster.local:9411 \
  -y
```

Enable automatic sidecar injection for the `default` namespace:

```bash
kubectl label namespace default istio-injection=enabled
```

---

### 2. Deploy the Bookinfo Application

```bash
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

---

### 3. Deploy the Istio Gateway

```bash
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
```

---

### 4. Access the Application

Get the external address for the product page:

```bash
NODEPORT=$(kubectl get svc -n istio-system -o json \
  | jq -r '.items[].spec.ports[]? | select(.port == 80 and .nodePort) | .nodePort')

NODELST=$(kubectl get nodes -o json \
  | jq -r '.items[].status.addresses[] | select(.type=="InternalIP") | .address')

for ip in $NODELST; do
  echo "http://$ip:$NODEPORT/productpage"
done
```