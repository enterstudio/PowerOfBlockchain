/* eslint-env mocha */
/* global web3 */
const expect = require('chai').expect
const Tournament = artifacts.require('Tournament.sol')

contract('Tournament', function (accounts) {
  let questions

  beforeEach(async function () {
    questions = await Tournament.new()
  })

  it('has no questions initially', async function () {
    const numberOfQuestions = await questions.numberOfQuestions()
    expect(numberOfQuestions.toNumber()).to.equal(0)
  })

  context('when adding a question', function () {
    const question = 'Who is Satoshi Nakamoto?'
    const answer = 'Nobody knows'

    beforeEach(async function () {
      await questions.add(question, web3.sha3(answer))
    })

    it('increases the number of questions', async function () {
      const numberOfQuestions = await questions.numberOfQuestions()
      expect(numberOfQuestions.toNumber()).to.equal(1)
    })

    it('can retrieve the added question', async function () {
      expect(await questions.getQuestion(0)).to.equal(question)
    })

    it('knows about the answer', async function () {
      expect(await questions.getAnswer(0)).to.equal(web3.sha3(answer))
    })

    context('when guessing the right answer', function () {
      const winner = accounts[1]
      const loser = accounts[2]

      beforeEach(async function () {
        await questions.guess(0, answer, { from: winner })
      })

      it('selects a winner', async function () {
        expect(await questions.getWinner(0)).to.equal(winner)
      })

      it('only selects a winner once', async function () {
        await questions.guess(0, answer, { from: loser })
        expect(await questions.getWinner(0)).to.equal(winner)
      })
    })

    context('when guessing a wrong answer', function () {
      const loser = accounts[2]

      beforeEach(async function () {
        await questions.guess(0, 'wrong answer', { from: loser })
      })

      it('does not select a winner', async function () {
        const person = await questions.getWinner(0)
        expect(web3.toDecimal(person)).to.equal(0)
      })
    })
  })
})
