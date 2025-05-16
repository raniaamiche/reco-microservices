const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController'); // Assurez-vous que le chemin est correct
const router = express.Router();

// Route pour enregistrer un utilisateur
router.post('/register', registerUser);

// Route pour connecter un utilisateur
router.post('/login', loginUser);

// Route pour obtenir un utilisateur par ID
router.get('/:id', getUser);
// Route pour tester ou retourner tous les utilisateurs
router.get('/', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});

module.exports = router;
