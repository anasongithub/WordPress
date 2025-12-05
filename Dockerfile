# Dockerfile
# Use official WordPress image as base
FROM wordpress:latest

# Copy any local changes into container (optional)
COPY . /var/www/html

# Ensure mysqli extension is available (WordPress uses it)
RUN docker-php-ext-install mysqli || true

# Set working directory
WORKDIR /var/www/html

# Expose port (container internal)
EXPOSE 80
