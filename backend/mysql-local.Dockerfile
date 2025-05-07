# Simple Dockerfile for local MySQL 8.0
#
# To run this container:
# docker build -f mysql-local.Dockerfile -t rgpay-mysql-local .
# docker run --name rgpay-mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=rgpay -p 3306:3306 -v rgpay-mysql-data:/var/lib/mysql -d rgpay-mysql-local
# docker start <container_id>
FROM mysql:8.0

# Set environment variables (can be overridden at runtime)
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=rgpay

# Expose default MySQL port
EXPOSE 3306

# Use a named volume for data persistence
VOLUME ["/var/lib/mysql"] 