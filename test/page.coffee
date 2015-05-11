serverPage = require('../classes/Page/serverPage.js')
clientPage = require('../classes/Page/clientPage.js')
assertExtends = require('./helpers/assertExtends')

describe 'Test Page class', ->

  it 'should expose the same API on client and server', ->  
    serverPage = new serverPage({},{})
    clientPage = new clientPage({},{})

    assertExtends(clientPage, serverPage)
    assertExtends(serverPage, clientPage)
