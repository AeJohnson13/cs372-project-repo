# cs372-project-repo

## Repo for the CS372 Class Projects

Movie Watching Website 
by Alex Johnson, Enica King and Ryland Sacker 

## Install Prerequisites 

### Software

* Host device should be running a modern version of Linux, Windows, or macOS (will definetly work for Windows 11 and Linux, however older Windows and other Linux Distros may potentially work as well)
  
* [Node.js](https://www.mongodb.com/docs/manual/installation/) must be installed on the machine intended to host the server. It allows JavaScript code to execute outside a web browser.

* [NPM](https://www.mongodb.com/docs/manual/installation/) must also be installed in order to install the required modules for javascript code.

* A Command Line Interface is also required for running Node and NPM commands. 

* [MongoDB](https://www.mongodb.com/docs/manual/installation/) should also be installed on the machine in order to host user and video collections

### Hardware
  The device running the server should meet at least these requirements, however higher user counts will demand greater resources: 
  
  * One CPU core, can be either x86-64 or ARM
    
  * 512 MB RAM absolute minimum
    
  * At least 1 GB of free space after installation of operating system and software prerequistes

## Installation Steps

After software prerequistes are installed, other instilation steps are as follows:

  * Step 1: Clone the full repo onto your device, If using a CLI with git installed use `git clone https://github.com/AeJohnson13/cs372-project-repo.git`
  
  * Step 2: Run `npm install` in the repo to install the dependencies 
  * Step 3: Setup MongoDB Database
    - a. Add a new connection with Name: `SC-Project` URI: `mongodb://localhost:27017`
    - b. Add a new database also named `SC-Project`
    - c. Add two new collections titled `User Credentials` and `Video Library`
    - d. Go to `User Credentials` and click the Add Data button, click import JSON and import `Test Files\testUsers.json`, this will set up an initial video catalog
    - e. *Optional* While 
  * Step 4: While connected to the database run `node serverhost.js` in the root directory, if successful you should see the following output: 

``Server running at http://localhost:6543``  
``Connected to MongoDB``


## MongoDB Setup


