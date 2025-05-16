const users = [
    { id: 1, email: 'test@example.com', password: '123456' },
    { id: 2, email: 'hello@example.com', password: '654321' }
  ];
  
  // Enregistrer un nouvel utilisateur
  exports.registerUser = (req, res) => {
    const { email, password } = req.body;
    const newUser = { id: users.length + 1, email, password };
    users.push(newUser);
    res.status(201).json(newUser);
  };
  
  // Connecter un utilisateur
  exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      res.json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };
  
  // Obtenir un utilisateur par ID
  exports.getUser = (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  };
  