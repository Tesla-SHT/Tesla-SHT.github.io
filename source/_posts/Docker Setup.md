---
title: Docker Setup
abbrlink: d0c4e12
date: 2026-06-18 21:30:00
updated: 2026-06-18 21:35:00
tags:
- Linux
- Docker
- ROS
categories:
- Linux
- System
toc: true
cover:
---

Docker setup notes split out from [Linux Lookup](/posts/f7b0b433.html).

# Install Docker On Ubuntu 22.04

```bash
# remove old versions
sudo apt-get remove docker docker-engine docker.io containerd runc

# install docker
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install -y docker.io

# allow current user to run docker
sudo usermod -aG docker "$USER"
newgrp docker

# verify
docker --version
docker run --rm hello-world
```

# Docker Daemon Proxy

If pulling images is blocked by proxy or network settings, configure a Docker daemon proxy.

```bash
sudo mkdir -p /etc/systemd/system/docker.service.d

sudo tee /etc/systemd/system/docker.service.d/http-proxy.conf >/dev/null <<'EOF'
[Service]
Environment="HTTP_PROXY=http://proxy-host:port"
Environment="HTTPS_PROXY=http://proxy-host:port"
Environment="NO_PROXY=localhost,127.0.0.1,::1"
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker
sudo systemctl show --property=Environment docker

# verify again
docker run --rm hello-world
```

# ROS Jazzy Container

Pull the image:

```bash
docker pull osrf/ros:jazzy-desktop-full
```

Create the project container:

```bash
docker run -it --name mtc_jazzy \
  --network host \
  --ipc host \
  -v "$HOME/Robotic:/home/haotian/Robotic" \
  -w /home/haotian/Robotic \
  -e http_proxy="$http_proxy" \
  -e https_proxy="$https_proxy" \
  -e HTTP_PROXY="$HTTP_PROXY" \
  -e HTTPS_PROXY="$HTTPS_PROXY" \
  -e NO_PROXY="$NO_PROXY" \
  -e no_proxy="$no_proxy" \
  osrf/ros:jazzy-desktop-full \
  bash
```

Enter the same container later:

```bash
docker start -ai mtc_jazzy
```

If the container is already running, open another shell inside it:

```bash
docker exec -it mtc_jazzy bash
```

If group permissions have not refreshed in the current shell:

```bash
newgrp docker
```

# Daily Commands

```bash
docker ps                 # running containers
docker ps -a              # all containers
docker stop mtc_jazzy     # stop container
docker rm mtc_jazzy       # remove container, not host code
docker images             # local images
docker rmi <image>        # remove image
docker run --rm -it <IMAGE_ID> /bin/bash
```
