import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLSchema
} from 'graphql'

import Db from '../db'

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
      description: {
        type: GraphQLString,
        resolve(clue) {
          return clue.description
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
      description: {
        type: GraphQLString,
        resolve(answer) {
          return answer.description
        }
      },
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
      }
    }
  }
})

const Schema = new GraphQLSchema({
  query: Query
})

export default Schema
