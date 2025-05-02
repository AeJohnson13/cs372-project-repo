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
  * Step 4: While connected to the database run `node serverhost.js` in the root directory, if successful you should see the following output: 

``Server running at http://localhost:6543``  
``Connected to MongoDB``
## Functionality

### Login Page
![Login Page](<Images/Login Page Screenshot.png>)
The login page give the user the ability to login by entering valid credentials into the Username and Password forms and clicking the `Login` button, or alternatively gives you the choice to click the `Click Here` button to go to the signup page to create a new account.

---
### Sign Up Page
![Signup Page](<Images/Signup Page Screenshot.png>)
The Sign Up Page allows the user to create a new viewer account by inputting a valid username and two identical passwords the hitting `Add User`, and gives you the option to hit the `Click Here` button to return to the Login page to sign in to their new account. Additional roles must be added to the viewer account by system admin. 

---
### Gallery Pages
![Viewer Gallery Page](<Images/Viewer Gallery Page.png>)
The viewer gallery page gives viewers the ability to look through all of the videos in the database sorted in alphabetical order, and click on them to be taken to their watch page. It also gives the user the ability to show just videos they've liked, as well as the ability to search for specific videos through the search bar. Finally it gives the option for an account with multiple roles to specify which role they would like to use the tools for, through the `Switch Roles` button. 

---
![Content Manager Gallery Page](<Images/ContMan Gallery Page.png>)
By enabling content manager tools on the gallery page the user can add videos from the `Add youtube video` by entering in a Title, valid youtube url, and optionally a genre, then hitting `Submit`. They can also remove videos from the database by clicking on the red `remove video` button, positioned to the right of the video it removes.

---
### Watch Pages
![Viewer Watch Page](<Images/Viewer Watch Page Screenshot.png>)
The viewer watch page allows the user to watch an imbedded youtube video within the website, allowing for full utilization of all of youtube's watch controls. It also give the user to like and dislike the video to their preference, and hit the `Back to Gallery` link to return to the gallery to select a new video. 

---
![Marketing Manager Watch Page](<Images/MarkMan Watch Page Screenshot.png>)
By going to the watch page with marketing manager tools enabled the user can view the current comment on the video, overwrite the current comment with the `Write a comment..` form, or remove the comment from the video using the `Clear Comment` button. They can also view the total number of likes and dislikes on a video displayed just below the `Clear Comment` button 

---
![Content Manager Watch Page](<Images/ContMan Watch Page Screenshot.png>)
By going to the watch page with content manager tools enabled the user can edit the video title and genre using the corresponding forms. They can also hit `Clear Comment` once any suggestions are taken care of to remove the current comment from the video.  
