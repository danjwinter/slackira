# Slackira

Slackira is a simple app to support slack to JIRA ticket comments using tagging `#slackira-<JIRA_TICKET_ID>`. 


## Getting Started

Slackira is configured as a cronjob to be run in kubernetes but can also be run locally using Node. 

### Prerequisites

Slackira depends on the following environment variables for credentials and configuration:
- $SLACK_TOKEN # your slack access token
- $JIRA_USERNAME # jira username to post comments
- $JIRA_PASSWORD # jira password
- $SLACK_CHANNELS # comma-separated list of slack channels to monitor
- $FREQUENCY_IN_MINUTES # how often you want the cronjob to run, also how far back it looks on each run.

#### Local Minikube

Requires:
- Docker
- Minikube

#### Local Node

Requires:
- Node 11
- NPM

### Installing

Ensure you have the environment variables set from the prerequisites section.

#### Local Minikube
```
./bin/build-and-deploy.sh [FREQUENCY_IN_MINUTES=1]
```
NOTE: For FREQUENCY_IN_MINUTES, this script will first look for a value passed in at the command line, if none is there, it will look for an environment variable defined for FREQUENCY_IN_MINUTES and will finally default to every one minute if none is set.

#### Local Node
Note, this only runs the job once and defaults to looking back 2 minutes.

```
npm install
npm start
```

TODO: add support to pass argument to npm start to configure how far back to query.


## Running the tests

TODO: Add tests
TODO: Add a CI tool - Jenkins, Circle, etc

## Deployment

TODO: ADD cd script


## Contributing

Fork it and add a pull request!

## Next Steps

### Express Server
Add support for an express server for Slack to push messages to Slackira rather than Slackira pulling from Slack. This was not implemented originally because the service had to sit behind a firewall to post to JIRA but we are unable to poke a hole in the firewall for Slack to hit publicly. Development of this feature would likely include running ngrok locally to create a tunnel with a public IP addess for Slack to hit. 

### Golang K8S CronJob Rest API Sidecar
The golang k8s CronJob Rest API Sidecar would comprise of a service account with access to the k8s api-server cronjob information and would expose that as a rest api for the cronjob to determine the last success time and can self-heal by picking up from the last successful run. This would allow the job to recover from longer lived failures.

## Authors

* **Dan Winter** @danjwinter
