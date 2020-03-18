const db = require('../data/knexConfig');
const { restrict } = require('../middleWare/restrict');
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express();

router.post('/register', async (req, res, next) => {
	const credentials = req.body;
	const hash = bcrypt.hashSync(credentials.password, 14);
	credentials.password = hash;
	try {
		const addUser = await db('users').insert(req.body);
		res.json(addUser);
	} catch (err) {
		next();
	}
});

router.post('/login', async (req, res, next) => {
	const credentials = req.body;
	try {
		const user = await db('users').select('*').where('users.userName', credentials.userName).first();
		if (!user || !bcrypt.compareSync(credentials.password, user.password)) {
			return res.status(401).json({ message: 'Invalid Credentials' });
		}

		req.session.user = user;
		res.json({ message: `Welcome ${user.userName}` });
	} catch (err) {
		console.log(err);
		next();
	}
});

router.get('/users', restrict(), async (req, res, next) => {
	try {
		const users = await db('users').select('users.id', 'users.userName');
		res.json(users);
	} catch (err) {
		console.log(err);
		next();
	}
});

router.get('/logout', restrict(), (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			next(err);
		}
		else {
			res.json({
				message: 'Successfully logged out'
			});
		}
	});
});

module.exports = router;
