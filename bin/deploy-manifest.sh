#!/usr/bin/env bash

frequency="${1:-1}"
git_sha=$(git rev-parse HEAD)
eval $(minikube docker-env)

sed -e "s/{{ GIT_SHA }}/${git_sha}/g; s/{{ FREQUENCY_IN_MINUTES }}/${frequency}/g" ./kubernetes/templates/cronjob.tpl > ./kubernetes/manifests/cronjob.yaml

kubectl apply -f ./kubernetes/manifests/cronjob.yaml
kubectl get cronjob
