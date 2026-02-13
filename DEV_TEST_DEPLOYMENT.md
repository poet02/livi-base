# Dev/Test Manual Deployment Guide

This guide walks you through manually deploying to AWS for dev/test environment. Production will use Terraform later.

## Prerequisites

- AWS account
- AWS CLI installed and configured (`aws configure`)
- Docker installed (for building backend image)
- GitHub repository

## Step 1: Create RDS PostgreSQL Database (10 minutes)

1. **Go to AWS Console → RDS → Databases → Create database**

2. **Database configuration:**
   - Engine: **PostgreSQL**
   - Version: **16.x** (or latest)
   - Template: **Free tier** (or Dev/Test)
   - DB instance identifier: `livi-dev-db`
   - Master username: `livi_admin`
   - Master password: **Create a strong password** (save this!)
   - DB instance class: `db.t3.micro` (or `db.t4g.micro` for ARM)
   - Storage: 20 GB (default) ✅

3. **Connectivity:**
   - VPC: **Default VPC** (simplest for dev/test)
   - Public access: **Yes** (for easy access)
   - VPC security group: **Create new** → Name: `livi-dev-db-sg`
   - Availability Zone: **No preference**

4. **Database authentication:**
   - Database authentication: **Password authentication**

5. **Additional configuration:**
   - Initial database name: `livi_db`
   - Backup retention: **7 days** (or 0 for dev/test to save costs)

6. **Click "Create database"** (takes ~5-10 minutes)

7. **After creation, note:**
   - **Endpoint** (e.g., `livi-dev-db.xxxxx.us-east-1.rds.amazonaws.com`)
   - **Port** (usually `5432`)
   - **Database name**: `livi_db`
   - **Username**: `livi_admin`
   - **Password**: (the one you created)

8. **Update Security Group:**
   - Go to RDS → Your database → Connectivity & security → VPC security groups
   - Click on the security group
   - Inbound rules → Edit inbound rules → Add rule:
     - Type: **PostgreSQL**
     - Port: **5432**
     - Source: **My IP** (or your IP address - use `curl ifconfig.me` to get it)
     - Description: "Allow PostgreSQL from my IP"
   - Save rules

## Step 2: Create ECR Repository for Backend (2 minutes)

1. **Go to AWS Console → ECR → Repositories → Create repository**

2. **Repository settings:**
   - Visibility: **Private**
   - Repository name: `livi-dev-backend`
   - Tag immutability: **Disabled** (for dev/test)
   - Scan on push: **Disabled** (optional, saves time)

3. **Click "Create repository"**

4. **Note the repository URI:**
   - Format: `123456789.dkr.ecr.us-east-1.amazonaws.com/livi-dev-backend`
   real:620356662106.dkr.ecr.eu-west-1.amazonaws.com/livi-dev-backend
   - You'll need this for pushing Docker images

## Step 3: Create S3 Bucket for Frontend (3 minutes)

1. **Go to AWS Console → S3 → Create bucket**

2. **Bucket configuration:**
   - Bucket name: `livi-dev-frontend-[your-account-id]` (must be globally unique)
   - AWS Region: `us-east-1` (or your preferred region)
   - Object Ownership: **ACLs disabled**
   - Block Public Access: **Enable all** (we'll use CloudFront)

3. **Bucket Versioning:**
   - Versioning: **Disabled** (for dev/test)

4. **Default encryption:**
   - Encryption: **Enabled**
   - Encryption type: **Amazon S3 managed keys (SSE-S3)**

5. **Click "Create bucket"**

6. **Configure static website hosting:**
   - Go to bucket → Properties → Static website hosting
   - Enable: **Static website hosting**
   - Index document: `index.html`
   - Error document: `index.html` (for SPA routing)
   - Save ✅

7. **Update bucket policy** (for CloudFront later):
   - Go to Permissions → Bucket policy
   - We'll update this after CloudFront is created

## Step 4: Create CloudFront Distribution (5 minutes)

1. **Go to AWS Console → CloudFront → Distributions → Create distribution** 

2. **Origin settings:**
   - Origin domain: Select your S3 bucket (e.g., `livi-dev-frontend-xxx.s3.us-east-1.amazonaws.com`)
   - Origin access: **Origin access control settings (recommended)**
   - Click "Create control setting":
     - Name: `livi-dev-frontend-oac`
     - Origin type: **S3**
     - Signing behavior: **Sign requests**
     - Click "Create"
   - Origin access control: Select the one you just created

3. **Default cache behavior:**
   - Viewer protocol policy: **Redirect HTTP to HTTPS**
   - Allowed HTTP methods: **GET, HEAD, OPTIONS**
   - Cache policy: **CachingOptimized**
   - Compress objects automatically: **Yes**

4. **Settings:**
   - Price class: **Use only North America and Europe** (cheaper)
   - Alternate domain names: Leave empty (for now)
   - SSL certificate: **Default CloudFront certificate**
   - Default root object: `index.html`

5. **Click "Create distribution"** (takes ~10-15 minutes to deploy) ✅

6. **After creation, note:**
   - **Distribution ID** (e.g., `E1234567890ABC`)
   - **Distribution domain name** (e.g., `d1234567890abcdef.cloudfront.net`)

7. **Update S3 bucket policy:**
   - Go back to S3 bucket → Permissions → Bucket policy
   - Use this policy (replace with your values):
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowCloudFrontServicePrincipal",
         "Effect": "Allow",
         "Principal": {
           "Service": "cloudfront.amazonaws.com"
         },
         "Action": "s3:GetObject",
         "Resource": "arn:aws:s3:::livi-dev-frontend-xxx/*",
         "Condition": {
           "StringEquals": {
             "AWS:SourceArn": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
           }
         }
       }
     ]
   }
   ```
   - Replace `ACCOUNT_ID` with your AWS account ID
   - Replace `DISTRIBUTION_ID` with your CloudFront distribution ID
   - Replace bucket name in Resource ARN

## Step 5: Create ECS Cluster (3 minutes)

1. **Go to AWS Console → ECS → Clusters → Create cluster**

2. **Cluster configuration:**
   - Cluster name: `livi-dev-cluster`
   - Infrastructure: **AWS Fargate (serverless)**
   - Monitoring: **CloudWatch Container Insights** (optional, costs extra) ✅

3. **Click "Create"** ✅

## Step 6: Create Application Load Balancer (10 minutes) 

1. **Go to AWS Console → EC2 → Load Balancers → Create Load Balancer**

2. **Load balancer type:**
   - Select **Application Load Balancer**

3. **Basic configuration:**
   - Name: `livi-dev-alb`
   - Scheme: **Internet-facing**
   - IP address type: **IPv4**

4. **Network mapping:**
   - VPC: **Default VPC**
   - Availability Zones: Select **all available zones**
   - Select subnets for each zone

5. **Security groups:**
   - Create new security group: `livi-dev-alb-sg`
   - Add inbound rules:
     - Type: **HTTP**, Port: **80**, Source: **0.0.0.0/0`
     - Type: **HTTPS**, Port: **443**, Source: **0.0.0.0/0** (if you add SSL later)

6. **Listeners and routing:** 
   - Protocol: **HTTP**, Port: **80**
   - Default action: **Create target group** (we'll configure this)

7. **Click "Create load balancer"** (takes ~2-3 minutes) ✅

8. **Note the DNS name:**
   - Format: `livi-dev-alb-1234567890.us-east-1.elb.amazonaws.com`
   real: livi-dev-alb-1440075958.eu-west-1.elb.amazonaws.com

## Step 7: Create ECS Target Group (5 minutes) ✅

1. **Go to AWS Console → EC2 → Target Groups → Create target group**

2. **Basic configuration:**
   - Target type: **IP addresses**
   - Target group name: `livi-dev-backend-tg`
   - Protocol: **HTTP**
   - Port: **3000**
   - VPC: **Default VPC**

3. **Health checks:**
   - Health check path: `/api/`
   - Advanced health check settings:
     - Healthy threshold: **2**
     - Unhealthy threshold: **2**
     - Timeout: **5 seconds**
     - Interval: **30 seconds**

4. **Click "Next"** → Skip registering targets → **Create target group**

5. **Attach to Load Balancer:**
   - Go to Load Balancer → Listeners → Edit listener
   - Default action: Forward to `livi-dev-backend-tg`✅

## Step 8: Create ECS Task Definition (10 minutes) 

1. **Go to AWS Console → ECS → Task Definitions → Create new task definition** 

2. **Task definition configuration:**
   - Task definition family: `livi-dev-backend`
   - Launch type: **Fargate**
   - Operating system: **Linux/X86_64**
   - Task size:
     - Task CPU: **0.25 vCPU**
     - Task memory: **0.5 GB**

3. **Container definitions → Add container:**
   - Container name: `livi-backend`
   - Image URI: `123456789.dkr.ecr.us-east-1.amazonaws.com/livi-dev-backend:latest`
     - (Use your ECR repository URI)
   - Port mappings:
     - Container port: **3000**
     - Protocol: **HTTP**

4. **Environment variables:** hhere
   - Add all these (get values from your `.env` or create new):
   ```
   NODE_ENV = production
   PORT = 3000
   DB_HOST = [RDS endpoint from Step 1]
   DB_PORT = 5432
   DB_TYPE = postgres
   DB_NAME = livi_db
   DB_USER = livi_admin
   DB_PASSWORD = [Your RDS password]
   SECRET = [Generate a JWT secret]
   TOKEN_EXPIRY_HOUR = 24
   EMAIL_SERVICE = gmail
   EMAIL_USER = [Your email]
   EMAIL_PASS = [Your email app password]
   EMAIL_FROM = [Your email]
   OTP_EXPIRY_MIN = 10
   OTP_SECRET = [Generate an OTP secret]
   AWS_REGION = us-east-1
   AWS_S3_BUCKET_NAME = [Your S3 bucket name]
   FRONTEND_URLS = https://[Your CloudFront domain]
   ```

5. **Click "Create"**

## Step 9: Create ECS Service (5 minutes) 👀

1. **Go to ECS → Clusters → livi-dev-cluster → Services → Create**

2. **Service configuration:**
   - Launch type: **Fargate**
   - Task definition: **livi-dev-backend** (latest revision)
   - Service name: `livi-dev-backend-service`
   - Desired tasks: **1**

3. **Networking:**
   - VPC: **Default VPC**
   - Subnets: Select **all available subnets**
   - Security group: **Create new** → Name: `livi-dev-ecs-sg`
     - Add inbound rule: Type **Custom TCP**, Port **3000**, Source: **livi-dev-alb-sg**
   - Auto-assign public IP: **Enabled**

4. **Load balancing:**
   - Load balancer type: **Application Load Balancer**
   - Load balancer name: **livi-dev-alb**
   - Container to load balance: **livi-backend:3000**
   - Target group: **livi-dev-backend-tg**

5. **Click "Create"** (takes ~2-3 minutes) ✅

## Step 10: Push Docker Image to ECR (5 minutes)

1. **Get ECR login (region must match your ECR):**
   ```bash
   aws ecr get-login-password --region [YOUR_REGION] | \
     docker login --username AWS --password-stdin [YOUR_ECR_URI]
   ```
   Replace `[YOUR_REGION]` and `[YOUR_ECR_URI]` with your values ✅

2. **Build and push (amd64 required for ECS x86_64 tasks):**
   ```bash
   cd backend
   # Build amd64 image and push to ECR (use a unique tag)
   docker buildx create --name multiarch --use || true
   TAG=$(date +%Y%m%d%H%M%S)
   docker buildx build \
     --platform linux/amd64 \
     -t 620356662106.dkr.ecr.eu-west-1.amazonaws.com/livi-dev-backend:$TAG \
     --push .
   ```
   - If your ECR repo has tag immutability enabled, do not reuse `latest`
   - If you want a multi-arch image, use `--platform linux/amd64,linux/arm64`
   - Save the tag value (`$TAG`) for Step 11

## Step 11: Update ECS Service to Use New Image (2 minutes)

1. **Go to ECS → Clusters → livi-dev-cluster → Services → livi-dev-backend-service**

2. **Click "Update"**

3. **Task definition:**
   - Create a new revision of **livi-dev-backend**
   - Update the container image to use the new tag you pushed:
     - Example: `620356662106.dkr.ecr.eu-west-1.amazonaws.com/livi-dev-backend:$TAG`
   - Select the **latest revision** in the service update ✅

4. **Click "Update"** → Wait for service to stabilize (~2-3 minutes)

## Step 12: Run Database Migrations (10 minutes)

### Option A: Direct Connection (Easiest)

Since RDS is publicly accessible:

1. **Connect using Valentina/pgAdmin:**
   - Host: `[RDS endpoint from Step 1]`
   - Port: `5432`
   - Database: `livi_db`
   - Username: `livi_admin`
   - Password: `[Your RDS password]`

2. **Or use psql:**
   ```bash
   psql -h [RDS_ENDPOINT] -U livi_admin -d livi_db
   ```

3. **Run migrations:**
   ```bash
   cd backend
   # Set environment variables
   export DB_HOST=[RDS_ENDPOINT]
   export DB_PORT=5432
   export DB_TYPE=postgres
   export DB_NAME=livi_db
   export DB_USER=livi_admin
   export DB_PASSWORD=[YOUR_PASSWORD]
   
   npm run db:migrate ✅
   ```

## Step 12.5: Enable HTTPS for Backend API (ACM + ALB) (10–20 minutes)

1. **Request ACM certificate (eu-west-1):**
   - ACM → Request certificate → Public
   - Domain: `api.[YOUR_DOMAIN]`
   - Validation: DNS

2. **Add DNS validation record (Squarespace or your DNS provider):**
   - Add the CNAME **exactly** as shown in ACM
   - Wait for status to become **Issued**

3. **Point API subdomain to ALB:**
   - Add CNAME: `api` → `[ALB_DNS_NAME]`

4. **Add HTTPS listener on ALB:**
   - EC2 → Load Balancers → `livi-dev-alb` → Listeners → Add listener
   - Protocol: **HTTPS**, Port: **443**
   - Certificate: `api.[YOUR_DOMAIN]`
   - Default action: Forward to `livi-dev-backend-tg`

5. **Update ALB security group:**
   - Allow inbound **HTTPS (443)** from `0.0.0.0/0`

## Step 13: Deploy Frontend to S3 (5 minutes)

1. **Build frontend:**
   ```bash
   cd livi-app
   
   # Set API URL (use HTTPS custom domain to avoid mixed-content errors)
   export VITE_API_BASE_URL=https://api.[YOUR_DOMAIN]/api
   
   yarn build
   ```
   - If you haven’t set up HTTPS yet, use `http://[ALB_DNS_NAME]/api` temporarily

2. **Upload to S3:**
   ```bash
   # Upload all files
   aws s3 sync dist/ s3://livi-dev-frontend --delete
   
   # Or upload with proper cache headers
   aws s3 sync dist/ s3://[YOUR_S3_BUCKET_NAME] \
     --delete \
     --cache-control "public, max-age=31536000, immutable" \
     --exclude "*.html" \
     --exclude "service-worker.js" \
     --exclude "sw.js"
   
   aws s3 sync dist/ s3://[YOUR_S3_BUCKET_NAME] \
     --delete \
     --cache-control "public, max-age=0, must-revalidate" \
     --include "*.html" \
     --include "service-worker.js" \
     --include "sw.js"
   ```

3. **Invalidate CloudFront cache:**
   ```bash
   aws cloudfront create-invalidation \
     --distribution-id EI5HM0NXWH481\
     --paths "/*"
   ```
   - If you see `AccessDenied` when loading the site, set CloudFront **Default root object** to `index.html` and invalidate again

## Step 14: Test Deployment (5 minutes)

1. **Test backend:**
   ```bash
   curl https://api.[YOUR_DOMAIN]/api/
   # Should return: {"msg":"server is up..","user":null}
   ```

2. **Test frontend:**
   - Open: `https://[CLOUDFRONT_DOMAIN]`
   - Should load your React app

3. **Test API from frontend:**
   - Try logging in or making API calls
   - Check browser console for errors
   - If you see CORS errors, add your frontend URL(s) to `FRONTEND_URLS` in the ECS task definition and redeploy

## Step 15: Configure GitHub Secrets for CI/CD (Required for Automatic Deployment)

**CI/CD workflows are already set up!** They will automatically deploy when you push to the `devtest` branch.

1. **Go to GitHub → Settings → Secrets and variables → Actions → New repository secret**

2. **Add these secrets (required for automatic deployment):**
   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_REGION (e.g., us-east-1)
   ECR_REPOSITORY_URI (just the repo name: livi-dev-backend)
   ECS_CLUSTER_NAME (livi-dev-cluster)
   ECS_SERVICE_NAME (livi-dev-backend-service)
   S3_BUCKET_NAME (your S3 bucket name)
   CLOUDFRONT_DISTRIBUTION_ID (your distribution ID)
   VITE_API_BASE_URL (https://api.[YOUR_DOMAIN]/api)
   DB_HOST (RDS endpoint)
   DB_PORT (5432)
   DB_TYPE (postgres)
   DB_NAME (postgres or livi_db)
   DB_USER (livi_admin)
   DB_PASSWORD (your DB password)
   ```

3. **How it works:**
   - Push to `devtest` branch → Automatic deployment
   - Backend changes → Runs migrations → Builds Docker image → Pushes to ECR → Updates ECS service
   - Frontend changes → Builds React app → Uploads to S3 → Invalidates CloudFront
   - **Migrations are run automatically** during backend deployment

## Step 16: Test Automatic Deployment

After configuring GitHub Secrets (Step 15), test the automatic deployment:

1. **Make a small change:**
   ```bash
   # Create devtest branch if it doesn't exist
   git checkout -b devtest
   
   # Make a small change (e.g., update a comment)
   # Then commit and push
   git add .
   git commit -m "Test automatic deployment"
   git push origin devtest
   ```

2. **Monitor deployment:**
   - Go to GitHub → Actions tab
   - Watch the workflows run
   - Verify deployment succeeds

3. **Verify deployment:**
   - Test backend: `curl https://api.[YOUR_DOMAIN]/api/`
   - Test frontend: Open `https://[CLOUDFRONT_DOMAIN]`

## Quick Reference: Resource Names

Keep track of these:

- **RDS Endpoint**: `livi-dev-db.xxxxx.us-east-1.rds.amazonaws.com`
- **ECR Repository**: `123456789.dkr.ecr.us-east-1.amazonaws.com/livi-dev-backend`
- **S3 Bucket**: `livi-dev-frontend-xxx`
- **CloudFront Domain**: `d1234567890abcdef.cloudfront.net`
- **CloudFront Distribution ID**: `E1234567890ABC`
- **ALB DNS Name**: `livi-dev-alb-1234567890.us-east-1.elb.amazonaws.com`
- **ECS Cluster**: `livi-dev-cluster`
- **ECS Service**: `livi-dev-backend-service`

## Cost Estimate (Dev/Test)

- **RDS (db.t3.micro)**: ~$15/month
- **ECS Fargate (0.25 vCPU, 0.5GB)**: ~$10/month
- **ALB**: ~$16/month
- **S3**: ~$1/month
- **CloudFront**: ~$1-5/month
- **ECR**: ~$0.50/month
- **Total**: ~$43-48/month

## Troubleshooting

### Backend not responding
- Check ECS service is running (ECS → Services)
- Check CloudWatch logs (ECS → Service → Logs)
- Verify security groups allow traffic
- Check task definition environment variables

### Frontend not loading
- Verify S3 bucket has files
- Check CloudFront distribution status
- Verify bucket policy allows CloudFront
- Check browser console for errors

### Database connection issues
- Verify security group allows your IP
- Check RDS endpoint is correct
- Verify credentials in ECS task definition

## Next Steps

- ✅ CI/CD workflows are already set up (see `DEV_TEST_CI_CD.md`)
- Configure custom domain (optional)
- Set up monitoring and alerts
- Plan for production Terraform deployment
