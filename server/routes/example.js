export default function (server) {

  server.route({
    path: '/api/pivot_table/example',
    method: 'GET',
    handler(req, reply) {
      reply({ time: (new Date()).toISOString() });
    }
  });

};
