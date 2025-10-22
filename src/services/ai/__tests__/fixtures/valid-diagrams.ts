/**
 * Valid Mermaid diagram samples for testing
 */

export const VALID_WORKFLOW = `flowchart TD
  Start[User Starts Login] --> Input[Enter Credentials]
  Input --> Validate{Valid Credentials?}
  Validate -- Yes --> Success[Login Successful]
  Validate -- No --> Error[Show Error Message]
  Error --> Input
  
  style Start fill:#D5F5E3,stroke:#229954,stroke-width:2px
  style Validate fill:#FCF3CF,stroke:#B9770E,stroke-width:2px
  style Success fill:#D5F5E3,stroke:#229954,stroke-width:2px
  style Error fill:#FADBD8,stroke:#C0392B,stroke-width:2px`;

export const VALID_SEQUENCE = `sequenceDiagram
  participant User
  participant Frontend
  participant Backend
  participant Database
  
  User->>Frontend: Search for products
  Frontend->>Backend: GET /api/products?q=laptop
  Backend->>Database: SELECT * FROM products
  Database-->>Backend: Return results
  Backend-->>Frontend: JSON response
  Frontend-->>User: Display products`;

export const VALID_STATE_MACHINE = `stateDiagram-v2
  [*] --> New
  New --> Pending: Place Order
  Pending --> Confirmed: Confirm Payment
  Pending --> Cancelled: Cancel Order
  Confirmed --> Shipped: Ship Order
  Shipped --> Delivered: Deliver Order
  Cancelled --> [*]
  Delivered --> [*]`;

export const VALID_ARCHITECTURE = `graph TB
  subgraph "Frontend"
    UI[React App]
  end
  
  subgraph "Backend Services"
    API[API Gateway]
    Auth[Auth Service]
    User[User Service]
    Order[Order Service]
  end
  
  subgraph "Data Layer"
    DB[(PostgreSQL)]
    Cache[(Redis)]
  end
  
  UI --> API
  API --> Auth
  API --> User
  API --> Order
  User --> DB
  Order --> DB
  Auth --> Cache`;

export const VALID_ENDPOINT_DIAGRAM = `flowchart TD
  Start[POST /auth/login] --> Validate{Validate Input}
  Validate -- Invalid --> Error400[Return 400]
  Validate -- Valid --> CheckUser{User Exists?}
  CheckUser -- No --> Error404[Return 404]
  CheckUser -- Yes --> VerifyPwd{Verify Password}
  VerifyPwd -- Invalid --> Error401[Return 401]
  VerifyPwd -- Valid --> GenerateToken[Generate JWT]
  GenerateToken --> Success200[Return 200 + Token]`;

export const VALID_CLASS_DIAGRAM = `classDiagram
  class User {
    +String id
    +String email
    +String name
    +login()
    +logout()
  }
  
  class Order {
    +String id
    +Date createdAt
    +Number total
    +calculateTotal()
  }
  
  class Product {
    +String id
    +String name
    +Number price
  }
  
  User "1" --> "*" Order
  Order "*" --> "*" Product`;

export const VALID_ER_DIAGRAM = `erDiagram
  USER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : "ordered in"
  
  USER {
    int id PK
    string email UK
    string name
    datetime created_at
  }
  
  ORDER {
    int id PK
    int user_id FK
    decimal total
    datetime created_at
  }
  
  PRODUCT {
    int id PK
    string name
    decimal price
    int stock
  }
  
  ORDER_ITEM {
    int order_id FK
    int product_id FK
    int quantity
    decimal price
  }`;

export const VALID_GANTT = `gantt
  title Project Timeline
  dateFormat YYYY-MM-DD
  section Planning
  Requirements :done, req, 2024-01-01, 2024-01-15
  Design :active, design, 2024-01-16, 2024-01-31
  section Development
  Backend :backend, 2024-02-01, 30d
  Frontend :frontend, 2024-02-15, 30d
  section Testing
  QA Testing :qa, after frontend, 15d
  UAT :uat, after qa, 10d`;
