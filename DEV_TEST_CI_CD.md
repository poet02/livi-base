# Dev/Test CI/CD Setup

This document explains the automatic deployment setup for the `devtest` branch.

## Overview

When you push code to the `devtest` branch, GitHub Actions will automatically:
- ✅ Build and deploy backend to ECS
- ✅ Run database migrations
- ✅ Build and deploy frontend to S3/CloudFront

## Workflows

### Backend Workflow (`.github/workflows/devtest-backend.yml`)

**Triggers:**
- Push to `devtest` branch with changes in `backend/` directory
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out code
2. Installs dependencies
3. Runs linting
4. Builds TypeScript
5. Runs database migrations
6. Builds Docker image
7. Pushes to ECR
8. Updates ECS service with new image
9. Waits for service to stabilize

**Time:** ~5-10 minutes

### Frontend Workflow (`.github/workflows/devtest-frontend.yml`)

**Triggers:**
- Push to `devtest` branch with changes in `livi-app/` directory
- Manual trigger via GitHub Actions UI

**What it does:**
1. Checks out code
2. Installs dependencies
3. Runs linting
4. Builds React app with `VITE_API_BASE_URL`
5. Uploads to S3 bucket
6. Invalidates CloudFront cache

**Time:** ~3-5 minutes

## Required GitHub Secrets

Configure these in: **GitHub → Settings → Secrets and variables → Actions**

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS access key | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region | `us-east-1` |
| `ECR_REPOSITORY_URI` | ECR repo name (not full URL) | `livi-dev-backend` |
| `ECS_CLUSTER_NAME` | ECS cluster name | `livi-dev-cluster` |
| `ECS_SERVICE_NAME` | ECS service name | `livi-dev-backend-service` |
| `S3_BUCKET_NAME` | S3 bucket name | `livi-dev-frontend-123456789` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E1234567890ABC` |
| `VITE_API_BASE_URL` | Backend API URL for frontend builds | `http://livi-dev-alb-xxx.elb.amazonaws.com/api` |
| `DB_HOST` | RDS endpoint | `devtest-livi-db.xxxxx.eu-west-1.rds.amazonaws.com` |
| `DB_PORT` | RDS port | `5432` |
| `DB_TYPE` | Database type | `postgres` |
| `DB_NAME` | Database name | `postgres` |
| `DB_USER` | Database user | `livi_admin` |
| `DB_PASSWORD` | Database password | `********` |

## How to Use

### Automatic Deployment

1. **Make changes to your code**
2. **Commit and push to `devtest` branch:**
   ```bash
   git checkout -b devtest  # If branch doesn't exist
   git add .
   git commit -m "Your changes"
   git push origin devtest
   ```

3. **GitHub Actions will automatically:**
   - Detect changes
   - Build and deploy backend (if `backend/` changed)
   - Build and deploy frontend (if `livi-app/` changed)

4. **Monitor deployment:**
   - Go to GitHub → Actions tab
   - Watch the workflow run
   - Check for any errors

### Manual Trigger

You can also trigger deployments manually:
1. Go to GitHub → Actions
2. Select the workflow (Backend or Frontend)
3. Click "Run workflow"
4. Select `devtest` branch
5. Click "Run workflow"

## Database Migrations

**Migrations are run automatically** during the backend workflow.

### To Run Migrations Manually (optional):

**Option 1: Direct Connection (Easiest)**
```bash
# Set environment variables
export DB_HOST=[RDS_ENDPOINT]
export DB_PORT=5432
export DB_TYPE=postgres
export DB_NAME=livi_db
export DB_USER=livi_admin
export DB_PASSWORD=[YOUR_PASSWORD]

# Run migrations
cd backend
npm run db:migrate
```

**Option 2: Via Database Client**
- Connect using Valentina/pgAdmin to RDS endpoint
- Run SQL migrations manually

**Option 3: From ECS Task (Advanced)**
```bash
# Get running task ID
aws ecs list-tasks --cluster livi-dev-cluster --service-name livi-dev-backend-service

# Execute migration command in running container
aws ecs execute-command \
  --cluster livi-dev-cluster \
  --task [TASK_ID] \
  --container livi-backend \
  --command "npm run db:migrate" \
  --interactive
```

## Workflow Behavior

### Path-Based Triggers

Workflows only run when relevant files change:
- **Backend workflow**: Only runs if files in `backend/` change
- **Frontend workflow**: Only runs if files in `livi-app/` change
- **Both workflows**: Run if workflow files themselves change

This saves CI/CD minutes and speeds up deployments.

### Parallel Execution

If both backend and frontend change in the same push:
- Both workflows run in parallel
- Each completes independently
- No dependency between them

## Monitoring

### Check Deployment Status

1. **GitHub Actions:**
   - Go to Actions tab
   - See workflow run history
   - Click on a run to see logs

2. **AWS Console:**
   - **ECS**: Check service status and task count
   - **CloudWatch**: View application logs
   - **S3**: Verify files are uploaded
   - **CloudFront**: Check invalidation status

### View Logs

**Backend logs:**
- AWS Console → CloudWatch → Log Groups → `/ecs/livi-dev-backend`
- Or: ECS → Service → Logs tab

**Frontend:**
- Check browser console for errors
- Verify CloudFront distribution is active

## Troubleshooting

### Workflow Fails

1. **Check GitHub Secrets:**
   - Verify all secrets are set correctly
   - Check for typos in secret names

2. **Check AWS Permissions:**
   - Verify IAM user has required permissions
   - Test with: `aws ecs describe-services --cluster livi-dev-cluster`

3. **Check Workflow Logs:**
   - Go to Actions → Failed workflow → View logs
   - Look for specific error messages

### Deployment Succeeds but App Doesn't Work

1. **Backend:**
   - Check ECS service is running
   - Check CloudWatch logs for errors
   - Verify environment variables in task definition
   - Test health endpoint: `curl http://[ALB_DNS]/api/`

2. **Frontend:**
   - Verify S3 bucket has files
   - Check CloudFront distribution status
   - Verify `VITE_API_BASE_URL` is correct
   - Check browser console for errors

### ECR Push Fails

- Verify ECR repository exists
- Check `ECR_REPOSITORY_URI` secret (should be just repo name, not full URL)
- Verify AWS credentials have ECR permissions

### ECS Update Fails

- Check task definition exists
- Verify container name is `livi-backend`
- Check ECS service is running
- Verify security groups allow traffic

## Best Practices

1. **Test Locally First:**
   - Run `yarn lint` and `yarn build` locally
   - Test database migrations locally
   - Fix issues before pushing

2. **Small, Frequent Commits:**
   - Easier to debug if something breaks
   - Faster deployments
   - Better git history

3. **Monitor First Deployment:**
   - Watch the workflow run
   - Verify deployment succeeds
   - Test the application after deployment

4. **Run Migrations Carefully:**
   - Always test migrations locally first
   - Backup database before running migrations
   - Run migrations during low-traffic periods

## Next Steps

- Set up notifications for failed deployments
- Add staging environment
- Configure custom domain
- Set up monitoring and alerts

