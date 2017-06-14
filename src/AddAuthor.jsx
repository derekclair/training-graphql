import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class AddPost extends Component {
	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<input
					ref={(el) => { this.firstName = el; }}
					type="text"
					placeholder="First"
				/>
				<input
					ref={(el) => { this.lastName = el; }}
					type="text"
					placeholder="Last"
				/>
				<input
					type="submit"
					value="Join the Discussion"
				/>
			</form>
		);
	}

	onSubmit = (e) => {
		e.preventDefault();

		const firstName = this.firstName.value.trim();
		const lastName = this.lastName.value.trim();

		this.props.setUser(firstName, lastName);
		this.props.addAuthor(firstName, lastName);
	}
}

export default graphql(gql`
  mutation newAuthor($firstName: String!, $lastName: String) {
    newAuthor(firstName: $firstName, lastName: $lastName) {
      id
    }
  }
`, {
		props: ({ ownProps: { setAuthorId }, mutate }) => ({
			addAuthor(firstName, lastName) {
				mutate({ variables: { firstName, lastName } })
					.then(({ data: { newAuthor: { id } } }) => setAuthorId(id))
					.catch((err) => console.log('ERROR:', err));
			}
		}),
	})(AddPost);
