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

// ----------------------

// Since this component needs to 'listen' to GraphQL data, we wrap it in
// `react-apollo`'s `graphql` HOC/decorator and pass in the query that this
// component requires. Note: This is not to be confused with the `graphql`
// lib, which is used on the server-side to initially define the schema
@graphql(allGames)
export default class GraphQLGame extends React.PureComponent {
  static propTypes = {
    data: PropTypes.shape({
      clues: PropTypes.arrayOf(
        PropTypes.shape({
          clue: PropTypes.shape({
            description: PropTypes.string,
          })
        })
      )
    }),
  }

  static defaultProps = {
    data: {
      clues: []
    },
  }

  renderGame() {
    const { data } = this.props;

    // Since we're dealing with async GraphQL data, we defend against the
    // data not yet being loaded by checking to see that we have the `message`
    // key on our returned object
    const games = data.games

    // Apollo will tell us whether we're still loading.  We can also use this
    // check to ensure we have a fully returned response
    const isLoading = data.loading

    let result = null

    if (!isLoading) {
      result = (
        <div>
          <p>Game Start: {games[0].start_time}</p>
          <p>Game End: {games[0].end_time}</p>
          <p>Game State: {games[0].state}</p>
          <p>Time Remaining: 8:00 Hours</p>
        </div>
        )
    }

    return result
  }

  render() {
    return (
      <div>
        <h2>Clues</h2>
        {this.renderGame()}
      </div>
    );
  }
}
