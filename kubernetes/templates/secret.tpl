apiVersion: v1
kind: Secret
metadata:
  name: slackira
type: Opaque
data:
  slack_token: {{ SLACK_TOKEN }}
  jira_username: {{ JIRA_USERNAME }}
  jira_password: {{ JIRA_PASSWORD }}
