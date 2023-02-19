# Next.js Dokku demo

```bash
# on server (in dokku container)
# https://nextjs-blank-dokku.dokku.arm1.localhost3002.live
docker exec -it dokku bash dokku apps:create nextjs-blank-dokku

# add remote (in local app git repo)
git remote add dokku dokku@dokku.arm1.localhost3002.live:nextjs-blank-dokku
git push dokku master:master
```