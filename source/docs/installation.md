---
title: Installation
---

[![qbo](https://img.shields.io/badge/qbo-support-red?logo=slack&style=for-the-badge)](https://qbo-cloud.slack.com/?redir=%2Farchives%2FC05733LJ22Z%3Fname%3DC05733LJ22Z)

[![qbo](/images/qbo-resources-black.svg)](https://www.qbo.io/resources)

# **QBO LINK & ORIGIN Installation Guide**

This guide provides instructions on how to install QBO on a bare-metal HOST running Debian 12 and configure the HOST as a LINK or an ORIGIN. Follow the steps below and ensure all prerequisites are met before proceeding.

## Overall Flow

{% preview "qbo_flow_diag.svg" %}

---

### **Definitions**

| **Term**                                                 | **Definition**                                             | **Notes**                                                                                                                                                                       |
| -------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **HOST**                                                 | A bare-metal server                                        | Any AMD64 or ARM64 hardware.                                                                                                                                                    |
| **ORIGIN**                                               | The first HOST configured and deployed with the QBO API    | The first HOST configured and deployed with the QBO API. The ORIGIN manages the cloud (e.g., .cloud.qbo.io) and provisions LINKs. It can either be user-managed or QBO-managed. |
| **LINK**                                                 | A bare-metal server configured as a LINK using the QBO API | LINKs connect to the ORIGIN cloud and are self-provisioned by the ORIGIN.                                                                                                       |
| [**API**](https://www.qbo.io/docs/cloud)                 | QBO AsyncAPI, configurable in LINK or ORIGIN mode          | Deployed as a Docker container on a bare-metal server.                                                                                                                          |
| [**QKE**](https://www.qbo.io/platform/#Container-Engine) | QBO Kubernetes Engine                                      |                                                                                                                                                                                 |
| [**QCE**](https://www.qbo.io/platform/#Container-Engine) | QBO Container Engine                                       |                                                                                                                                                                                 |

---

### **Prerequisites**

| **Category**         | **Requirement**                                     | **Notes**                                                                                                                                          |
| -------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Host**             | Physical server with AMD64[1] or ARM64 architecture | QBO supports any AMD64 or ARM64 hardware capable of running Debian 12\.                                                                            |
| **GPU**              | NVIDIA or equivalent                                | Required only if CUDA or AI/ML capabilities are needed.                                                                                            |
| **CPU**              | Minimum 2 cores                                     |                                                                                                                                                    |
| **RAM**              | Minimum 8 GB                                        |                                                                                                                                                    |
| **Operating System** | Debian 12                                           | Perform a network installation using a minimal USB or CD.                                                                                          |
| **User**             | Root privileges                                     | Initial server configuration must be performed with root-level access via the console.                                                             |
| **Network**          | Private or public network                           | The network must not use DHCP. It will be assigned to compute instances and Kubernetes clusters created by QBO.                                    |
| **Security**         | Outbound internet access                            | Ensure the HOST has external outbound internet access.                                                                                             |
| **Browser**          | Chrome-based browser or Firefox[2]                  | Required to access the web console once the ORIGIN is operational.                                                                                 |
| **Account**          | Google Email Account                                | QBO uses Google authentication, so any email address that can authenticate with Google will work. Alternatively, a Gmail account can also be used. |

---

> **Additional Requirements for ORIGIN Configuration Only**

| **Category**                                                                                                  | **Requirement**              | **Notes**                                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain Name**                                                                                               | Domain name                  | Example: \*.cloud.qbo.io — The domain name used for the project (e.g., cloud.qbo.io).                                                                          |
| [**Google Cloud DNS Zone**](https://console.cloud.google.com/net-services/dns/zones?)                         | Google Cloud DNS Zone        | Example: \*.cloud.qbo.io — A DNS zone in Google Cloud for managing domain records.                                                                             |
| [**Cloud DNS Service Account**](https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts?) | Cloud DNS service account    | A Google Cloud service account used to interact with the DNS service.                                                                                          |
| [**Google OAuth 2.0 Client ID**](https://console.cloud.google.com/apis/credentials)                           | Google OAuth 2.0 Client ID   | Example: 435161597188-k1hqld6ouhve09i7jovbrk811dla8n76.apps.googleusercontent.com — OAuth 2.0 credentials required for authentication during API interactions. |
| [**Authorized JavaScript Origin**](https://console.cloud.google.com/apis/credentials)                         | Authorized JavaScript Origin | Example: o-221241c9.cloud.qbo.io — The authorized origin for OAuth 2.0 client requests.                                                                        |

---

**Notes:**

[1] **AMD64**: Refers to 64-bit x86 architecture.  
[2] **Firefox and Chrome-based browsers**: Ensure the browser is updated to the latest version for compatibility with the web console. Firefox has limited support for WebRTC, which may restrict functionality when using QBO’s Plasma Workstation.

---

### **GitHub Project**

> Create a [classic token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic) if you don't already have one, or generate any other token that allows access to the [install](https://github.com/alexeadem/install) repository.

To clone the repository containing the QBO configuration and setup scripts, use the following command:

```bash
git clone https://github.com/alexeadem/install.git
cd install
```

### **Configuration Files**

Below is a description of the configuration files, how to obtain them, and their relevance for **LINK** or **ORIGIN** deployments.

> Before proceeding, please ensure you have an env file. If you don't have one, contact the QBO account team to obtain it at `info@qbo.io`.

> LINK & ORIGIN Configurations

|            | File                                 | Definition                                                                                                                                                                                             |
| ---------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [&#10003;] | [**qbo**](#qbo-configuration-script) | A script used for ORIGIN and LINK configuration and deployment, as described in this document. It uses a wizard-based configuration to generate the necessary configuration files from the `env` file. |
| [&#10003;] | [**env**](env.sample)                | An environment file containing the required credentials for LINK or ORIGIN deployments.                                                                                                                |
| [&#10003;] | **README.md**                        | This document.                                                                                                                                                                                         |
| [&#10003;] | [**iam.json**](env.sample)           | Public authentication credentials required to authenticate with the QBO web console. This file is obtained from the Google API and Services section in the Google Cloud Console.                       |
| [&#10003;] | [**id_rsa.pub**](env.sample)         | Public key added to the SSH `authorized_keys` file, allowing HOST access after system configuration. it can be generated using `ssh-keygen`.                                                           |
| [&#10003;] | [**registry.json**](env.sample)      | Contains QBO registry authentication credentials, used to retrieve API, CLI, SHELL, and instance images. If you are using QBO registries, these credentials will be provided by the QBO account team.  |

> LINK Specific Configuration

|            | File                        | Definition                                                                                                                                                                                                                                                                                                             |
| ---------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [&#10003;] | [**link.json**](env.sample) | LINK user service account. This key is provided by the QBO account team if using QBO managed ORIGIN and should be set as a variable in the env file. If you are using your own ORIGIN, you can create a user with link level permissions by an admin user and use that service account to populate the link.json file. |

> ORIGIN Specific Configuration

|            | File                        | Definition                                                                                                                                            |
| ---------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| [&#10003;] | [**key.json**](env.sample)  | QBO ORIGIN key, provided by the QBO account team. It is required to start the ORIGIN and should be set as an environment variable in your `env` file. |
| [&#10003;] | [**acme.json**](env.sample) | Contains your Let’s Encrypt information for your cloud domain.                                                                                        |
| [&#10003;] | [**dns.json**](env.sample)  | Contains the Google Cloud DNS Service Account credentials, which can be obtained from the Google Cloud Console. See below for instructions.           |

### QBO Configuration Script

The qbo script will help you to configure the system for the QBO API deployment in LINK or ORIGIN mode. It uses a wizard-based configuration to generate the necessary configuration files above from the `env` file.

Here is a sample of usage:

```bash
./qbo
>>> qbo start api                        -- start api
 -C { domain }                           -- * required valid domain name. example: cloud.qbo.io
 -c                                      -- start clean
 -r                                      -- build type. default: prod
 -T                                      -- tag. default: latest
 -t { link | origin }                    -- API mode. default: link
>>> qbo stop api                         -- stop api api
>>> qbo attach terminal                  -- attach api. (CTRL-p, CTL-q) to exit
>>> qbo logs api                         -- get api logs
 -f                                      -- follow logs
 -j                                      -- output json
 -e                                      -- output vi
>>> qbo test host                        -- test HOST compatibility
>>> qbo configure api                    -- configure API in mode LINK or ORIGIN
 -C { domain }                           -- * required valid domain name. example: cloud.qbo.io
 -r { prod |stage }                      -- configure build type. default: prod
 -t { link | origin }                    -- configure link or origin. default: link
 -c                                      -- clean previous configuration
>>> qbo configure host                   -- configure host or API
 -C { domain }                           -- * required valid domain name. example: cloud.qbo.io
 -r { prod |stage }                      -- configure build type. default: prod
 -a                                      -- all
 -u                                      -- update
 -p                                      -- apparmor
 -h                                      -- hostname
 -U                                      -- user
 -m                                      -- motd
 -e                                      -- vim
 -v                                      -- ipvsadm
 -i                                      -- iptables
 -d                                      -- docker
 -R                                      -- registry
 -x                                      -- nvidia
 -s                                      -- ssh
 -I                                      -- images

```

---

## **HOST**

<!-- ### Configuration -->

### Debian 12 Installation

> See [prerequisites](#prerequisites)

- **File System**: ext4
- **Software Selection**: SSH Server, Standard system utilities, QBO configuration script

### Root Level Configuration

Access the host via SSH or console and verify you are logged in as root

```bash
id
uid=0(root) gid=0(root) groups=0(root)
```

#### **QBO API**

> Clone [**QBO's installation repository**](#github-project) as `root` user under the `/root` directory

##### Host Tests

The following command can perform compatibility tests before any installation

```bash
./qbo test host
HOSTNAME: fenestra.cloud.qbo.io
ARCH: x86_64
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>
```

##### Host Configuration

The following command will perform all host-level configurations to set up the host as either ORIGIN or LINK:

> **ORIGIN configuration**: The `-C` option should specify your cloud domain name. `cloud.qbo.io` is used here as an example.

> **LINK configuration**: The `-C` option should specify `cloud.qbo.io` if you do not manage an ORIGIN and are using a QBO managed **ORIGIN**. Otherwise, you should specify the domain name of your **ORIGIN**.

```bash
./qbo configure host -C cloud.qbo.io -a
>>> cloud.qbo.io
CLOUD: *.cloud.qbo.io
TYPE: link
IMAGE: eadem/api:latest
BUILD: prod
_ALL: 1
CLEAN: 0
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>

```

Upon successful configuration the API is ready to host the API in mode LINK or ORIGIN.

> This is the end of any command run as root. Any other command from now on should be run as user `qbo`.

### **User Level Configuration**

#### **SSH Access**

If you’ve replaced the default public key [**id_rsa.pub**](conf/id_rsa.pub), use your private key to access the system; otherwise, use the provided [**id_rsa**](id_rsa) private key from the repository.

Before logging out as the `root` user and closing the session, start a new session using the `qbo` user from another SSH shell session. All subsequent commands must be executed as the `qbo` user.

The `qbo` script will automatically add a public SSH key to the `authorized_hosts` file. The host can then only be accessed using the corresponding private key, as password authentication will be disabled.

##### **Key Permissions**

If necessary, change the permissions of the private key file using the following command:

```bash
chmod 600 id_rsa
```

Start a new shell session using the IP address of the host:

```bash
ssh -i id_rsa qbo@$IP
```

---

<!-- #### [**QBO API**](#github-project)

> Clone repository as `qbo` user under the `/home/qbo` directory -->

## **LINK**

> If you are configuring an **ORIGIN**, go to this section: [QBO ORIGIN](installation#ORIGIN).

---

### **Google Cloud Client ID**

For a QBO managed **ORIGIN**, the `client_id` will be provided in the `env` file by the QBO account team. In this case, proceed to the [next section](#link-configuration).

For an user-managed **ORIGIN**, retrieve the `client_id` from the Google Cloud Console under Google API & Services. You can either set it manually in your `env` file or provide it during the wizard setup. The wizard will generate an `iam.json` file containing the `client_id`.

{% preview "client_id_copy.png" %}

### QBO API

> Before proceeding, ensure the following prerequisites are completed:

|            | Prerequisite                 | Notes                                                                                                                                                                                                                                 |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [&#10003;] | `env` file configured        | The environment file with `IAM`, `LINK`, and `REGISTRY` variables should be properly set. If the `env` file is not in the root folder of the repository and was provided separately, copy it to the root directory of the repository. |
| [&#10003;] | HOST configuration completed | Ensure all [HOST tests](#host-tests) have passed successfully.                                                                                                                                                                        |
| [&#10003;] | User `qbo` shell             | You should have an active [SSH connection](#ssh-access) under the qbo user                                                                                                                                                            |
| [&#10003;] | Github repo                  | As the `qbo` user, clone the [repository](#github-project) into `/home/qbo`                                                                                                                                                           |

#### LINK Configuration

The following command will configure the API in **LINK** mode (`-t link`) using the domain cloud.qbo.io (`-C cloud.qbo.io`). A wizard will start, guiding you through the process of configuring the API in **LINK** mode.

> If you have your own **ORIGIN**, you should specify the **ORIGIN**'s domain name. Otherwise, use QBO's **ORIGIN**: `cloud.qbo.io`.

```bash
 ./qbo configure api -C cloud.qbo.io -c
```

```bash
>>> cloud.qbo.io
CLOUD: *.cloud.qbo.io
TYPE: link
IMAGE: eadem/api:latest
BUILD: prod
_ALL: 0
CLEAN: 1
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>
[WARNING]: The environment file containing authentication credentials was not found. These credentials are necessary to run QBO in link mode. Contact the QBO account team at info@qbo.io to obtain the file, or enter the credentials manually using this wizard.
<Press any key to continue> | <CTRL+C to exit>
```

> registry.json

```bash
>>> registry.json
Enter QBO Registry Credentials (prod):
[INFO]: Input in JSON format
< {
  "user": "qbo",
  "auth": "git.qbo.io",
  "token": "glpat-h7hsw1_tGCDFUU7tyBq2",
  "repo": "cloud",
  "hostname": "registry.qbo.io",
  "type": "gitlab"
}

{
  "user": "qbo",
  "auth": "git.qbo.io",
  "token": "glpat-h7hsw1_tGCDFUU7tyBq2",
  "repo": "cloud",
  "hostname": "registry.qbo.io",
  "type": "gitlab"
}
<Press any key to continue> | <CTRL+C to exit>
```

> id_rsa.pub

```bash
>>> id_rsa.pub
Enter SSH Id RSA Public Key:
[INFO]: The 'qbo' script will automatically add a public SSH key to the 'authorized_hosts' file. The host can then only be accessed using the corresponding private key, as password authentication will be disabled.
< ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAABCAQCmAu9Svd4MwTrse5ouXvMED2jUGgbynbQs3VxG9kB0tb3RycrL923VrA+amh+YN8VGgphk/b7TxnWR5l26VfMqIv2CmXwi7OTqmUN6I4WQQsFnkU0v5lPtMp5Wl0CvWG6l6woYT9p2lblB6XoiLAnMrlHJ6xSzGJP8Wj0IVIrU54DGhI23IJhrOHBOGEcpIPc9qbmt47CB7jF+fYXjkFxOjYIMWkoMncuq+D/8/kbilZ4sbXF0hBrNYL0xN3g36ce0p/jE/525PxRuzaYOuf3oGeqFFd8BjQfENFiPn3x2In3x9mTzUYKkniedC5PuWuP4BkwI6/yfDs63HqzH4NPz5XqOKzlxwAN8co9xdOjt4v3zIUpLPJ2KTdh00quQMXITu+Ew4hnbRpoJDGu9Gra9Hw2osUMeVhLawfiu9PFaa0ysEzzi4lvZJZzV57VPoJpZD9H9hQDp6ixaNgWckQI6csAeOFrVSpYnleVjVzspyYfRQaikcZRUn3S4NOQT/gOtbqIlZsKwth51gBOhIgerknDcfY8ykXtYvJ6GqgEu+yzbJt8tXEbaEOYqNnH1WundqfouyqqnlgtzV4ac+RcGx6UDl/Ift3i1/IVwJP4dIdlgcrp+KMKWJ/uxIPFHy8QUlhTlnJyzqHmZUy5bVRP/zPFnJ0GyXjF2BXma2Y+xVw== alex@fenestra.cloud.qbo.io
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAABCAQCmAu9Svd4MwTrse5ouXvMED2jUGgbynbQs3VxG9kB0tb3RycrL923VrA+amh+YN8VGgphk/b7TxnWR5l26VfMqIv2CmXwi7OTqmUN6I4WQQsFnkU0v5lPtMp5Wl0CvWG6l6woYT9p2lblB6XoiLAnMrlHJ6xSzGJP8Wj0IVIrU54DGhI23IJhrOHBOGEcpIPc9qbmt47CB7jF+fYXjkFxOjYIMWkoMncuq+D/8/kbilZ4sbXF0hBrNYL0xN3g36ce0p/jE/525PxRuzaYOuf3oGeqFFd8BjQfENFiPn3x2In3x9mTzUYKkniedC5PuWuP4BkwI6/yfDs63HqzH4NPz5XqOKzlxwAN8co9xdOjt4v3zIUpLPJ2KTdh00quQMXITu+Ew4hnbRpoJDGu9Gra9Hw2osUMeVhLawfiu9PFaa0ysEzzi4lvZJZzV57VPoJpZD9H9hQDp6ixaNgWckQI6csAeOFrVSpYnleVjVzspyYfRQaikcZRUn3S4NOQT/gOtbqIlZsKwth51gBOhIgerknDcfY8ykXtYvJ6GqgEu+yzbJt8tXEbaEOYqNnH1WundqfouyqqnlgtzV4ac+RcGx6UDl/Ift3i1/IVwJP4dIdlgcrp+KMKWJ/uxIPFHy8QUlhTlnJyzqHmZUy5bVRP/zPFnJ0GyXjF2BXma2Y+xVw== alex@fenestra.cloud.qbo.io
<Press any key to continue> | <CTRL+C to exit>
```

> iam.json

```bash
>>> iam.json
Enter Google Authentication Client ID:
[INFO]: Your Client ID can be found under 'API & Services' in the Google Cloud Console. Visit https://console.cloud.google.com/apis/credentials to locate it. It is required to authenticate your application with Google services. Example: '1234567890-abcdefg.apps.googleusercontent.com'.
< 618979529734-pba2m5leob2ouggj12153nkuvvnou681.apps.googleusercontent.com
{
  "client_id": "618979529734-pba2m5leob2ouggj12153nkuvvnou681.apps.googleusercontent.com",
  "provider": "google"
}
<Press any key to continue> | <CTRL+C to exit>
```

> link.json

```bash
>>> link.json
Enter QBO LINK Service Account:
[INFO]: You should have received a QBO LINK service account from the QBO account team, or it should be available in your env file. If you haven't received it, please contact info@qbo.io for assistance.
< {
  "provider": "qbo",
  "type": "service_account",
  "qbo_uid": {
    "crv": "P-521",
    "kty": "EC",
    "x": "AZEZgwvTKsXodvyWvwQ_jkQBIxL5\6S-6yJBIAxpZEeDMn3ZAUsnAhpl7B-q9NJRs9zs7v3itfXRQeSjxLSjmSx4as",
    "y": "AGCSspCH7gJfMZ71OM1spca_Z8-GRtPynd5G_H5fXj-Nivn-BOpRx9ws_wmPLPLcpxhS0O7mUlgGH_LZgH0wrA3W"
  },
  "qbo_aux": "72605773-5885-4c43-90cd-1d06abddc4d7",
  "qbo_port": 443,
  "qbo_host": "origin.cloud.qbo.io",
  "qbo_user": "alex@eadem.com"
}

{
  "provider": "qbo",
  "type": "service_account",
  "qbo_uid": {
    "crv": "P-521",
    "kty": "EC",
    "x": "AZEZgwvTKsXodvyWvwQ_jkQBIxL5\6S-6yJBIAxpZEeDMn3ZAUsnAhpl7B-q9NJRs9zs7v3itfXRQeSjxLSjmSx4as",
    "y": "AGCSspCH7gJfMZ71OM1spca_Z8-GRtPynd5G_H5fXj-Nivn-BOpRx9ws_wmPLPLcpxhS0O7mUlgGH_LZgH0wrA3W"
  },
  "qbo_aux": "72605773-5885-4c43-90cd-1d06abddc4d7",
  "qbo_port": 443,
  "qbo_host": "origin.cloud.qbo.io",
  "qbo_user": "alex@eadem.com"
}
<Press any key to continue> | <CTRL+C to exit>

```

```bash
ls ./cloud.qbo.io/prod/
iam.json  id_rsa.pub  link.json  registry.json
```

#### Start LINK

Once the **LINK** wizard configuration is completed, the configuration files will be generated under cloud.qbo.io (or under your **ORIGIN**'s domain name if you are not using QBO's), and they will be read when the API starts.

The following command will start the **LINK** with notice-level logging (`-l notice`), perform a clean install (`-c`) which will delete and prune previous Docker images and configurations, and set the default build type to prod (`-r prod`).

```bash
./qbo start api -C cloud.qbo.io -lnotice -t origin -c
CLOUD: *.cloud.qbo.io
TYPE: origin
IMAGE: eadem/api:latest
BUILD: prod
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>
```

## **ORIGIN**

If you are configuring a **LINK**, go to this section: [LINK Configuration](installation#LINK).

---

### **Google Cloud DNS**

> Note that this configuration is needed for **ORIGIN** deployments only.

Add a zone on the Google Cloud DNS console.

{% preview "zone.png" %}

Save your zone name. It will use in your in your [**dns.json**](conf/dns.json) to fill in the `zone` field

**DNS Configuration**  
Once the zone is created, a set of Google DNS records will be generated. Use these DNS entries to delegate your domain by adding the provided NS records to your DNS provider.

{% preview "dns.png" %}

Add the following NS records in your DNS provider.

> The DNS provider for the domain _.qbo.io may differ from the _.cloud.qbo.io zone managed by Google DNS."

```dns
cloud	NS ns-cloud-a1.googledomains.com.
cloud	NS ns-cloud-a2.googledomains.com.
cloud	NS ns-cloud-a3.googledomains.com.
cloud	NS ns-cloud-a4.googledomains.com.
```

### **Google Cloud API & Services**

> Note that this configuration is needed for **ORIGIN** deployments only.
>
> To allow authentication from the Origin, add an OAuth client ID under API & Services.

{% preview "client_id.png" %}

### **Google Cloud Client ID**

Once completed, you can fill in your [**iam.json**](conf/iam.json) configuration from the Google console under Google API and Services.

{% preview "client_id_copy.png" %}

### **Google Cloud DNS Service Account**

> Note that this configuration is needed for **ORIGIN** deployments only.

Below is an example of the service account configuration obtained when adding an API key to the Google Service account:

{% preview "sa.png" %}

{% preview "sa_key.png" %}

Note that `zone` and `provider` are added as part of the Service Account configuration in [**dns.json**](conf/dns.json)

### QBO API

> Before proceeding, ensure the following prerequisites are completed:

|            | Prerequisite                 | Notes                                                                                                                                                                                                                                |
| ---------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [&#10003;] | `env` file configured        | The environment file with `IAM`, `KEY`, and `REGISTRY` variables should be properly set. If the `env` file is not in the root folder of the repository and was provided separately, copy it to the root directory of the repository. |
| [&#10003;] | HOST configuration completed | Ensure all [HOST tests](#host-tests) have passed successfully.                                                                                                                                                                       |
| [&#10003;] | User `qbo` shell             | You should have an active [SSH connection](#ssh-access) under the qbo user                                                                                                                                                           |
| [&#10003;] | Github repo                  | As the `qbo` user, clone the [repository](#github-project) into `/home/qbo`                                                                                                                                                          |

#### ORIGIN Configuration

The following command will configure the API in **ORIGIN** mode (`-t origin`) using the domain cloud.qbo.io (`-C cloud.qbo.io`). A wizard will start, guiding you through the process of configuring the API in **ORIGIN** mode.

> `cloud.qbo.io` is provided as an example; you should use your own domain name.

```bash
./qbo configure api -C cloud.qbo.io -c -t origin
```

```bash
>>> cloud.qbo.io
CLOUD: *.cloud.qbo.io
TYPE: origin
IMAGE: eadem/api:latest
BUILD: prod
_ALL: 0
CLEAN: 1
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>
[WARNING]: The environment file containing authentication credentials was not found. These credentials are necessary to run QBO in origin mode. Contact the QBO account team at info@qbo.io to obtain the file, or enter the credentials manually using this wizard.
<Press any key to continue> | <CTRL+C to exit>
```

> registry.json

```bash
>>> registry.json
Enter QBO Registry Credentials (prod):
[INFO]: Input in JSON format
< {
  "user": "qbo",
  "auth": "git.qbo.io",
  "token": "glpat-h6hsw1_tGCDFUU7tyAq2",
  "repo": "cloud",
  "hostname": "registry.qbo.io",
  "type": "gitlab"
}

{
  "user": "qbo",
  "auth": "git.qbo.io",
  "token": "glpat-h6hsw1_tGCDFUU7tyAq2",
  "repo": "cloud",
  "hostname": "registry.qbo.io",
  "type": "gitlab"
}
<Press any key to continue> | <CTRL+C to exit>
```

> id_rsa.pub

```bash
>>> id_rsa.pub
Enter SSH Id RSA Public Key:
[INFO]: The 'qbo' script will automatically add a public SSH key to the 'authorized_hosts' file. The host can then only be accessed using the corresponding private key, as password authentication will be disabled.
< ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAABCAQCmAu9Svd4MwTrse5ouXvMED2jUGgbynbQs3VxG9kB0tb3RycrL923VrA+amh+YN8VGgphk/b7TxnWR5l26VfMqIv2CmXwi7OTqmUN6I4WQQsFnkU0v5lPtMp5Wl0CvWG6l6woYT9p2lblB6XoiLAnMrlHJ6xSzGJP8Wj0IVIrU54DGhI23IJhrOHBOGEcpIPc9qbmt47CB7jF+fYXjkFxOjYIMWkoMncuq+D/8/kbilZ4sbXF0hBrNYL1xN3g35ce0p/jE/525PxRuzaYOuf3oGeqFFd8BjQfENFiPn3x2In3x9mTzUYKkniedC5PuWuP4BkwI6/yfDs63HqzH4NPz5XqOKzlxwAN8co9xdOjt4v3zIUpLPJ2KTdh00quQMXITu+Ew4hnbRpoJDGu9Gra9Hw2osUMeVhLawfiu9PFaa0ysEzzi4lvZJZzV57VPoJpZD9H9hQDp6ixaNgWckQI6csAeOFrVSpYnleVjVzspyYfRQaikcZRUn3S4NOQT/gOtbqIlZsKwth51gBOhIgerknDcfY8ykXtYvJ6GqgEu+yzbJt8tXEbaEOYqNnH1WundqfouyqqnlgtzV4ac+RcGx6UDl/Ift3i1/IVwJP4dIdlgcrp+KMKWJ/uxIPFHy8QUlhTlnJyzqHmZUy5bVRP/zPFnJ0GyXjF2BXma2Y+xVw== alex@fenestra.cloud.qbo.io
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAABCAQCmAu9Svd4MwTrse5ouXvMED2jUGgbynbQs3VxG9kB0tb3RycrL923VrA+amh+YN8VGgphk/b7TxnWR5l26VfMqIv2CmXwi7OTqmUN6I4WQQsFnkU0v5lPtMp5Wl0CvWG6l6woYT9p2lblB6XoiLAnMrlHJ6xSzGJP8Wj0IVIrU54DGhI23IJhrOHBOGEcpIPc9qbmt47CB7jF+fYXjkFxOjYIMWkoMncuq+D/8/kbilZ4sbXF0hBrNYL1xN3g35ce0p/jE/525PxRuzaYOuf3oGeqFFd8BjQfENFiPn3x2In3x9mTzUYKkniedC5PuWuP4BkwI6/yfDs63HqzH4NPz5XqOKzlxwAN8co9xdOjt4v3zIUpLPJ2KTdh00quQMXITu+Ew4hnbRpoJDGu9Gra9Hw2osUMeVhLawfiu9PFaa0ysEzzi4lvZJZzV57VPoJpZD9H9hQDp6ixaNgWckQI6csAeOFrVSpYnleVjVzspyYfRQaikcZRUn3S4NOQT/gOtbqIlZsKwth51gBOhIgerknDcfY8ykXtYvJ6GqgEu+yzbJt8tXEbaEOYqNnH1WundqfouyqqnlgtzV4ac+RcGx6UDl/Ift3i1/IVwJP4dIdlgcrp+KMKWJ/uxIPFHy8QUlhTlnJyzqHmZUy5bVRP/zPFnJ0GyXjF2BXma2Y+xVw== alex@fenestra.cloud.qbo.io
<Press any key to continue> | <CTRL+C to exit>
```

> iam.json

```bash
>>> iam.json
Enter Google Authentication Client ID:
[INFO]: Your Client ID can be found under 'API & Services' in the Google Cloud Console. Visit https://console.cloud.google.com/apis/credentials to locate it. It is required to authenticate your application with Google services. Example: '1234567890-abcdefg.apps.googleusercontent.com'.
< 618979529734-pba2m5leob2ouggj12153nkuvvnou681.apps.googleusercontent.com
{
  "client_id": "618979529734-pba2m5leob2ouggj12153nkuvvnou681.apps.googleusercontent.com",
  "provider": "google"
}
<Press any key to continue> | <CTRL+C to exit>
```

> key.json

```bash
>>> key.json
Enter QBO Key:
< {
  "crv": "P-521",
  "kty": "EC",
  "x": "AfZNaIVMIGh5Qc7WuaWxwa0xHwriJ_d1bTemKtdl208oAkeB2xbhXHSc3QY6RUWHK511glnTRAzP3htAFWPioPck",
  "y": "ATkunpTXycJj9ZHI2jTJAoYhsb7U-TJlZhXORpkPPo35Wh35dEbzizwgVwIzUxbNgm_pdp1BZKyDJrR86ZnJHbyq",
  "u": "eyJhbGciOiJFQ0RILUVTIiwgImVuYyI6IkEyNTZDQkMtSFM1MTIiLCAiZXBrIjp7ImNydiI6IlAtNTIxIiwia3R5IjoiRUMiLCJ4IjoiQVE0M1NMV3RvVnpRY1IyNF95bUhHS2xkbTlJdGdHMUJUMnlMdUN0ZHNfYklUSWJubFVHOXNPZWQ4LTdJVWhCWUllS1NUVmozZ3ZLNEF0VVUxM09FVDItSiIsInkiOiJBR0htcUNEX0oxLWFhRG5LQTVWbkxwa01jdEFHb1dKX2l1QS1qT2JKTkpIcmo4UG1FWDdzR0ZHanNKOVZMOXhqZm9ycmJnSUtwQ3NHYkVneF91UzBfU01HIn19..OW77Md5cELnCwL44CAMBlA.oiTQA528L7d7qs6hALbICPSL9d_W2e0znafHDklX2yDwELsKFiJxbhM1TL0B3JTmlmMYOaAcCBwjWSJMO3qVkg.SCkcPO4TVQH7xv21Z7Iwh5W56Tad_SQUJu4KmdWElyM",
  "ipse": "o-5b92876f.acme.cloud"
}

{
  "crv": "P-521",
  "kty": "EC",
  "x": "AfZNaIVMIGh6Qc5WuaWxwa0xHwriJ_d1bTemKtdl208oAkeB2xbhXHSc3QY6RUWHK511glnTRAzP3htAFWPioPck",
  "y": "ATkunpTXycJj9ZHI2jTJAoYhsb7U-TJlZhXORpkPPo35Wh35dEbzizwgVwIzUxbNgm_pdp1BZKyDJrR86ZnJHbyq",
  "u": "eyJhbGciOiJFQ0RILUVTIiwgImVuYyI6IkEyNTZDQkMtSFM1MTIiLCAiZXBrIjp7ImNydiI6IlAtNTIxIiwia3R5IjoiRUMiLCJ4IjoiQVE0M1NMV3RvVnpRY1IyNF95bUhHS2xkbTlJdGdHMUJUMnlMdUN0ZHNfYklUSWJubFVHOXNPZWQ4LTdJVWhCWUllS1NUVmozZ3ZLNEF0VVUxM09FVDItSiIsInkiOiJBR0htcUNEX0oxLWFhRG5LQTVWbkxwa01jdEFHb1dKX2l1QS1qT2JKTkpIcmo4UG1FWDdzR0ZHanNKOVZMOXhqZm9ycmJnSUtwQ3NHYkVneF91UzBfU01HIn19..OW77Md5cELnCwL44CAMBlA.oiTQA528L7d7qs6hALbICPSL9d_W2e0znafHDklX2yDwELsKFiJxbhM1TL0B3JTmlmMYOaAcCBwjWSJMO3qVkg.SCkcPO4TVQH7xv21Z7Iwh5W56Tad_SQUJu4KmdWElyM",
  "ipse": "o-5b92876f.acme.cloud"
}
<Press any key to continue> | <CTRL+C to exit>
```

> acme.json

```bash
>>> acme.json
Enter ACME Country: US
[INFO]: The 'Country' field specifies the country where your organization is based. Enter a valid two-letter country code as per the ISO 3166-1 standard. For example, 'US' for the United States or 'GB' for the United Kingdom
<
Enter ACME Locality: San Francisco
[INFO]: The 'Locality' field specifies the city or locality of your organization. Example: San Francisco
<
Enter ACME Organizaton:
[INFO]: The 'Organization' field identifies your organization within the certificate. Example: Acme Technologies LLC
< qbo
Organization name is valid.
Organization name is valid.
Enter ACME State: { CA }
[INFO]: The 'State' field specifies the state, province, or region where your organization is located. Enter the full name of the state or its appropriate abbreviation. For example, 'California' or 'CA' for California in the United States, 'Ontario' or 'ON' for Ontario in Canada.
<
Enter ACME Email:
< alex@eadem.com
{
  "provider": "letsencrypt",
  "type": "dns-01",
  "auth-path": "/tmp/qbo/acme/live/cloud.qbo.io/auth.jwk",
  "cert-path": "/tmp/qbo/acme/live/cloud.qbo.io/fullchain.pem",
  "key-path": "/tmp/qbo/acme/live/cloud.qbo.io/privkey.pem",
  "directory-url": "https://acme-v02.api.letsencrypt.org/directory",
  "country": "US",
  "state": "CA",
  "locality": "San Francisco",
  "organization": "qbo",
  "common-name": "*.cloud.qbo.io",
  "email": "alex@eadem.com"
}
<Press any key to continue> | <CTRL+C to exit>
```

> dns.json

```bash
>>> dns.json
Enter Google Cloud DNS Zone Name:
[INFO]: You can find your DNS Zone Name in the Google Cloud Console at: https://console.cloud.google.com/net-services/dns/zones. Please ensure the zone name corresponds to the correct DNS configuration for your project.
< eadem
Enter Google Cloud DNS Service Account:
[INFO]: You can find your DNS Cloud Service Account under 'IAM & Admin' in the Google Cloud Console: https://console.cloud.google.com/iam-admin/serviceaccounts
< {
  "type": "service_account",
  "project_id": "eadem",
  "private_key_id": "710d5070481253a8036f5635b42fff9ccacafb97",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxyms7gXZfAREA\ngIkPGbq8BDXpTNxC4L90jgZj7acGH+NNdY8VhMyBlE0cgPwdqaNqubEqKCwLMXWV\n60Z9sohdwlF/1IO2xvxiSuAMJUwWlTPhzUvP1eLghW0bco8Anj7OkODNJbOefZRe\nGyIvhGtCYlOdqCSYq6WuQmfT0QUwoMC3XL0f6YYb8uV5du0RCDNgkVlsezxsy7DM\nlTYo4xFLcC+HDaHl4vO9n/WuRxjbQVsdyrhQi5xlhz4QCG2O8RY8+bAvvwt5pGg+\n9pui6OCPkdDn2TnmRocsorBRotKiHSMaqkFIXCEHOycU/TmL5hcxn2U7vxpvO4NY\nRYe5kyWLAgMBAAECggEAJCwou7fECjWCIiWYm5o5TfyBRjxZ7WVrLxg6S4PXy3pE\nyqdONyVtZOtXV+7SCOwChyptn0VwRWJqWXnfy1lEvmYeRDX6WINPabMS7q47wlsi\n7mKEt3yjmvxLFOKgEzMZaVTSVM6RnyHhauy7QgmY9E76fGkVxINVX4sOtmkcUihI\nB3WKB7VSV0PMbXR50fD8dJSFRDx1wPmemJhjkgAM14tlEaSYBbdu2h3e1DIcbpX3\nhYe6uSsfCNmG7bVThalaQSWcPzKzk/EX/2/PK5D7cWidU6hhBNiOyKlej+i27Zo9\nOQ0yGuXl8YZVtD8zJMzmDCVrUiXYJ01zs2ylOK8g3QKBgQD992I8hv0xsfLhCO+z\n2JrxmoyINQ0Or5LZU8/RMsPLgS6DpmOLzQz8kiwR/U1yBevQ+NJ5kwALE4cuhVw6\ndilD4eDE7kOLGmMjmVrcGX6La9rUOOESp4uqqvp8m2EGS2hBrQjkoNGKuwjxiGQY\nXdFJDxIKDHNCAA8mD+3PI+EmpQKBgQDzuhNmIMDu0OXS0rTAwxC5YkBaZOitGDhl\nXQrKqh/glV0VnGT0XgRB74yrb0G57ZE5r2ND5l95j4B29YXm0D7mkLtUbDTRflkY\ndEPAzm8zseJ+dVnrV35i2iQx2c/vStXCGeVthPU9SgI2UT0RJe8HAJwEoHe+CGMA\nHFMOd2yUbwKBgQCqbvNJJVoTmJUjOgkLC6jnzMzUt618lo0ZNeq4PLYzAw2BIg+a\nCVDWyw2yQOhRRfH8eo9dMS6NQFyu9qZvQU7uFE7wOemwF1RC1q6oGJ/Y1tezJjy9\ndR0Aut+A8hFJ1R8xO/tE2zvkOyKEXQC3bXZ+7hMwFSzgNQP1iikQosZ9VQKBgFA6\nb0pN+9RhFVYJoBBX5bhwfCiFUQYxk9biArxlteqSoDqN6bl6/UHLHe4MyIDwj76C\nWlWujr0QHMSL25D3+cyh1dhbaiOPyLpBA1CDY52Lr7fa30eV3HejwQhb35OweZ7U\nMW6Utrl/FC1XHpf3ebA/Zhwryl7WmegeasS3URmnAoGBALoup0j8VY3lyu814E3b\nQ1zsiqcJnSEZVqoYYe4gOqsmJt7fpOSZC8WMwEbwYS/qcZRN5GfSX090V7LqlmES\npM28LOKHy3jd3aHan4TmoWlkkgE9bTz+TpHbfos4lbRheRc6FY6A6cM6QyXuhJBb\n1tZOXoXpXH3K9A/gH3+CuyW9\n-----END PRIVATE KEY-----\n",
  "client_email": "eadem@eadem.iam.gserviceaccount.com",
  "client_id": "104697797075099706139",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/eadem%40eadem.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

{
  "type": "service_account",
  "project_id": "eadem",
  "private_key_id": "710d5070481253a8036f5635b42fff9ccacafb97",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDxyms7gXZfAREA\ngIkPGbq8BDXpTNxC4L90jgZj7acGH+NNdY8VhMyBlE0cgPwdqaNqubEqKCwLMXWV\n60Z9sohdwlF/1IO2xvxiSuAMJUwWlTPhzUvP1eLghW0bco8Anj7OkODNJbOefZRe\nGyIvhGtCYlOdqCSYq6WuQmfT0QUwoMC3XL0f6YYb8uV5du0RCDNgkVlsezxsy7DM\nlTYo4xFLcC+HDaHl4vO9n/WuRxjbQVsdyrhQi5xlhz4QCG2O8RY8+bAvvwt5pGg+\n9pui6OCPkdDn2TnmRocsorBRotKiHSMaqkFIXCEHOycU/TmL5hcxn2U7vxpvO4NY\nRYe5kyWLAgMBAAECggEAJCwou7fECjWCIiWYm5o5TfyBRjxZ7WVrLxg6S4PXy3pE\nyqdONyVtZOtXV+7SCOwChyptn0VwRWJqWXnfy1lEvmYeRDX6WINPabMS7q47wlsi\n7mKEt3yjmvxLFOKgEzMZaVTSVM6RnyHhauy7QgmY9E76fGkVxINVX4sOtmkcUihI\nB3WKB7VSV0PMbXR50fD8dJSFRDx1wPmemJhjkgAM14tlEaSYBbdu2h3e1DIcbpX3\nhYe6uSsfCNmG7bVThalaQSWcPzKzk/EX/2/PK5D7cWidU6hhBNiOyKlej+i27Zo9\nOQ0yGuXl8YZVtD8zJMzmDCVrUiXYJ01zs2ylOK8g3QKBgQD992I8hv0xsfLhCO+z\n2JrxmoyINQ0Or5LZU8/RMsPLgS6DpmOLzQz8kiwR/U1yBevQ+NJ5kwALE4cuhVw6\ndilD4eDE7kOLGmMjmVrcGX6La9rUOOESp4uqqvp8m2EGS2hBrQjkoNGKuwjxiGQY\nXdFJDxIKDHNCAA8mD+3PI+EmpQKBgQDzuhNmIMDu0OXS0rTAwxC5YkBaZOitGDhl\nXQrKqh/glV0VnGT0XgRB74yrb0G57ZE5r2ND5l95j4B29YXm0D7mkLtUbDTRflkY\ndEPAzm8zseJ+dVnrV35i2iQx2c/vStXCGeVthPU9SgI2UT0RJe8HAJwEoHe+CGMA\nHFMOd2yUbwKBgQCqbvNJJVoTmJUjOgkLC6jnzMzUt618lo0ZNeq4PLYzAw2BIg+a\nCVDWyw2yQOhRRfH8eo9dMS6NQFyu9qZvQU7uFE7wOemwF1RC1q6oGJ/Y1tezJjy9\ndR0Aut+A8hFJ1R8xO/tE2zvkOyKEXQC3bXZ+7hMwFSzgNQP1iikQosZ9VQKBgFA6\nb0pN+9RhFVYJoBBX5bhwfCiFUQYxk9biArxlteqSoDqN6bl6/UHLHe4MyIDwj76C\nWlWujr0QHMSL25D3+cyh1dhbaiOPyLpBA1CDY52Lr7fa30eV3HejwQhb35OweZ7U\nMW6Utrl/FC1XHpf3ebA/Zhwryl7WmegeasS3URmnAoGBALoup0j8VY3lyu814E3b\nQ1zsiqcJnSEZVqoYYe4gOqsmJt7fpOSZC8WMwEbwYS/qcZRN5GfSX090V7LqlmES\npM28LOKHy3jd3aHan4TmoWlkkgE9bTz+TpHbfos4lbRheRc6FY6A6cM6QyXuhJBb\n1tZOXoXpXH3K9A/gH3+CuyW9\n-----END PRIVATE KEY-----\n",
  "client_email": "eadem@eadem.iam.gserviceaccount.com",
  "client_id": "104697797075099706139",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/eadem%40eadem.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com",
  "zone": "eadem",
  "provider": "google"
}
<Press any key to continue> | <CTRL+C to exit>
```

```bash
ls cloud.qbo.io/prod/
acme.json  dns.json  iam.json  id_rsa.pub  key.json  registry.json

```

#### **Start ORIGIN**

Once the ORIGIN wizard configuration is completed, the configuraton files will be generated under `cloud.qbo.io` in this example and read when the API starts.
The following command will start the ORIGIN with `notice` level logging `-lnotice`, perform a clean install (which will delete and prune previous Docker images) `-c`, and prod.

> `cloud.qbo.io` is provided just an example and you should use your own domain name

```bash
./qbo start api -C cloud.qbo.io -lnotice -t origin -c
CLOUD: *.cloud.qbo.io
TYPE: origin
IMAGE: eadem/api:latest
BUILD: prod
-------------------------------------------------------------------------------
<Press any key to continue> | <CTRL+C to exit>
```

### **Google Cloud Authorized JavaScript Origin**

> Note that this configuration is needed for **ORIGIN** deployments only.

The URL should begin with `o-`, and you must use the complete URL, for example: `https://o-5b92876f.acme.cloud`

{% preview "ajo.png" %}

## **Web Console Access**

You can access the **LINK** or **ORIGIN** console through the assigned domain name using a Chrome-based browser.

> Note:
> **ORIGIN** hostnames start with `o-`, for example: https://o-5b92876f.acme.cloud. > **LINK** hostnames start with `l-`, for example: https://l-6a90876f.acme.cloud.

{% preview "login.png" %}

---

## **Network Configuration**

Before utilizing the QCE or QKE engines, a network must be added for QBO to use. Execute the following command in the [QBO web terminal](https://www.qbo.io/docs/web) to add the network:

```bash
qbo add network 192.168.1.220 192.168.1.221 192.168.1.222 192.168.1.223
```

---

{% preview "net.png" %}

## **Getting Started**

To learn how to get started with QBO and begin running your app in Kubernetes or on compute instances, refer to our [resources page](https://www.qbo.io/resources/).

---

## **Support**

If you need assistance, you can reach out to the QBO support team through the following channels:

- **Email**: support@qbo.io
