
// File to cleanup RPG Maker MV (RMMV) files. See usage below for
// details. If you edit this file, please use the standard.js
// linter to keep things readable and robust.

'use strict'

var usage = `The cleanRMMV.js script is designed to clean your RMMV files.

You call it as

  node cleanRMMV.js /path/to/your/RMMV/project [/path/to/output]

where the first argument is the path to your RMMV project (i.e., the
directory containing things like your data and js sub-directories)
and the second optional argument is where you want the cleaned
output to go. If you omit the second argument (which is the typical
use case) then the output overwrites the input.

The purpose of this script is that after you have done some work
on RMMV and *CLOSED* the RMMV editor and *BEFOER* you commit to
git, you run cleanRMMV.js to cleanup all of your RMMV files to
make them nicer JSON format. This makes git diffs, merges, etc.,
much easier to work with.

See https://github.com/cmdted/rmmv_tools for more details.
`

var fs = require('fs')

function cleanPluginFile (fileName, outFile) {
  var data = fs.readFileSync(fileName).toString()
  var myRe = /^([^=]+=)(.+);/s
  var check = myRe.exec(data)
  var clean = check[2]
  var cleanJSON = JSON.parse(clean)
  fs.writeFileSync(outFile, check[1] + '\r\n' +
                   JSON.stringify(cleanJSON, null, 4) +
                   ';') // last ; needed since we expect it ourselves
}

function main () {
  if (process.argv.length < 3 ||
      process.argv[2] === '--help' || process.argv[2] === '-help' ||
      process.argv[2] === '-h') {
    console.log(usage)
    return
  }

  var projectRoot = process.argv[2]
  var outDir = process.argv[3]
  if (outDir == null) {
    outDir = projectRoot
  }
  var pluginsFile = projectRoot + '/js/plugins.js'
  var pluginsOut = outDir + '/js/plugins.js'

  var dataDir = fs.readdirSync(projectRoot + '/data/')
  for (let i = 0; i < dataDir.length; i++) {
    console.log('cleaning ' + dataDir[i])
    let myInPath = projectRoot + '/data/' + dataDir[i]
    let myOutPath = outDir + '/data/' + dataDir[i]
    let item = fs.readFileSync(myInPath).toString()
    let itemOut = JSON.stringify(JSON.parse(item), null, 4)
    fs.writeFileSync(myOutPath, itemOut)
  }

  console.log(`Will clean plugins file ${pluginsFile} to ${pluginsOut}`)

  cleanPluginFile(pluginsFile, pluginsOut)
}

main()
