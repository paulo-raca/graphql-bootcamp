const message = 'Some message from myModule.js'
const name = 'Paulo Costa'
const location = 'Campinas, SP, Brazil'

const getGreeting = (name) => {
  return `Hello, ${name}`
}

export { message as msg, name, getGreeting, location as default }
