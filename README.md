<<<<<<< HEAD
# HumanMuse.ic: A Playlist Manager for Listener Engagement

## Setting up
First make sure you have python3 -- to find out if you got it, ask:
```
$ which python3
/usr/local/bin/python3
```
If instead you see nothing, you need to get python3. On mac, ``` $ brew install python3 ``` If you're on windows, god help you.
Next we want to set up a virtual environment.  First clone the repo, then navigate to the top level directory, then create the venv, then activate it.
```
$ cd /path/to/project
$ python3 -m venv pyenv                       # create virtual environment (named "pyenv")
$ . pyenv/bin/activate                        # run the activation script
(pyenv) $ which python                        # check that the venv is activated
/path/to/project/pyenv/bin/python
(pyenv) $ pip install -r requirements.txt     # install the required packages
```

## Running the development server
To run the project on your local machine, first make sure the database is up to date with the current version of the code. Since Django manages the database for us, we need to tell it when to apply the changes we've made in the python source to the SQL database.  Commands to manage django can be passed to manage.py in the project root.  Before start
```
(pyenv) $ python manage.py makemigrations     # see if changes have been made to the DB schema
(pyenv) $ python manage.py migrate            # apply changes to the database
(pyenv) $ python manage.py runserver          # start a webserver on localhost:8000
```

## Contributing
Check out what features need to be implemented by going to the Projects tab.  There are two projects for the application, that function mostly independently of one another: DJ Side, and Public Side.  Each project has its own board with four columns: TO-DO, in progress, testing/review, and done.  Issues are cards on the board, and correspond to a more-or-less full feature.  There may be several steps to complete on the feature, but usually a card can/should be done by a single person.  Any questions, clarification, and discussion for a feature can take place on the issue card, each of which has its own comment thread.

To contribute to the project, pull the latest, then make a new branch.  Be sure to assign the card for the feature to yourself an move it into the "in-progress" column.  Make your edits on this new branch and commit your changes incrementally and only as needed to satisfy the task at hand.  Push the changes to a remote branch on github, and initiate a pull request frm github.  Ideally your pull request will include unit tests (using Django's test framework for python, or Jest for JS). Anyone else on the team can merge a branch, but first review the submitted code.  Go over the changes that were made, understand them, make sure they do what they should.  Pull the branch to your local and make sure the tests work, nothing else has broken, and _style conforms to our style guides_.  If there are any questions or further changes needed before merging, address them in the corresponding github issue.  When the branch is merged, close the issue.

```
(pyenv) $ git pull
(pyenv) $ git checkout -b <featurename>
 ...
(pyenv) $ git add changedFile1.py changedFile2.py
(pyenv) $ git commit -m "Short description of what I did"
(pyenv) $ git push origin <featurename>
```

## Project Structure
We will organize the project into a few distinct Django "apps."  Each app is a collection of python modules, including a models.py database schema, that serve a single clearly defined purpose.  Currently there are two: _music_, which defines relationships between artists, songs, genres, record labels, etc.; and _playlist_ which defines DJs, plays, shows, etc.
