// Demonstrates several components on one page, each with their own `export`.
//
// These are smaller components that <Main> imports, and changes depending
// on the page route (via React Router).
//
// <WhenNotFound> demonstrates the use of <NotFound>, a ReactQL helper
// component that signals to our web server that we have a 404 error, to handle
// accordingly

// ----------------------
// IMPORTS

/* NPM */

// React
import React from 'react';
import PropTypes from 'prop-types';

/* ReactQL */
import GraphQLClue from './graphql'

// NotFound 404 handler for unknown routes
import { NotFound } from 'kit/lib/routing';

// ----------------------

// We'll display this <Home> component when we're on the / route
export const Home = () => (
  <div>
    <h1>Twitch Game Leader Board</h1>
    <hr />
    <p>Game Start: 12:00 Mountain Time, June 11, 2018</p>
    <p>Game End: 20:00 Mountain Time, June 11, 2018</p>
    <p>Time Remaining: 8:00 Hours</p>
    <hr />
    <GraphQLClue />
    <hr />
    <p>Game Winner:</p>
    <p>Laboratory One</p>
    <hr />
    <p>Game Rankings:</p>
    <p>1. Laboratory One - 100 points</p>
    <p>2. Northwest - 1 point</p>
    <p>3. YungTuxedoMask - 1 point</p>
    <hr />
    <p>Play on <a href="https://www.twitch.tv/LaboratoryOne">Twitch</a></p>
    <hr />
    <p>Commands</p>
    <p>!clue</p>
    <p>!guess [guess]</p>
  </div>
);

// Create a route that will be displayed when the code isn't found
export const WhenNotFound = () => (
  <NotFound>
    <h1>Unknown route - the 404 handler was triggered!</h1>
  </NotFound>
);
