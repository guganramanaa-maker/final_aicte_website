# ==============================================================================
# Production Dockerfile for AICTE Approval & Compliance Tracking System
# Base Image: Lightweight Alpine Linux with Nginx Web Server (~23MB)
# ==============================================================================

FROM nginx:alpine

# Metadata labels
LABEL maintainer="AICTE Portal Development Team"
LABEL description="AICTE Approval Process & AI Document Validation Portal"
LABEL version="1.0.0"

# Set web root directory
WORKDIR /usr/share/nginx/html

# Clear any default Nginx static files
RUN rm -rf ./*

# Copy custom production Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all website assets, HTML, CSS, JS, and statutory PDF documents
COPY . .

# Expose standard web port 80 and Render's default port 10000
EXPOSE 80 10000

# Health check to verify that Nginx is actively serving the portal
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || wget --quiet --tries=1 --spider http://localhost:10000/ || exit 1

# Launch Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
