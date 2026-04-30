/**
 * Evaluates raw Azure API responses against CMMC control pass/fail criteria.
 * Returns { status, findings[] } for each control.
 */

function evaluate(controlId, data) {
  const evaluator = evaluators[controlId];
  if (!evaluator) return { status: 'error', findings: [`No evaluator for ${controlId}`] };

  try {
    return evaluator(data);
  } catch (err) {
    return { status: 'error', findings: [`Evaluation failed: ${err.message}`] };
  }
}

const evaluators = {
  /**
   * AC.L2-3.1.1 — Conditional Access Policies
   * Pass if at least 1 active policy exists with grant controls
   */
  'AC.L2-3.1.1': (data) => {
    const policies = data.value || [];
    const activePolicies = policies.filter((p) => p.state === 'enabled');
    const findings = [];

    if (activePolicies.length === 0) {
      findings.push('No active Conditional Access policies found.');
      return { status: 'fail', findings };
    }

    findings.push(`${activePolicies.length} active Conditional Access policies detected.`);

    const hasGrantControls = activePolicies.some(
      (p) => p.grantControls && p.grantControls.builtInControls?.length > 0
    );
    if (!hasGrantControls) {
      findings.push('Warning: No policies enforce grant controls (MFA, compliant device, etc.).');
      return { status: 'warning', findings };
    }

    findings.push('At least one policy enforces grant controls.');
    return { status: 'pass', findings };
  },

  /**
   * AC.L2-3.1.2 — RBAC Role Assignments
   * Flag if guests have Owner, or too many Contributor assignments at subscription scope
   */
  'AC.L2-3.1.2': (data) => {
    const assignments = data.value || [];
    const findings = [];

    if (assignments.length === 0) {
      findings.push('No RBAC role assignments found.');
      return { status: 'warning', findings };
    }

    findings.push(`${assignments.length} role assignments found.`);

    // Check for Owner role assignments (roleDefinitionId ends with known Owner GUID)
    const ownerGuid = 'b24988ac-6180-42a0-ab88-20f7382dd24c'; // built-in Owner
    const ownerAssignments = assignments.filter((a) =>
      a.properties?.roleDefinitionId?.includes(ownerGuid)
    );

    if (ownerAssignments.length > 3) {
      findings.push(
        `Warning: ${ownerAssignments.length} Owner role assignments detected. Review for least privilege.`
      );
      return { status: 'warning', findings };
    }

    findings.push('Role assignments appear to follow least-privilege principles.');
    return { status: 'pass', findings };
  },

  /**
   * AU.L2-3.3.1 — Activity Logs
   * Pass if logs exist in the last 90 days
   */
  'AU.L2-3.3.1': (data) => {
    const events = data.value || [];
    const findings = [];

    if (events.length === 0) {
      findings.push('No activity log events found in the last 90 days.');
      return { status: 'fail', findings };
    }

    findings.push(`${events.length} activity log events found (capped at query limit).`);

    const categories = [...new Set(events.map((e) => e.category?.value).filter(Boolean))];
    findings.push(`Log categories present: ${categories.join(', ') || 'N/A'}`);

    if (categories.includes('Administrative') || categories.includes('Security')) {
      findings.push('Critical audit categories (Administrative/Security) are present.');
      return { status: 'pass', findings };
    }

    findings.push('Warning: Administrative or Security log categories not found.');
    return { status: 'warning', findings };
  },

  /**
   * IA.L2-3.5.1 — User Identification
   * Pass if all users have unique UPNs and accounts are tracked
   */
  'IA.L2-3.5.1': (data) => {
    const users = data.value || [];
    const findings = [];

    if (users.length === 0) {
      findings.push('No users found in directory.');
      return { status: 'fail', findings };
    }

    const upns = users.map((u) => u.userPrincipalName);
    const uniqueUpns = new Set(upns);
    findings.push(`${users.length} users found. ${uniqueUpns.size} unique UPNs.`);

    if (uniqueUpns.size < upns.length) {
      findings.push('Warning: Duplicate userPrincipalNames detected.');
      return { status: 'warning', findings };
    }

    const disabledUsers = users.filter((u) => !u.accountEnabled);
    if (disabledUsers.length > 0) {
      findings.push(`${disabledUsers.length} disabled accounts present — review for cleanup.`);
    }

    const guests = users.filter((u) => u.userType === 'Guest');
    findings.push(`${guests.length} guest accounts tracked.`);

    return { status: 'pass', findings };
  },

  /**
   * IA.L2-3.5.2 — MFA Authentication
   * Pass if MFA registration >= 95% of active users
   */
  'IA.L2-3.5.2': (data) => {
    const registrations = data.value || [];
    const findings = [];

    if (registrations.length === 0) {
      findings.push('No MFA registration data available.');
      return { status: 'error', findings };
    }

    const mfaRegistered = registrations.filter((r) => r.isMfaRegistered === true);
    const rate = ((mfaRegistered.length / registrations.length) * 100).toFixed(1);

    findings.push(
      `MFA registration rate: ${rate}% (${mfaRegistered.length}/${registrations.length} users).`
    );

    if (parseFloat(rate) >= 95) {
      findings.push('MFA registration meets the 95% threshold.');
      return { status: 'pass', findings };
    }

    if (parseFloat(rate) >= 80) {
      findings.push('MFA registration is below 95% — needs improvement.');
      return { status: 'warning', findings };
    }

    findings.push('MFA registration is critically low.');
    return { status: 'fail', findings };
  },

  /**
   * SC.L2-3.13.1 — Network Security Groups
   * Fail if any NSG allows 0.0.0.0/0 inbound on SSH (22) or RDP (3389)
   */
  'SC.L2-3.13.1': (data) => {
    const nsgs = data.value || [];
    const findings = [];

    if (nsgs.length === 0) {
      findings.push('No Network Security Groups found.');
      return { status: 'fail', findings };
    }

    findings.push(`${nsgs.length} NSGs found.`);

    let hasOpenPorts = false;
    for (const nsg of nsgs) {
      const rules = nsg.properties?.securityRules || [];
      for (const rule of rules) {
        const props = rule.properties || {};
        if (
          props.direction === 'Inbound' &&
          props.access === 'Allow' &&
          (props.sourceAddressPrefix === '*' || props.sourceAddressPrefix === '0.0.0.0/0')
        ) {
          const destPort = props.destinationPortRange;
          if (destPort === '22' || destPort === '3389' || destPort === '*') {
            findings.push(
              `CRITICAL: NSG "${nsg.name}" allows inbound ${destPort === '*' ? 'ALL PORTS' : `port ${destPort}`} from any source.`
            );
            hasOpenPorts = true;
          }
        }
      }
    }

    if (hasOpenPorts) {
      return { status: 'fail', findings };
    }

    findings.push('No overly permissive inbound rules detected on critical ports.');
    return { status: 'pass', findings };
  },
};

module.exports = { evaluate };
