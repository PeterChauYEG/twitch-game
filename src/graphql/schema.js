import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'

import { PubSub, withFilter } from 'graphql-subscriptions'

import Db from '../db'

const pubsub = new PubSub()

// Types
const Answer = new GraphQLObjectType({
  name: 'Answer',
  description: `This represents a game clue's answer`,
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(answer) {
          return answer.id
        }
      },
      text: {
        type: GraphQLString,
        resolve(answer) {
          return answer.text
        }
      },
    }
  }
})

const Clue = new GraphQLObjectType({
  name: 'Clue',
  description: 'This represents a game clue',
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(clue) {
          return clue.id
        }
      },
      text: {
        type: GraphQLString,
        resolve(clue) {
          return clue.text
        }
      },
      answer: {
        type: Answer,
        resolve(clue) {
          return clue.getAnswer()
        }
      }
    }
  }
})

const Game = new GraphQLObjectType({
  name: 'Game',
  description: `This represents a game`,
  fields: () => {
    return {
      id: {
        type: GraphQLInt,
        resolve(game) {
          return game.id
        }
      },
      winner: {
        type: GraphQLString,
        resolve(game) {
          return game.winner
        }
      },
      clues: {
        type: new GraphQLList(Clue),
        resolve(game) {
          return game.getClues()
        }
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  description: 'This is a root query',
  fields: () => {
    return {
      answers: {
        type: new GraphQLList(Answer),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.answer.findAll({ where: args })
        }
      },
      clues: {
        type: new GraphQLList(Clue),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.clue.findAll({ where: args })
        }
      },
      games: {
        type: new GraphQLList(Game),
        args: {
          id: {
            type: GraphQLInt
          }
        },
        resolve(root, args) {
          return Db.models.game.findAll({ where: args })
        }
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Functions to create/update data',
  fields() {
    return {
      setWinner: {
        type: Game,
        args: {
          username: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(_, args) {
          return Db.models.game.update(
            { winner: args.username },
            { where: { id: 1 } }
          ).then(() => {
            return Db.models.game.find({ where: { id: 1 }})
          }).then(game => {
            pubsub.publish('gameWon', { gameWon: { id: game.dataValues.id, winner: game.dataValues.winner }})
          })
        }
      }
    }
  }
})

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  description: 'Function to push data to client',
  fields() {
    return {
      gameWon: {
        type: Game,
        description: 'Listens for when a game has been won',
        subscribe: () => pubsub.asyncIterator('gameWon')
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  subscription: Subscription
})

export default Schema
