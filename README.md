# Next.js Dokku demo

```bash
# on server (in dokku container)
# https://nextjs-blank-dokku.dokku.arm1.localhost3002.live
docker exec -it dokku bash dokku apps:create nextjs-blank-dokku

# add remote (in local app git repo)
git remote add dokku dokku@dokku.arm1.localhost3002.live:nextjs-blank-dokku
git push dokku main:master
```

#### Install pack on host

```bash
(curl -sSL "https://github.com/buildpacks/pack/releases/download/v0.28.0/pack-v0.28.0-linux-arm64.tgz" | sudo tar -C /usr/local/bin/ --no-same-owner -xzv pack)

docker exec -it dokku bash dokku buildpacks:report

# trust builder
pack trust-builder gliderlabs/herokuish:latest-20

# list trusted
pack builder suggest
pack builder inspect <builder-image>
pack buildpack inspect gliderlabs/herokuish:latest-20

# list supported architectures
docker manifest inspect gliderlabs/herokuish:latest-20

docker exec -it dokku bash dokku buildpacks:add nextjs-blank-dokku https://github.com/paketo-buildpacks/nodejs.git

# allow arm64
docker exec -it dokku bash dokku builder-herokuish:set nextjs-blank-dokku allowed true
# taj
docker exec -it dokku bash dokku builder-herokuish:set --global allowed true

docker exec -it dokku bash dokku config:show nextjs-blank-dokku

docker exec -it dokku bash dokku ps:report

# https://oscarchou.com/posts/handbook/dokku-command-cheatsheet/
docker exec -it dokku bash dokku config:set nextjs-blank-dokku DOKKU_PROXY_PORT="80" DOKKU_PROXY_PORT_MAP="http:80:3000"

```

```bash
# git remote -v
dokku dokku@dokku.arm1.localhost3002.live:nextjs-blank-dokku

docker exec -it dokku bash dokku apps:list
nextjs-blank-dokku

# important, delete bind mount data
# must add ssh key again
sudo rm -rf ~/traefik-proxy/apps/dokku/dokku-data/*

docker exec -it dokku bash dokku apps:create nextjs-blank-dokku

git push dokku main:master

ssh-keygen -f "/home/username/.ssh/known_hosts" -R "[dokku.arm1.localhost3002.live]:3022"

```

### Main error


```bash
username@computer:~/Desktop/nextjs-blank-dokku$ git push dokku main:master
Enumerating objects: 44, done.
Counting objects: 100% (44/44), done.
Delta compression using up to 8 threads
Compressing objects: 100% (39/39), done.
Writing objects: 100% (44/44), 56.72 KiB | 2.47 MiB/s, done.
Total 44 (delta 12), reused 0 (delta 0), pack-reused 0
remote:  !     Herokuish builder not supported on arm64 servers.
remote:  !     Switching to pack builder.
-----> Cleaning up...
-----> Building nextjs-blank-dokku from cnb stack heroku/buildpacks (experimental)...
latest: Pulling from heroku/buildpacks
Digest: sha256:149ba2eceb2f3aba18328ea5fdc15a245952cd28b083f3cdd3ff8d19f37170fa
Status: Image is up to date for heroku/buildpacks:latest
20-cnb: Pulling from heroku/heroku
Digest: sha256:5b8bfd56b2862648234ac7b9528e407827d9e0f42748910e16b05b9dd03ec0d7
Status: Image is up to date for heroku/heroku:20-cnb
0.16.0: Pulling from buildpacksio/lifecycle
Digest: sha256:f75a04887fced3ae0504a37edb2c0d29d366511cd9ede34dbb90c5282b106e79
Status: Image is up to date for buildpacksio/lifecycle:0.16.0
===> ANALYZING
remote: [analyzer] exec /cnb/lifecycle/analyzer: exec format error
remote: ERROR: failed to build: executing lifecycle. This may be the result of using an untrusted builder: failed with status code: 1
remote:  !     Removing invalid image tag dokku/nextjs-blank-dokku:latest
remote:  !     App build failed
To dokku.arm1.localhost3002.live:nextjs-blank-dokku
 ! [remote rejected] main -> master (pre-receive hook declined)
error: failed to push some refs to 'dokku.arm1.localhost3002.live:nextjs-blank-dokku'
```

```bash
# 23. feb
// u app src
// pack builder suggest
ubuntu@arm1:~/traefik-proxy/apps/mern-boilerplate$ pack builder suggest
Suggested builders:
Google:                gcr.io/buildpacks/builder:v1      
Heroku:                heroku/builder:22
Heroku:                heroku/buildpacks:20
Paketo Buildpacks:     paketobuildpacks/builder:base
Paketo Buildpacks:     paketobuildpacks/builder:full
Paketo Buildpacks:     paketobuildpacks/builder:tiny 
---
// you are using a pack builder that doesnt work on arm64
-----
docker exec -it dokku bash dokku buildpacks:set nextjs-blank-dokku https://github.com/heroku/heroku-buildpack-nodejs.git

docker exec -it dokku bash dokku buildpacks:report
Buildpacks computed stack:     gliderlabs/herokuish:latest-20

```

```bash
docker exec -it dokku bash dokku buildpacks:remove nextjs-blank-dokku https://github.com/heroku/heroku-buildpack-nodejs.git

https://dev.to/emdienn/deploy-sveltekit-on-dokku-in-8-sort-of-easy-steps-28g2

docker exec -it dokku bash dokku buildpacks:set-property --global stack paketobuildpacks/builder:base

docker exec -it dokku bash dokku buildpacks:set-property --global stack heroku/builder:22



# unset globally
https://dokku.com/docs~v0.25.7/deployment/builders/herokuish-buildpacks/#removing-a-buildpack


# set globally
dokku buildpacks:set-property --global stack gliderlabs/herokuish:latest

# unset globally
docker exec -it dokku bash dokku buildpacks:set-property --global stack
```

### Solution

```ts
// can use main, no need for master
git push dokku main:main

// can use default
gliderlabs/herokuish:latest

// solves all arm64 dependencies, postgres, node.js...
https://featurist.co.uk/blog/hosting-rails-apps-for-free-on-oracle-cloud-with-dokku
https://www.reddit.com/r/docker/comments/ray2wc/comment/hnluex8
https://stackoverflow.com/questions/67017795/npm-install-is-failing-with-docker-buildx-linux-arm64
https://github.com/tonistiigi/binfmt
https://hub.docker.com/r/tonistiigi/binfmt

// this line, container installs and configures the host
docker run --privileged --rm tonistiigi/binfmt --install all

// todo:
routing and https fails, add dokku config

```

### Fix routing

docker exec -it dokku bash dokku domains:report --global

docker exec -it dokku bash dokku domains:report nextjs-blank-dokku

docker exec -it dokku bash dokku proxy:ports nextjs-blank-dokku

### Check if app container is running, not only Dokku container - Process Management

docker exec -it dokku bash dokku ps:start nextjs-blank-dokku

#### Rebuild

docker exec -it dokku bash dokku ps:rebuild nextjs-blank-dokku

### Lets encrypt https

this is plugin, not dokku config

https://github.com/dokku/dokku-letsencrypt

docker exec -it dokku bash dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
docker exec -it dokku bash dokku config:set --no-restart nextjs-blank-dokku DOKKU_LETSENCRYPT_EMAIL=acczasearchapi@gmail.com

docker exec -it dokku bash dokku letsencrypt:set nextjs-blank-dokku acczasearchapi@gmail.com

docker exec -it dokku bash dokku letsencrypt:enable nextjs-blank-dokku acczasearchapi@gmail.com

---
---

# After solved network error

### Add remote, create app and push

```bash
git remote add dokku dokku@dokku.arm1.localhost3002.live:nextjs-app

dokku apps:create nextjs-app

dokku apps:list

# check if added
dokku network:report node-app

git push dokku main:main
```

Traefik wont request cert for http app route

```bash
ubuntu@arm1:~/traefik-proxy/core$ curl https://node-app.dokku.arm1.localhost3002.live/
curl: (35) error:0A000126:SSL routines::unexpected eof while reading
```

Traefik has passthrough, Dokku must handle ssl

```
Error while dialing backend: dial tcp 172.21.0.4:443: connect: connection refused"
```