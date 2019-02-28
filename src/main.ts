import * as slack from './slack'
import * as jira from './jira'

require('sepia');

async function main() {
  try {
    const messages = await slack.getAllSlackiraMessages()
    await Promise.all(jira.buldAddCommentsIdempotent(messages))
  } catch(e) {
    console.log('There was an error getting messages from Slack or sending them to Jira')
    console.log(e)
  }
}

main().then(() => {
  console.log('finished')
})
