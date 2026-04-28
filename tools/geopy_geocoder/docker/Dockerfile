FROM ubuntu:22.04

# Prevent interactive timezone/keyboard prompts during build
ENV DEBIAN_FRONTEND=noninteractive

# Install Apache, FastCGI, and Python
RUN apt-get update && apt-get install -y \
    apache2 \
    libapache2-mod-fcgid \
    python3 \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Enable required Apache modules
RUN a2enmod fcgid alias

# Create the working directory
WORKDIR /var/www/scripts


# Set up the virtual environment and install dependencies
COPY ./requirements.txt /tmp/requirements.txt
RUN python3 -m venv venv
RUN ./venv/bin/pip install -r /tmp/requirements.txt

# Copy configuration and code into the container
COPY ./docker/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY ./geocoder.fcgi /var/www/scripts/geocoder.fcgi

# Fix permissions so the Apache user (www-data) can execute the script
RUN chmod +x /var/www/scripts/geocoder.fcgi && \
    chown -R www-data:www-data /var/www/scripts

# Expose the standard web port
EXPOSE 80

# Run Apache in the foreground so the container stays alive
CMD ["apachectl", "-D", "FOREGROUND"]