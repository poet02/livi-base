# Custom Domain Setup for CloudFront

This guide shows how to set up a custom domain (e.g., `dev-app.livi.company`) for your CloudFront distribution.

## Prerequisites

- Domain `livi.company` managed in Squarespace DNS
- CloudFront distribution already created
- AWS Certificate Manager (ACM) access

## Step 1: Request SSL Certificate in ACM (5-10 minutes)

**⚠️ IMPORTANT: CloudFront requires certificates to be in `us-east-1` region!**

1. **Go to AWS Console → Certificate Manager**

2. **Check the region selector (top right):**
   - **MUST be set to `us-east-1` (N. Virginia)**
   - If it's not, click the region dropdown and select `us-east-1`

3. **Click "Request certificate"**

4. **Certificate type:**
   - Select: **Request a public certificate**

5. **Domain names:**
   - Enter: `dev-app.livi.company`
   - Click "Add another name" if you want to add `*.livi.company` (wildcard) for future subdomains
   - **Note:** For wildcard, enter `*.livi.company` (this covers all subdomains)

6. **Validation method:**
   - Select: **DNS validation** (recommended)

7. **Click "Request"**

8. **Wait for certificate to show "Pending validation"**

**Why us-east-1?** CloudFront is a global service, but it only accepts SSL certificates from the `us-east-1` region. This is an AWS requirement.

## Step 2: Validate Certificate via DNS (5-15 minutes)

1. **In ACM, click on the certificate**

2. **Expand the domain name (`dev-app.livi.company`)**

3. **You'll see a CNAME record like:**
   ```
   Name: _abc123def456.dev-app.livi.company
   Value: _xyz789.abc-validations.aws.
   ```

4. **Go to Squarespace → Settings → Domains → livi.company → DNS Settings**

5. **Add a CNAME record:**
   - **Type:** CNAME
   - **Host:** `_abc123def456.dev-app` (the part before `.livi.company`)
   - **Points to:** `_xyz789.abc-validations.aws.` (the full validation value)
   - **TTL:** 30 minutes (or lowest available)
   - **Save**

6. **Wait for validation** (usually 5-15 minutes)
   - Check ACM → Certificates → Status should change to **"Issued"**
   - You can click "Refresh" in ACM to check status

**Note:** If you used a wildcard (`*.livi.company`), you'll need to add a CNAME for the wildcard validation as well.

## Step 3: Add Custom Domain to CloudFront (2 minutes)

1. **Go to AWS Console → CloudFront → Distributions → Select your distribution**

2. **Click "Edit" (top right)**

3. **Scroll to "Alternate domain names (CNAMEs)"**

4. **Click "Add item"**

5. **Enter:** `dev-app.livi.company`

6. **Scroll to "Custom SSL certificate"**

7. **Select:** Your certificate from ACM (should show `dev-app.livi.company` or `*.livi.company`)

8. **Click "Save changes"** (takes ~10-15 minutes to deploy)

9. **Wait for status to change to "Deployed"**

## Step 4: Create DNS CNAME Record in Squarespace (2 minutes)

1. **Go to Squarespace → Settings → Domains → livi.company → DNS Settings**

2. **Add a CNAME record:**
   - **Type:** CNAME
   - **Host:** `dev-app` (or `dev-app.livi.company` depending on Squarespace UI)
   - **Points to:** Your CloudFront distribution domain (e.g., `d2sssuh2b33ngx.cloudfront.net`)
   - **TTL:** 30 minutes (or lowest available)
   - **Save**

3. **Wait for DNS propagation** (usually 5-30 minutes, can take up to 48 hours)

## Step 5: Update Backend CORS Configuration (2 minutes)

1. **Go to ECS → Task Definitions → `livi-dev-backend` → Create new revision**

2. **Find the `FRONTEND_URLS` environment variable**

3. **Update it to include the new domain:**
   ```
   https://dev-app.livi.company,https://d2sssuh2b33ngx.cloudfront.net,https://livi.company
   ```

4. **Create the new revision**

5. **Update your service:**
   - Go to ECS → Services → `livi-dev-backend-service` → Update
   - Select the new task definition revision
   - Click "Update" to deploy

## Step 6: Update S3 Bucket CORS Configuration (2 minutes)

1. **Go to S3 → Buckets → `devtest-property-images` → Permissions → CORS**

2. **Click "Edit"**

3. **Update `AllowedOrigins` to include the new domain:**
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
       "AllowedOrigins": [
         "https://dev-app.livi.company",
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

4. **Click "Save changes"**

## Step 7: Test the Custom Domain (2 minutes)

1. **Wait for DNS propagation** (check with: `nslookup dev-app.livi.company` or `dig dev-app.livi.company`)

2. **Test in browser:**
   - Open: `https://dev-app.livi.company`
   - Should load your React app

3. **Test API calls:**
   - Try logging in
   - Check browser console for CORS errors
   - If you see CORS errors, verify `FRONTEND_URLS` was updated correctly

## Troubleshooting

### Certificate Status Stuck on "Pending validation"
- Verify the CNAME record in Squarespace matches exactly (including the trailing dot)
- Wait a few more minutes and refresh ACM
- Check DNS propagation: `dig _abc123def456.dev-app.livi.company CNAME`

### CloudFront Shows "Deploying" for a Long Time
- This is normal, can take 10-15 minutes
- Check CloudWatch for any errors
- Verify the certificate is "Issued" in ACM

### DNS Not Resolving
- Verify CNAME record in Squarespace points to CloudFront domain
- Check DNS propagation: `nslookup dev-app.livi.company`
- Wait up to 48 hours for full propagation (usually much faster)

### CORS Errors After Setup
- Verify `FRONTEND_URLS` in ECS task definition includes `https://dev-app.livi.company`
- Verify S3 bucket CORS includes `https://dev-app.livi.company`
- Redeploy backend service after updating environment variables

## Optional: Update GitHub Actions Secrets

If you want to use the custom domain in your CI/CD:

1. **Go to GitHub → Settings → Environments → devtest → Environment secrets**

2. **Update `VITE_API_BASE_URL`** (if you want to reference it in builds):
   - This is optional - the frontend build uses this for API calls
   - You can keep it as `https://dev-api.livi.company/api` (backend domain)

3. **No other changes needed** - the workflows will continue to work with the custom domain

