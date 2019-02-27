// import * as JiraApi from 'jira-client';
var JiraApi = require('jira-client');
var requestify = require('requestify'); 

// Initialize
const jira = new JiraApi({
  protocol: 'https',
  host: 'slackira.atlassian.net',
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  apiVersion: '2',
  strictSSL: true
});

export async function addComment(issueId, comment) {
  console.log(`trying to add comment for issue ${issueId} with comment ${comment}`)
  try {
    return await jira.addComment(issueId, comment)
  } catch (e) {
    console.log('could not add comment with jira node')
    console.log(e.message)
    console.log(e.options)
  }
}
