---
title: Equinix
---

## Turn Equinix into a GPU cloud platform with QBO

{% preview "equinix.svg" %}

QBO delivers unparalleled performance for ML/AI workloads, I/O-intensive databases, and real-time applications by bypassing the constraints of traditional virtual machines. By deploying Kubernetes components and compute instances using pure container technology—without virtualization—it provides direct access to hardware resources. This approach can be utilized on Equinix machines to deliver the agility of the cloud while maintaining optimal performance.

| Prerequisities           | Notes                                                                                                                                                                 |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Email             | An email address that can be authenticated by [Google Identitity](https://developers.google.com/identity), or an email address that can authenticate with Google Mail |
| QBO Account              | [Contact Us](/about/)                                                                                                                                                 |
| Equinix Account          | Sign up for [Equinix](https://deploy.equinix.com/)                                                                                                                    |
| QBO Registry Credentials | [Contact Us](/about/)                                                                                                                                                 |

## Architecture

{% preview "Equinix_QBO_Architecture.svg" %}

## Links

> The following configuration relates to the QBO API, CLI or Console

Host Links or just `Links` are metal servers or hosts that are auto-provisioned by `Origin`. They use the QBO API to add themselves to the Origin Domain `*.cloud.qbo.io`. The `Origin` is responsible for provisioning and configuring `Links` once authentication is successful. `Links` are provisioned with SSL, DNS, networking, authentication, registries, user accounts and more by the `Origin`. Read below to learn how to set up your `Links` on Equinix.

### Create Account

[Contact us](/about/) us to create an `Origin` account by providing your Google email address. Once your account is active, you should be able to retrieve your QBO Service Account and add Links to the `Origin`.

### Retrieve Service Account

QBO Cloud uses a [service account](/docs/cloud#Service-Account) to authenticate the CLI with the QBO API. Log in to the `Origin` at https://origin.cloud.qbo.io and retrieve your service account using the web terminal.

```bash
qbo get user qbot@@qbo.id | jq .users[]?.cli.conf
```

```json
{
  "qbo_uid": {
    "crv": "P-521",
    "kty": "EC",
    "x": "AbKEdPiq2Rw3OIM1G8agX-nQNhoXkEaZf2iUQf7GtcuG1d2_I5xrAEslKq3iQt25-bFPhjk7LmAWQ-KEGhfbez2x",
    "y": "AUSuWrt4OqUGVWYLdjsNBtvNcIkHQQOWefCChFywoXiw0uQeqoeLKStAseyK2hUT5FDGkNrHlJ6JEE97ZbdY8nvQ"
  },
  "qbo_aux": "ba1b8497-940d-4718-97a8-4b9d91b737b4",
  "qbo_port": 443,
  "qbo_host": "origin.cloud.qbo.io",
  "qbo_user": "qbot@@qbo.id"
}
```

### Select Metal Server

> The following configuration relates to the Equinix API, CLI or Console

{% preview "Screenshot from 2024-09-15 10-50-15.png" %}

> In this demo a c3.medium.x86 metal server was selected.

### Select Server OS

{% preview "Screenshot from 2024-09-15 10-50-33.png" %}

> Debian 12 is the default supported version for QBO API but RPM based distros are also supported. [Contact Us](/about/) for information.

### Configure User Data

> The following configuration relates to the Equinix API, CLI or Console

{% preview "Screenshot from 2024-09-15 10-50-43.png" %}

The QBO script below should be pasted into the section labeled **"Paste your script here"** under the `User data` section. Before pasting the script, user credentials must be replaced with the values for REGISTRY\_\* and the service account.

```bash
#!/bin/bash

set -e

######### BEGIN REPLACE #########
# docker
export BIN=api
export QBO_VERSION=latest

# prod
export REGISTRY_USER=eadem
export REGISTRY_AUTH=hub.docker.com
export REGISTRY_TOKEN=dckr_pat_2-flkLI81ioYaFLXMtlpWHYaaog
export REGISTRY_REPO="",
export REGISTRY_HOSTNAME=hub.docker.com
export REGISTRY_TYPE=docker

# sa
ACME=$(cat <<EOF
{
    "provider": "qbo",
    "type": "service_account",
    "qbo_uid": {
        "crv": "P-521",
        "kty": "EC",
        "x": "ACWum2MtKFApNRgjbcBnzC8R9NErzBPjmy6fDqzAt3s_-SSGr7jECFbNuYHIf4FPKyD2tsvi9k0lszJ0LOK3SOSs",
        "y": "ATXsHkfr1SjFjEq20aXfScquNj_SpnGKN2mxHonb5vE4EsOcqSqP9ukfobVcknmZrouIdReSYOxLrzlJDDQmsyMJ"
    },
    "qbo_aux": "590df48e-4cf8-4e92-98dd-6f86c0472a88",
    "qbo_port": 443,
    "qbo_host": "origin.cloud.qbo.io",
    "qbo_user": "alex@eadem.com"
}
EOF
)
######### END REPLACE #########

DNS=$ACME

IPTABLES=/sbin/iptables

_ALL=1

# update
_update() {
    (set -x; apt-get update -y)
    (set -x; apt install -y mesa-utils jq)
}

# hostname
_hostname() {
    (set -x; hostnamectl set-hostname $HOST)
}

_user() {
	(set -x; useradd -r -m --key MAIL_DIR=/dev/null --shell /bin/bash qbo)
	(set -x; usermod -aG sudo qbo)
    (set -x; usermod -aG systemd-journal qbo)
	(set -x; sed -i -e 's/^%sudo.*/%sudo ALL=(ALL:ALL) NOPASSWD: ALL/g' /etc/sudoers)
}

# motd
_motd() {
   sh -c "cat <<EOF >>/etc/motd

       .oO °°°°OOO o.
    .o°        OO    °o.
   OO          OO      OO
  OO  .oOOOo   OOOOOo.  OO
  O  OO    OO  OO    OO  O
  O  OO    OO  OO    OO  O
  OO   °OOOOO   °OOO°   OO
   OO      OO          OO
    °o     OO         o°
       °Oo 00     .oO°
           °°°°°°
\"Unlocking the power of cloud computing for anyone, anywhere.\"
EOF"

    (set -x; cat /etc/motd)
    if [ -f "/etc/motd.d/cockpit" ]; then
        (set -x; mv /etc/motd.d/cockpit ~/cockpit.rm)
    fi

}

# selinux
_selinux() {
     exit 0
}

_docker() {
    # docker
    # Add Docker's official GPG key:
    apt-get update -y
    apt-get install -y ca-certificates curl
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null
    (set -x; apt-get update -y)
    (set -x; apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin)

    (set -x; usermod -aG docker qbo)
    cat << EOF >> /etc/docker/daemon.json
{
  "log-driver": "journald"
}
EOF
    (set -x; systemctl enable docker)
    (set -x; systemctl restart docker)
    (set -x; systemctl status docker --no-pager)
    #(set -x; docker run hello-world)

    # buildx
    mkdir -p /home/qbo/.docker/cli-plugins/
    curl -Lo /home/qbo/.docker/cli-plugins/docker-buildx  https://github.com/docker/buildx/releases/download/v0.16.0/buildx-v0.16.0.linux-amd64
    chmod 755 /home/qbo/.docker/cli-plugins/docker-buildx
    chown qbo:qbo -R /home/qbo/.docker
}

# iptables
_iptables() {

    (set -x; echo iptables-persistent iptables-persistent/autosave_v4 boolean true | debconf-set-selections)
    (set -x; echo iptables-persistent iptables-persistent/autosave_v6 boolean true | debconf-set-selections)
    (set -x; apt install -y iptables-persistent)
    (set -x; $IPTABLES -F INPUT)
    (set -x; $IPTABLES -A INPUT -i lo -j ACCEPT)
    (set -x; $IPTABLES -A INPUT ! -i lo -d 127.0.0.0/8 -j REJECT)
    (set -x; $IPTABLES -A INPUT -i docker0 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -i br-+ -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp --dport 80 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp --dport 443 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp --dport 9601 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp --dport 6443 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp --dport 8000 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p tcp -m state --state NEW --dport 22 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -p icmp -m icmp --icmp-type 8 -j ACCEPT)
    (set -x; $IPTABLES -A INPUT -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7)
    (set -x; $IPTABLES -A INPUT -j REJECT)
    (set -x; $IPTABLES -S INPUT)

    (set -x; sh -c "iptables-save > /etc/iptables/rules.v4")
    (set -x; sh -c "cat /etc/iptables/rules.v4")
}

# registry
_registry() {

    echo "$REGISTRY_TOKEN" | docker login "$REGISTRY_HOSTNAME" -u "$REGISTRY_USER" --password-stdin
    cp -R /root/.docker/ /home/qbo/
    chown qbo:qbo -R /home/qbo/.docker
    (set -x; cat /home/qbo/.docker/config.json)

}

# ipvsadm
_ipvsadm() {

    (set -x; apt install -y ipvsadm)
    (set -x; ipvsadm -Ln)
    #modprobe ip_vs
    (set -x; lsmod | grep ^ip_vs)

}


# vim
_vim() {

    cat << EOF >> /home/qbo/.vimrc
set mouse-=a
set t_Co=256
if has("autocmd")
  au BufReadPost * if line("'\"") > 0 && line("'\"") <= line("$") | exe "normal! g'\"" | endif
endif
syntax on
set tabstop=8 softtabstop=0 expandtab shiftwidth=4 smarttab
EOF

    chown qbo:qbo /home/qbo/.vimrc
    cat /home/qbo/.vimrc
}

# ssh
_ssh() {

    (set -x; mkdir /home/qbo/.ssh)
    (set -x; mv /root/.ssh/authorized_keys /home/qbo/.ssh/authorized_keys)
    (set -x; chown qbo:qbo -R /home/qbo/.ssh/)

    (set -x; cat /home/qbo/.ssh/authorized_keys)

    sed -i 's/#\?\(PubkeyAuthentication\s*\).*$/\1yes/' /etc/ssh/sshd_config
    sed -i 's/#\?\(PermitEmptyPasswords\s*\).*$/\1no/' /etc/ssh/sshd_config
    sed -i 's/#\?\(PasswordAuthentication\s*\).*$/\1no/' /etc/ssh/sshd_config
    sed -i 's/#\?\(X11Forwarding\s*\).*$/\1no/' /etc/ssh/sshd_config
    sed -i 's/#\?\(PermitRootLogin\s*\).*$/\1no/' /etc/ssh/sshd_config

    chown qbo:qbo -R /home/qbo/.ssh
    cat /etc/ssh/sshd_config | grep  '^PubkeyAuthentication\|^PermitEmptyPasswords\|^PasswordAuthentication\|^X11Forwarding\|^PermitRootLogin'
    (set -x; systemctl restart sshd)
}

# nvidia
_nvidia() {
    exit 0
    dnf install -y https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
    dnf update
    dnf install -y nvidia-driver

    curl -s -L https://nvidia.github.io/libnvidia-container/stable/rpm/nvidia-container-toolkit.repo | \
    tee /etc/yum.repos.d/nvidia-container-toolkit.repo

    dnf install -y nvidia-container-toolkit

    nvidia-ctk runtime configure --runtime=docker
    systemctl restart docker
}

_qbo() {
    if [ ! -d /home/qbo/.qbo ]; then
        mkdir /home/qbo/.qbo
    fi

    TEMPLATE=$(cat <<EOF
{
    "vhosts": [
        {
        "name": "proxy",
        "port": "443",
        "ignore-missing-cert": "1",
        "access-log": "/tmp/qbo/access-log",
        "timeout_secs_ah_idle": "30",
        "connect_timeout_secs": "30",
        "mounts": [
            {
            "mountpoint": "/login",
            "origin": "callback://qbo"
            },
            {
            "mountpoint": "/",
            "origin": "callback://qbo",
            "extra-mimetypes": {
                ".map": "application/json"
            }
            }
        ],
        "ws-protocols": [
            {
            "qbo": {
                "node": {
                    "registry": {
                        "user":"kindest",
                        "auth":"hub.docker.com",
                        "token":"",
                        "repo":"",
                        "registry":"hub.docker.com",
                        "type":"docker"
                    }
                },
                "instance": {
                    "registry": {
                        "user":"$REGISTRY_USER",
                        "auth":"$REGISTRY_AUTH",
                        "token":"$REGISTRY_TOKEN",
                        "repo":"$REGISTRY_REPO",
                        "hostname":"$REGISTRY_HOSTNAME",
                        "type": "$REGISTRY_TYPE"
                    }
                },
                "registry": {
                    "user":"$REGISTRY_USER",
                    "auth":"$REGISTRY_AUTH",
                    "token":"$REGISTRY_TOKEN",
                    "repo":"$REGISTRY_REPO",
                    "hostname":"$REGISTRY_HOSTNAME",
                    "type": "$REGISTRY_TYPE"
                },
                "dns": null,
                "acme": null
            },
            "qbo-term": {
            },
            "qbo-thread": {
            },
            "qbo-acme-client": {
                "acme": null,
                "dns": null
            }
            }
        ]
        }
    ]
}
EOF
)

    echo $TEMPLATE| jq --argjson dns "$DNS" --argjson acme "$ACME" '
.vhosts[]."ws-protocols"[] |= (
.["qbo-acme-client"].dns = $dns |
.["qbo-acme-client"].acme = $acme |
.["qbo"].dns = $dns |
.["qbo"].acme = $acme
)' > /home/qbo/.qbo/api.json

    chown qbo:qbo -R /home/qbo/.qbo

    sysctl fs.inotify.max_user_watches=2147483647
    sysctl fs.inotify.max_user_instances=2048
    sysctl fs.inotify.max_queued_events=2147483647

    IMAGE="$REGISTRY_HOSTNAME/$REGISTRY_USER/cloud/$BIN:$QBO_VERSION"
    LL=notice
    su - qbo -c "docker pull $IMAGE && docker run --rm --name qbo --network host -d -it --privileged -v /home/qbo/.qbo/:/tmp/qbo/ -v /var/run/docker.sock:/var/run/docker.sock $IMAGE api --$LL"

}


echo "HOSTNAME = $HOST"
echo "-------------------------------------------------------------------------------"

_update
_user
_motd
_vim
_ipvsadm
_iptables
_docker
_registry
_ssh
_qbo

```

### Get Link URL

> The following configuration relates to the QBO API, CLI or Console

Upon successful configuration, you should be able to see the host link attached to the Origin by logging in to https://origin.cloud.qbo.io under `Hosts`.

{% preview "Screenshot from 2024-09-16 21-02-15.png" %}

> Hardware information and hostname will be displayed by expanding the host `id`

### Access Web Console

You can then access the QBO web console on your Equinix host by entering the hostname collected above in your web browser, for instance, https://h-3ab5f895.cloud.qbo.io/

> The login account should be the same as the one used to access the Origin

{% preview "Screenshot from 2024-09-17 22-02-01.png" %}

At this point, you should have a fully configured Equinix server with QBO. To get started, explore our [resources section](/resources/) section and begin deploying Kubernetes clusters and compute instances.

## Network

> The following configuration relates to the Equinix API, CLI or Console

#### Add Elastic IPs

Equinix provides you the ability to assign [Elastic IP addresses](https://deploy.equinix.com/developers/docs/metal/networking/elastic-ips/) statically to your servers through the console and API.

{% preview "Screenshot from 2024-09-17 19-43-58.png" %}

#### Assign Elastic IPs

Once the host is in the `running` state, you can [assign the IP addresses](https://deploy.equinix.com/developers/docs/metal/networking/elastic-ips/#adding-elastic-ip-addresses-to-an-existing-server)

{% preview "Screenshot from 2024-09-17 20-39-05.png" %}

> Manual Host IP configuration is not necessary directly on the host, as QBO will perform those operations once the IP addresses are assigned to the host. See below to see how to configure the host network with QBO

#### Add Network

> The following configuration relates to the QBO API, CLI or Console

A network with the range `139.178.81.148/30`, which includes the IP addresses 139.178.81.148, 139.178.81.149, 139.178.81.150, and 139.178.81.151, can be configured with QBO using the following command:

```bash
qbo add network 139.178.81.148 139.178.81.149 139.178.81.150 139.178.81.151 | jq
```

After the IPs are added, QBO will manage the IP network for deployments in both the QBO Kubernetes Engine and the QBO Container Engine.

{% preview "Screenshot from 2024-09-17 20-18-45.png" %}

<!-- ### Host Origin

> The following configuraton option is only required if you plan to maintain your own Origin

| Prerequisities                                      | Notes                                                                                                                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Google Cloud DNS Service Account                    | [Dcoumentation](https://cloud.google.com/dns#documentation)                                                                                                              |
| Let's Encrypt DNS-01 Challenge Configuration        | [Dcoumentation](https://letsencrypt.org/docs/)                                                                                                                           |
| GooglE APIs & Services Authorized JavaScript Origin | Authentication endpoint URL added to [Authorized JavaScript origins](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow#origin-validation) |
| QBO Account                                         | Create a [QBO](/about/) account                                                                                                                                          |
| Equinix Account                                     | Sign up to [Equinix](https://deploy.equinix.com/)                                                                                                                        | -->
