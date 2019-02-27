import * as slack from './slack'
import * as jira from './jira'

async function main() {
  const messages = await slack.formattedSlackiraMessages()
  messages.forEach((message) => {
    jira.addComment(message.issue, message.text)
  })
}

main().then(() => {
  console.log('finished')
})
