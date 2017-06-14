import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import update from 'react-addons-update';
import gql from 'graphql-tag';

class AddPost extends Component {
	constructor(props) {
		super(props);

		this.state = { comment: '' };
	}

	render() {
		return (
			<form onSubmit={this.onSubmit}>
				<input
					ref={(el) => { this.comment = el; }}
					type="text"
					onChange={this.onChange}
					placeholder="Add your 0.02 here"
				/>
				<input type="submit" value="submit" disabled={!this.state.comment} />
			</form>
		);
	}

	onChange = () => {
		this.setState(() => ({ comment: this.comment.value }));
	}

	onSubmit = (e) => {
		e.preventDefault();

		this.props.addNewPost(this.state.comment);
	}
}

export default graphql(gql`
  mutation newPost($post: NewPostInput!) {
    newPost(post: $post) {
      id
      votes
      comment
      author {
        id
        firstName
        lastName
      }
    }
  }
`, {
		props: ({ ownProps: { authorId }, mutate }) => ({
			addNewPost(comment) {
				mutate({
					variables: { post: { comment, authorId } },
					updateQueries: {
						allPosts: (prev, { mutationResult: { data } }) => (
							update(prev, { posts: { $push: [data.newPost] } })
						),
					},
				})
					.then(({ data: { newPost } }) => console.log('SUCCESS:', newPost))
					.catch((err) => console.log('ERROR:', err));
			}
		})
	})(AddPost);
