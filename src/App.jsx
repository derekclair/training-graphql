
import React, { Component } from 'react';
import ApolloClient, { createNetworkInterface } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import {
	SubscriptionClient,
	addGraphQLSubscriptions,
} from 'subscriptions-transport-ws';


import PostList from './PostList';

import './App.css';

export default class App extends Component {
	constructor(props) {
		super(props);

		const wsClient = new SubscriptionClient('ws://localhost:8090', {
			reconnect: true,
			connectionParams: { randomId: Math.floor(Math.random() * 10000) },
		});

		const networkInterface = createNetworkInterface({
			uri: 'http://localhost:8080/graphql',
		});

		const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(networkInterface, wsClient);

		this.client = new ApolloClient({
			networkInterface: networkInterfaceWithSubscriptions,
			connectToDevTools: true,
			dataIdFromObject: (r) => (r.id),
		});

		this.state = {
			authorId: null,
			firstName: null,
			lastName: null,
		};
	}

	render() {
		return (
			<ApolloProvider client={this.client}>
				<PostList
					setAuthorId={this.setAuthorId}
					setUser={this.setUser}
					{...this.state}
				/>
			</ApolloProvider>
		);
	}

	setAuthorId = (authorId) => this.setState(() => ({ authorId }));

	setUser = (firstName, lastName) => this.setState(() => ({ firstName, lastName }));
}
