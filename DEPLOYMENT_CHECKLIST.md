# Deployment Checklist

Use this checklist to ensure a smooth deployment to AWS.

## Pre-Deployment

### AWS Account Setup
- [x] AWS account created
- [x] IAM user with programmatic access created
- [x] AWS CLI installed and configured (`aws configure`)
- [x] Appropriate IAM permissions granted (see IAM_PERMISSIONS.md)

### Local Setup
- [x] Terraform >= 1.0 installed
- [x] Docker installed (for building images)
- [x] Git repository initialized
- [x] GitHub repository created

### GitHub Configuration
- [x] GitHub Actions enabled
- [x] Secrets configured:
  - [x] `AWS_ACCESS_KEY_ID`
  - [x] `AWS_SECRET_ACCESS_KEY`
  - [ ] `VITE_API_URL` (set after infrastructure deployment)
  - [ ] `CLOUDFRONT_DISTRIBUTION_ID` (set after infrastructure deployment)

## Infrastructure Deployment

### Terraform Setup
- [ ] Navigate to `infrastructure/terraform`
- [ ] Copy `terraform.tfvars.example` to `terraform.tfvars`
- [ ] Edit `terraform.tfvars` with your values:
  - [ ] AWS region
  - [ ] Database password (strong password!)
  - [ ] JWT secret (strong secret!)
  - [ ] Domain name (if using custom domain)

### Deploy Infrastructure
- [ ] Run `terraform init`
- [ ] Run `terraform plan` and review changes
- [ ] Run `terraform apply` (takes ~15 minutes)
- [ ] Save outputs: `terraform output -json > ../../terraform-outputs.json`

### Post-Infrastructure
- [ ] Update GitHub secret `VITE_API_URL` with ALB DNS name
- [ ] Update GitHub secret `CLOUDFRONT_DISTRIBUTION_ID` with distribution ID
- [ ] Note RDS endpoint for database migrations

## Database Setup

- [ ] Connect to RDS instance
- [ ] Run migrations: `npm run db:migrate` (from backend directory)
- [ ] Verify database connection
- [ ] Test database queries

## Backend Deployment

### First Deployment
- [ ] Build Docker image locally
- [ ] Push to ECR
- [ ] Update ECS service
- [ ] Verify backend is accessible at ALB endpoint
- [ ] Check CloudWatch logs for errors

### Automated Deployment
- [ ] Push to `main` branch
- [ ] Verify GitHub Actions workflow runs successfully
- [ ] Monitor ECS service deployment
- [ ] Test API endpoints

## Frontend Deployment

### First Deployment
- [ ] Build frontend with correct `VITE_API_URL`
- [ ] Deploy to S3
- [ ] Invalidate CloudFront cache
- [ ] Verify frontend loads correctly
- [ ] Test API connectivity from frontend

### Automated Deployment
- [ ] Push to `main` branch
- [ ] Verify GitHub Actions workflow runs successfully
- [ ] Test frontend functionality

## Post-Deployment Verification

### Backend
- [ ] Health check endpoint works: `/api/`
- [ ] Authentication endpoints work
- [ ] Database connections successful
- [ ] Logs are being written to CloudWatch

### Frontend
- [ ] Frontend loads correctly
- [ ] API calls work from frontend
- [ ] No console errors
- [ ] PWA features work (if applicable)

### Security
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] CORS configured correctly
- [ ] Security groups restrict access appropriately
- [ ] Secrets stored in Secrets Manager (not in code)
- [ ] Database not publicly accessible

## Monitoring Setup

- [ ] CloudWatch alarms configured (optional)
- [ ] Log aggregation working
- [ ] Error tracking set up (optional)
- [ ] Performance monitoring enabled

## Documentation

- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created
- [ ] Team members trained on deployment process

## Cost Optimization

- [ ] Review AWS Cost Explorer
- [ ] Set up billing alerts
- [ ] Consider Reserved Instances for RDS (production)
- [ ] Review and optimize resource sizes

## Backup and Recovery

- [ ] RDS automated backups enabled
- [ ] Backup retention period configured
- [ ] Disaster recovery plan documented
- [ ] Test restore procedure (optional)

## Next Steps

- [ ] Set up staging environment
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Configure auto-scaling
- [ ] Set up monitoring and alerts
- [ ] Plan for production traffic

## Rollback Plan

If deployment fails:
1. **Backend**: Revert to previous ECS task definition
2. **Frontend**: Revert S3 bucket to previous version
3. **Infrastructure**: Use `terraform destroy` (careful - deletes everything!)

## Support Contacts

- AWS Support: https://console.aws.amazon.com/support
- Terraform Docs: https://www.terraform.io/docs
- GitHub Actions Docs: https://docs.github.com/en/actions

