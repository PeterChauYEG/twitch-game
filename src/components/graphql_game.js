// Now, let's create a GraphQL-enabled component...

// ... then, let's create the component and decorate it with the `graphql`
// HOC that will automatically populate `this.props` with the query data
// once the GraphQL API request has been completed

// ----------------------
// IMPORTS

/* NPM */
import moment from 'moment'

// React
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
      games: PropTypes.arrayOf(
        PropTypes.shape({
          game: PropTypes.shape({
            end_time: PropTypes.string,
            start_time: PropTypes.string,
            state: PropTypes.string,
            winner: PropTypes.string
          })
        })
      )
    }),
  }

  static defaultProps = {
    data: {
      games: []
    },
  }

  renderGame() {
    const { data } = this.props;

    // Apollo will tell us whether we're still loading.  We can also use this
    // check to ensure we have a fully returned response
    const isLoading = data.loading

    let result = null

    if (!isLoading) {
      const game = data.games[0]
      const formattedEndTime = moment(game.end_time).format('LLLL')
      const formattedStartTime = moment(game.start_time).format('LLLL')
      const timeRemaining = moment.duration(moment(game.end_time).diff(moment(game.start_end)))

      result = (
        <div>
          <p>Game Start: {formattedStartTime}</p>
          <p>Game End: {formattedEndTime}</p>
          <p>Game State: {game.state}</p>
          <p>Time Remaining: {timeRemaining.as('minutes')} minutes</p>
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
