sinon = require 'sinon'
chai = require 'chai'

chai.use(require 'chai-as-promised')
chai.use(require 'sinon-chai')

# publish globals that all specs can use
global.expect = chai.expect
global.should = chai.should()
global.sinon = sinon

beforeEach ->
  global.sinon = sinon.sandbox.create()

afterEach ->
  global.sinon.restore()
