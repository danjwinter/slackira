# Specify the image that this app is going to be built from.  This is a docker hub hosted Node image
	FROM node:10.15.1

# Specify the username this app is going to run in
	ENV USER=app

# Specify the subdirectory (/home/user/sub_dir_here) that this app will run in
	ENV SUBDIR=appDir

# Specify environment variable to be passed in during build process
  ARG SLACK_TOKEN=local
  ENV SLACK_TOKEN ${SLACK_TOKEN}

  ARG JIRA_USERNAME=local
  ENV JIRA_USERNAME ${JIRA_USERNAME}}

  ARG JIRA_PASSWORD=local
  ENV JIRA_PASSWORD ${JIRA_PASSWORD}}

# Create a user named $USER.  Run npm install as root before doing other commands
	RUN useradd --user-group --create-home --shell /bin/false $USER &&\
		npm install --global npm typescript 

# The default directory created for a user in node is /home/user_name
	ENV HOME=/home/$USER

# Copy package.json and the gulpfile as root into the subdir where our app lies
	COPY package.json tsconfig.json $HOME/$SUBDIR/

# set the $USER as the owner of the $HOME directory.  Necessary after copying the files from the line above
	RUN chown -R $USER:$USER $HOME/*

# Change user to $USER
	USER $USER

# Change directory to the specified subdirectory
	WORKDIR $HOME/$SUBDIR

# As this user, finally run NPM install
	RUN npm install


# Kick node off from the compiled dist folder.
	CMD ["yarn", "start"]
