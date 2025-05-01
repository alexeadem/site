---
title: Command Line Interface
---

> QBO is a client CLI that connects to the qbo API using websockets. It can send a single command as a message and disconnect. Or it can keep the websocket open to continue receiving state messages from the [mirror](?id=qbo-cloud). It runs in docker.

## Configuration

QBO CLI processes configuration input in the following order:

1. Environment variables

- QBO_UID
- QBO_AUX
- QBO_HOST
- QBO_PORT

2. $HOME/.qbo/cli.json
3. $HOME/.qbo/.cli.db

## Download

> If you are accessing the cluster outside the `qbo` terminal you can install the CLI as follows:

```bash
git clone https://github.com/alexeadem/qbo-ce.git
cd qbo-ce
. ./alias
```

## Cluster Operations

### Add Cluster

> Create two new cluster `dev prod` cluster

```bash
qbo add cluster dev prod | jq

```

> Create new cluster `test` with `5` nodes

```bash
qbo add cluster test -n 5 | jq

```

### Stop Cluster

> Stop cluster `test`. All nodes in cluster `test` will be stopped

```bash
qbo stop cluster test | jq

```

### Start Cluster

> Start cluster `test`.

```bash
qbo start cluster test | jq

```

### Delete Cluster

> Delete cluster `test`. Cluster will be deleted. Operation is irreversible

```bash
qbo delete cluster test | jq

```

> Delete `all` clusters.

```bash
qbo delete cluster -A | jq

```

## Node Operations

### Stop Node

> Stops node with name `node-8a774663.localhost` `bfc61532`

```bash
qbo stop node node-123 node-567 | jq

```

### Start Node

> Starts nodes `bfc61532`

```bash
qbo start node node-123 | jq

```

### Add Node

> Add new a new node to cluster `test`

```bash
qbo add node test | jq

```

> Add new `2` new nodes to cluster `test`

```bash
qbo add node test -n 2 | jq

```

### Delete Node

> Scale cluster down by deleting node `node-8a774663.localhost`

```bash
qbo del node node-123 | jq

```

## Network operations

### Get Networks

> Get all cluster networks

```bash
qbo get networks -A
```

> Get `dev` and `prod` cluster networks

```bash
qbo get network dev prod
```

## CLI Reference

| Command            | Argument | Options | Paraemeter | Admin | Example                                                         | Description                | CLOUD | CE  |
| ------------------ | -------- | ------- | ---------- | ----- | --------------------------------------------------------------- | -------------------------- | ----- | --- |
| qbo add cluster    | char[64] | -i      | char[64]   | N     | qbo add cluster `alex` -i `hub.docker.com/kindest/node:v1.27.2` | Add cluster                | X     | X   |
|                    |          | -n      | unsigned   | N     |                                                                 | Number of nodes            | X     | X   |
|                    |          | -d      | char[128]  | N     |                                                                 | Domain name                | X     | X   |
| qbo add node       | char[64] |         |            | N     | qbo add node `alex`                                             | Add node to cluster        | X     | X   |
|                    |          | -n      | unsigned   | N     | qbo add node `alex` -n `3`                                      | Add n nodes to cluster     | X     | X   |
| qbo add user       | char[64] |         |            | Y     | qbo add user `alex`                                             | Add user                   | X     |     |
|                    |          | --admin |            | Y     | qbo add user --admin `alex`                                     | Add admin user             | X     |     |
| qbo add network    | char[64] |         |            | Y     | qbo add net `136.25.15.102 136.25.15.103`                       | Add network                | X     |     |
| qbo delete network | char[64] |         |            | Y     | qbo del net `136.25.15.102 136.25.15.103`                       | Delete network             | X     |     |
| qbo delete user    | char[64] |         |            | Y     | qbo del user `alex`                                             | Delete user                | X     |     |
| qbo delete node    | char[64] |         |            | N     | qbo del node `node-2b251a2c`                                    | Delete node                | X     | X   |
| qbo delete cluster | char[64] |         |            | N     | qbo delete cluster `alex`                                       | Delete cluster             | X     | X   |
|                    |          | -A      |            | N     | qbo delete cluster -A                                           | Delete all clusters        | X     | X   |
| qbo stop node      | char[64] |         |            | N     | qbo stop node `node-2b251a2c.localhost`                         | Stop node                  | X     | X   |
| qbo stop cluster   | char[64] |         |            | N     | qbo stop cluster `alex`                                         | Stop cluster               | X     | X   |
|                    |          | -A      |            | N     | qbo stop cluser -A                                              | Stop all clusters          | X     | X   |
| qbo start node     | char[64] |         |            | N     | qbo start node `node-2b251a2c`                                  | Start node                 | X     | X   |
|                    |          | -A      |            | N     | qbo start node -A                                               | Start all nodes            | X     | X   |
| qbo start cluster  | char[64] |         |            | N     | qbo start cluster `alex`                                        | Start cluster              | X     | X   |
|                    |          | -A      |            | N     | qbo start cluster -A                                            | Start all clusters         | X     | X   |
| qbo get nodes      | char[64] |         |            | N     | qbo get nodes `alex`                                            | Get nodes                  | X     | X   |
|                    |          | -A      |            | N     | qbo get nodes -A                                                | Get all nodes              | X     | X   |
|                    |          | -w      |            | N     | qbo get nodes -w `43706dd0`                                     | Watch nodes                | X     |     |
| qbo get pods       | char[64] |         |            | N     | qbo get pods `alex`                                             | Get pods                   | X     | X   |
|                    |          | -A      |            | N     | qbo get pods -A                                                 | Get all pods               | X     | X   |
|                    |          | -w      |            | N     | qbo get pods -w `43706dd0`                                      | Watch pods                 | X     |     |
| qbo get services   | char[64] |         |            | N     | qbo get svc `alex`                                              | Get cluster services       | X     |     |
|                    |          | -A      |            | N     | qbo get svc -A                                                  | Get all services           | X     |     |
|                    |          | -w      |            | N     | qbo get svc -w `43706dd0`                                       | Watch services             | X     |     |
| qbo get ipvs       | char[64] |         |            | N     | qbo get ipvs `alex`                                             | Get cluster load balancers | X     |     |
|                    |          | -A      |            | N     | qbo get ipvs -A                                                 | Get all load balancers     | X     |     |
| qbo get images     | char[64] |         |            | N     | qbo get images                                                  | Get node images            | X     | X   |
|                    |          | -A      |            | N     | qbo get images -A                                               | Get all images             | X     | X   |
| qbo get users      | char[64] |         |            | N     | qbo get user `alex`                                             | Get user                   | X     |     |
|                    |          | -A      |            | N     | qbo get users -A                                                | Get all users              | X     |     |
| qbo get cluster    | char[64] |         |            | N     | qbo get cluster `alex`                                          | Get cluster                | X     |     |
|                    |          | -A      |            | N     | qbo get cluster -A                                              | Get all clusters           | X     | X   |
|                    |          | -k      |            | N     | qbo get cluster -k `alex`                                       | Get cluster kubeconfig     | X     |     |
| qbo get network    | char[64] |         |            | N     | qbo get net `alex`                                              | Get cluster network        | X     | X   |
|                    |          | -A      |            | N     | qbo get net -A                                                  | Get all cluster networks   | X     | X   |
|                    |          | -H      |            | Y     | qbo get net -H                                                  | Get host network           | X     |     |
| qbo get instance   | char[64] |         |            | N     | qbo get instance `alex`                                         | Get instance               | X     |     |
|                    |          | -A      |            | N     | qbo get instance -A                                             | Get all instances          | X     | X   |
|                    |          | -k      |            | N     | qbo get instance -k `alex`                                      | Get instance kubeconfig    | X     |     |
| qbo get instance   | char[64] |         |            | N     | qbo get instance `alex`                                         | Get instance               | X     |     |
|                    |          | -A      |            | N     | qbo get instance -A                                             | Get all instances          | X     | X   |
|                    |          | -k      |            | N     | qbo get instance -k `alex`                                      | Get instance               |
| qbo version        | char[64] |         |            | N     | qbo version                                                     | Get qbo version            | X     |     |
