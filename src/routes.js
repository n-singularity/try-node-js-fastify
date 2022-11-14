module.exports = function (fastify) {
    fastify.get("/", new (require("./controllers/PollingController"))().index);
    fastify.post("/", new (require("./controllers/PollingController"))().vote);

    fastify.get("/logs", new (require("./controllers/PollingController"))().logs)
    fastify.get("/reset", new (require("./controllers/PollingController"))().reset)
}