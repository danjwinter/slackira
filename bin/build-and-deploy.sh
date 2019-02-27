#!/usr/bin/env bash -e

frequency="${1:-1}"
git_sha=$(git rev-parse HEAD)

# Use minikube docker environment
eval $(minikube docker-env)

docker build \
  --build-arg JIRA_USERNAME=${JIRA_USERNAME} \
  --build-arg JIRA_PASSWORD=${JIRA_PASSWORD} \
  --build-arg SLACK_TOKEN=${SLACK_TOKEN} \
  --build-arg SLACK_CHANNELS=${SLACK_CHANNELS} \
  . -t slackira:$git_sha

docker images

sed -e "s/{{ GIT_SHA }}/${git_sha}/g; s/{{ FREQUENCY_IN_MINUTES }}/${frequency}/g" ./kubernetes/templates/cronjob.tpl > ./kubernetes/manifests/cronjob.yaml

kubectl apply -f ./kubernetes/manifests/cronjob.yaml 
kubectl get cronjob
