import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ApiKitClient } from '../src/ApiKitClient';

describe('ApiKitClient', () => {
    // @ts-ignore
    let mockAxios;

    beforeEach(() => {
        // Initialize mock for Axios
        mockAxios = new MockAdapter(axios);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    it('should initialize the client with correct configuration', () => {
        const baseURL = 'https://api.example.com';
        const authTokenCallback = jest.fn(() => Promise.resolve('fake-token'));
        const unauthorizedCallback = jest.fn();

        const client = ApiKitClient.i('testClient');
        client.initialize(baseURL, authTokenCallback, unauthorizedCallback, true);

        const apiClient = ApiKitClient.apiClients['testClient'];
        expect(apiClient.baseURL).toBe(baseURL);
        expect(apiClient.authTokenCallback).toBe(authTokenCallback);
        expect(apiClient.unauthorizedCallback).toBe(unauthorizedCallback);
        expect(apiClient.useAuth).toBe(true);
    });

    it('should throw an error if authTokenCallback is not provided when useAuth is true', () => {
        const baseURL = 'https://api.example.com';
        const client = ApiKitClient.i('testClient');
        expect(() => client.initialize(baseURL, undefined, undefined, true)).toThrowError(
            'authTokenCallback must be provided if useAuth is true.'
        );
    });

    it('should make a GET request successfully', async () => {
        const baseURL = 'https://api.example.com';
        const endpoint = '/test-endpoint';
        const responseData = { success: true };

        mockAxios.onGet(`${baseURL}${endpoint}`).reply(200, responseData);

        const client = ApiKitClient.i('testClient');
        client.initialize(baseURL);

        const response = await client.get(endpoint);
        expect(response.data).toEqual(responseData);
    });

    it('should add Authorization header when useAuth is true', async () => {
        const baseURL = 'https://api.example.com';
        const endpoint = '/auth-endpoint';
        const authToken = 'test-token';
        const responseData = { authorized: true };

        mockAxios.onGet(`${baseURL}${endpoint}`).reply(200, responseData);

        const authTokenCallback = jest.fn(() => Promise.resolve(authToken));
        const client = ApiKitClient.i('authClient');
        client.initialize(baseURL, authTokenCallback, undefined, true);

        const response = await client.get(endpoint);

        expect(authTokenCallback).toHaveBeenCalled();
        expect(mockAxios.history.get[0].headers.Authorization).toBe(`Bearer ${authToken}`);
        expect(response.data).toEqual(responseData);
    });

    it('should call unauthorizedCallback on 401 response', async () => {
        const baseURL = 'https://api.example.com';
        const endpoint = '/unauthorized-endpoint';

        mockAxios.onGet(`${baseURL}${endpoint}`).reply(401);

        const unauthorizedCallback = jest.fn();
        const client = ApiKitClient.i('unauthorizedClient');
        client.initialize(baseURL, undefined, unauthorizedCallback);

        try {
            await client.get(endpoint);
        } catch (error) {
            // Ensure unauthorizedCallback is called
            expect(unauthorizedCallback).toHaveBeenCalled();
        }
    });
});
