---
title: Persistent Storage
---

## Persistent Volume Example: Let's Encrypt Certs Demo

This example demonstrates how to use persistent storage with the Local Path Provisioner in a Kubernetes deployment. The configuration shows a workload (locus-ws) that uses a persistent volume to store Let's Encrypt certificates under /tmp/locus/acme.

---

### Deployment YAML

The following Kubernetes Deployment mounts two volumes:
- A read-only ConfigMap for configuration files
- A writable PersistentVolumeClaim for storing certs

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: locus-ws
spec:
  replicas: 1
  selector:
    matchLabels:
      app: locus-ws
  template:
    metadata:
      labels:
        app: locus-ws
    spec:
      containers:
        - name: locus-ws
          image: registry.eadem.com/alex/locus-cloud/locus-ws:latest
          volumeMounts:
            - name: etc-ws
              mountPath: "/etc/ws/"
              readOnly: true
            - name: volume
              mountPath: /tmp/locus/acme
          ports:
            - containerPort: 80
              name: http
            - containerPort: 443
              name: https
      imagePullSecrets:
        - name: regcred
      dnsConfig:
        options:
          - name: ndots
            value: "1"
      volumes:
        - name: etc-ws
          configMap:
            name: locus-ws-cm
        - name: volume
          persistentVolumeClaim:
            claimName: locus-ws-pvc
```

---

### Persistent Volume Claim (PVC)

This PVC requests 2Gi of storage using the standard storage class and supports ReadWriteOnce access mode.

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: locus-ws-pvc
  labels:
    app: locus-ws-pvc
spec:
  storageClassName: standard
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

---

### Notes

- The volumeMounts section ensures Let's Encrypt data persists even if the pod is restarted.
- This configuration is compatible with QBO's local path provisioner or any CSI-compliant storage backend.
- Ensure the standard StorageClass is available in your cluster, or replace it with your provisioner's class.