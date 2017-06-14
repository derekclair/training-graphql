
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { printSchema } from 'graphql/utilities/schemaPrinter';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import { subscriptionManager } from './subscriptions';
import schema from './schema';


const GRAPHQL_PORT = 8080;
const WS_PORT = 8090;


/*******************************************************************************
	Configure: GraphQL server
*******************************************************************************/
const graphQLServer = express();

graphQLServer.use('*', cors());

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({
	schema,
	context: {},
	allowUndefinedInResolve: true,
	pretty: true,
	formatError: (error) => ({
		message: error.message,
		locations: error.locations,
		stack: error.stack,
		path: error.path,
	}),
	// validationRules?: ?Array < any >,
	graphiql: true,
}));

graphQLServer.use('/graphiql', graphiqlExpress({
	endpointURL: '/graphql',
}));

graphQLServer.use('/schema', (req, res) => {
	res.set('Content-Type', 'text/plain');
	res.send(printSchema(schema));
});

graphQLServer.listen(GRAPHQL_PORT, () => console.log( // eslint-disable-line no-console
	`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`
));


/*******************************************************************************
	Configure: WebSocket server for subscriptions
*******************************************************************************/
const websocketServer = createServer((request, response) => {
	response.writeHead(404);
	response.end();
});


websocketServer.listen(WS_PORT, () => console.log( // eslint-disable-line no-console
	`Websocket Server is now running on http://localhost:${WS_PORT}`
));

// eslint-disable-next-line
new SubscriptionServer({
	onConnect: async (connectionParams) => {
		if (connectionParams.randomId) {
			console.log('randomId =>', connectionParams.randomId);
		}
	},
	subscriptionManager,
}, {
		server: websocketServer,
		path: '/',
	});
