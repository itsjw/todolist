**Todo list**

**Setup**

\- app: symfony 3.4\
\- nginx\
\- php7\
\- postgresql

**Install**

Download the repository to a dir (for example todolist).

Edit .env to your needing (espacially ports if needed).

Install docker and docker-compose if not already there.

Cd to dir todolist and run it: `docker-compose up`.

Open a second terminal
Activate app environment: `docker exec -i -t todolist.php /bin/bash`
From here you have access to yarn, composer/npm, php bin commands.
Installed commands for compiling (package.json):
- `yarn run dev`
- `yarn run watch`
- `yarn run prod` \

The first time your run the app do: 
- `php bin/console cache:clear`
- `yarn run dev`

To see the app running; go to browser url: http://127.0.0.1:8084/

**Important note** \
Be aware of the fact that almost all .gitignore files are renamed to .gitignore-orig.
This is done to get a complete working app from the first pull, including scripts and database.
If you are planning on using git your self, you should rename them all back to .gitignore.
