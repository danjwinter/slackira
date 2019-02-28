const { WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;

const web = new WebClient(token);

async function listChannels() {
  const response = await web.conversations.list({
    exclude_archived: true,
    types: 'public_channel',
    limit: 100,
  });
  return response.channels
}

async function getChannelHistory(id: string, minutesAgo: number = null): Promise<object> {
  const result = await web.conversations.history({
    channel: id,
    oldest: timeXMinutesAgo(minutesAgo || parseInt(process.env.FREQUENCY_IN_MINUTES) || 2)
  })
  return result.messages
}

function timeXMinutesAgo(x: number) {
  const ms_per_minute = 60000;
  // x+2 adds a buffer in case of failed job.
  return new Date(new Date().getTime() - ((x+2) * ms_per_minute)).getTime()/1000
}

const channels = process.env.SLACK_CHANNELS && process.env.SLACK_CHANNELS.split(',') || ['slackjira']

async function trackedChannelIds() {
  const slackChannels = await listChannels()
  return slackChannels.filter((channel) => {
      return channels.includes(channel.name)
  }).map(channel => channel.id)
}

async function pertinentChannelHistory() {
  const tracked = await trackedChannelIds()
  const chanHistPromiseList = tracked.map((cId) => { return getChannelHistory(cId) })
  const histories = await Promise.all(chanHistPromiseList)
  const channelMessageMap = {}
  for (let i=0;i<tracked.length;i++) {
    channelMessageMap[tracked[i]] = histories[i]
  }
  return channelMessageMap
}

const messagePrefix = '#slackira-'
const messagePattern = /(#slackira-).{1,}/

const threadPrefix = '#slackira@thread-'
const threadPattern = /(#slackira@thread-).{1,}/

async function formattedSlackiraMessages(messages) {
  const filteredMessages = filterMessages(messages, messagePattern)
  return formatSlackiraMessages(filteredMessages, messagePattern, messagePrefix)
}

export async function getAllSlackiraMessages() {
  const channelAndMessages = await pertinentChannelHistory()
  //ABOVE is a map chanId > message[]

  // TODO: get user name to add  to message this just gets a user id
  // const users = messages.map((m) => m.user)

  const preparedSlackiraThreads = await formattedSlackiraThreads(channelAndMessages)
  const messages = [].concat.apply([], Object.values(channelAndMessages))
  const preparedSlackiraMessages = await formattedSlackiraMessages(messages)
  return [].concat.apply([], [preparedSlackiraMessages, preparedSlackiraThreads])
}

async function getAllMessagesOnThread(threadId, channelId) {
  const result = await web.conversations.replies({
    channel: channelId,
    ts: threadId
  })
  return extractThreadComments(result.messages)
}

function extractThreadComments(messages) {
  let fullComment = ""
  for( let i=0;i<messages.length;i++) {
    const message = messages[i]
    fullComment += message.text + '\n---\n'
  }
  return {text: fullComment}
}

async function formattedSlackiraThreads(chanMessageMap) {
  const threadPromises = []
  for (const chan in chanMessageMap) {
    const messages = filterMessages(chanMessageMap[chan], threadPattern)
    for (let i=0;i<messages.length;i++) {
      threadPromises.push(getAllMessagesOnThread(messages[i].thread_ts, chan))
    }
  }
  const slackiraThreads = await Promise.all(threadPromises)
  return formatSlackiraMessages(slackiraThreads, threadPattern, threadPrefix)
}

function formatSlackiraMessages(messages, pattern, prefix) {
  return messages.map((message) => {
    const issue = message.text.match(pattern)[0].split(prefix).pop()
    return {
      issue,
      text: message.text
    }
  })
}

function filterMessages(messages, pattern) {
  return messages.filter((message) => {
    return message.text.match(pattern)
  })
}

