FROM httpd:alpine
MAINTAINER Rosa Aguilar  r.aguilar@utwente.nl <r.aguilar@utwente.nl>
# start shell as root
RUN sudo -s 

# go to the app dir
RUN cd /home/aguilardearchilarm/myogito

# get the latest version of the app
RUN git pull origin master

# remove any files in htdocs directory
RUN rm -r /usr/local/apache2/htdocs/*

#copy all the files from the docker build context into the public htdocs of the apache container
COPY ./ /usr/local/apache2/htdocs/

# pass the dist/myOgito to the docker build command
# docker build -f Dockerfile -t myOgito:0.1 dist/myOgito/

# docker run -d -p 8080:80 --name myOgito myOgito:0.1
