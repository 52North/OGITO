FROM httpd:alpine
MAINTAINER Rosa Aguilar  r.aguilar@utwente.nl <r.aguilar@utwente.nl>
# install git
RUN apk update && apk upgrade && apk add --no-cache bash git openssh

# to ask for username and password as arguments
ARG username
ARG password 

WORKDIR /home/aguilardearchilarm/myogito

# get the latest version of the app
#RUN git clone https://github.com/rosaguilar/myogito.git
RUN git clone https://${username}:${password}@github.com/rosaguilar/myogito.git

# remove any files in htdocs directory
RUN rm -r /usr/local/apache2/htdocs/*

#copy all the files from the docker build context into the public htdocs of the apache container
COPY ./ /usr/local/apache2/htdocs/

# pass the dist/myOgito to the docker build command
# docker build -f Dockerfile -t myOgito:0.1 dist/myOgito/

# docker run -d -p 8080:80 --name myOgito myOgito:0.1
