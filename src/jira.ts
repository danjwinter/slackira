const JiraApi = require('jira-client');

// Initialize
const jira = new JiraApi({
  protocol: 'https',
  host: process.env.JIRA_HOST,
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  apiVersion: '2',
  strictSSL: true
});

async function addComment(issueId: string, comment: string): Promise<void> {
  console.log(`trying to add comment for issue ${issueId} with comment ${comment}`)
  try {
    await jira.addComment(issueId, comment)
  } catch (e) {
    console.log('could not add comment with jira node')
    console.log(e.message)
    console.log(e.options)
    throw e
  }
}

interface Message {
  issue: string
  text: string
}

export function bulkAddCommentsIdempotent(messages: Message[] ): Promise<void>[] {
  return messages.map((message) => { return addCommentsIdempotent(message.issue, message.text) })
}

export async function addCommentsIdempotent(issueId: string, newComment: string): Promise<void> {
  const comments = await getIssueComments(issueId)
  if (comments.filter((issueComment) => issueComment.body === newComment).length === 0) {
    await addComment(issueId, newComment)
    console.log(`added comment ${newComment} to issue ${issueId}`)
  } else {
    console.log(`comment ${newComment} was already on issue ${issueId}`)
  }
}

interface IssueComments {
  body: string
}

async function getIssueComments(issueId: string): Promise<IssueComments[]> {
  const issue = await findIssue(issueId)
  return issue.fields.comment.comments
}

interface Issue {
  fields: {
    comment: {
      comments: IssueComments[]
    }
  }
}

async function findIssue(issueId: string): Promise<Issue> {
  console.log(`trying to find issue ${issueId}`)
  try {
    return await jira.findIssue(issueId)
  } catch (e) {
    console.log('could not add comment with jira node')
    console.log(e.message)
    console.log(e.options)
    throw e
  } 
}
