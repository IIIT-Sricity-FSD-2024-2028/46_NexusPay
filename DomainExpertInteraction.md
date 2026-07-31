# Summary of the Interaction

## Basic Information
- **Domain:** Fintech  
- **Problem Statement:** Digital Payments and Transaction Coordination Platform  
- **Date of Interaction:** 01-02-2026  
- **Mode of Interaction:** Video Call  
- **Duration (in minutes):** 53 minutes
- **Publicly Accessible Video Link:** https://drive.google.com/file/d/1oKEzaL_RBJU-PLG0Pp5kJQZqeICwZjuF/view?usp=sharing

---

## Domain Expert Details
- **Role / Designation:** Senior Software Engineer  
- **Experience in the Domain:**  
  Over 4 years of experience working on digital payment systems including designing and implementing microservices .
- **Nature of Work:** Developer 

---

## Domain Context and Terminology

### How would you describe the overall purpose of this problem statement in your daily work?
The problem statement focuses on enabling reliable, secure, and traceable digital
transactions while coordinating multiple payment scenarios such as scheduled
payments, split expenses, and post-transaction resolution.

### What are the primary goals or outcomes of this problem statement?
- Enable seamless peer-to-peer digital payments  
- Automate scheduled transfers  
- Coordinate group expenses and settlements  
- Ensure traceability, auditability, and dispute resolution  
- Minimize transaction errors and user confusion  

### Key Domain Terms

| Term | Meaning as explained by the expert |
|---|---|
| Retry Mechanism | A retry mechanism is a controlled process that re-attempts a failed payment or operation under predefined conditions to ensure completion without causing duplicate transactions. |


---

## Actors and Responsibilities

| Actor | Summary of Responsibilities |
|---|---|
| **Customer** | Initiates digital payments, creates and manages scheduled payments, maintains beneficiary profiles and funding sources, participates in split expense groups, views transaction history and notifications, raises disputes for eligible transactions, and reviews spending insights. |
| **Merchant** | Receives digital payments, tracks transaction and settlement status, confirms receipt of payments, maintains merchant payment profile, and responds to transaction-related disputes when required. |
| **Bank Admin** |Validates funding source availability and transaction limits, handles bank-side transaction failures, and applies banking constraints for disputes and refunds. |
| **NexusPay Admin** | Oversees platform-wide payment operations, monitors transaction execution, reviews and resolves disputes, approves or rejects refunds, configures limits and dispute windows. |


---

## Core Workflows

### Workflow 1: Scheduled Peer-to-Peer Payment
- **Trigger / Start Condition:**  
  Payer sets up a monthly scheduled payment
- **Steps Involved:**  
  1. Payer selects beneficiary  
  2. Defines amount and schedule  
  3. System validates beneficiary and funding source  
  4. Schedule is stored as active  
  5. Scheduler triggers payment on due date  
  6. System validates balance and limits  
  7. Payment is executed and recorded  
- **Outcome / End Condition:**  
  Payment completed and schedule remains active for next cycle  

---

### Workflow 2: Split Expense Settlement
- **Trigger / Start Condition:**  
  Payer creates an expense group
- **Steps Involved:**  
  1. Group participants are added  
  2. Total amount is entered  
  3. System calculates split amounts  
  4. Participants complete payments  
  5. System tracks contributions  
- **Outcome / End Condition:**  
  Settlement status marked as settled  

---

### Workflow 3: Dispute Raising by Payer
- **Trigger / Start Condition:**  
  Payer identifies an issue with a completed transaction
- **Steps Involved:**  
  1. Payer selects transaction  
  2. Raises dispute with reason  
  3. System validates eligibility  
  4. Dispute case is created  
- **Outcome / End Condition:**  
  Dispute status set to open and visible to payer  

---

## Rules, Constraints, and Exceptions

### Mandatory Rules or Policies
- Only successful transactions can be disputed  
- Scheduled payments require prior authorization  
- One active dispute per transaction
- Do not commit anything into database until the payment is successful.
### Constraints or Limitations
- Transactions must respect balance and spending limits  
- Disputes must be raised within a defined time window  

### Common Exceptions or Edge Cases
- Scheduled payment fails due to insufficient balance  
- Duplicate execution caused by scheduler issues  

### Situations Where Things Usually Go Wrong
- Incorrect beneficiary selection  
- Split expense marked settled prematurely  
- Scheduled payments executed after cancellation  

---

## Current Challenges and Pain Points
- Coordinating multiple transaction states reliably  
- Handling dispute eligibility consistently  
- Preventing duplicate or unintended scheduled executions  
- Tracking settlement status in group expenses  

---

## Assumptions & Clarifications

### Assumptions Confirmed
- Scheduled payments are pre-authorized by the payer  
- Disputes apply only to completed transactions  
- Funding source rules affect payment eligibility  

### Assumptions Corrected
- Not all failed transactions require dispute handling  
- Split payments are coordination problems, not simple transfers  

### Open Questions for Follow-up
- Retry behavior for failed scheduled payments  
- Maximum dispute window duration  
- Partial settlement handling in group expenses  

---
