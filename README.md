gcloud auth login

gcloud beta compute ssh --zone "us-east1-b" "instance-1" --project "kostyapro-website"


https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx

https://github.com/nodesource/distributions/blob/master/README.md



npm run build
gcloud beta compute scp --zone "us-east1-b" --project "kostyapro-website" saunter-dev.tar.gz instance-1:saunter-dev.tar.gz
gcloud beta compute ssh --zone "us-east1-b" "instance-1" --project "kostyapro-website" --command='mkdir -p saunter-dev && rm -rf saunter-dev/* && tar -xvf saunter-dev.tar.gz -C saunter-dev && cd saunter-dev && npm install && nohup npm start &'