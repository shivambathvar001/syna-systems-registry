# Security Architecture & Compliance Whitepaper
**Syna Systems | Post-Denial Resolution Engine**

This document describes the security controls, data isolation boundaries, and compliance architectures governing the Syna Post-Denial Resolution Engine (the "Engine") when integrated with hospital EHR systems.

---

## 1. Zero-Trust Data Scrubbing Architecture

To guarantee absolute compliance with HIPAA and patient privacy standards, Syna Systems utilizes a **Zero-Trust Proxy Gateway** deployed inside the client’s local infrastructure firewall.

```
          [ Local EHR Database ]
                    |
                    v (FHIR APIs: Raw Payload with PHI/PII)
        [ Local Proxy Gateway (Scrubber) ]
                    |
                    +---> [ AES-256 Local PHI Token Vault ]
                    |
                    v (Scrubbed Payload: Cryptographic Tokens Only)
           [ Syna Cloud Engine ] (AI clinical synthesis & graph routing)
                    |
                    v (Scrubbed Draft Letter)
        [ Local Proxy Gateway (Reconstructor) ]
                    |
                    +---> [ Rebind Patient Demographics ]
                    v
         [ Human Triage Queue ] (Full Appeal Letter with PHI)
```

### Encryption Standards:
* **Data in Transit:** Enforced TLS 1.3 encryption with AES-GCM-256 for all API payloads.
* **Data at Rest:** All local token databases are encrypted utilizing AES-256 keys managed by local cloud provider key management systems (KMS).

---

## 2. Compliance Boundaries

### HIPAA Security Rule Adherence:
* **Administrative Safeguards:** Complete workforce security controls, disaster recovery procedures, and yearly risk audits.
* **Physical Safeguards:** Hosting restricted to SOC2 Type II, ISO 27001 certified cloud infrastructure regions (AWS/GCP US regions).
* **Technical Safeguards:** Unique user IDs, automatic session lockouts, cryptographic hashing of audit logs, and automatic encryption.

### SOC2 Type II Framework:
* The Engine follows SOC2 trust service principles:
  * **Security:** Firewalls, intrusion detection (IDS/IPS), and multifactor authentication (MFA) on all admin endpoints.
  * **Confidentiality:** Mandatory scrubbing of PHI/PII. Data is never shared or stored in global AI model training sets.

---

## 3. Human-in-the-Loop (HITL) Audit Controls

* **Immutable Log Ledger:** Every appeal draft generation, human modification, and submission event is logged to a write-once-read-many (WORM) storage bucket.
* **Steering Gateways:** Prohibits automatic outbound mail, fax, or electronic submissions to payers. The system strictly serves as a drafting helper, requiring manual sign-off by credentialed hospital coders.
