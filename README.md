# cs372-project-repo

## Repo for the CS372 Class Projects

Movie Watching Website 
by Alex Johnson, Enica King and Ryland Sacker 

## Install Prerequisites 

### Software

* Host device should be running a modern version of Linux, Windows, or macOS (will definetly work for Windows 11 and Linux, however older Windows and other Linux Distros may potentially work as well)
  
* Node.js must be installed on the machine intended to host the server. It allows JavaScript code to execute outside a web browser.

* NPM must also be installed in order to install the required modules for javascript code.

* A Command Line Interface is also required for running Node and NPM commands. 

* MongoDB should also be installed on the machine in order to host user and video collections

### Hardware
  The device running the server should meet at least these requirements, however higher user counts will demand greater resources: 
  
  * One CPU core, can be either x86-64 or ARM
    
  * 512 MB RAM absolute minimum
    
  * At least 1 GB of free space after installation of operating system and software prerequistes

## Installation Steps

After software prerequistes are installed, other instilation 





## MongoDB Setup

For this project to work you must have on your laptop a connection named 'SC-Project', with a database also named 'SC-Project', and within this the collections 'User Credentials' and 'Video Library', which can be imported from the videos.json file.

Users can be created using the sign-up page, by default they will only have viewer privileges, additional privilege have to be added manually by editing the 'roles' object within the user's database entry.

test users can be imported from testUsers.json, password for all the accounts is 3
