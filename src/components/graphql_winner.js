// Now, let's create a GraphQL-enabled component...

// ... then, let's create the component and decorate it with the `graphql`
// HOC that will automatically populate `this.props` with the query data
// once the GraphQL API request has been completed

// ----------------------
// IMPORTS

/* NPM */

import React from 'react';
import PropTypes from 'prop-types';

// GraphQL
import { graphql } from 'react-apollo';

/* App */

// GraphQL queries.  Looking at this file demonstrates how to import fragments.
// Webpack will compile this into inline GraphQL for us, so we can pass the
// query to components using the @graphql decorator
import allGames from 'src/graphql/queries/all_games.gql';
import gameWon from 'src/graphql/queries/game_won.gql';

// ----------------------

// Since this component needs to 'listen' to GraphQL data, we wrap it in
// `react-apollo`'s `graphql` HOC/decorator and pass in the query that this
// component requires. Note: This is not to be confused with the `graphql`
// lib, which is used on the server-side to initially define the schema
@graphql(gameWon)
export default class GraphQLGames extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      gameWon: PropTypes.shape({
        winner: PropTypes.string,
      })
    }),
  }

  static defaultProps = {
    data: {
      gameWon: null
    },
  }

  renderWinner() {
    const { data } = this.props;

    // Since we're dealing with async GraphQL data, we defend against the
    // data not yet being loaded by checking to see that we have the `message`
    // key on our returned object
    const gameWon = data.gameWon

    // Apollo will tell us whether we're still loading.  We can also use this
    // check to ensure we have a fully returned response
    const isLoading = data.loading

    let result = null

    if (!isLoading) {
      const winner = gameWon.winner

      result = (
        <p>
          {winner}
        </p>
      )
    }

    return result
  }

  render() {
    return (
      <div>
        <h2>Winner</h2>
        {this.renderWinner()}
      </div>
    );
  }
}
