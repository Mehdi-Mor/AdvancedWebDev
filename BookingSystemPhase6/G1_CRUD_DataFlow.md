# 1️⃣ CREATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant V as express-validator
    participant DB as PostgreSQL

    U->>F: Submit form
    F->>F: Client-side validation
    F->>B: POST /api/resources (JSON)
    B->>S: createResource(data)

    S->>V: Validate request
    V-->>S: Validation result

    alt Validation fails (express-validator)
        S-->>B: Validation errors
        B-->>F: 400 Bad Request + errors[]
        F-->>U: Show validation message
    else Validation OK
        S->>DB: INSERT INTO resources (...) RETURNING *

        alt Duplicate (unique constraint)
            DB-->>S: Error (duplicate)
            S-->>B: Duplicate detected
            B-->>F: 409 Conflict
            F-->>U: Show duplicate message
        else Success
            DB-->>S: Inserted row
            S-->>B: Created resource
            B-->>F: 201 Created + data
            F-->>U: Show success message
        else Database error
            DB-->>S: Error
            S-->>B: Database error
            B-->>F: 500 Internal Server Error
            F-->>U: Show database error
        end
    end
```

# 2️⃣ READ — Resource (Sequence Diagram)

## READ — ALL

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Open list / refresh resources
    F->>B: GET /api/resources
    B->>S: getAllResources()
    S->>DB: SELECT * FROM resources ORDER BY created_at DESC

    alt Success
        DB-->>S: rows[]
        S-->>B: Resource list
        B-->>F: 200 OK + data[]
        F-->>U: Display resources
    else Database error
        DB-->>S: Error
        S-->>B: Database error
        B-->>F: 500 Internal Server Error
        F-->>U: Show database error
    end
```

## READ — ID

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Open resource details
    F->>B: GET /api/resources/:id
    B->>S: getResourceById(id)

    alt Invalid ID
        S-->>B: Invalid ID
        B-->>F: 400 Bad Request
        F-->>U: Show "Invalid ID"
    else Valid ID
        S->>DB: SELECT * FROM resources WHERE id = $1

        alt Not found
            DB-->>S: 0 rows
            S-->>B: Resource not found
            B-->>F: 404 Not Found
            F-->>U: Show "Resource not found"
        else Success
            DB-->>S: row
            S-->>B: Resource
            B-->>F: 200 OK + data
            F-->>U: Display resource
        else Database error
            DB-->>S: Error
            S-->>B: Database error
            B-->>F: 500 Internal Server Error
            F-->>U: Show database error
        end
    end
```

# 3️⃣ UPDATE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (form.js and resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant V as express-validator
    participant DB as PostgreSQL

    U->>F: Edit resource and submit
    F->>F: Client-side validation

    alt Client validation fails
        F-->>U: Show validation messages
    else Client validation OK
        F->>B: PUT /api/resources/:id (JSON)
        B->>S: updateResource(id, data)

        S->>V: Validate request
        V-->>S: Validation result

        alt Invalid ID
            S-->>B: Invalid ID
            B-->>F: 400 Bad Request
            F-->>U: Show "Invalid ID"
        else Validation fails (express-validator)
            S-->>B: Validation errors
            B-->>F: 400 Bad Request + errors[]
            F-->>U: Show validation messages
        else Validation OK
            S->>DB: UPDATE resources SET ... WHERE id = $1 RETURNING *

            alt Not found
                DB-->>S: 0 rows
                S-->>B: Resource not found
                B-->>F: 404 Not Found
                F-->>U: Show "Resource not found"
            else Duplicate (unique constraint)
                DB-->>S: Error (duplicate)
                S-->>B: Duplicate detected
                B-->>F: 409 Conflict
                F-->>U: Show "Duplicate resource"
            else Success
                DB-->>S: Updated row
                S-->>B: Updated resource
                B-->>F: 200 OK + data
                F-->>U: Show updated resource
            else Database error
                DB-->>S: Error
                S-->>B: Database error
                B-->>F: 500 Internal Server Error
                F-->>U: Show database error
            end
        end
    end
```

# 4️⃣ DELETE — Resource (Sequence Diagram)

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as Frontend (resources.js)
    participant B as Backend (Express Route)
    participant S as Resource Service
    participant DB as PostgreSQL

    U->>F: Click "Delete" on resource
    F->>B: DELETE /api/resources/:id
    B->>S: deleteResource(id)

    alt Invalid ID
        S-->>B: Invalid ID
        B-->>F: 400 Bad Request
        F-->>U: Show "Invalid ID"
    else Valid ID
        S->>DB: DELETE FROM resources WHERE id = $1

        alt Not found
            DB-->>S: 0 rows affected
            S-->>B: Resource not found
            B-->>F: 404 Not Found
            F-->>U: Show "Resource not found"
        else Success
            DB-->>S: 1 row affected
            S-->>B: Deleted
            B-->>F: 204 No Content
            F-->>U: Remove resource from UI
        else Database error
            DB-->>S: Error
            S-->>B: Database error
            B-->>F: 500 Internal Server Error
            F-->>U: Show database error
        end
    end
```
