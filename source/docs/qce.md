---
title: Container Engine (QCE)
---

### Quick Start

QCE is qbo's service that offers compute instances. Traditional approaches that rely on virtual machines for compute introduce performance challenges and unnecessary overhead.

Enter QBO: the solution that unleashes the true potential of cloud computing. With a single AsyncAPI across clouds and on-prem environments, QBO streamlines the deployment and management of compute instances, all while delivering unparalleled bare metal performance with Docker-in-Docker (DinD) subsecond deployments. This approach not only simplifies but also accelerates the adoption of modern cloud computing.

QBO is tailored to the demands of resource-intensive environments, making it an optimal choice for AI and ML workloads. Its commitment to optimized performance ensures that your cloud infrastructure meets the unique requirements of advanced computing applications.

> In the following demo we'll do a sub-second deployment of a QBO instance, and we will be accesing the instance via SSH.

#### Get API Version

```bash
qbo version | jq .version[]?
```

```json
{
  "qbo": "cli-amd64:stage-4.3.0.59ceb7d"
}
{
  "docker": "24.0.5",
  "qbo": "cloud-dev-4.3.0.dd223852",
  "host": "lux.cloud.qbo.io"
}
```

#### Add Instance

```bash
export INSTANCE_NAME=alex
qbo add instance $INSTANCE_NAME | jq
```

#### Get SSH Certficate

```bash
qbo get instance $INSTANCE_NAME -k | jq -r '.output[]?.sshconfig | select( . != null)' > $HOME/.qbo/$INSTANCE_NAME.crt
```

> Change certificate permissions

```bash
chmod 600 $HOME/.qbo/$INSTANCE_NAME.crt
```

#### Get Instance Address

```bash
qbo get ipvs $INSTANCE_NAME | jq -r '.ipvs[]? | select(.node | contains("insta")) | .vip'
```

#### Access Instance

```bash
ssh -o StrictHostKeyChecking=no -i $HOME/.qbo/$INSTANCE_NAME.crt qbo@192.168.1.201
```

```
Warning: Permanently added '192.168.1.201' (ECDSA) to the list of known hosts.

     .oO °°°°OOO o.
  .o°        OO    °o.
 OO          OO      OO
OO  .oOOOo   OOOOOo.  OO
O  OO    OO  OO    OO  O
O  OO    OO  OO    OO  O
OO   °OOOOO   °OOO°   OO
 OO      OO          OO
  °o     OO         o°
     °Oo 00     .oO°    qbo.
         °°°°°°
Unlocking the power of cloud computing for anyone, anywhere.


[qbo@instance-94ad0889 ~]$
```
