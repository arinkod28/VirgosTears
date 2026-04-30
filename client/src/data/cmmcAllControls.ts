export interface CMMCControl {
  id: string;
  title: string;
  description: string;
  monitored: boolean;
}

export interface CMMCDomain {
  code: string;
  name: string;
  color: string;
  controls: CMMCControl[];
}

export const MONITORED_IDS = new Set([
  'AC.L2-3.1.1',
  'AC.L2-3.1.2',
  'AU.L2-3.3.1',
  'IA.L2-3.5.1',
  'IA.L2-3.5.2',
  'SC.L2-3.13.1',
]);

export const CMMC_DOMAINS: CMMCDomain[] = [
  {
    code: 'AC',
    name: 'Access Control',
    color: 'blue',
    controls: [
      { id: 'AC.L2-3.1.1', title: 'Authorized Access Control', description: 'Limit system access to authorized users, processes acting on behalf of authorized users, and devices (including other systems).', monitored: true },
      { id: 'AC.L2-3.1.2', title: 'Transaction & Function Control', description: 'Limit system access to the types of transactions and functions that authorized users are permitted to execute.', monitored: true },
      { id: 'AC.L2-3.1.3', title: 'Control CUI Flow', description: 'Control the flow of CUI in accordance with approved authorizations.', monitored: false },
      { id: 'AC.L2-3.1.4', title: 'Separation of Duties', description: 'Separate the duties of individuals to reduce the risk of malevolent activity without collusion.', monitored: false },
      { id: 'AC.L2-3.1.5', title: 'Least Privilege', description: 'Employ the principle of least privilege, including for specific security functions and privileged accounts.', monitored: false },
      { id: 'AC.L2-3.1.6', title: 'Non-Privileged Account Use', description: 'Use non-privileged accounts or roles when accessing non-security functions.', monitored: false },
      { id: 'AC.L2-3.1.7', title: 'Privileged Function Execution', description: 'Prevent non-privileged users from executing privileged functions and capture the execution of such functions in audit logs.', monitored: false },
      { id: 'AC.L2-3.1.8', title: 'Unsuccessful Logon Attempts', description: 'Limit unsuccessful logon attempts.', monitored: false },
      { id: 'AC.L2-3.1.9', title: 'Privacy & Security Notices', description: 'Provide privacy and security notices consistent with CUI rules (as established under 32 CFR Part 2002).', monitored: false },
      { id: 'AC.L2-3.1.10', title: 'Session Lock', description: 'Use session lock with pattern-hiding displays after a period of inactivity.', monitored: false },
      { id: 'AC.L2-3.1.11', title: 'Session Termination', description: 'Terminate (automatically) a user session after a defined condition.', monitored: false },
      { id: 'AC.L2-3.1.12', title: 'Remote Access Monitoring', description: 'Monitor and control remote access sessions.', monitored: false },
      { id: 'AC.L2-3.1.13', title: 'Remote Access Confidentiality', description: 'Employ cryptographic mechanisms to protect the confidentiality of remote access sessions.', monitored: false },
      { id: 'AC.L2-3.1.14', title: 'Remote Access Routing', description: 'Route remote access via managed access control points.', monitored: false },
      { id: 'AC.L2-3.1.15', title: 'Privileged Remote Commands', description: 'Authorize remote execution of privileged commands via remote access only for documented operational needs.', monitored: false },
      { id: 'AC.L2-3.1.16', title: 'Wireless Access Authorization', description: 'Authorize wireless access prior to allowing such connections.', monitored: false },
      { id: 'AC.L2-3.1.17', title: 'Wireless Access Protection', description: 'Protect wireless access using authentication and encryption.', monitored: false },
      { id: 'AC.L2-3.1.18', title: 'Mobile Device Control', description: 'Control connection of mobile devices.', monitored: false },
      { id: 'AC.L2-3.1.19', title: 'Encrypt CUI on Mobile', description: 'Encrypt CUI on mobile devices and mobile computing platforms.', monitored: false },
      { id: 'AC.L2-3.1.20', title: 'External System Connections', description: 'Verify and control/limit connections to external systems.', monitored: false },
      { id: 'AC.L2-3.1.21', title: 'Portable Storage Restrictions', description: 'Limit use of portable storage devices on external systems.', monitored: false },
      { id: 'AC.L2-3.1.22', title: 'Publicly Accessible CUI Control', description: 'Control CUI posted or processed on publicly accessible systems.', monitored: false },
    ],
  },
  {
    code: 'AT',
    name: 'Awareness & Training',
    color: 'purple',
    controls: [
      { id: 'AT.L2-3.2.1', title: 'Role-Based Risk Awareness', description: 'Ensure that organizational personnel are aware of the security risks associated with their activities and systems.', monitored: false },
      { id: 'AT.L2-3.2.2', title: 'Role-Based Training', description: 'Ensure that personnel are trained to carry out their assigned information security responsibilities.', monitored: false },
      { id: 'AT.L2-3.2.3', title: 'Insider Threat Awareness', description: 'Provide security awareness training on recognizing and reporting potential threats, including social engineering attacks.', monitored: false },
    ],
  },
  {
    code: 'AU',
    name: 'Audit & Accountability',
    color: 'green',
    controls: [
      { id: 'AU.L2-3.3.1', title: 'System Audit', description: 'Create and retain system audit logs and records to the extent needed to enable monitoring, analysis, investigation, and reporting of unlawful or unauthorized system activity.', monitored: true },
      { id: 'AU.L2-3.3.2', title: 'User Accountability', description: 'Ensure that the actions of individual system users can be uniquely traced to those users so they can be held accountable for their actions.', monitored: false },
      { id: 'AU.L2-3.3.3', title: 'Event Review', description: 'Review and update logged events.', monitored: false },
      { id: 'AU.L2-3.3.4', title: 'Alert on Audit Failure', description: 'Alert in the event of an audit logging process failure.', monitored: false },
      { id: 'AU.L2-3.3.5', title: 'Audit Correlation', description: 'Correlate audit record review, analysis, and reporting processes for investigation and response to indications of inappropriate activity.', monitored: false },
      { id: 'AU.L2-3.3.6', title: 'Audit Reduction', description: 'Provide audit record reduction and report generation to support on-demand analysis and reporting.', monitored: false },
      { id: 'AU.L2-3.3.7', title: 'Authoritative Time Source', description: 'Provide a system capability that compares and synchronizes internal system clocks with an authoritative source.', monitored: false },
      { id: 'AU.L2-3.3.8', title: 'Protect Audit Information', description: 'Protect audit information and audit tools from unauthorized access, modification, and deletion.', monitored: false },
      { id: 'AU.L2-3.3.9', title: 'Limit Audit Management', description: 'Limit management of audit logging to a subset of privileged users.', monitored: false },
    ],
  },
  {
    code: 'CM',
    name: 'Configuration Management',
    color: 'orange',
    controls: [
      { id: 'CM.L2-3.4.1', title: 'System Baselining', description: 'Establish and maintain baseline configurations and inventories of organizational systems (including hardware, software, firmware, and documentation).', monitored: false },
      { id: 'CM.L2-3.4.2', title: 'Security Configuration Enforcement', description: 'Establish and enforce security configuration settings for information technology products employed in organizational systems.', monitored: false },
      { id: 'CM.L2-3.4.3', title: 'Change Control', description: 'Track, review, approve, and log changes to organizational systems.', monitored: false },
      { id: 'CM.L2-3.4.4', title: 'Security Impact Analysis', description: 'Analyze the security impact of changes prior to implementation.', monitored: false },
      { id: 'CM.L2-3.4.5', title: 'Access Restrictions for Change', description: 'Define, document, approve, and enforce physical and logical access restrictions associated with changes to organizational systems.', monitored: false },
      { id: 'CM.L2-3.4.6', title: 'Least Functionality', description: 'Employ the principle of least functionality by configuring the system to provide only essential capabilities.', monitored: false },
      { id: 'CM.L2-3.4.7', title: 'Nonessential Functionality', description: 'Restrict, disable, or prevent the use of nonessential programs, functions, ports, protocols, and services.', monitored: false },
      { id: 'CM.L2-3.4.8', title: 'Application Execution Policy', description: 'Apply deny-by-exception policy to prevent the use of unauthorized software or permit-by-exception policy to allow the execution of authorized software.', monitored: false },
      { id: 'CM.L2-3.4.9', title: 'User-Installed Software', description: 'Control and monitor user-installed software.', monitored: false },
    ],
  },
  {
    code: 'IA',
    name: 'Identification & Authentication',
    color: 'cyan',
    controls: [
      { id: 'IA.L2-3.5.1', title: 'Identification', description: 'Identify system users, processes acting on behalf of users, and devices.', monitored: true },
      { id: 'IA.L2-3.5.2', title: 'Authentication', description: 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational systems.', monitored: true },
      { id: 'IA.L2-3.5.3', title: 'Multifactor Authentication (Privileged)', description: 'Use multifactor authentication for local and network access to privileged accounts and for network access to non-privileged accounts.', monitored: false },
      { id: 'IA.L2-3.5.4', title: 'Replay-Resistant Authentication', description: 'Employ replay-resistant authentication mechanisms for network access to privileged and non-privileged accounts.', monitored: false },
      { id: 'IA.L2-3.5.5', title: 'Identifier Reuse', description: 'Employ multifactor authentication for network access to non-privileged accounts.', monitored: false },
      { id: 'IA.L2-3.5.6', title: 'Identifier Handling', description: 'Disable identifiers after a defined inactivity period.', monitored: false },
      { id: 'IA.L2-3.5.7', title: 'Password Complexity', description: 'Enforce a minimum password complexity and change of characters when new passwords are created.', monitored: false },
      { id: 'IA.L2-3.5.8', title: 'Password Reuse', description: 'Prohibit password reuse for a specified number of generations.', monitored: false },
      { id: 'IA.L2-3.5.9', title: 'Temporary Passwords', description: 'Allow temporary password use for system logons with an immediate change to a permanent password.', monitored: false },
      { id: 'IA.L2-3.5.10', title: 'Cryptographically-Protected Passwords', description: 'Store and transmit only cryptographically-protected passwords.', monitored: false },
      { id: 'IA.L2-3.5.11', title: 'Obscure Authentication Feedback', description: 'Obscure feedback of authentication information during the authentication process.', monitored: false },
    ],
  },
  {
    code: 'IR',
    name: 'Incident Response',
    color: 'red',
    controls: [
      { id: 'IR.L2-3.6.1', title: 'Incident Handling', description: 'Establish an operational incident-handling capability for organizational systems including preparation, detection, analysis, containment, recovery, and user response activities.', monitored: false },
      { id: 'IR.L2-3.6.2', title: 'Incident Reporting', description: 'Track, document, and report incidents to appropriate officials and/or authorities both internal and external to the organization.', monitored: false },
      { id: 'IR.L2-3.6.3', title: 'Incident Response Testing', description: 'Test the organizational incident response capability.', monitored: false },
    ],
  },
  {
    code: 'MA',
    name: 'Maintenance',
    color: 'yellow',
    controls: [
      { id: 'MA.L2-3.7.1', title: 'Controlled Maintenance', description: 'Perform maintenance on organizational systems.', monitored: false },
      { id: 'MA.L2-3.7.2', title: 'Maintenance Tools', description: 'Provide controls on the tools, techniques, mechanisms, and personnel used to conduct system maintenance.', monitored: false },
      { id: 'MA.L2-3.7.3', title: 'Equipment Sanitization', description: 'Ensure equipment removed for off-site maintenance is sanitized of any CUI.', monitored: false },
      { id: 'MA.L2-3.7.4', title: 'Media Inspection', description: 'Check media containing diagnostic and test programs for malicious code before the media are used in systems.', monitored: false },
      { id: 'MA.L2-3.7.5', title: 'Multifactor Authentication for Maintenance', description: 'Require MFA to establish nonlocal maintenance sessions via external networks and terminate such sessions when nonlocal maintenance is complete.', monitored: false },
      { id: 'MA.L2-3.7.6', title: 'Maintenance Personnel', description: 'Supervise the maintenance activities of personnel without required access authorization.', monitored: false },
    ],
  },
  {
    code: 'MP',
    name: 'Media Protection',
    color: 'indigo',
    controls: [
      { id: 'MP.L2-3.8.1', title: 'Media Protection', description: 'Protect (i.e., physically control and securely store) system media containing CUI, both paper and digital.', monitored: false },
      { id: 'MP.L2-3.8.2', title: 'Media Access', description: 'Limit access to CUI on system media to authorized users.', monitored: false },
      { id: 'MP.L2-3.8.3', title: 'Media Sanitization', description: 'Sanitize or destroy system media before disposal or reuse.', monitored: false },
      { id: 'MP.L2-3.8.4', title: 'Media Markings', description: 'Mark media with necessary CUI markings and distribution limitations.', monitored: false },
      { id: 'MP.L2-3.8.5', title: 'Media Accountability', description: 'Control access to media containing CUI and maintain accountability for media during transport.', monitored: false },
      { id: 'MP.L2-3.8.6', title: 'Portable Storage Encryption', description: 'Implement cryptographic mechanisms to protect the confidentiality of CUI during transport unless otherwise protected by alternative physical safeguards.', monitored: false },
      { id: 'MP.L2-3.8.7', title: 'Removable Media', description: 'Control the use of removable media on system components.', monitored: false },
      { id: 'MP.L2-3.8.8', title: 'Shared Media', description: 'Prohibit the use of portable storage devices when such devices have no identifiable owner.', monitored: false },
      { id: 'MP.L2-3.8.9', title: 'Protect Backups', description: 'Protect the confidentiality of backup CUI at storage locations.', monitored: false },
    ],
  },
  {
    code: 'PS',
    name: 'Personnel Security',
    color: 'pink',
    controls: [
      { id: 'PS.L2-3.9.1', title: 'Screen Individuals', description: 'Screen individuals prior to authorizing access to organizational systems containing CUI.', monitored: false },
      { id: 'PS.L2-3.9.2', title: 'Personnel Actions', description: 'Ensure that CUI is protected during and after personnel actions such as terminations and transfers.', monitored: false },
    ],
  },
  {
    code: 'PE',
    name: 'Physical Protection',
    color: 'teal',
    controls: [
      { id: 'PE.L2-3.10.1', title: 'Limit Physical Access', description: 'Limit physical access to organizational systems to authorized individuals.', monitored: false },
      { id: 'PE.L2-3.10.2', title: 'Monitor Facility', description: 'Protect and monitor the physical facility and support infrastructure.', monitored: false },
      { id: 'PE.L2-3.10.3', title: 'Visitor Control', description: 'Escort visitors and monitor visitor activity.', monitored: false },
      { id: 'PE.L2-3.10.4', title: 'Audit Physical Access Logs', description: 'Maintain audit logs of physical access.', monitored: false },
      { id: 'PE.L2-3.10.5', title: 'Physical Access Devices', description: 'Control and manage physical access devices.', monitored: false },
      { id: 'PE.L2-3.10.6', title: 'Alternate Work Sites', description: 'Enforce safeguarding measures for CUI at alternate work sites.', monitored: false },
    ],
  },
  {
    code: 'RA',
    name: 'Risk Assessment',
    color: 'amber',
    controls: [
      { id: 'RA.L2-3.11.1', title: 'Risk Assessments', description: 'Periodically assess the risk to organizational operations (including mission, functions, image, or reputation), assets, and individuals.', monitored: false },
      { id: 'RA.L2-3.11.2', title: 'Vulnerability Scan', description: 'Scan for vulnerabilities in organizational systems and applications periodically and when new vulnerabilities affecting those systems are identified.', monitored: false },
      { id: 'RA.L2-3.11.3', title: 'Vulnerability Remediation', description: 'Remediate vulnerabilities in accordance with risk assessments.', monitored: false },
    ],
  },
  {
    code: 'CA',
    name: 'Security Assessment',
    color: 'lime',
    controls: [
      { id: 'CA.L2-3.12.1', title: 'Security Control Assessment', description: 'Periodically assess the security controls in organizational systems to determine if the controls are effective in their application.', monitored: false },
      { id: 'CA.L2-3.12.2', title: 'Plan of Action', description: 'Develop and implement plans of action designed to correct deficiencies and reduce or eliminate vulnerabilities in organizational systems.', monitored: false },
      { id: 'CA.L2-3.12.3', title: 'Continuous Monitoring', description: 'Monitor security controls on an ongoing basis to ensure the continued effectiveness of the controls.', monitored: false },
      { id: 'CA.L2-3.12.4', title: 'System Security Plan', description: 'Develop, document, and periodically update system security plans that describe system boundaries, environments of operation, and security requirements.', monitored: false },
    ],
  },
  {
    code: 'SC',
    name: 'System & Communications Protection',
    color: 'violet',
    controls: [
      { id: 'SC.L2-3.13.1', title: 'Boundary Protection', description: 'Monitor, control, and protect communications (i.e., information transmitted or received by organizational systems) at the external boundaries and key internal boundaries of organizational systems.', monitored: true },
      { id: 'SC.L2-3.13.2', title: 'Security Engineering Principles', description: 'Employ architectural designs, software development techniques, and systems engineering principles that promote security within organizational systems.', monitored: false },
      { id: 'SC.L2-3.13.3', title: 'Role Separation', description: 'Separate user functionality from system management functionality.', monitored: false },
      { id: 'SC.L2-3.13.4', title: 'Shared Resource Control', description: 'Prevent unauthorized and unintended information transfer via shared resources.', monitored: false },
      { id: 'SC.L2-3.13.5', title: 'Public-Access System Separation', description: 'Implement subnetworks for publicly accessible system components that are physically or logically separated from internal networks.', monitored: false },
      { id: 'SC.L2-3.13.6', title: 'Network Communication Deny by Default', description: 'Deny network communications traffic by default and allow network communications traffic by exception (i.e., deny all, permit by exception).', monitored: false },
      { id: 'SC.L2-3.13.7', title: 'Split Tunneling', description: 'Prevent remote devices from simultaneously connecting to the system and other resources (i.e., split tunneling) unless the connection is secured.', monitored: false },
      { id: 'SC.L2-3.13.8', title: 'Data in Transit', description: 'Implement cryptographic mechanisms to prevent unauthorized disclosure of CUI during transmission unless otherwise protected by alternative physical safeguards.', monitored: false },
      { id: 'SC.L2-3.13.9', title: 'Network Disconnect', description: 'Terminate network connections after a defined period of inactivity.', monitored: false },
      { id: 'SC.L2-3.13.10', title: 'Key Management', description: 'Establish and manage cryptographic keys for required cryptography employed in organizational systems.', monitored: false },
      { id: 'SC.L2-3.13.11', title: 'FIPS-Validated Cryptography', description: 'Employ FIPS-validated cryptography when used to protect the confidentiality of CUI.', monitored: false },
      { id: 'SC.L2-3.13.12', title: 'Collaborative Device Control', description: 'Prohibit remote activation of collaborative computing devices and provide indication of use to present users.', monitored: false },
      { id: 'SC.L2-3.13.13', title: 'Mobile Code', description: 'Control and monitor the use of mobile code.', monitored: false },
      { id: 'SC.L2-3.13.14', title: 'VoIP', description: 'Control and monitor the use of Voice over Internet Protocol (VoIP) technologies.', monitored: false },
      { id: 'SC.L2-3.13.15', title: 'Communications Authenticity', description: 'Protect the authenticity of communications sessions.', monitored: false },
      { id: 'SC.L2-3.13.16', title: 'Data at Rest', description: 'Protect the confidentiality of CUI at rest.', monitored: false },
    ],
  },
  {
    code: 'SI',
    name: 'System & Information Integrity',
    color: 'emerald',
    controls: [
      { id: 'SI.L2-3.14.1', title: 'Flaw Remediation', description: 'Identify, report, and correct information and system flaws in a timely manner.', monitored: false },
      { id: 'SI.L2-3.14.2', title: 'Malicious Code Protection', description: 'Provide protection from malicious code at appropriate locations within organizational systems.', monitored: false },
      { id: 'SI.L2-3.14.3', title: 'Security Alerts', description: 'Monitor system security alerts and advisories and take action in response.', monitored: false },
      { id: 'SI.L2-3.14.4', title: 'Update Malicious Code Protection', description: 'Update malicious code protection mechanisms when new releases are available.', monitored: false },
      { id: 'SI.L2-3.14.5', title: 'System & File Scanning', description: 'Perform periodic scans of organizational systems and real-time scans of files from external sources as files are downloaded, opened, or executed.', monitored: false },
      { id: 'SI.L2-3.14.6', title: 'Security Monitoring', description: 'Monitor organizational systems, including inbound and outbound communications traffic, to detect attacks and indicators of potential attacks.', monitored: false },
      { id: 'SI.L2-3.14.7', title: 'Identify Unauthorized Use', description: 'Identify unauthorized use of organizational systems.', monitored: false },
    ],
  },
];

export const ALL_CONTROLS = CMMC_DOMAINS.flatMap((d) => d.controls);
export const TOTAL_CONTROLS = ALL_CONTROLS.length;
export const MONITORED_COUNT = ALL_CONTROLS.filter((c) => c.monitored).length;
