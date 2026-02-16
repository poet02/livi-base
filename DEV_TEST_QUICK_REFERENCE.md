# Dev/Test Deployment Quick Reference

Quick checklist and commands for dev/test deployment.

## Pre-Deployment Checklist

- [ ] AWS account created
- [ ] AWS CLI configured (`aws configure`)
- [ ] Docker installed
- [ ] Database password generated
- [ ] JWT secret generated
- [ ] OTP secret generated
- [ ] Email credentials ready

## Resource Creation Order

1. RDS Database (10 min)
2. ECR Repository (2 min)
3. S3 Bucket (3 min)
4. CloudFront Distribution (5 min)
5. ECS Cluster (3 min)
6. Application Load Balancer (10 min)
7. Target Group (5 min)
8. ECS Task Definition (10 min)
9. ECS Service (5 min)

**Total setup time: ~60 minutes**

## Key Commands

### Get Your IP
```bash
curl ifconfig.me
```

### ECR Login
```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin [ECR_URI]
```

### Build and Push Backend
```bash
cd backend
docker build -t livi-dev-backend:latest .
docker tag livi-dev-backend:latest [ECR_URI]:latest
docker push [ECR_URI]:latest
```

### Build Frontend
```bash
cd livi-app
export VITE_API_BASE_URL=http://[ALB_DNS]/api
yarn build
```

### Deploy Frontend to S3
```bash
aws s3 sync dist/ s3://[BUCKET_NAME] --delete
```

### Invalidate CloudFront
```bash
aws cloudfront create-invalidation \
  --distribution-id [DIST_ID] \
  --paths "/*"
```

### Run Migrations
```bash
cd backend
export DB_HOST=[RDS_ENDPOINT]
export DB_PORT=5432
export DB_TYPE=postgres
export DB_NAME=livi_db
export DB_USER=livi_admin
export DB_PASSWORD=[PASSWORD]
npm run db:migrate
```

## Resource Naming Convention

Use `livi-dev-` prefix for all resources:
- Database: `livi-dev-db`
- ECR: `livi-dev-backend`
- S3: `livi-dev-frontend-xxx`
- ECS Cluster: `livi-dev-cluster`
- ECS Service: `livi-dev-backend-service`
- ALB: `livi-dev-alb`
- Security Groups: `livi-dev-*-sg`

## Testing URLs

After deployment:
- **Backend API**: `http://[ALB_DNS]/api/`
- **Frontend**: `https://[CLOUDFRONT_DOMAIN]`
- **Health Check**: `http://[ALB_DNS]/api/`

## Common Issues

**Issue**: ECS service won't start
- Check: Task definition image URI is correct
- Check: Environment variables are set
- Check: Security groups allow traffic

**Issue**: Frontend shows blank page
- Check: S3 bucket has files
- Check: CloudFront distribution is deployed
- Check: Bucket policy allows CloudFront

**Issue**: Can't connect to database
- Check: Security group allows your IP on port 5432
- Check: RDS is publicly accessible
- Check: Credentials are correct

