# API Contract: Frontend to Backend Specification

This document details every endpoint required by the frontend client for the **Esports Tournament & Community Platform**, as defined in the project specification (API-001 through API-014).

Base URL: Configured via `VITE_API_BASE_URL` (e.g. `http://localhost:8080/api/v1`).
Authentication: Bearer Token via HTTP Header `Authorization: Bearer <token>`, with sessions persisted via secure cookies or headers.

---

## 1. Authentication & Lifecycle (API-001, SEC-001 to SEC-003)

### 1.1 Register
- **Method:** `POST`
- **Path:** `/auth/register`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string",
    "inGameUsername": "string",
    "inGameId": "string"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "Registration successful. Please check your email for the verification link.",
    "userId": "string",
    "email": "string"
  }
  ```

### 1.2 Verify Email
- **Method:** `POST`
- **Path:** `/auth/verify-email`
- **Request Body:**
  ```json
  {
    "token": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Email verified successfully.",
    "emailVerified": true
  }
  ```

### 1.3 Login
- **Method:** `POST`
- **Path:** `/auth/login`
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "token": "string",
    "user": {
      "id": "string",
      "email": "string",
      "role": "normal_user | admin",
      "emailVerified": boolean,
      "presetProfilePictureRef": "string",
      "inGameId": "string",
      "inGameUsername": "string",
      "inGameRole": "string",
      "bio": "string",
      "theme": "crimson | midnight",
      "density": "compact | comfortable | spacious",
      "activityVisibility": "public | hidden | off"
    },
    "sessionId": "string"
  }
  ```

### 1.4 Current Session User
- **Method:** `GET`
- **Path:** `/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "user": { ...UserObject }
  }
  ```

### 1.5 Logout
- **Method:** `POST`
- **Path:** `/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:** `{}`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Logged out successfully."
  }
  ```

### 1.6 Forgot Password (Request Reset)
- **Method:** `POST`
- **Path:** `/auth/forgot-password`
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "If the email is registered, a password reset link has been dispatched."
  }
  ```

### 1.7 Reset Password (Confirm Token)
- **Method:** `POST`
- **Path:** `/auth/reset-password`
- **Request Body:**
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Password updated successfully. You may now log in."
  }
  ```

---

## 2. Sessions & Devices (API-002, DEV-001 to DEV-004, SEC-004 to SEC-005)

### 2.1 List Active Sessions
- **Method:** `GET`
- **Path:** `/sessions`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "sessions": [
      {
        "sessionId": "string",
        "userId": "string",
        "deviceMetadata": {
          "browser": "string",
          "os": "string",
          "deviceType": "string",
          "ipAddress": "string",
          "approximateLocation": "string"
        },
        "loginTimestamp": "ISO8601 string",
        "lastActiveTimestamp": "ISO8601 string",
        "status": "active | revoked",
        "isCurrent": boolean
      }
    ]
  }
  ```

### 2.2 List Login History
- **Method:** `GET`
- **Path:** `/sessions/history`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "history": [
      {
        "id": "string",
        "userId": "string",
        "timestamp": "ISO8601 string",
        "ipAddress": "string",
        "approximateLocation": "string",
        "deviceSummary": "string",
        "status": "success | failed"
      }
    ]
  }
  ```

### 2.3 Revoke Session (Remote Logout)
- **Method:** `DELETE`
- **Path:** `/sessions/:sessionId`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Session revoked successfully."
  }
  ```

---

## 3. Tournaments (API-003, FR-004, FR-010 to FR-012)

### 3.1 List Tournaments
- **Method:** `GET`
- **Path:** `/tournaments`
- **Query Parameters:**
  - `status`: `past | current | future` (optional)
  - `game`: `string` (optional)
  - `limit`: `number` (optional)
- **Response (`200 OK`):**
  ```json
  {
    "tournaments": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "fullDetails": "string",
        "status": "past | current | future",
        "rating": 4.8,
        "ratingCount": 42,
        "startDate": "ISO8601 string",
        "endDate": "ISO8601 string",
        "gameTitle": "string",
        "bannerUrl": "string",
        "prizePool": "string",
        "rules": "string"
      }
    ]
  }
  ```

### 3.2 Get Tournament Details
- **Method:** `GET`
- **Path:** `/tournaments/:id`
- **Response (`200 OK`):**
  ```json
  {
    "tournament": { ...TournamentObject }
  }
  ```

---

## 4. Teams & Groups (API-004, FR-020 to FR-023, UX-004)

### 4.1 List Teams
- **Method:** `GET`
- **Path:** `/teams`
- **Query Parameters:**
  - `availability`: `open | closed` (optional)
  - `search`: `string` (optional)
- **Response (`200 OK`):**
  ```json
  {
    "teams": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "leaderId": "string",
        "leaderUsername": "string",
        "members": [
          {
            "userId": "string",
            "username": "string",
            "inGameRole": "string",
            "joinedAt": "ISO8601 string"
          }
        ],
        "memberCount": 4,
        "maxSlots": 5,
        "availability": "open | closed",
        "createdAt": "ISO8601 string"
      }
    ]
  }
  ```

### 4.2 Get Team Details
- **Method:** `GET`
- **Path:** `/teams/:id`
- **Response (`200 OK`):**
  ```json
  {
    "team": { ...TeamObject }
  }
  ```

### 4.3 Create Team
- **Method:** `POST`
- **Path:** `/teams`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "name": "string",
    "description": "string",
    "maxSlots": 5
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "team": { ...TeamObject }
  }
  ```

### 4.4 Join Team / Request Join
- **Method:** `POST`
- **Path:** `/teams/:id/join`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "message": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Join request submitted or joined successfully."
  }
  ```

---

## 5. Profile & Presets (API-005, FR-024 to FR-027, TC-008)

### 5.1 Get Preset Avatars List
- **Method:** `GET`
- **Path:** `/profile/preset-avatars`
- **Response (`200 OK`):**
  ```json
  {
    "avatars": [
      {
        "id": "preset-1",
        "name": "Vanguard",
        "url": "string"
      }
    ]
  }
  ```

### 5.2 Get User Profile
- **Method:** `GET`
- **Path:** `/profile/:id`
- **Response (`200 OK`):**
  ```json
  {
    "user": {
      "id": "string",
      "presetProfilePictureRef": "string",
      "inGameId": "string",
      "inGameUsername": "string",
      "inGameRole": "string",
      "bio": "string",
      "theme": "crimson | midnight",
      "density": "compact | comfortable | spacious",
      "activityVisibility": "public | hidden | off"
    }
  }
  ```

### 5.3 Update Current User Profile
- **Method:** `PUT`
- **Path:** `/profile/me`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "presetProfilePictureRef": "string",
    "inGameId": "string",
    "inGameUsername": "string",
    "inGameRole": "string",
    "bio": "string",
    "theme": "crimson | midnight",
    "density": "compact | comfortable | spacious",
    "activityVisibility": "public | hidden | off"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "user": { ...UserObject }
  }
  ```

---

## 6. ID Buy/Sell Marketplace (API-006, FR-040 to FR-045, SEC-007)

### 6.1 List Listings
- **Method:** `GET`
- **Path:** `/marketplace`
- **Query Parameters:**
  - `status`: `active | sold | deleted`
  - `tag`: `good_deal | hot`
  - `sort`: `price_asc | price_desc | newest`
  - `search`: `string`
- **Response (`200 OK`):**
  ```json
  {
    "listings": [
      {
        "id": "string",
        "sellerRef": {
          "id": "string",
          "username": "string",
          "inGameUsername": "string",
          "ratingAverage": 4.9,
          "ratingCount": 18
        },
        "gameTitle": "string",
        "gameIdDetails": "string",
        "screenshots": ["url1", "url2"],
        "currentPrice": 250,
        "initialPrice": 300,
        "priceHistory": [
          { "price": 300, "timestamp": "ISO8601 string" },
          { "price": 250, "timestamp": "ISO8601 string" }
        ],
        "status": "active | sold | deleted",
        "tags": ["good_deal"],
        "discountAmount": 50,
        "discountPercentage": 16.67,
        "createdAt": "ISO8601 string",
        "updatedAt": "ISO8601 string"
      }
    ]
  }
  ```

### 6.2 Get Listing Detail
- **Method:** `GET`
- **Path:** `/marketplace/:id`
- **Response (`200 OK`):**
  ```json
  {
    "listing": {
      "...ListingFields",
      "contact": "Contact string (exposed on detail view per FR-041/SEC-007)"
    }
  }
  ```

### 6.3 Create Listing
- **Method:** `POST`
- **Path:** `/marketplace`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body (or multipart FormData):**
  ```json
  {
    "gameTitle": "string",
    "gameIdDetails": "string",
    "price": 250,
    "contact": "string",
    "screenshots": ["url1", "url2"]
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "listing": { ...ListingObject }
  }
  ```

### 6.4 Update Listing Price (Triggers Good Deal / Hot calculation)
- **Method:** `PATCH`
- **Path:** `/marketplace/:id/price`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "newPrice": 220
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "listing": { ...ListingObject }
  }
  ```

### 6.5 Mark Listing Sold
- **Method:** `POST`
- **Path:** `/marketplace/:id/sold`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Listing marked as sold."
  }
  ```

### 6.6 Delete Listing
- **Method:** `DELETE`
- **Path:** `/marketplace/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Listing deleted."
  }
  ```

---

## 7. Rank Boosting Packages (API-007, FR-050a to FR-050c)

### 7.1 List Rank Packages
- **Method:** `GET`
- **Path:** `/rank-boosting`
- **Response (`200 OK`):**
  ```json
  {
    "packages": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "gameTitle": "string",
        "providerDetails": {
          "providerName": "string",
          "providerContact": "string",
          "verified": boolean
        },
        "price": 120,
        "currentRankTier": "Gold",
        "targetRankTier": "Diamond",
        "estimatedDuration": "2-3 days",
        "availability": "available | unavailable",
        "bookingsCount": 12,
        "createdAt": "ISO8601 string"
      }
    ]
  }
  ```

### 7.2 Get Rank Package Detail
- **Method:** `GET`
- **Path:** `/rank-boosting/:id`
- **Response (`200 OK`):**
  ```json
  {
    "package": { ...PackageObject }
  }
  ```

### 7.3 Book Rank Package
- **Method:** `POST`
- **Path:** `/rank-boosting/:id/book`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "userContact": "string",
    "notes": "string"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "booking": {
      "id": "string",
      "packageId": "string",
      "userId": "string",
      "status": "pending | confirmed",
      "createdAt": "ISO8601 string"
    }
  }
  ```

---

## 8. Leaderboard (API-008, FR-060 to FR-061)

### 8.1 Get Leaderboard
- **Method:** `GET`
- **Path:** `/leaderboard`
- **Response (`200 OK`):**
  ```json
  {
    "topTournaments": [
      {
        "id": "string",
        "name": "string",
        "gameTitle": "string",
        "rating": 4.95,
        "ratingCount": 120,
        "prizePool": "$10,000"
      }
    ],
    "hotTeams": [
      {
        "id": "string",
        "name": "string",
        "memberCount": 5,
        "maxSlots": 5,
        "availability": "closed",
        "score": 1420
      }
    ]
  }
  ```

---

## 9. Ratings (API-009, FR-050, SEC-008, EDGE-006)

### 9.1 Check Rating Eligibility
- **Method:** `GET`
- **Path:** `/ratings/eligibility`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:** `sellerId=string&listingId=string`
- **Response (`200 OK`):**
  ```json
  {
    "eligible": boolean,
    "reason": "eligible | no_purchase_record | already_rated"
  }
  ```

### 9.2 Submit Rating
- **Method:** `POST`
- **Path:** `/ratings`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "sellerId": "string",
    "listingId": "string",
    "value": 5,
    "comment": "string"
  }
  ```
- **Response (`201 Created`):**
  ```json
  {
    "message": "Rating submitted successfully.",
    "ratingId": "string"
  }
  ```

### 9.3 Get Seller Ratings
- **Method:** `GET`
- **Path:** `/ratings/seller/:sellerId`
- **Response (`200 OK`):**
  ```json
  {
    "average": 4.8,
    "totalCount": 24,
    "ratings": [
      {
        "id": "string",
        "buyerUsername": "string",
        "value": 5,
        "comment": "string",
        "createdAt": "ISO8601 string"
      }
    ]
  }
  ```

---

## 10. Notifications (API-010, FR-080)

### 10.1 List Notifications
- **Method:** `GET`
- **Path:** `/notifications`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "notifications": [
      {
        "id": "string",
        "recipientId": "string",
        "type": "request | update",
        "title": "string",
        "message": "string",
        "readState": boolean,
        "sourceRef": {
          "entityType": "team | tournament | listing | booking",
          "entityId": "string"
        },
        "createdAt": "ISO8601 string"
      }
    ]
  }
  ```

### 10.2 Mark Notification As Read
- **Method:** `PATCH`
- **Path:** `/notifications/:id/read`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "message": "Notification marked as read."
  }
  ```

---

## 11. Universal Search (API-011, FR-030 to FR-033)

### 11.1 Cross-Entity Search
- **Method:** `GET`
- **Path:** `/search`
- **Query Parameters:**
  - `q`: `string`
  - `category`: `all | tournaments | teams | marketplace`
  - `sort`: `relevance | newest | name`
- **Response (`200 OK`):**
  ```json
  {
    "tournaments": [...TournamentObjects],
    "teams": [...TeamObjects],
    "listings": [...ListingObjects]
  }
  ```

---

## 12. Activity History (API-012, FR-100 to FR-102, SEC-006, EDGE-004)

### 12.1 Log Activity Event
- **Method:** `POST`
- **Path:** `/activity`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "event": "string",
    "eventDetails": "string"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Activity recorded (if privacy allows)."
  }
  ```

### 12.2 Get Activity History
- **Method:** `GET`
- **Path:** `/activity`
- **Headers:** `Authorization: Bearer <token>`
- **Response (`200 OK`):**
  ```json
  {
    "visibility": "public | hidden | off",
    "activities": [
      {
        "id": "string",
        "event": "string",
        "eventDetails": "string",
        "timestamp": "ISO8601 string",
        "visibility": "public | hidden | off"
      }
    ]
  }
  ```

### 12.3 Update Activity Visibility
- **Method:** `PUT`
- **Path:** `/activity/visibility`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "visibility": "public | hidden | off"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Activity visibility updated."
  }
  ```

---

## 13. Admin Management (API-013, ADM-001 to ADM-002)

### 13.1 Platform Overview Stats
- **Method:** `GET`
- **Path:** `/admin/stats`
- **Headers:** `Authorization: Bearer <token>` (Admin only)
- **Response (`200 OK`):**
  ```json
  {
    "totalUsers": 0,
    "activeListings": 0,
    "totalTournaments": 0,
    "openTeams": 0
  }
  ```

### 13.2 Moderate Marketplace Listing
- **Method:** `PATCH`
- **Path:** `/admin/marketplace/:id/status`
- **Headers:** `Authorization: Bearer <token>` (Admin only)
- **Request Body:**
  ```json
  {
    "status": "active | deleted"
  }
  ```
- **Response (`200 OK`):**
  ```json
  {
    "message": "Listing status modified by administrator."
  }
  ```

---

## 14. Static & Community Info (FR-002, FR-070, FR-071)

### 14.1 Home Banners
- **Method:** `GET`
- **Path:** `/content/banners`
- **Response (`200 OK`):**
  ```json
  {
    "banners": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "imageUrl": "string",
        "linkUrl": "string",
        "type": "update | poster"
      }
    ]
  }
  ```

### 14.2 Owner Social Links
- **Method:** `GET`
- **Path:** `/content/socials`
- **Response (`200 OK`):**
  ```json
  {
    "socials": [
      {
        "id": "string",
        "platform": "string",
        "handle": "string",
        "url": "string"
      }
    ]
  }
  ```

### 14.3 About Us Info
- **Method:** `GET`
- **Path:** `/content/about`
- **Response (`200 OK`):**
  ```json
  {
    "ownerName": "string",
    "missionStatement": "string",
    "contactEmail": "string",
    "foundedYear": "string",
    "description": "string"
  }
  ```
