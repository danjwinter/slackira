# Slackira

Slackira is a simple app to support slack to JIRA ticket comments using tagging `#slackira-<JIRA_TICKET_ID>`. Slackira is configured as a cronjob to be run in kubernetes and requires the following environment variables to be set during build time:
- $SLACK_TOKEN
- $JIRA_USERNAME
- $JIRA_PASSWORD


