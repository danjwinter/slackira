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

## Authors

* **Dan Winter** @danjwinter
