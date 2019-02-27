#!/usr/bin/env bash

git_sha=$(git rev-parse HEAD)

# Build image in the minikube environment
eval $(minikube docker-env)

docker build \
  --build-arg JIRA_USERNAME=${JIRA_USERNAME} \
  --build-arg JIRA_PASSWORD=${JIRA_PASSWORD} \
  --build-arg SLACK_TOKEN=${SLACK_TOKEN} \
  . -t slackiva:$git_sha
