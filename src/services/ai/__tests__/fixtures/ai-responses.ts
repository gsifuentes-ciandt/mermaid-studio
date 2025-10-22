/**
 * Sample AI response formats for testing
 */

export const AI_RESPONSE_VALID_WORKFLOW = `Title: User Authentication Flow
Description: Complete login process with validation and error handling
Diagram Type: workflow

\`\`\`mermaid
flowchart TD
  Start[User Starts Login] --> Input[Enter Credentials]
  Input --> Validate{Valid Credentials?}
  Validate -- Yes --> Success[Login Successful]
  Validate -- No --> Error[Show Error Message]
  Error --> Input
  
  style Start fill:#D5F5E3,stroke:#229954,stroke-width:2px
  style Validate fill:#FCF3CF,stroke:#B9770E,stroke-width:2px
  style Success fill:#D5F5E3,stroke:#229954,stroke-width:2px
  style Error fill:#FADBD8,stroke:#C0392B,stroke-width:2px
\`\`\`

This diagram shows the authentication flow with color-coded nodes.`;

export const AI_RESPONSE_VALID_ENDPOINT = `Title: User Authentication Endpoint
Description: POST /auth/login endpoint with validation and error handling
Diagram Type: endpoint

HTTP Method: POST
Endpoint Path: /auth/login

\`\`\`mermaid
flowchart TD
  Start[POST /auth/login] --> Validate{Validate Input}
  Validate -- Invalid --> Error400[Return 400]
  Validate -- Valid --> CheckUser{User Exists?}
  CheckUser -- No --> Error404[Return 404]
  CheckUser -- Yes --> VerifyPwd{Verify Password}
  VerifyPwd -- Invalid --> Error401[Return 401]
  VerifyPwd -- Valid --> GenerateToken[Generate JWT]
  GenerateToken --> Success200[Return 200 + Token]
\`\`\`

Request Payload:
- Status: Request Body
- Content-Type: application/json
- JSON Example:
\`\`\`json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

Response Payload (200):
- Status: 200
- Content-Type: application/json
- JSON Example:
\`\`\`json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "uuid-here"
}
\`\`\`

Response Payload (400):
- Status: 400
- Content-Type: application/json
- JSON Example:
\`\`\`json
{
  "error": "Missing required fields: email, password"
}
\`\`\`

Response Payload (401):
- Status: 401
- Content-Type: application/json
- JSON Example:
\`\`\`json
{
  "error": "Invalid credentials"
}
\`\`\``;

export const AI_RESPONSE_EXPLANATION_ONLY = `This endpoint handles user authentication by validating credentials and returning a JWT token on success.

The flow works as follows:
1. Validate input for required fields (email and password)
2. Check if user exists in the database
3. Verify password correctness using bcrypt
4. Generate JWT token with user claims
5. Return appropriate response code and payload

Error handling includes:
- 400 for missing or invalid input
- 404 for non-existent user
- 401 for incorrect password
- 500 for server errors`;

export const AI_RESPONSE_WITH_MARKDOWN_SEPARATORS = `Certainly! Here is the documentation for the User Authentication Endpoint API in text format, ready for export.

---

**Title:** User Authentication Endpoint  
**Description:** Authenticates a user by verifying provided email and password. Returns a JWT token on success.

---

**HTTP Method:** POST  
**Endpoint Path:** /auth/login

---

**Request Payload:**  
- **Status:** Request Body  
- **Content-Type:** application/json  
- **JSON Example:**
\`\`\`json
{
  "email": "user@example.com",
  "password": "yourPassword"
}
\`\`\`

---

**Response Payload (200):**  
- **Status:** 200  
- **Content-Type:** application/json  
- **JSON Example:**
\`\`\`json
{
  "success": true,
  "token": "jwt-token",
  "userId": "uuid"
}
\`\`\`

---

**Summary of Logic:**
1. Validate input for required fields (email and password).
2. Check if user exists.
3. Verify password correctness.
4. Return appropriate response code and payload.`;

export const AI_RESPONSE_MULTIPLE_CODE_BLOCKS = `Here's the diagram you requested:

First, let me show you some JSON data:
\`\`\`json
{
  "test": "data"
}
\`\`\`

Now here's the actual Mermaid diagram:

\`\`\`mermaid
flowchart TD
  A --> B
  B --> C
\`\`\`

And here's some additional context in a code block:
\`\`\`
This is just text
\`\`\``;

export const AI_RESPONSE_WORKFLOW_WITH_ACTORS = `Title: Patient Registration Workflow
Description: Complete patient registration process from arrival to confirmation
Diagram Type: workflow

\`\`\`mermaid
flowchart TD
  Start[Patient Arrives] --> CheckIn[Front Desk Check-in]
  CheckIn --> Verify{Insurance Verified?}
  Verify -- Yes --> Register[Register Patient]
  Verify -- No --> Manual[Manual Verification]
  Manual --> Register
  Register --> Confirm[Send Confirmation]
  Confirm --> End[Registration Complete]
\`\`\`

Workflow Actors: Patient, Front Desk Staff, Insurance Verification System, Registration System
Workflow Trigger: Patient arrival at facility`;

export const AI_RESPONSE_SEQUENCE_DIAGRAM = `Title: Schema Management Workflow Sequence
Description: Sequence of interactions between User, Admin, and System during schema management lifecycle
Diagram Type: sequence

\`\`\`mermaid
sequenceDiagram
  participant User
  participant Admin
  participant System
  
  User->>System: Request Schema
  System->>Admin: Validate Request
  Admin->>System: Approve Schema
  System->>User: Return Schema
\`\`\``;

export const AI_RESPONSE_NO_CODE_BLOCK = `flowchart TD
  A --> B
  B --> C`;

export const AI_RESPONSE_EMPTY = ``;

export const AI_RESPONSE_ONLY_METADATA = `Title: Test Diagram
Description: A test diagram
Diagram Type: workflow`;
