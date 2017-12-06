**Todo list**

**Setup**

\- app: symfony 3.4\
\- nginx\
\- php7\
\- postgresql

**Install**

Download the repository to a dir.

Edit .env to your needing (espacially ports if needed).

Install docker and docker-compose if not already there.

Cd to downloaded dir /todolist and run it: 
/todolist$ `docker-compose up`.

Open a second terminal and activate app environment:
/todolist$ `docker exec -i -t todolist.php /bin/bash`

From here you have access to yarn, composer/npm, php bin commands.
Installed commands for compiling (see package.json):
- dev@xxx:~$ `yarn run dev`
- dev@xxx:~$ `yarn run watch`
- dev@xxx:~$ `yarn run prod` 

**Important**: the first time you run the app do:
- dev@xxx:~$ `php bin/console cache:clear` >> clear the cache
- dev@xxx:~$ `yarn run dev` >> install dependencies
- /todolist$ `docker-compose down` >> bring it down to avoid db errors
- /todolist$ `docker-compose up` >> bring it up again and you're all set

To see the app running; go to browser url: http://127.0.0.1:8084/

\
**Important note** \
Be aware of the fact that almost all .gitignore files are renamed to .gitignore-orig.
This is done to get a complete working app from the first pull, including scripts and database.
If you are planning on using git your self, you should rename them all back to .gitignore.
