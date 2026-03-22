# 1️⃣ CREATE – RResource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)

    B->>V: Validate request
    V-->>B: Validation result

    alt Validation fails
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        B->>S: create Resource(data)
        S->>DB: INSERT INTO resources
        DB-->>S: Result / Duplicate error

        alt Duplicate
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            S-->>B: Created resource
            B-->>F: 201 Created
            F-->>U: Show success message
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Request all resources (refreshing the page)
    F->>B: GET /api/resources

    B->>S: getAllResources()
    S->>DB: SELECT * FROM resources ORDER BY created_at DESC
    DB-->>S: Result rows

    S-->>B: Resource list
    B-->>F: 200 OK + data[]
    F-->>U: Display all resources in the blocks of the website page

    U->>F: Request single resource by ID
    F->>B: GET /api/resources/:id

    B->>S: getResourceById(id)
    S->>DB: SELECT * FROM resources WHERE id = $1
    DB-->>S: Result

    alt Resource not found
        S-->>B: Empty result
        B-->>F: 404 Not Found
        F-->>U: Show "Resource not found"
    else Success
        S-->>B: Resource data
        B-->>F: 200 OK + data
        F-->>U: Display resource
    end
```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js + resources.js)
    participant B as Backend (Express Route)
    participant V as express-validator
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click the resources, edit the click the button
    F->>F: Client-side validation
    alt Client validation fails
        F-->>U: Show validation messages
    else Validation OK
        F->>B: PUT /api/resources/:id (JSON)

        B->>V: Validate request
        V-->>B: Validation result

        alt Server validation fails
            B-->>F: 400 Bad Request + errors[]
            F-->>U: Show validation messages
        else Validation OK
            B->>S: updateResource(id, data)
            S->>DB: UPDATE resources ... RETURNING *
            DB-->>S: Result row(s)

            alt Duplicate resource name
                S-->>B: DB error code 23505
                B-->>F: 409 Conflict
                F-->>U: Show "Duplicate resource name"
            else Success
                S-->>B: Updated resource
                B-->>F: 200 OK + data
                F-->>U: Show updated resource
            end
        end
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
```
