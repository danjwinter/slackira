import * as slack from './slack'
import * as jira from './jira'

async function main() {
  const messages = await slack.formattedSlackiraMessages()
  for (let i=0; i<messages.length;i++) {
    const message = messages[i]
    // await jira.addComment(message.issue, message.text)
    await jira.addCommentsIfNotThere(message.issue, message.text)
  }
}

main().then(() => {
  console.log('finished')
})
