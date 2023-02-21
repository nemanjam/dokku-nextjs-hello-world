# Next.js Dokku demo


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
docker exec -it dokku bash dokku builder-herokuish:set --global allowed true


```


```bash
# on server (in dokku container)
# https://nextjs-blank-dokku.dokku.arm1.localhost3002.live
docker exec -it dokku bash dokku apps:create nextjs-blank-dokku

# add remote (in local app git repo)
git remote add dokku dokku@dokku.arm1.localhost3002.live:nextjs-blank-dokku
git push dokku main:main
```