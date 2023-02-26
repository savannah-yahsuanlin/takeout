const express = require('express');
const app = express();
const {db, Person, Place, Thing, Takeout} = require('./db');

app.use(express.urlencoded({extended: false}))
app.use(require('method-override')('_method'))


app.get('/', async(req, res, next) =>{
	try {
		const people = await Person.findAll()
		const places = await Place.findAll()
		const things = await Thing.findAll()	
		const takeout = await Takeout.findAll({
			include:[
				Person,
				Thing,
				Place
			]
		})
		res.send(`
			<html>
				<body>
					<h1>Takeout</h1>
					<h3>People</h3>
					<ul>
						${people.map(person => {
							return `
								<li>
									${person.name}
								</li>
							`
						}).join('')}
					</ul>
					<h3>Place</h3>
						<ul>
							${
								places.map(place => {
									return `
										<li>
											${place.name}
										</li>
									`
							}).join('')}
						</ul>
						<h3>Things</h3>
						<ul>
							${
								things.map(thing => {
									return `
										<li>
											${thing.name}
										</li>
									`
							}).join('')}
						</ul>

						<h2>Takeout</h2>
						<form method="POST", action='/takeout'>
							<select name='personId'>
								${people.map(person =>{
									return `
										<option value="${person.id}">${person.name}</option>
									`
								}).join('')}
							</select>
							<select name='placeId'>
								${places.map(place => {
									return `
									<option value="${place.id}">${place.name}</option>
									`
								}).join('')}
							</select>
							<select name='thingId'>
								${things.map(thing => {
									return `
									<option value="${thing.id}">${thing.name}</option>
									`
								}).join('')}
							</select>
							<button>Create</button>
						</form>
						<ul>
							${takeout.map(x => {
								return `
								<li>
									A ${x.thing.name} was taken by ${x.person.name} in ${x.place.name}
									<form method="POST" action="/takeout/${x.id}?_method=delete"><button>X</button></form>
								</li>
								`
							}).join('')}
						</ul>
				</body>
			</html>
		`)
	} catch (error) {
		next(error)
	}
})

app.post('/takeout', async(req, res, next) => {
	try {
		await Takeout.create(req.body)
		res.redirect('/')
	} catch (error) {
		next(error)
	}
})

app.delete('/takeout/:id', async(req, res, next) => {
	try {
		const takeout = await Takeout.findByPk(req.params.id)
		await takeout.destroy()
		res.redirect('/')
	} catch (error) {
		next(error)
	}
})
const port = process.env.PORT || 3000
app.listen(port, async() => {
	try {
		await db.sync({force: true})
		const [lucy, moe, larry, ethyl, foo, bar, bazz, que, nyc, paris, boston, tw] = await Promise.all([
			Person.create({name: 'lucy'}),
			Person.create({name: 'moe'}),
			Person.create({name: 'larry'}),
			Person.create({name: 'ethyl'}),
			Thing.create({name: 'foo'}),
			Thing.create({name: 'bar'}),
			Thing.create({name: 'bazz'}),
			Thing.create({name: 'quq'}),
			Place.create({name: 'Nyc'}),
			Place.create({name: 'Paris'}),
			Place.create({name: 'Boston'}),
			Place.create({name: 'Tw'}),
		])

		await Promise.all([
			Takeout.create({personId: lucy.id, thingId: foo.id, placeId: nyc.id}),
			Takeout.create({personId: lucy.id, thingId: foo.id, placeId: boston.id}),

		])
		console.log(`listening on ${port}`)
	} catch (error) {
		console.log(error);
	}
})