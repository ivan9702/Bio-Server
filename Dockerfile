FROM ubuntu:16.04

RUN apt-get update
RUN apt-get install -y curl

# nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
# 
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
# 
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

# 
# 
# 
RUN apt-get update
RUN apt-get install -y build-essential git-all python 
RUN apt-get install -y nodejs mongodb-org yarn
# RUN npm install node-dev -g

# 
# 
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN yarn install

COPY . /usr/src/app
EXPOSE 3000

CMD [ "npm", "start" ]

