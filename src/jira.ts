const JiraApi = require('jira-client');

// Initialize
const jira = new JiraApi({
  protocol: 'https',
  host: 'slackira.atlassian.net',
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  apiVersion: '2',
  strictSSL: true
});

async function addComment(issueId, comment) {
  console.log(`trying to add comment for issue ${issueId} with comment ${comment}`)
  try {
    return await jira.addComment(issueId, comment)
  } catch (e) {
    console.log('could not add comment with jira node')
    console.log(e.message)
    console.log(e.options)
  }
}

export async function buldAddCommentsIdempotent(messages) {
  return messages.map((message) => addCommentsIdempotent(message.issue, message.comment))
}

export async function addCommentsIdempotent(issueId, newComment) {
  const comments = await getIssueComments(issueId)
  if (comments.filter((issueComment) => issueComment.body === newComment).length === 0) {
    await addComment(issueId, newComment)
    console.log(`added comment ${newComment} to issue ${issueId}`)
  } else {
    console.log(`comment ${newComment} was already on issue ${issueId}`)
  }
}

async function getIssueComments(issueId) {
  const issue = await findIssue(issueId)
  return issue.fields.comment.comments
}

async function findIssue(issueId) {
  console.log(`trying to find issue ${issueId}`)
  try {
    return await jira.findIssue(issueId)
  } catch (e) {
    console.log('could not add comment with jira node')
    console.log(e.message)
    console.log(e.options)
  } 
}
