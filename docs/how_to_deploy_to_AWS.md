# How to Deploy to AWS

This guide walks through deploying the Document Annotation Tool to AWS.

## Prerequisites

- AWS Account with permissions to create:
  - EC2 instances
  - RDS databases
  - Security groups
  - Elastic IPs
- Domain name registered (e.g., documentcoder.com)
- AWS CLI installed and configured locally
- Docker and docker-compose installed locally

## Step 1: Set Up Database (RDS)

1. Create a PostgreSQL RDS instance:
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier documentcoder-prod \
     --db-instance-class db.t3.micro \
     --engine postgres \
     --master-username documentcoder \
     --master-user-password <your-secure-password> \
     --allocated-storage 20 \
     --backup-retention-period 7 \
     --db-name documentcoder \
     --no-multi-az
   ```

2. Note the endpoint URL when RDS instance is ready (takes ~10 minutes)

## Step 2: Set Up EC2 Instance

1. Launch an EC2 instance:
   - AMI: Amazon Linux 2
   - Instance Type: t3.small (2GB RAM minimum for npm builds)
   - Storage: 20GB gp2
   - Security Group: 
     - Allow SSH (22) from your IP
     - Allow HTTP (80) from anywhere
     - Allow HTTPS (443) from anywhere

2. If you have a custom domain, assign your Elastic IP to the and point your domain at that IP address.

3. Connect your RDB instance to the EC2 instance. (In the web console, go to the RDS instance, and add an entry in the "connected compute resources" section.)

3. SSH into the instance:
   ```bash
   ssh -i <your-key.pem> ec2-user@<your-elastic-ip>
   ```

4. Install dependencies:
   ```bash
    sudo yum update -y
    sudo yum install -y docker git
    sudo service docker start
    sudo usermod -a -G docker ec2-user
    sudo chkconfig docker on
   ```

## Step 3: Configure Production Settings

1. Clone your repository:
   ```bash
   git clone https://github.com/davidbstein/document-coder.git
   cd document-coder
   ```

2. Create production environment file:
  ```bash
    cp annotation_tool/.env.example annotation_tool/.env
    nano annotation_tool/.env
   ```

   ```conf
   DJANGO_SETTINGS_MODULE=config.settings.production
   DATABASE_URL=postgres://documentcoder:<password>@<rds-endpoint>:5432/documentcoder
   ALLOWED_HOSTS=documentcoder.com
   CSRF_TRUSTED_ORIGINS=<YOUR_DOMAIN_NAME>
   SECRET_KEY=<your-secret-key>
   DEBUG=False
   ```

## Step 4: Set Up SSL

1. Install and run Certbot:

    ```bash
    # Create directory for certbot
    sudo mkdir -p /etc/letsencrypt

    # Get the certificate using certbot in a temporary container
    sudo docker run -it --rm \
      -v "/etc/letsencrypt:/etc/letsencrypt" \
      -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
      -p 80:80 \
      certbot/certbot certonly --standalone \
      -d <YOUR_DOMAIN_NAME> \
      --agree-tos \
      --email your-email@example.com \
      --non-interactive

    # Set up auto-renewal
    echo "0 0 1 * * docker run --rm -v /etc/letsencrypt:/etc/letsencrypt -v /var/lib/letsencrypt:/var/lib/letsencrypt certbot/certbot renew --quiet" | sudo crontab -
    ```

2. Follow prompts to configure SSL

3. Create an `nginx` configuration file:

    ```bash
    nano ./nginx.conf
    ```

    ```conf
    server {
        listen 80;
        server_name <YOUR_DOMAIN_NAME>;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name <YOUR_DOMAIN_NAME>;

        ssl_certificate /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location /static/ {
            alias /usr/share/nginx/html/static/;
        }

        location /media/ {
            alias /usr/share/nginx/html/media/;
        }

        location / {
            proxy_pass http://web:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```

## Step 5: Deploy Application

1. Build and start services:
    ```bash
    docker-compose -f docker-compose.prod.ec2.yml build
    docker-compose -f docker-compose.prod.ec2.yml up -d
    ```

