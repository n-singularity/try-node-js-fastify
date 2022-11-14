module.exports = class Polling {
    async index(request, reply) {
        let Choice = require('../models/choiceModel')();

        let choices = await Choice.findAll()

        let params = {};

        params.optionNames = choices.map((choice) => choice.language);
        params.optionCounts = choices.map((choice) => choice.picks);

        // Send the page options or raw JSON data if the client requested it
        return request.query.raw
            ? reply.send(params)
            : reply.view("/src/pages/index.hbs", params);
    }

    async vote(request, reply) {
        let Choice = require('../models/choiceModel')();
        let Log = require('../models/logModel')();

        let params = {}
        params.results = true;

        let choice;

        let voteLanguage = request.body.language

        if (voteLanguage) {
            choice = await Choice.findOne({where: {language: voteLanguage}});

            if (choice) {
                choice.picks = choice.picks + 1
            } else {
                choice = await Choice.build({language: voteLanguage, picks: 1})
            }

            let log = await Log.build({choice: voteLanguage, time: (new Date()).toDateString()})
            await choice.save()
            await log.save()
        }

        let choices = await Choice.findAll()
        params.optionNames = choices.map((choice) => choice.language);
        params.optionCounts = choices.map((choice) => choice.picks);

        params.error = choice ? null : data.errorMessage;

        // Return the info to the client
        return request.query.raw
            ? reply.send(params)
            : reply.view("/src/pages/index.hbs", params);
    }

    async logs(request, reply) {
        let Log = require('../models/logModel')();
        let params = {}

        // Get the log history from the db
        let logs = await Log.findAll();
        params.optionHistory = logs.map((log) => ({'choice': log.choice, 'time': log.time}));

        // Send the log list
        return request.query.raw
            ? reply.send(params)
            : reply.view("/src/pages/admin.hbs", params);
    }

    async reset(request, reply) {
        let Log = require('../models/logModel')();

        if (
            !request.body.key ||
            request.body.key.length < 1 ||
            request.body.key !== 'abcd'
        ) {
            console.error("Auth fail");

            // Auth failed, return the log data plus a failed flag
            params.failed = "You entered invalid credentials!";

            // Get the log list
            let logs = await Log.findAll();
            params.optionHistory = logs.map((log) => ({'choice': log.choice, 'time': log.time}));
        } else {
            await Log.destroy({
                where: {},
                truncate: true
            });

            // Check for errors - method would return false value
            params.error = params.optionHistory ? null : data.errorMessage;
        }

        // Send a 401 if auth failed, 200 otherwise
        const status = params.failed ? 401 : 200;
        // Send an unauthorized status code if the user credentials failed
        return request.query.raw
            ? reply.status(status).send(params)
            : reply.status(status).view("/src/pages/admin.hbs", params);

    }
}