# Utilise l'image officielle de Node.js
FROM node:18

# Dossier de travail
WORKDIR /app

# Copier les fichiers package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install
RUN npm install kafkajs

# Copier tout le projet
COPY . .

# Exposer le port utilisé par le service (par ex. 3001)
EXPOSE 3001

# Lancer le serveur
CMD ["node", "index.js"]
