# Facebook User Info Fetcher

## Overview

This Node.js application leverages the Facebook Graph API to retrieve basic user information. It is designed to make periodic API calls, initially set at 2-second intervals, and employs mechanisms to handle API rate limits by adapting the request frequency based on API feedback.

## Prerequisites

- Node.js (version recommended: 14.x or higher)
- npm (version 20.11.1)
- A Facebook Developer account and a Facebook App (for the API access token)

## Setting Up Your Environment

1. **Clone the Repository**

   Start by cloning this repository to your local machine.

2. **Install Dependencies**

   Use npm to install the project's dependencies. Ensure you're using npm version 20.11.1 to match the project's setup requirements:

   ```bash
   npm install
   ```

3. **Configure Environment Variables**

   You need to set your Facebook API access token in an environment variable for the application to authenticate requests. Create a `.env` file in the root directory of the project:

   ```plaintext
   FACEBOOK_ACCESS_TOKEN=YourAccessTokenHere
   ```

   Replace `YourAccessTokenHere` with your actual access token obtained from the Facebook Developer portal.

## Running the Application

To run the application, use the following npx command from the root directory:

```bash
npx ts-node src/main.ts
```

## Handling Rate Limits

The application has basic handling for Facebook API rate limits. If a rate limit is hit, it will attempt to retry the request after a delay specified by the API's `retry-after` header. The logic for this behavior is encapsulated in the error handling within the application's codebase.