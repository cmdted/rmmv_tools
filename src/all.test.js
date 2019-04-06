
// This is a file for our unit tests. It should get run by the
// framework `jest` when you do `npm run test`

// The following tells eslint not to nag about `test` and `expect`
// since `jest` will define those.
/* global test expect */

const cleanRMMV = require('./cleanRMMV.js')
const fs = require('fs')
const tmp = require('tmp')

test('check source of move correct', () => {
  let tmpobj = tmp.dirSync()
  let dataDir = tmpobj.name + '/data/'
  let dataSubDir = tmpobj.name + '/data/subDir/'
  fs.mkdirSync(dataDir)
  fs.mkdirSync(dataSubDir)
  let outFileOne = dataDir + '/System.json'
  let exampleOne = [ { lots: 'of', packed: 'data' } ]
  fs.writeFileSync(outFileOne, JSON.stringify(exampleOne))
  let outFileTwo = dataSubDir + '/more.json'
  let exampleTwo = [ { lots: 'more', packed: 'data' } ]
  fs.writeFileSync(outFileTwo, JSON.stringify(exampleTwo))
  cleanRMMV.cleanDir(dataDir, dataDir)

  let cleanedOne = fs.readFileSync(outFileOne).toString()
  expect(cleanedOne).toBe(JSON.stringify(exampleOne, null, 4))

  let cleanedTwo = fs.readFileSync(outFileTwo).toString()
  expect(cleanedTwo).toBe(JSON.stringify(exampleTwo, null, 4))
})
