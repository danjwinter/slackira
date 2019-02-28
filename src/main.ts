import * as slack from './slack'
import * as jira from './jira'

require('sepia');

async function main() {
  try {
    const messages = await slack.formattedSlackiraMessages()
    // Promise.all(jira.buldAddCommentsIdempotent(messages))
    for (let i=0; i<messages.length;i++) {
      const message = messages[i]
      await jira.addCommentsIdempotent(message.issue, message.text)
    }
  } catch(e) {
    console.log('There was an error getting messages from Slack or sending them to Jira')
    console.log(e)
  }
}

main().then(() => {
  console.log('finished')
})
