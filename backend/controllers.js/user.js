const bcrypt = require("bcrypt");
const User = require("../models/user");

//Enregistrement d'un nouvel utilisateur

exports.signup = (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
       email: req.body.email,
       password: hash
    });
      user
        .save()
        .then(() => res.status(201).json({ Message: "Utilisateur créé !" }))
        .catch((err) => res.status(500).json({ error }));
    })
    .catch((err) => res.status(500).json({ error }));
};

// Connexion d'un utilisateur existant

exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé !' });
    }
      bcrypt.compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect" });
          }
          res.status(200).json({
            userId: user._id,
            token: 'TOKEN'
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};