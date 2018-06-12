// NODE
import {
  GraphQLEnumType,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql'
import {
  GraphQLDateTime
} from 'graphql-iso-date'
import { PubSub, withFilter } from 'graphql-subscriptions'
import moment from 'moment'

// database
import Db from '../db'

// initialize pubsub for graphql
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
      end_time: {
        type: GraphQLDateTime,
        resolve(game) {
          return game.end_time
        }
      },
      start_time: {
        type: GraphQLDateTime,
        resolve(game) {
          return game.start_time
        }
      },
      state: {
        type: new GraphQLEnumType({
          name: 'game_state',
          values: {
            NOT_STARTED: GraphQLInt,
            IN_PROGRESS: GraphQLInt,
            WON: GraphQLInt,
            COMPLETED: GraphQLInt
          }
        }),
        resolve(game) {
          return game.state
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
            {
              end_state: moment(),
              state: 'WON',
              winner: args.username
            },
            { where: { id: 1 } }
          ).then(() => {
            return Db.models.game.find({ where: { id: 1 }})
          }).then(game => {
            pubsub.publish(
              'gameWon',
              {
                gameWon: {
                  end_time: game.dataValues.end_time,
                  id: game.dataValues.id,
                  start_time: game.dataValues.start_time,
                  state: game.dataValues.state,
                  winner: game.dataValues.winner
                }
              }
            )
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
