// Simple smoke-test to make sure that SSR is working correctly
const ReactDOMServer = require('react-dom/server')
const React = require('react')
const { Picker, NimblePicker } = require('../dist/index.js')
const data = require('../data/all.json')

function testPicker() {
  const element = React.createElement(Picker)
  const string = ReactDOMServer.renderToString(element)

  if (typeof string !== 'string') {
    throw new Error('expected a string')
  }
}

function testNimblePicker() {
  const element = React.createElement(NimblePicker, { data })
  const string = ReactDOMServer.renderToString(element)

  if (typeof string !== 'string') {
    throw new Error('expected a string')
  }
}

testPicker()
testNimblePicker()
