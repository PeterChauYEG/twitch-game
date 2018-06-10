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
const Clue = Conn.define('clue', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

const Answer = Conn.define('answer', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

// Relationships
Clue.hasOne(Answer)
Answer.belongsTo(Clue)

// overrides tables each initalization
// seed data
Conn.sync({ force: true }).then(() => {
  _.times(1, () => {
    return Clue.create({
      text: 'What is love?'
    }).then(clue => {
      return clue.createAnswer({
        text: `Baby don't hurt me`
      })
    })
  })
})

export default Conn
