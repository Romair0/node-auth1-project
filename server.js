const express = require('express');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const server = express();
const userRouter = require('./router/usersRouter');
const dbConfig = require('./data/knexConfig');

server.use(express.json());
server.use(
	session({
		name: 'token',
		resave: false,
		saveUninitialized: false,
		secret: 'keep it safe, keep it secure',
		cookie: {
			httpOnly: true
		},
		store: new KnexSessionStore({
			knex: dbConfig,
			createtable: true
		})
	})
);
server.use('/api', userRouter);

server.use((err, req, res, next) => {
	res.status(500).json({ message: 'Server Error' });
});

module.exports = server;
