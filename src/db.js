import Sequelize from 'sequelize'
import _ from 'lodash'

const Conn = new Sequelize(
  'relay', // db name
  'postgres', // user
  'asdf', // pass
  {
    dialect: 'postgres',
    host: 'localhost'
  }
)

// type definitions
const Answer = Conn.define('answer', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const Clue = Conn.define('clue', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const Game = Conn.define('game', {
  winner: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

// Relationships
Game.hasMany(Clue)
Clue.belongsTo(Game)
Clue.hasOne(Answer)
Answer.belongsTo(Clue)

// overrides tables each initalization
// seed data
Conn.sync({ force: true }).then(() => {
  _.times(1, () => {
    return Game.create({
      winner: null
    }).then(game => {
      return game.createClue({
        text: 'What is love?'
      }).then(clue => {
        return clue.createAnswer({
          text: `Baby don't hurt me`
        })
      })
    })
  })
})

export default Conn
