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
            # imagePullPolicy: Never
          restartPolicy: OnFailure
