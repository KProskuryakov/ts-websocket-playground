gcloud auth login

gcloud beta compute ssh --zone "us-east1-b" "instance-1" --project "kostyapro-website"


https://certbot.eff.org/lets-encrypt/ubuntufocal-nginx


gcloud beta compute scp --zone "us-east1-b" --project "kostyapro-website" saunter-dev instance-1:saunter-dev
gcloud beta compute scp --zone "us-east1-b" --project "kostyapro-website" assets/* instance-1:assets/