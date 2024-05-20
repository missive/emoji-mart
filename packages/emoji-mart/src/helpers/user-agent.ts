const agent: string = window.navigator.userAgent.toLowerCase()

const isMacOs: boolean = agent.indexOf('mac') !== -1
const isChrome: boolean = agent.indexOf('chrome') > -1
const chromeVersion: number = isChrome
  ? parseInt(agent.match(/chrome\/(\d+)/i)[1])
  : 0

export default {
  isMacOs,
  isChrome,
  chromeVersion,
}
