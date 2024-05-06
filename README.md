# supaapps-api-kit-client

A versatile, type-safe API client designed for TypeScript applications. It simplifies making HTTP requests and handling responses with built-in support for authorization and automatic handling of unauthorized access scenarios.

## Features

- **Type Safety**: Leverages TypeScript for ensuring type safety in requests and responses.
- **Authorization Support**: Automatically includes authorization tokens in requests.
- **Customizable Unauthorized Access Handling**: Executes a callback function when encountering a 401 Unauthorized response, allowing for custom reaction strategies such as redirecting to a login page.
- **Simplified API Requests**: Offers methods for common HTTP requests (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) with a straightforward, promise-based API.
- **Flexible Response Handling**: Allows specifying the `responseType` for requests, enabling direct handling of blobs, JSON, and other formats.

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

const BASE_URL = 'https://api.example.com'

const authTokenCallback = () => {
  // Implement authToken logic here
};

const unauthorizationCallback = () => {
  // Implement redirection to login page here
};

ApiKitClient.initialize(BASE_URL, authTokenCallback, unauthorizationCallback);
```

## Making Requests

Use the `ApiKitClient` instance to make API requests. Here are some examples:

### Fetching Data

Fetch a list of resources specifying the expected response type:

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

ApiKitClient.get<User[]>('/users')
  .then(response => console.log(response.data)) // Expected to be of type User[]
  .catch(error => console.error(error));
```

Fetch a single resource:

```ts
ApiKitClient.getOne<User>('/users/1')
  .then(response => console.log(response.data)) // Expected to be of type User
  .catch(error => console.error(error));
```

Fetch a blob data:

```ts
ApiKitClient.get<Blob>('/download', undefined, 'blob')
  .then(response => console.log(response.data)) // Expected to be of type Blob
  .catch(error => console.error(error));
```

Fetch a paginated resource:

```ts
ApiKitClient.getPaginated<User>('/users')
  .then(response => console.log(response)) // Expected to be of type PaginatedResponse<User>
  .catch(error => console.error(error));
```

### Creating Data

```ts
// Create a new user
const newUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
};

ApiKitClient.post<User>('/users', newUser, 'json')
  .then(response => console.log(response.data)) // Expected to be of type User
  .catch(error => console.error(error));
```

### Updating Data

```ts
// Update a user's information
const updatedUser: User = {
  id: 1,
  name: 'Jane Doe',
  email: 'jane@example.com',
};

const updatedUser2: User = {
  name: 'Jane Doe',
};

ApiKitClient.put<User>('/users/1', updatedUser)
  .then(response => console.log(response.data)) // Expected to be of type User
  .catch(error => console.error(error));

ApiKitClient.patch<User>('/users/1', updatedUser2)
  .then(response => console.log(response.data)) // Expected to be of type User
  .catch(error => console.error(error));
```

### Deleting Data

```ts
// Delete a user
ApiKitClient.delete('/users/1')
  .then(() => console.log('User deleted'))
  .catch(error => console.error(error));
```

## Handling Unauthorized Access
The unauthorized access callback provided during initialization will be called automatically for any request that receives a 401 Unauthorized response, allowing you to handle such scenarios globally (e.g., redirecting the user to a login page).
