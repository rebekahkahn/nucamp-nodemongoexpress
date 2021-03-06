const express = require("express");

const mantisesRouter = express.Router();

mantisesRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the mantises to you");
  })
  .post((req, res) => {
    res.end(
      `Will add the mantis: ${req.body.name} with the description: ${req.body.description}`
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /mantises");
  })
  .delete((req, res) => {
    res.end("Deleting all mantises");
  });

// const mantisRouter = express.Router();
// mantisRouter
//   .route("/mantises/:mantisId")
//   .all((req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     next();
//   })
//   .get((req, res) => {
//     res.end(`Will send details of the mantis: ${req.params.mantisId} to you`);
//   })

//   .post((req, res) => {
//     res.statusCode = 403;
//     res.end(`POST operation not supported on /mantises/${req.params.mantisId}`);
//   })

//   .put((req, res) => {
//     res.write(`Updating the mantis: ${req.params.mantisId}\n`);
//     res.end(`Will update the mantis: ${req.body.name}
//         with description: ${req.body.description}`);
//   })

//   .delete((req, res) => {
//     res.end(`Deleting mantis: ${req.params.mantisId}`);
//   });

module.exports = mantisesRouter;
