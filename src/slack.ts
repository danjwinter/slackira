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
  return new Date(new Date().getTime() - x * ms_per_minute).getTime()/1000
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
  return [].concat.apply([], histories)
}

const tagPrefix = '#slackira-'
const tagPattern = /(#slackira-).{1,}/

function match(str: string) {
  return str.match(tagPattern)
}

export async function formattedSlackiraMessages() {
  const messages = await getSlackiraMessages()
  return messages.map((message) => {
    const issue = match(message.text)[0].split(tagPrefix).pop()
    return {
      issue,
      text: message.text
    }
  })
}

async function getSlackiraMessages() {
  const messages = await pertinentChannelHistory()
  return messages.filter((message) => {
    return match(message.text)
  })
}

