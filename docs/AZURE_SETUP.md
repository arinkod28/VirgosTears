# Azure AD App Registration Setup

## Step 1: Register the Application

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory → App registrations
2. Click **New registration**
3. Configure:
   - **Name:** `CMMC Compliance Dashboard`
   - **Supported account types:** Single tenant (your org only)
   - **Redirect URI:** `http://localhost:3000/api/auth/callback` (Web)
4. Click **Register**
5. Copy the **Application (client) ID** and **Directory (tenant) ID**

## Step 2: Create Client Secret

1. In your app registration → **Certificates & secrets**
2. Click **New client secret**
3. Set expiry (6 months recommended for dev)
4. **Copy the secret value immediately** (you can't see it again)

## Step 3: Configure API Permissions

Add the following **Application permissions** under Microsoft Graph:

| Permission               | Type        | Used For                    |
|--------------------------|-------------|-----------------------------|
| `Directory.Read.All`     | Application | User enumeration (IA.L2-3.5.1) |
| `Policy.Read.All`        | Application | Conditional Access (AC.L2-3.1.1) |
| `AuditLog.Read.All`      | Application | Activity logs (AU.L2-3.3.1) |
| `UserAuthenticationMethod.Read.All` | Application | MFA status (IA.L2-3.5.2) |
| `Reports.Read.All`       | Application | Sign-in reports             |

Add the following under **Azure Service Management**:

| Permission                        | Used For                         |
|-----------------------------------|----------------------------------|
| `user_impersonation`              | ARM API calls for NSGs and RBAC  |

Then click **Grant admin consent** for your tenant.

## Step 4: Note Your Azure Subscription ID

1. Go to **Subscriptions** in Azure Portal
2. Copy the **Subscription ID** for the subscription containing your resources

## Step 5: Environment Variables

```env
AZURE_CLIENT_ID=<your-app-client-id>
AZURE_CLIENT_SECRET=<your-client-secret>
AZURE_TENANT_ID=<your-tenant-id>
AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Scoped Permissions Summary

This app uses **read-only** permissions. It cannot modify any Azure resources.
The minimal permission set is intentional — we only pull what's needed for 6 CMMC controls.
