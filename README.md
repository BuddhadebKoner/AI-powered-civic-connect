# AI-Powered Civic Connect: System Architecture and Data Model

## Database Models and Relationships

We design a set of core entities to represent users, posts, categories, and authorities. Each table has a primary key (PK) and appropriate foreign keys (FK) to capture relationships. For example, the **User** table holds fields like `UserID (PK)`, `Name`, `Email`, `PasswordHash`, `RoleID (FK)`, etc.  The **Post** table includes `PostID (PK)`, `UserID (FK)` referencing the poster, `Caption`, `ImageURL`, `CategoryID (FK)`, `Status`, timestamps, and other metadata. (Typical social-media schemas include similar fields.)  Additional tables include **Role** (e.g. User, Admin, Authority), **Category** (e.g. “Road”, “Water”, etc.), and **Authority** (e.g. “Road Ministry”, “Water Department” with contact info).  To map categories to government bodies, we use a **AuthorityCategory** join table (`AuthorityID (FK)`, `CategoryID (FK)`) for a many-to-many mapping.  Optionally, we include a **PostLog** or **ActionHistory** table to record status changes (e.g. closure requests) with fields `LogID (PK)`, `PostID (FK)`, `ActorID (FK)`, `ActionType`, `Timestamp`. Each **User** has one **Role** (1\:N) and one (optional) **AuthorityID** if the user is an authority.  Likewise, **User (1)→Post (N)** (a user can create many posts, each post belongs to one user). Similarly, **Category (1)→Post (N)** and **Category (M)→(N) Authority** via the join table.

| **Table**             | **Fields (PK=primary key)**                                                                                                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Role**              | RoleID (PK), Name (e.g. “User”, “MusterAdmin”, “Authority”)                                                                                                                                                   |
| **User**              | UserID (PK), Name, Email, PasswordHash, RoleID (FK→Role), \[AuthorityID (FK→Authority)]<sup>†</sup>, *ProfileData…*                                                                                           |
| **Category**          | CategoryID (PK), Name (e.g. “Road”, “Sanitation”, “Water”), Description                                                                                                                                       |
| **Authority**         | AuthorityID (PK), Name (e.g. “Road Ministry”), Region, ContactInfo                                                                                                                                            |
| **AuthorityCategory** | AuthorityID (FK→Authority), CategoryID (FK→Category) – composite PK. (Maps which agencies handle which categories.)                                                                                           |
| **Post**              | PostID (PK), UserID (FK→User), Caption, ImageURL (link to media storage), CategoryID (FK→Category), AssignedAuthorityID (FK→Authority, nullable), Status (enum: Open/Pending/Resolved), CreatedAt, UpdatedAt. |
| **PostLog** (opt)     | LogID (PK), PostID (FK→Post), ActorID (FK→User), ActionType (e.g. “REQUEST\_CLOSE”, “CONFIRM\_RESOLUTION”), Timestamp.                                                                                        |

*<sup>†</sup>* Authorities can be modeled as specialized users (Role=Authority) linked to an Authority record; alternatively, Authority users simply have RoleID=Authority and use the Authority table for details. The **User–Post** relationship is one-to-many (one user can create many posts, each post has one user). All foreign-key relationships are 1→N except AuthorityCategory which is N→N.

## Entity-Relationship Overview

The ER “diagram” (described here) connects these tables. **Users** (with Roles) create **Posts** (1\:M). Each Post belongs to one **Category** (e.g. road damage), and each Category can map to multiple **Authorities**. Thus, an Authority (e.g. a ministry) can handle many Categories, and a Category can involve multiple agencies (N\:M via AuthorityCategory). When the AI service categorizes a post, the system looks up the relevant Authority(ies) for that Category.  In summary:

* **User – Role:** *Each user has one role* (User\:Role = M:1).
* **User – Post:** *Each post has one author (user)* (User\:Post = 1\:M).
* **Post – Category:** *Each post is tagged with one category* (Category\:Post = 1\:M).
* **Category – Authority:** *Categories and Authorities are linked via a many-to-many relationship* (via AuthorityCategory).

No two entities share the same PK; all FKs reference the appropriate PK as listed above.  (For brevity we omit unrelated entities like comments or likes, focusing on civic-post flows.)  This logical design can be implemented in a relational DB (e.g. PostgreSQL) or a document DB (MongoDB) with similar structure.  In practice, one might use an ODM/ORM (like Mongoose or Prisma) to define these models.

## System Architecture

We propose a **microservices architecture** using a MERN/Next.js stack. The frontend is a Next.js (React) web app; backend services are Node.js-based, each handling a distinct domain. This allows independent scaling and deployment of components. Key components:

* **Frontend (Next.js app):** Single-page or server-rendered React UI for user posts, dashboards, etc.  Uses Next.js pages/components and fetches data via APIs (Rest or GraphQL).
* **API Layer / Gateway:** An API gateway (or Next.js API routes acting as BFF) routes requests to services. Next.js’s built-in API routes can serve as lightweight service endpoints. Alternatively, a dedicated Node/Express gateway could proxy to microservices.
* **Authentication Service:** Handles user sign-up, login (using JWT or NextAuth). Implements role-based login so users receive a token containing their role.
* **User Service:** Manages user profiles and roles. Provides endpoints for profile updates, and (for Muster Admins) management actions.
* **Post/Issue Service:** Handles creation, update, and retrieval of posts. On new post, it saves the image to a **Media Service** (e.g. S3/Cloud Storage) and records the metadata in Post table.  This service enqueues a job to categorize the post (see “AI Integration” below).  (Media uploads are often served via a CDN for performance.)
* **AI Service:** A background worker or part of the Post Service that calls the Gemini (vision) API to classify images. The result (issue category) is written back to the post record.
* **Notification Service:** Optional; pushes notifications or emails (e.g. to authorities) about new issues. Could use a message queue (RabbitMQ/Kafka) for async processing.
* **Authority Dashboard Service:** Backend for government users. Retrieves posts tagged for that authority (by category). Allows authorities to update a post’s status (request closure).
* **Muster Admin Service (Community Admin):** Allows domain admins to view all posts, override categories or escalate issues. (Muster Admins might moderate content, add local context, or reassign categories if AI is uncertain.)
* **Database Layer:** We can use a mix of databases as needed. A relational DB (PostgreSQL) can store Users, Posts, Categories, etc.. For high-throughput feeds or caching, a NoSQL DB (e.g. MongoDB) is suitable. Redis/Memcached can cache frequent queries (like lists of posts) for faster response.
* **Infrastructure:** Deploy services in containers (Docker) orchestrated by Kubernetes or similar. Use load balancers (e.g. AWS ELB) to distribute traffic.

**Technology Choices:** All services are implemented in Node.js (or Next.js API routes for simpler setup) so they fit a MERN stack. The Next.js app can be hosted on Vercel or any cloud, the API on AWS/GCP. Images are stored on cloud object storage (e.g. Amazon S3) and served via CDN. Databases are hosted on managed services (e.g. MongoDB Atlas or RDS) for reliability.

## Role-Based Access Control (RBAC) Flow

*Figure: Basic RBAC flow where user roles determine allowed services.* In our system every API request carries the user’s identity and role (User, MusterAdmin, or Authority). An authentication middleware verifies the token and extracts the user’s role. Each request is then checked against a permission table: for example, only users with the “Authority” role can access endpoints for “close issue” or view authority dashboards.  Conversely, normal users can create posts and view only their own issues; Muster Admins can moderate or reassign posts. This follows standard RBAC principles (assign roles to users, assign permissions to roles). In practice, a request from **User A** will be routed through an authorization layer: if User A’s role includes the requested action, the service fulfills it; otherwise a “403 Forbidden” is returned. For instance, when an Authority user logs in and views their dashboard, the backend checks “Authority” role and returns posts tagged to that authority. RBAC ensures a clean separation of privileges: e.g. only Authorities can transition post status to *Pending Verification*, while only the original posting user can confirm final resolution.

## Post Lifecycle

Posts go through a defined lifecycle: **Open → Pending Verification → Resolved**.

1. **Open:** When a user creates an issue post, it is initially “Open”. The status and metadata are saved in the database. (At this point the AI categorization job is triggered.)
2. **Pending Verification:** After an Authority fixes the issue, they click “Request Closure” on their dashboard. This sets the post status to “Pending Verification” and notifies the original user. We also log this action in PostLog for audit.
3. **Resolved:** The original user reviews the fix. If satisfied, they click “Confirm Resolution”. The status changes to “Resolved” (and optionally archived). If not satisfied, they can re-open or comment.

These states mirror standard issue-tracking workflows (akin to a bug life cycle from “New” to “Assigned/Resolved”). Transition triggers are authenticated actions by roles: only an Authority in *Open* status can request closure, and only the owning user can confirm. The **Status** field of the Post table (enum) tracks this state, and each change can be audited in a log.

## Gemini AI Integration

On post creation, the **Post Service** invokes the Gemini (vision-enabled LLM) API to classify the issue. We send the *image* and *caption text* as input. The AI model returns tags or a predicted category (e.g. “road damage”, “flooding”). Modern GPT-4/Gemini models support image inputs and can output descriptive tags. Our backend then matches the AI’s output to one of our predefined categories (with possible confidence thresholds). This category is written into the Post record. Immediately after categorization, the system queries the **AuthorityCategory** mapping to find which government agency handles that category, and assigns the post to that authority (setting `AssignedAuthorityID`). Optionally, a notification is sent to that authority’s dashboard.

This call to Gemini can be done synchronously (on save) or asynchronously via a job queue: for example, after saving the image, the service pushes a task to a worker which calls the AI API and updates the database. Using a queue (RabbitMQ/Kafka) decouples the UI response time from the AI processing.  In rare cases where AI is uncertain, a Muster Admin can manually recategorize the post before it reaches authorities.

## Next.js Component & Module Breakdown

A Next.js implementation might be organized as follows:

* **Pages / Routes:**

  * `/login`, `/register` – Authentication pages (using NextAuth or custom).
  * `/feed` or `/community` – Main feed showing open issues. Uses SSR or client-side data fetch.
  * `/post/new` – Form to create a new issue (upload photo & caption).
  * `/dashboard/authority` – Authority dashboard showing tagged posts (with “Request Close” buttons).
  * `/dashboard/admin` – (Muster Admin) page to view/all posts, override categories, etc.
  * `/post/[id]` – Post detail page (shows status, history, comments).

* **Components:** Reusable React components for PostList, PostItem, UserMenu, ImageUploader, StatusBadge, etc. Style with Tailwind or CSS-in-JS.

* **API Routes / Services:** Under `/pages/api/` or as separate Express services:

  * `api/auth/*` – Endpoints for login/logout, using JWT/NextAuth.
  * `api/users/*` – User profile updates.
  * `api/posts/*` – CRUD for posts. On `POST /posts` a new issue is created (image stored, DB entry made, and AI call queued). On `GET /posts` filters by user or authority.
  * `api/categories/*` – Read categories.
  * `api/authorities/*` – (For admins) manage authority info or category mappings.
  * `api/actions/request-close` – Authority requests close (updates status).
  * `api/actions/confirm-resolution` – User confirms (updates status).

* **Libraries/Modules:** Use Mongoose or Prisma for DB models. A service module for calling the Gemini AI (wrapping OpenAI or Google API). A mailer module for notifications. Utilities for error handling, logging, and RBAC middleware (e.g. checking `req.user.role`).

* **State/Styling:** React state management (Context or Zustand) for auth/user state. Tailwind CSS or Chakra UI for design.

* **Deployment:** The Next.js app (including API routes) can be deployed on Vercel or any Node host. Backend microservices (if split) can be Dockerized and deployed on a Kubernetes cluster or serverless functions (e.g. AWS Lambda + API Gateway). Use environment variables and CI/CD for build and deployment.

By organizing code into clear components and services (e.g. **PostService**, **UserService**, **AuthorityService** classes or modules), we achieve a modular Next.js application that cleanly implements the above architecture.
