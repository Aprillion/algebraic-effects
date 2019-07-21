const RESUME_ERROR = new Error('enforce single resumeWith')
const state = {}
let resumeValue

const perform = effect => {
  const {stack} = new Error('perform')
  const callerList = stack.split('\n').slice(4)
  for (const caller of callerList) {
    if (!state[caller]) {
      continue
    }
    try {
      state[caller](effect)
    } catch (e) {
      if (e === RESUME_ERROR) {
        const returnValue = resumeValue
        resumeValue = undefined
        return returnValue
      }
    }
  }
}

const withPerform = (tryCallback, handleCallback) => {
  const {stack} = new Error('register')
  const currentWithPerform = stack.split('\n')[2]
  state[currentWithPerform] = handleCallback
  tryCallback()
}

const resumeWith = value => {
  const {stack} = new Error('resumeWith')
  const callerList = stack.split('\n').slice(6)
  for (const caller of callerList) {
    if (!state[caller]) {
      continue
    }
    resumeValue = value
    throw RESUME_ERROR
  }
}

module.exports = {perform, withPerform, resumeWith}
