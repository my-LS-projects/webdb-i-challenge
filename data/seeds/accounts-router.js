const router = require("express").Router();
const knex = require("../dbConfig.js");

router.get("/", (req, res) => {
  knex('accounts')
    .then(accounts => res.status(200).json(accounts))
    .catch(error => res.status(500).json({ error: "Could not get accounts" }));
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  knex('accounts')
    .where({ id })
    .then(account =>
      account
        ? res.status(200).json(account)
        : res
            .status(404)
            .json({ message: "Account with specified id not found" })
    )
    .catch(error => res.status(500).json({ error: "Could not get account" }));
});

router.post("/", validateAccount, (req, res) => {
  // const { name, budget } = req.body
  console.log(req.body);
  knex('accounts')
    .insert({ name: `${req.body.name}`, budget: `${req.body.budget}` })
    .then(account => res.status(201).json(account))
    .catch(error =>
      res.status(500).json({ error: "Could not create account" })
    );
});

router.put("/:id", (req, res) => {
    // const { id } = req.params
  knex('accounts')
    .where({ id: req.params.id })
    .update(req.body)
    .then(account => res.status(200).json({ message: `Account with id of ${id} updated` }))
    .catch(error => res.status(500).json({ error: "Could not update account" }))
});

router.delete('/:id', ( req, res ) => {
    knex('accounts')
      .where({ id: req.params.id })
      .del()
      .then(account => res.status(200).json({ message:"Account deleted" }))
      .catch(error => res.status(500).json({ error: "Could not delete account" }))
    
})

function validateAccount(req, res, next) {
  if (!req.body.name || !req.body.budget){
    res.status(404).json({ message: "Please include a name and budget" })
  } else if (typeof req.body.budget != 'number'){
    return res.status(404).json({ message: "Please make sure budget is a number" })
  } else {
    next()
  }
}

module.exports = router;
