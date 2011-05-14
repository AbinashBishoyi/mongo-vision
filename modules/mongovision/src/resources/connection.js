//
// Copyright 2010-2011 Three Crickets LLC.
//
// The contents of this file are subject to the terms of the Apache License
// version 2.0: http://www.opensource.org/licenses/apache2.0.php
// 
// Alternatively, you can obtain a royalty free commercial license with less
// limitations, transferable or non-transferable, directly from Three Crickets
// at http://threecrickets.com/
//

document.executeOnce('/mongo-db/')

function handleInit(conversation) {
	conversation.addMediaTypeByName('application/json')
	conversation.addMediaTypeByName('text/plain')
}

function handleGet(conversation) {
	var connection = application.globals.get('mongoDbConnection')
	if (null !== connection) {
		connection = {
			master: connection.address,
			addresses: connection.allAddress,
			options: connection.mongoOptions
		}
	}
	else {
		connection = {}
	}
	
	return JSON.to(connection, conversation.query.get('human') == 'true')
}

function handlePut(conversation) {
	var text = conversation.entity.text
	if (null === text) {
		return 400
	}
	var data = JSON.from(text, true)
	
	var connection = application.globals.get('mongoDbConnection')
	if (null !== connection) {
		try {
			connection.close()
		}
		catch (x) {
		}
	}

	application.globals.remove('mongoDbConnection')
	
	try {
		connection = MongoDB.connect(data.uris, data.options)
		application.globals.put('mongoDbConnection', connection)
	}
	catch (x) {
		return 500
	}

	return handleGet(conversation)
}
