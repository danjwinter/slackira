#!/usr/bin/env bash -e

frequency="${1:-${FREQUENCY_IN_MINUTES:-1}}"
git_sha=$(git rev-parse HEAD)

# Use minikube docker environment
eval $(minikube docker-env)

docker build . -t slackira:$git_sha
  # --build-arg JIRA_USERNAME=${JIRA_USERNAME} \
  # --build-arg JIRA_PASSWORD=${JIRA_PASSWORD} \
  # --build-arg SLACK_TOKEN=${SLACK_TOKEN} \
  # --build-arg SLACK_CHANNELS=${SLACK_CHANNELS} \

docker images

encoded_slack_token=$(echo -n $SLACK_TOKEN | base64)
encoded_jira_username=$(echo -n $JIRA_USERNAME | base64)
encoded_jira_password=$(echo -n $JIRA_PASSWORD | base64)

rm -rf kubernetes/manifests/*

sed -e "s/{{ SLACK_TOKEN }}/${encoded_slack_token}/g; s/{{ JIRA_USERNAME }}/${encoded_jira_username}/g; s/{{ JIRA_PASSWORD }}/${encoded_jira_password}/g" ./kubernetes/templates/secret.tpl > ./kubernetes/manifests/1-secret.yaml
sed -e "s/{{ GIT_SHA }}/${git_sha}/g; s/{{ SLACK_CHANNELS }}/${SLACK_CHANNELS}/g; s/{{ FREQUENCY_IN_MINUTES }}/${frequency}/g" ./kubernetes/templates/cronjob.tpl > ./kubernetes/manifests/2-cronjob.yaml

kubectl apply -f ./kubernetes/manifests/
kubectl get cronjob
