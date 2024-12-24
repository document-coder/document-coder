# Setting up a test environment.

## STEP 1: Installing the server and getting it running

  1. Download the repo:

    git clone https://github.com/davidbstein/document-coder.git

  2. Create an `annotation_tool/.env` file by copying the `.env.example` file. Most of the default values will work, but you'll need to get your own Google OAuth account settings.

    cp annoation_tool/.env.example annotation_tool/.env

### The easy way: with VSCode and Docker

The easiest way to get started testing and modifying the tool:

  1. Install [Docker](https://www.docker.com/) and [Visual Studio Code](https://code.visualstudio.com/).
  2. Open the repo foler in VS Code
  3. Run the task "`run webapp in docker with debugpy`"

  - You can now test the service in your browser by visiting http://localhost:8000
  - In the VSCode debug pane, running the task "Python Debugger: Remote Attach" will allow you to set breakpoints and observe variable values in the python code.
    
### The harder way: manual installation


  2. Install required resources:
     - [PostgreSQL](https://www.postgresql.org/ )
     - [NodeJS](https://nodejs.org/en)
     - Python3.8

  3. Install dependancies:

    cd <REPO_DIRECTORY>
    pip install -r requirements.txt
    cd annotation_tool/frontend
    npm install

  5. Set up the database

    cd annotation_tool
    python manage.py makemigrations api
    python manage.py migrate

  6. Build the static files:

    cd annotation_tool/frontend
    npm run dev

  6. start the server using the --nostatic flag

    cd annotation_tool
    python managem.py runserver --nostatic


## STEP 2: Setting up a test project

  1. Sign into the admin page at `localhost:8000/admin`. The username and password are set in `.env` and default to `admin` and `adminpassword`.
  2. Add a new `Project`. I usually use prefix: `T`, name: `Test Project`. Note the project ID.
  3. Add a new `Project Role` to the project, using the Project ID you noted in the last step.
  4. Go back to the homepage and log out.
