# 🚀 Deployment Guide - Dehadi.co.in

Complete deployment instructions for local development, Docker, and cloud platforms (AWS, DigitalOcean, etc.)

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Docker Deployment](#docker-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Environment Variables](#environment-variables)
6. [Database Migrations](#database-migrations)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js** 20.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher (for local development)
- **Docker** & **Docker Compose** (for containerized deployment)
- **AWS CLI** (for AWS deployment)

### Required Accounts & API Keys

1. **Razorpay Account** - For payment processing
   - Sign up at https://dashboard.razorpay.com/
   - Get test/live API keys

2. **AWS Account** (for cloud deployment)
   - Sign up at https://aws.amazon.com/

3. **OpenAI API Key** (optional - for AI features)
   - Get from https://platform.openai.com/

---

## 🖥️ Local Development

### Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/dehadi.co.in.git
cd dehadi.co.in

# Install dependencies
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
nano .env  # or use your preferred editor
```

**Required configuration:**
```env
DATABASE_URL=postgresql://dehadi:dehadi_password@localhost:5432/dehadi_db
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_secret_here
SESSION_SECRET=generate-a-random-secret-here
```

### Step 3: Set Up Database

```bash
# Start PostgreSQL locally (or use Docker)
# For macOS with Homebrew:
brew services start postgresql@16

# Create database
createdb dehadi_db

# Push database schema
npm run db:push
```

### Step 4: Run Development Server

```bash
# Start dev server (frontend + backend)
npm run dev

# Access application
# Frontend: http://localhost:8080
# Backend API: http://localhost:8080/api
```

---

## 🐳 Docker Deployment

### Quick Start (Recommended for Testing)

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Update .env with your configuration

# 3. Start all services
docker-compose up -d

# 4. View logs
docker-compose logs -f app

# 5. Access application
# App: http://localhost:8080
# pgAdmin: http://localhost:5050 (with --profile tools)
```

### Step-by-Step Docker Setup

#### 1. Build the Docker Image

```bash
# Build the application image
docker build -t dehadi-app:latest .

# Verify build
docker images | grep dehadi
```

#### 2. Run with Docker Compose

```bash
# Start in detached mode
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (DANGER: deletes database data)
docker-compose down -v
```

#### 3. Access Services

- **Application**: http://localhost:8080
- **PostgreSQL**: localhost:5432 (credentials from .env)
- **pgAdmin** (optional): http://localhost:5050

#### 4. Database Management with pgAdmin

```bash
# Start services including pgAdmin
docker-compose --profile tools up -d

# Access pgAdmin at http://localhost:5050
# Email: admin@dehadi.local (from .env)
# Password: admin (from .env)

# Add PostgreSQL server in pgAdmin:
# Host: postgres
# Port: 5432
# Username: dehadi (from .env)
# Password: dehadi_password (from .env)
```

### Production Docker Deployment

For production deployment on any Docker-capable platform:

```bash
# Build production image with tags
docker build -t your-registry.com/dehadi-app:1.0.0 .
docker push your-registry.com/dehadi-app:1.0.0

# On production server
docker pull your-registry.com/dehadi-app:1.0.0
docker run -d \
  --name dehadi-app \
  -p 8080:8080 \
  --env-file .env.production \
  your-registry.com/dehadi-app:1.0.0
```

---

## ☁️ AWS Deployment

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   AWS Cloud                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐        ┌──────────────┐          │
│  │   Route 53   │───────▶│  CloudFront  │          │
│  │     (DNS)    │        │     (CDN)    │          │
│  └──────────────┘        └──────────────┘          │
│                                 │                    │
│                          ┌──────▼──────┐           │
│                          │     ALB     │           │
│                          │ (Load Bal.) │           │
│                          └──────┬──────┘           │
│                                 │                    │
│  ┌──────────────────────────────▼─────────┐        │
│  │          ECS Cluster (Fargate)         │        │
│  │  ┌─────────────┐    ┌─────────────┐   │        │
│  │  │  Task 1     │    │  Task 2     │   │        │
│  │  │ (Container) │    │ (Container) │   │        │
│  │  └─────────────┘    └─────────────┘   │        │
│  └────────────────────────────────────────┘        │
│                      │                              │
│               ┌──────▼──────┐                      │
│               │  RDS (PG)   │                      │
│               │  (Database) │                      │
│               └─────────────┘                      │
│                                                      │
│  ┌─────────────────┐    ┌──────────────┐          │
│  │ Secrets Manager │    │      S3      │          │
│  │   (API Keys)    │    │   (Assets)   │          │
│  └─────────────────┘    └──────────────┘          │
└─────────────────────────────────────────────────────┘
```

### Option 1: AWS ECS Fargate (Recommended)

Best for: Production-grade, scalable deployments

#### Prerequisites

```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, Region (e.g., ap-south-1)
```

#### Step 1: Create ECR Repository

```bash
# Create repository for Docker images
aws ecr create-repository \
  --repository-name dehadi-app \
  --region ap-south-1

# Authenticate Docker to ECR
aws ecr get-login-password --region ap-south-1 | \
  docker login --username AWS --password-stdin \
  <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com
```

#### Step 2: Build and Push Docker Image

```bash
# Build image
docker build -t dehadi-app:latest .

# Tag for ECR
docker tag dehadi-app:latest \
  <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/dehadi-app:latest

# Push to ECR
docker push \
  <YOUR_AWS_ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/dehadi-app:latest
```

#### Step 3: Set Up RDS PostgreSQL

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier dehadi-postgres \
  --db-instance-class db.t4g.micro \
  --engine postgres \
  --engine-version 16.1 \
  --master-username dehadiadmin \
  --master-user-password "YourSecurePassword123!" \
  --allocated-storage 20 \
  --storage-type gp3 \
  --vpc-security-group-ids sg-xxxxxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --publicly-accessible false \
  --multi-az \
  --storage-encrypted \
  --region ap-south-1

# Get endpoint after creation (takes 5-10 minutes)
aws rds describe-db-instances \
  --db-instance-identifier dehadi-postgres \
  --query 'DBInstances[0].Endpoint.Address' \
  --output text
```

#### Step 4: Store Secrets in Secrets Manager

```bash
# Store Razorpay keys
aws secretsmanager create-secret \
  --name dehadi/razorpay-key-id \
  --secret-string "rzp_live_your_key_id" \
  --region ap-south-1

aws secretsmanager create-secret \
  --name dehadi/razorpay-key-secret \
  --secret-string "your_secret_here" \
  --region ap-south-1

# Store database password
aws secretsmanager create-secret \
  --name dehadi/db-password \
  --secret-string "YourSecurePassword123!" \
  --region ap-south-1

# Store session secret
aws secretsmanager create-secret \
  --name dehadi/session-secret \
  --secret-string "$(openssl rand -base64 32)" \
  --region ap-south-1
```

#### Step 5: Create ECS Cluster

```bash
# Create cluster
aws ecs create-cluster \
  --cluster-name dehadi-cluster \
  --region ap-south-1

# Verify cluster
aws ecs list-clusters --region ap-south-1
```

#### Step 6: Create Task Definition

Create `ecs-task-definition.json`:

```json
{
  "family": "dehadi-app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<ACCOUNT_ID>:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "dehadi-app",
      "image": "<ACCOUNT_ID>.dkr.ecr.ap-south-1.amazonaws.com/dehadi-app:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "8080"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:dehadi/database-url"
        },
        {
          "name": "RAZORPAY_KEY_ID",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:dehadi/razorpay-key-id"
        },
        {
          "name": "RAZORPAY_KEY_SECRET",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:dehadi/razorpay-key-secret"
        },
        {
          "name": "SESSION_SECRET",
          "valueFrom": "arn:aws:secretsmanager:ap-south-1:<ACCOUNT_ID>:secret:dehadi/session-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/dehadi-app",
          "awslogs-region": "ap-south-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "node -e \"require('http').get('http://localhost:8080/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})\""],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

Register the task definition:

```bash
# Create CloudWatch log group
aws logs create-log-group \
  --log-group-name /ecs/dehadi-app \
  --region ap-south-1

# Register task definition
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition.json \
  --region ap-south-1
```

#### Step 7: Create Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name dehadi-alb \
  --subnets subnet-xxxxx subnet-yyyyy \
  --security-groups sg-xxxxxxx \
  --scheme internet-facing \
  --type application \
  --region ap-south-1

# Create target group
aws elbv2 create-target-group \
  --name dehadi-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxxxxxx \
  --target-type ip \
  --health-check-path /api/health \
  --region ap-south-1

# Create listener
aws elbv2 create-listener \
  --load-balancer-arn <ALB_ARN> \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=<TARGET_GROUP_ARN> \
  --region ap-south-1
```

#### Step 8: Create ECS Service

```bash
# Create service
aws ecs create-service \
  --cluster dehadi-cluster \
  --service-name dehadi-service \
  --task-definition dehadi-app-task \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxxxx,subnet-yyyyy],securityGroups=[sg-xxxxxxx],assignPublicIp=ENABLED}" \
  --load-balancers targetGroupArn=<TARGET_GROUP_ARN>,containerName=dehadi-app,containerPort=8080 \
  --region ap-south-1

# Check service status
aws ecs describe-services \
  --cluster dehadi-cluster \
  --services dehadi-service \
  --region ap-south-1
```

#### Step 9: Configure Auto Scaling

```bash
# Register scalable target
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/dehadi-cluster/dehadi-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10 \
  --region ap-south-1

# Create scaling policy (CPU-based)
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/dehadi-cluster/dehadi-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-target-tracking-policy \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json \
  --region ap-south-1
```

`scaling-policy.json`:
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 60
}
```

### Option 2: AWS Elastic Beanstalk (Easier Alternative)

Best for: Quick deployment with less configuration

```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init -p docker dehadi-app --region ap-south-1

# Create environment
eb create dehadi-production \
  --database.engine postgres \
  --database.size 20 \
  --database.instance db.t4g.micro

# Set environment variables
eb setenv \
  NODE_ENV=production \
  RAZORPAY_KEY_ID=rzp_live_xxx \
  RAZORPAY_KEY_SECRET=xxx \
  SESSION_SECRET=$(openssl rand -base64 32)

# Deploy
eb deploy

# Open in browser
eb open
```

### Option 3: AWS EC2 (Most Control)

Best for: Custom configurations, tighter control

```bash
# Launch EC2 instance (Ubuntu 22.04)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxxxxxx \
  --subnet-id subnet-xxxxxx \
  --region ap-south-1

# SSH into instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# On EC2 instance:
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone https://github.com/yourusername/dehadi.co.in.git
cd dehadi.co.in

# Create .env file
nano .env  # Add your production values

# Start with Docker Compose
docker-compose up -d

# Set up NGINX reverse proxy (optional)
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/dehadi
```

NGINX configuration (`/etc/nginx/sites-available/dehadi`):

```nginx
server {
    listen 80;
    server_name dehadi.co.in www.dehadi.co.in;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/dehadi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d dehadi.co.in -d www.dehadi.co.in
```

---

## 🔑 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | `rzp_test_xxxxx` or `rzp_live_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | `your_secret_here` |
| `SESSION_SECRET` | Express session secret | Random 32+ char string |
| `NODE_ENV` | Environment | `production` or `development` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `8080` |
| `OPENAI_API_KEY` | OpenAI API key | None |
| `DEFAULT_OBJECT_STORAGE_BUCKET_ID` | S3/Object storage bucket | None |

---

## 🗄️ Database Migrations

### Initial Setup

```bash
# Push schema to database
npm run db:push

# For production, use --force if needed
npm run db:push --force
```

### Creating Migrations (Advanced)

```bash
# Generate migration from schema changes
npx drizzle-kit generate:pg

# Apply migration
npx drizzle-kit push:pg
```

---

## 🔧 Troubleshooting

### Docker Issues

**Container not starting:**
```bash
# Check logs
docker-compose logs app

# Check if PostgreSQL is ready
docker-compose logs postgres

# Restart services
docker-compose restart
```

**Port already in use:**
```bash
# Find process using port 8080
lsof -i :8080
# Or on Linux
sudo netstat -tulpn | grep 8080

# Kill process
kill -9 <PID>
```

### Database Issues

**Connection refused:**
```bash
# Check DATABASE_URL format
# Should be: postgresql://user:password@host:port/database

# Test connection
psql "postgresql://user:password@host:port/database"
```

**Schema out of sync:**
```bash
# Force push schema
npm run db:push --force
```

### AWS Issues

**ECS task failing:**
```bash
# Check CloudWatch logs
aws logs tail /ecs/dehadi-app --follow

# Check task status
aws ecs describe-tasks \
  --cluster dehadi-cluster \
  --tasks <TASK_ARN>
```

**RDS connection timeout:**
- Check security groups allow inbound on port 5432
- Verify VPC configuration
- Ensure ECS tasks are in same VPC as RDS

### Payment Gateway Issues

**Razorpay signature verification fails:**
- Verify `RAZORPAY_KEY_SECRET` is correct
- Check webhook signature calculation
- Ensure keys match environment (test vs live)

---

## 📊 Monitoring & Logs

### CloudWatch (AWS)

```bash
# View logs
aws logs tail /ecs/dehadi-app --follow

# Create alarm for high CPU
aws cloudwatch put-metric-alarm \
  --alarm-name dehadi-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold
```

### Docker Logs

```bash
# View application logs
docker-compose logs -f app

# View database logs
docker-compose logs -f postgres

# Export logs
docker-compose logs --no-color > app-logs.txt
```

---

## 🔒 Security Checklist

- [ ] Use strong, unique `SESSION_SECRET`
- [ ] Enable SSL/TLS (HTTPS)
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Configure security groups with least privilege
- [ ] Enable RDS encryption at rest
- [ ] Enable VPC flow logs
- [ ] Set up CloudWatch alarms
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Use IAM roles instead of access keys
- [ ] Enable MFA on AWS account

---

## 💰 Cost Estimation

### AWS Monthly Costs (Approximate)

| Service | Configuration | Cost (USD) |
|---------|--------------|------------|
| ECS Fargate | 2 tasks × 0.5 vCPU, 1GB | $30 |
| RDS PostgreSQL | db.t4g.micro, 20GB, Multi-AZ | $40 |
| Application Load Balancer | Standard | $20 |
| Data Transfer | ~100GB/month | $10 |
| **Total** | | **~$100/month** |

### Cost Optimization Tips

1. Use **Reserved Instances** for RDS (save ~40%)
2. Use **Fargate Spot** for non-critical tasks (save ~70%)
3. Enable **S3 Intelligent-Tiering** for assets
4. Set up **CloudWatch log retention policies**
5. Use **Auto Scaling** to scale down during low traffic

---

## 📚 Additional Resources

- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Documentation](https://docs.docker.com/)
- [Razorpay Integration Guide](https://razorpay.com/docs/payments/server-integration/)
- [PostgreSQL on RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)

---

## 🆘 Support

For deployment issues, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review logs for error messages
3. Open an issue on GitHub
4. Contact the development team

---

**Last Updated:** January 2025  
**Version:** 1.0.0
