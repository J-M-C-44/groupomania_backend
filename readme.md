# Groupomania / back-end

## Description
  Projet 7 du parcours de Développeur Web d'OpenClassRooms : construire un réseau social d'entreprise. Celui-ci a pour but d'augmenter les relations sociales au sein de l'entreprise et aisni améliorer l'ambiance entre collaborateurs. 
  
  Ici n'est traité que le backend. La partie frontend est disponible dans le repos suivant : ICIJCO-A-compléter

##  Installation
  
pré-requis : installer node et MySQL si cela n'est pas déjà fait.

1) Base de données:
    1. Créer la base de données groupomania et les différentes tables via SQL_requests/create_tables.sql
    2. Insérer la ligne administrateur via SQL_requests/02_insert_admin  
        Remarques :  
            - conserver le mot de passe indiqué dans la requete, vous pourrez le modifier ensuite directement via l'application (tout comme l'email d'ailleurs).  
            - vous pouvez modifier la valeur du rôle correspondant à l'administrateur
2) Dans le terminal, à partir du dossier backend, taper `npm install`
3) Editer le fichier `.env.example ` situé à la racine du projet : supprimer l'extension `.example `  
4) Renseigner vos propres valeurs de variables d'environnement ( remplacer les ` XXXXXXX `) 
  
    | Variable d'environnement | Fonction |
    |--|--|
    | ` PORT ` | votre numéro de port (3000 par défaut)|
    | ` HASH_NUMBER ` | nombre de tour de hashage |
    | ` TOKEN_SECRET` | clé secrète du token d'authentification|
    | ` DB_HOST ` =|  serveur hôte (ex:localhost)
    | ` DB_USER ` | nom d'un utilisateur de votre base de donnée MySQL ayant les droits de lecture/écriture|
    | ` DB_PASSWORD ` | mot de passe associé à ` DB_USER `|
    | ` DB_NAME ` | nom de la base de donnée (=groupomania) |
    | ` ROLE_ADMIN ` | valeur numérique correspondant au rôle d'administrateur (celle mise en 1.b) |
    


4) Dans le terminal, toujours à partir du dossier backend, taper `npm start` (ou `nodemon server`) 
