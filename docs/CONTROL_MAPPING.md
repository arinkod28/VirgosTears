# CMMC Control → Azure API Mapping

This document maps each targeted control to the exact Azure API endpoint,
the Graph/ARM query, and what constitutes passing evidence.

---

## AC.L2-3.1.1 — Authorized Access Control

**NIST Requirement:** Limit system access to authorized users, processes, and devices.

**Azure Source:** Conditional Access Policies
**API:** Microsoft Graph v1.0
**Endpoint:** `GET /identity/conditionalAccess/policies`
**Permission:** `Policy.Read.All`

**Pass Criteria:**
- At least 1 active Conditional Access policy exists
- Policy targets "All users" or critical groups
- Policy enforces grant controls (MFA, compliant device, etc.)

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp

---

## AC.L2-3.1.2 — Transaction & Function Control

**NIST Requirement:** Limit system access to the types of transactions and functions that authorized users are permitted to execute.

**Azure Source:** RBAC Role Assignments
**API:** Azure Resource Manager
**Endpoint:** `GET /subscriptions/{subId}/providers/Microsoft.Authorization/roleAssignments?api-version=2022-04-01`
**Permission:** Reader role on subscription

**Pass Criteria:**
- No "Owner" role assigned to guest users
- Custom roles exist (not only built-in)
- Role assignments follow least-privilege (flag if > 5 users have "Contributor" at subscription scope)

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp

---

## AU.L2-3.3.1 — System Audit

**NIST Requirement:** Create and retain system audit logs and records.

**Azure Source:** Azure Monitor Activity Logs
**API:** Azure Resource Manager
**Endpoint:** `GET /subscriptions/{subId}/providers/Microsoft.Insights/eventtypes/management/values?api-version=2015-04-01&$filter=eventTimestamp ge '{startDate}'`
**Permission:** Reader role on subscription

**Pass Criteria:**
- Activity logs are being generated (non-empty response)
- Logs cover the last 90 days minimum
- Critical categories present: Administrative, Security, Policy

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp

---

## IA.L2-3.5.1 — Identification

**NIST Requirement:** Identify system users, processes acting on behalf of users, and devices.

**Azure Source:** Azure AD User Directory
**API:** Microsoft Graph v1.0
**Endpoint:** `GET /users?$select=id,displayName,userPrincipalName,accountEnabled,userType,createdDateTime`
**Permission:** `Directory.Read.All`

**Pass Criteria:**
- All users have unique userPrincipalName
- No orphaned accounts (accountEnabled: false for > 90 days without reason)
- Guest vs Member distinction is tracked

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp

---

## IA.L2-3.5.2 — Authentication

**NIST Requirement:** Authenticate (or verify) the identities of users, processes, or devices as a prerequisite to allowing access.

**Azure Source:** MFA Registration Status
**API:** Microsoft Graph v1.0
**Endpoint:** `GET /reports/authenticationMethods/userRegistrationDetails`
**Permission:** `UserAuthenticationMethod.Read.All`

**Pass Criteria:**
- MFA registration rate ≥ 95% of active users
- No admin accounts without MFA
- Default methods include Authenticator app or FIDO2 (not just SMS)

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp

---

## SC.L2-3.13.1 — Boundary Protection

**NIST Requirement:** Monitor, control, and protect communications at external boundaries and key internal boundaries.

**Azure Source:** Network Security Groups (NSGs)
**API:** Azure Resource Manager
**Endpoint:** `GET /subscriptions/{subId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2023-09-01`
**Permission:** Reader role on subscription

**Pass Criteria:**
- NSGs exist and are associated with subnets or NICs
- No rules allowing inbound 0.0.0.0/0 on ports 22, 3389 (SSH/RDP wide open)
- Default deny rules are in place

**Evidence Hash:** SHA-256 of JSON response body + ISO timestamp
