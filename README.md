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