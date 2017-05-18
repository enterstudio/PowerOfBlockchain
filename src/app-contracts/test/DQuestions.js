/* eslint-env mocha */
const expect = require('chai').expect
const DQuestions = artifacts.require('DQuestions.sol')

contract('DQuestions', function () {
  let questions

  beforeEach(async function () {
    questions = await DQuestions.new()
  })

  it('can be constructed', async function () {
    expect(questions).to.exist
  })

  it('has no questions initially', async function () {
    let numberOfQuestions = await questions.numberOfQuestions()
    expect(numberOfQuestions.toNumber()).to.equal(0)
  })
})
