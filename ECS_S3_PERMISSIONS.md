# ECS Task Role - S3 Permissions

## Problem
When calling `/api/v1/properties/{id}/images/upload-urls`, you get:
```
code: 500
message: "Could not load credentials from any providers"
```

This happens because the ECS **Task Role** (not Task Execution Role) doesn't have S3 permissions.

## Important: Task Role vs Task Execution Role

- **Task Execution Role**: Used by ECS to pull Docker images, write CloudWatch logs, etc.
- **Task Role**: Used by your application code to access AWS services (S3, DynamoDB, etc.)

**Your application needs the Task Role to have S3 permissions!**

## Solution

### Option 1: Add S3 Permissions to Task Role (Recommended)

1. **Find your Task Role:**
   - Go to AWS Console → ECS → Task Definitions → `livi-dev-backend`
   - Click on the latest revision
   - Look for **"Task role"** (NOT "Task execution role")
   - If it says "None" or is empty, you need to create/assign a task role first (see step 1a below)

1a. **If no Task Role exists, create one (Step-by-step):**

   **Step 1: Create the IAM Role**
   - Go to AWS Console → IAM → Roles → "Create role"
   - Under "Select trusted entity", choose: **"AWS service"**
   - Under "Use case", search for or select: **"Elastic Container Service"**
   - Then select: **"Elastic Container Service Task"** (this is the one for your application code)
   - Click "Next"
   
   **IMPORTANT:** If you already created the role but it's not showing in the dropdown, you need to fix the trust policy (see troubleshooting below)
   
   **Step 2: Skip permissions (we'll add them next)**
   - Don't attach any policies yet - click "Next"
   
   **Step 3: Name the role**
   - Role name: `livi-dev-backend-task-role`
   - Description: "Task role for livi-dev-backend ECS tasks to access S3"
   - Click "Create role"
   
   **Step 4: Add S3 permissions to the new role**
   - You should now be on the role details page
   - Click "Add permissions" → "Create inline policy"
   - Click the "JSON" tab
   - Paste this policy:
   
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:PutObjectAcl"
         ],
         "Resource": "arn:aws:s3:::devtest-property-images/*"
       },
       {
         "Effect": "Allow",
         "Action": [
           "s3:ListBucket"
         ],
         "Resource": "arn:aws:s3:::devtest-property-images"
       }
     ]
   }
   ```
   
   - Click "Next"
   - Policy name: `S3PropertyImagesAccess`
   - Click "Create policy"
   
   **Step 5: Assign the role to your task definition**
   - Go back to ECS → Task Definitions → `livi-dev-backend`
   - Click "Create new revision" (button at the top)
   - Scroll down to "Task role" dropdown
   - Select: `livi-dev-backend-task-role` (the role you just created)
   - Leave "Task execution role" as is (don't change it)
   - Click "Create" at the bottom
   
   **Step 6: Update your service to use the new revision**
   - Go to ECS → Clusters → `livi-dev-cluster` → Services → `livi-dev-backend-service`
   - Click "Update"
   - Under "Task definition", select the new revision (should be the latest one)
   - Click "Update" at the bottom
   - Wait for the deployment to complete (takes 1-2 minutes)

2. **Add S3 permissions to the Task Role:**
   - Go to AWS Console → IAM → Roles
   - Find and click on your **Task Role** (e.g., `livi-dev-backend-task-role` or whatever is shown in your task definition)
   - If you don't see a task role, check your task definition - it might be using the execution role, or you need to create one
   - Click "Add permissions" → "Create inline policy"
   - Choose "JSON" tab
   - Paste this policy (using the correct bucket name `devtest-property-images`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:PutObjectAcl"
      ],
      "Resource": "arn:aws:s3:::devtest-property-images/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::devtest-property-images"
    }
  ]
}
```

   - Name the policy: `S3PropertyImagesAccess`
   - Click "Create policy"

3. **Verify the Task Role is attached to your task definition:**
   - Go to ECS → Task Definitions → `livi-dev-backend` → Latest revision
   - Under **"Task role"** (NOT "Task execution role"), verify it shows your role
   - If it's not set or shows "None", you need to:
     a. Create a new task definition revision
     b. Select your Task Role in the "Task role" dropdown
     c. Save the new revision
     d. Update your service to use the new revision

4. **Redeploy your service:**
   - The new permissions will take effect immediately for new tasks
   - You can force a new deployment: ECS → Services → `livi-dev-backend-service` → Update → Force new deployment

### Option 2: Use Explicit AWS Credentials (Not Recommended)

If you prefer to use explicit credentials instead of IAM roles:

1. **Add to task definition environment variables:**
   - Go to ECS → Task Definitions → `livi-dev-backend` → Create new revision
   - Add these environment variables:
     - `AWS_ACCESS_KEY_ID` = [Your access key]
     - `AWS_SECRET_ACCESS_KEY` = [Your secret key]
   - Create the new revision
   - Update your service to use the new revision

**Note:** Using IAM roles (Option 1) is more secure and recommended by AWS.

## Verify It Works

After adding permissions, test the endpoint:
```bash
curl -X POST https://dev-api.livi.company/api/v1/properties/2/images/upload-urls \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"count": 1}'
```

You should get a response with presigned URLs instead of a 500 error.

## CORS Configuration for S3 Bucket

If you get a CORS error when uploading images from the frontend, you need to configure CORS on your S3 bucket.

### Configure CORS on `devtest-property-images` Bucket

1. **Go to AWS Console → S3 → Buckets → `devtest-property-images`**

2. **Click on the "Permissions" tab**

3. **Scroll down to "Cross-origin resource sharing (CORS)"**

4. **Click "Edit"**

5. **Paste this CORS configuration:**

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "HEAD"
    ],
    "AllowedOrigins": [
      "https://d2sssuh2b33ngx.cloudfront.net",
      "https://livi.company",
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2",
      "x-amz-version-id"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

**Note:** S3 automatically handles OPTIONS requests for preflight, so you don't need to include it in `AllowedMethods`. The configuration above should work.

6. **Click "Save changes"**

**Note:** 
- Replace `https://d2sssuh2b33ngx.cloudfront.net` with your actual CloudFront domain if different
- Add `https://livi.company` if you're using a custom domain
- The localhost origins are for local development

After saving, the CORS error should be resolved and image uploads should work.

### Critical: Region Mismatch Issue

**Your bucket is in `eu-west-1` but your task definition has `AWS_REGION` set to `us-west-1`.**

This mismatch causes presigned URLs to be generated with the wrong region, which will cause CORS errors and upload failures.

**Fix: Update ECS Task Definition Region**

1. **Go to ECS → Task Definitions → `livi-dev-backend` → Create new revision**

2. **Find the `AWS_REGION` environment variable and change it:**
   - Current: `us-west-1` ❌
   - Should be: `eu-west-1` ✅

3. **Create the new revision**

4. **Update your service:**
   - Go to ECS → Clusters → `livi-dev-cluster-1` → Services → `livi-dev-backend-service`
   - Click "Update"
   - Select the new task definition revision
   - Click "Update" to deploy

5. **Wait for deployment to complete** (usually 1-2 minutes)

6. **Test again** - The presigned URLs should now use `eu-west-1` and CORS should work

**Note:** After this change, presigned URLs will show `eu-west-1` in the URL instead of `us-west-1`.

### Still Getting CORS Errors with Wildcard Config?

If you're still getting CORS errors even with `"AllowedOrigins": ["*"]`, try these steps:

1. **Verify CORS config was saved:**
   - Go to S3 → Bucket → Permissions → CORS
   - Make sure the config shows `"AllowedOrigins": ["*"]`
   - If it doesn't match, re-save it

2. **Check bucket region:**
   - The presigned URL shows `us-west-1` region
   - Verify your bucket is actually in `us-west-1`
   - Make sure `AWS_REGION` in your ECS task definition is set to `us-west-1` (not `us-east-1`)

3. **Check bucket policy:**
   - Go to S3 → Bucket → Permissions → Bucket policy
   - Make sure there's no policy blocking requests
   - If there's a policy, it should allow the operations

4. **Wait longer:**
   - CORS changes can take up to 5 minutes to fully propagate
   - Try again after waiting

5. **Test with curl to verify CORS headers:**
   ```bash
   curl -X OPTIONS "https://devtest-property-images.s3.us-west-1.amazonaws.com/properties/13/images/test.jpg" \
     -H "Origin: https://d2sssuh2b33ngx.cloudfront.net" \
     -H "Access-Control-Request-Method: PUT" \
     -v
   ```
   - Look for `Access-Control-Allow-Origin` in the response headers
   - If it's missing, the CORS config isn't working

6. **Try a different browser/incognito:**
   - Clear all browser cache
   - Try in incognito/private mode
   - CORS responses can be cached by browsers

### Troubleshooting CORS Issues

If you're still getting CORS errors after configuring CORS:

1. **Verify bucket region matches:**
   - Check your S3 bucket region (the URL shows `us-west-1`)
   - Make sure `AWS_REGION` in your ECS task definition matches the bucket region
   - If they don't match, update the task definition environment variable

2. **Wait for CORS propagation:**
   - CORS changes can take a few seconds to propagate
   - Try again after 10-30 seconds
   - Clear browser cache or try incognito mode

3. **Check the exact error:**
   - Open browser DevTools → Network tab
   - Look for the failed OPTIONS or PUT request
   - Check the response headers - you should see `Access-Control-Allow-Origin`

4. **Verify origin matches exactly:**
   - The origin in the error must exactly match one in `AllowedOrigins`
   - No trailing slashes, exact protocol (https vs http)

5. **If still failing, try a simpler CORS config temporarily:**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```
   - This allows all origins (less secure, but good for testing)
   - If this works, then narrow down to specific origins

