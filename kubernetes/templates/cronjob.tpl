apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: slackira
spec:
  schedule: "*/{{ FREQUENCY_IN_MINUTES }} * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: slackira
            image: slackira:{{ GIT_SHA }}
            env:
            - name: FREQUENCY_IN_MINUTES
              value: "{{ FREQUENCY_IN_MINUTES }}"
            - name: SLACK_CHANNELS
              value: "{{ SLACK_CHANNELS }}"
            - name: JIRA_HOST
              value: "{{ JIRA_HOST }}"
            - name: SLACK_TOKEN
              valueFrom:
                secretKeyRef:
                  name: slackira
                  key: slack_token
            - name: JIRA_USERNAME
              valueFrom:
                secretKeyRef:
                  name: slackira
                  key: jira_username
            - name: JIRA_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: slackira
                  key: jira_password
          restartPolicy: OnFailure
