const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/takeout');

const Person = db.define('person', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	}
})

const Thing = db.define('thing',{
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
		}
	}
})

const Place = db.define('place', {
	name: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
		validate: {
			notEmpty: true,
		}
	}
})

const Takeout = db.define('takeout',{

})

Takeout.belongsTo(Person)
Person.hasMany(Takeout)

Takeout.belongsTo(Place)
Place.hasMany(Takeout)

Takeout.belongsTo(Thing)
Thing.hasMany(Takeout)



module.exports = {
	db,
	Person,
	Thing,
	Place,
	Takeout
}