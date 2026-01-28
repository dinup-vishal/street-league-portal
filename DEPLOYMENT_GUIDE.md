# Street League Portal - Deployment Guide

## Azure Deployment Architecture

```
┌─────────────────────────────────────┐
│   Azure Static Web Apps             │
│   (Frontend - React App)            │
│   - Automatic CI/CD from GitHub     │
│   - Global CDN distribution         │
│   - Custom domain support           │
└──────────────┬──────────────────────┘
               │
               │ API Calls (HTTPS)
               │
┌──────────────▼──────────────────────┐
│   Azure Function App                 │
│   (Backend API)                      │
│   - RESTful endpoints                │
│   - Authentication & Authorization  │
│   - Database connectivity            │
└─────────────────────────────────────┘
```

## Prerequisites

- Azure subscription
- GitHub account with repository
- Node.js 18+ and npm
- Azure CLI (optional but recommended)

## Step 1: Prepare for Deployment

### 1.1 Update Environment Configuration

Edit `.env.production`:
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://<your-function-app>.azurewebsites.net/api
VITE_AZURE_API_URL=https://<your-function-app>.azurewebsites.net/api
```

### 1.2 Ensure Build Optimizations

The application is pre-configured for production optimization:
- TypeScript strict mode
- Tree shaking
- Code minification
- CSS optimization

### 1.3 Build the Application

```bash
npm run build
```

This creates optimized files in the `dist/` directory.

## Step 2: Set Up Azure Resources

### 2.1 Create Resource Group

```bash
az group create \
  --name street-league-rg \
  --location eastus
```

### 2.2 Create Static Web App

**Option A: Using Azure Portal**
1. Go to Azure Portal
2. Create new "Static Web App" resource
3. Connect your GitHub repository
4. Select `main` branch
5. Set build configuration:
   - Build preset: Vite
   - App location: `/`
   - Output location: `dist`

**Option B: Using Azure CLI**

```bash
az staticwebapp create \
  --name street-league-portal \
  --resource-group street-league-rg \
  --source https://github.com/<your-username>/<your-repo>.git \
  --branch main \
  --location eastus \
  --app-location "/" \
  --output-location "dist" \
  --api-location "api"
```

### 2.3 Create Function App (for Backend)

```bash
# Create storage account
az storage account create \
  --name slportalstg \
  --resource-group street-league-rg \
  --location eastus \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --resource-group street-league-rg \
  --consumption-plan-location eastus \
  --runtime python \
  --runtime-version 3.11 \
  --functions-version 4 \
  --name street-league-api \
  --storage-account slportalstg
```

## Step 3: Configure CI/CD Pipeline

### 3.1 GitHub Actions Workflow

Azure Static Web Apps automatically creates a GitHub Actions workflow. The workflow file is typically at:
`.github/workflows/azure-static-web-apps-<name>.yml`

Default configuration handles:
- Building with Node.js
- Running the build command
- Deploying to Azure

### 3.2 Custom Workflow (if needed)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Azure Static Web Apps
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        action: 'upload'
        app_location: '/'
        app_artifact_location: 'dist'
        skip_app_build: true
```

## Step 4: Environment Management

### 4.1 Add Application Settings in Azure

In Azure Static Web Apps configuration, add environment variables:

Go to Azure Portal → Static Web Apps → Configuration → Application Settings

Add:
```
VITE_USE_MOCK_DATA = false
VITE_API_BASE_URL = https://street-league-api.azurewebsites.net/api
VITE_AZURE_API_URL = https://street-league-api.azurewebsites.net/api
```

### 4.2 Staging Environment

For staging/testing:
1. Create a staging branch (e.g., `develop`)
2. Add another Static Web App for staging
3. Configure separate environment variables
4. Test before merging to main

## Step 5: Security Configuration

### 5.1 Enable HTTPS

Azure Static Web Apps automatically provides HTTPS with managed certificates.

### 5.2 Configure CORS

If backend API is on a different domain, configure CORS headers in your Azure Function App:

```python
import azure.functions as func

def main(req: func.HttpRequest) -> func.HttpResponse:
    headers = {
        "Access-Control-Allow-Origin": "https://your-domain.com",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
    return func.HttpResponse("OK", headers=headers)
```

### 5.3 API Authentication

Add authentication headers to API calls:
- Update `src/services/apiClient.ts` to include auth tokens
- Configure Azure AD or API key authentication
- Store sensitive data in Azure Key Vault

## Step 6: Monitoring and Logging

### 6.1 Application Insights

1. Enable Application Insights in Azure Portal
2. Add instrumentation key to your app
3. Monitor performance and errors

### 6.2 Logs

Monitor deployment logs in:
- Azure Portal → Static Web App → Deployment logs
- GitHub Actions workflow runs
- Azure Function App logs

## Step 7: Custom Domain Setup

### 7.1 Configure Custom Domain

1. Go to Azure Portal → Static Web App
2. Navigate to "Custom domains"
3. Add your domain name
4. Update DNS records with CNAME or TXT records
5. Validate and complete setup

## Deployment Checklist

- [ ] Environment variables configured in `.env.production`
- [ ] Application builds successfully (`npm run build`)
- [ ] `dist/` folder contains all assets
- [ ] GitHub repository connected to Azure
- [ ] CI/CD pipeline configured
- [ ] Backend API deployed and running
- [ ] API endpoints configured in environment variables
- [ ] CORS properly configured
- [ ] Application Insights enabled
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificates valid
- [ ] Database connections tested
- [ ] Error handling and logging verified

## Rollback Procedures

### Rollback to Previous Deployment

1. Go to Azure Portal → Static Web App → Deployments
2. Select the previous deployment
3. Click "Redeploy"

Or use Azure CLI:
```bash
az staticwebapp env show \
  --name street-league-portal \
  --resource-group street-league-rg
```

## Scaling and Performance

### Static Web Apps Scaling
- Automatic global distribution via CDN
- No server management required
- Scales automatically with traffic

### Function App Scaling
For backend API:
1. Start with consumption plan (pay-per-use)
2. Monitor usage patterns
3. Scale up to dedicated plan if needed

## Troubleshooting

### Build Failures
1. Check GitHub Actions logs
2. Verify `dist/` output location
3. Ensure all dependencies installed
4. Check for environment variable issues

### API Connection Issues
1. Verify API URL in environment variables
2. Check CORS configuration
3. Test API endpoint directly
4. Review Function App logs

### Performance Issues
1. Check Application Insights metrics
2. Optimize bundle size
3. Review CDN cache settings
4. Check database query performance

## Cost Optimization

1. Use Static Web Apps free tier for development
2. Use consumption plan for Function Apps
3. Monitor and set spending limits
4. Use reserved instances for predictable workloads

## Additional Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/azure/static-web-apps)
- [Azure Functions Documentation](https://docs.microsoft.com/azure/azure-functions)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Azure CLI Documentation](https://docs.microsoft.com/cli/azure)

---

For questions or issues, refer to the DEVELOPER_GUIDE.md or contact your Azure support team.
