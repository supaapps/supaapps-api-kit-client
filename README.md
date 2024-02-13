# supaapps-api-kit-client

A versatile, type-safe API client designed for TypeScript applications. It simplifies making HTTP requests and handling responses with built-in support for authorization and automatic handling of unauthorized access scenarios.

## Features

- **Type Safety**: Leverages TypeScript for ensuring type safety in requests and responses.
- **Authorization Support**: Automatically includes authorization tokens in requests.
- **Customizable Unauthorized Access Handling**: Executes a callback function when encountering a 401 Unauthorized response, allowing for custom reaction strategies such as redirecting to a login page.
- **Simplified API Requests**: Offers methods for common HTTP requests (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with a straightforward, promise-based API.

## Installation

Install the package using npm:

```bash
npm install supaapps-api-kit-client
# or
yarn add supaapps-api-kit-client
```

## Setup

Before making any requests, initialize the `ApiKitClient` with your API's base URL, an authorization token, and a callback function for handling unauthorized access.


```ts
import { ApiKitClient } from 'supaapps-api-kit-client';

interface User {
  id: string;
  name: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
}

// Define your unauthorized access handler
function handleUnauthorizedAccess() {
  // Implement the redirection or other logic here
}

// Factory function to create a typed API client for a specific model
function createApiClientForModel<T>(baseUrl: string, authToken?: string) {
  return ApiKitClient<T>(baseUrl, authToken, handleUnauthorizedAccess);
}

// Example usage
const userApiClient = createApiClientForModel<User>('api_url', 'auth_token');
const postApiClient = createApiClientForModel<Post>('api_url', 'auth_token');
```

## Making Requests

Use the `ApiKitClient` instance to make API requests. Here are some examples:

### Fetching Data

Fetch a list of resources:

```ts
userApiClient.get('/users').then(response => {
  if (response.status === 200) {
    console.log('Fetched user:', response.data);
  }
});
```

Fetch a single resource:

```ts
userApiClient.getOne('/users/1').then(response => {
  if (response.status === 200) {
    console.log('Fetched user:', response.data);
  }
});
```

### Creating Data

```ts
// Create a new post
const newPost: Post = {
  id: '123',
  title: 'Hello World',
  content: 'This is my first post',
};

postApiClient.post('/posts', newPost).then(response => {
  if (response.status === 200) {
    console.log('Post created:', response.data);
  }
});
```