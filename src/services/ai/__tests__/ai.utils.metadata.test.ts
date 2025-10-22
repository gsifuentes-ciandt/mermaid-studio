import { describe, it, expect } from 'vitest';
import {
  extractHttpMethod,
  extractEndpointPath,
  extractRequestPayloads,
  extractResponsePayloads,
  extractWorkflowActors,
  extractWorkflowTrigger,
} from '../ai.utils';
import * as responses from './fixtures/ai-responses';

describe('extractHttpMethod', () => {
  it('should extract POST method from endpoint response', () => {
    const result = extractHttpMethod(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toBe('POST');
  });

  it('should extract GET method', () => {
    const content = 'HTTP Method: GET';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('GET');
  });

  it('should extract PUT method', () => {
    const content = 'HTTP Method: PUT';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('PUT');
  });

  it('should extract PATCH method', () => {
    const content = 'HTTP Method: PATCH';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('PATCH');
  });

  it('should extract DELETE method', () => {
    const content = 'HTTP Method: DELETE';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('DELETE');
  });

  it('should return undefined when no method present', () => {
    const result = extractHttpMethod(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toBeUndefined();
  });

  it('should handle lowercase method', () => {
    const content = 'HTTP Method: post';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('POST');
  });

  it('should handle method with extra whitespace', () => {
    const content = 'HTTP Method:   POST  ';
    const result = extractHttpMethod(content);
    
    expect(result).toBe('POST');
  });
});

describe('extractEndpointPath', () => {
  it('should extract endpoint path from response', () => {
    const result = extractEndpointPath(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toBe('/auth/login');
  });

  it('should extract path with parameters', () => {
    const content = 'Endpoint Path: /api/users/{id}';
    const result = extractEndpointPath(content);
    
    expect(result).toBe('/api/users/{id}');
  });

  it('should extract path with query parameters', () => {
    const content = 'Endpoint Path: /api/products?category=electronics';
    const result = extractEndpointPath(content);
    
    expect(result).toBe('/api/products?category=electronics');
  });

  it('should return undefined when no path present', () => {
    const result = extractEndpointPath(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toBeUndefined();
  });

  it('should handle path with version', () => {
    const content = 'Endpoint Path: /api/v2/users';
    const result = extractEndpointPath(content);
    
    expect(result).toBe('/api/v2/users');
  });
});

describe('extractRequestPayloads', () => {
  it('should extract request payload from endpoint response', () => {
    const result = extractRequestPayloads(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      status: 'Request Body',
      contentType: 'application/json',
    });
    expect(result[0].json).toContain('"email"');
    expect(result[0].json).toContain('"password"');
  });

  it('should extract multiple request payloads', () => {
    const content = `Request Payload:
- Status: Request Body
- Content-Type: application/json
- JSON Example:
\`\`\`json
{"test": 1}
\`\`\`

Request Payload:
- Status: Alternative Format
- Content-Type: application/xml
- JSON Example:
\`\`\`json
{"test": 2}
\`\`\``;
    
    const result = extractRequestPayloads(content);
    
    expect(result).toHaveLength(2);
    expect(result[0].status).toBe('Request Body');
    expect(result[1].status).toBe('Alternative Format');
  });

  it('should return empty array when no request payloads', () => {
    const result = extractRequestPayloads(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toEqual([]);
  });

  it('should handle payload without JSON example', () => {
    const content = `Request Payload:
- Status: Request Body
- Content-Type: application/json`;
    
    const result = extractRequestPayloads(content);
    
    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('');
  });
});

describe('extractResponsePayloads', () => {
  it('should extract multiple response payloads from endpoint response', () => {
    const result = extractResponsePayloads(responses.AI_RESPONSE_VALID_ENDPOINT);
    
    expect(result).toHaveLength(3);
    
    // Check 200 response
    const success = result.find(p => p.status === '200');
    expect(success).toBeDefined();
    expect(success?.contentType).toBe('application/json');
    expect(success?.json).toContain('"success"');
    expect(success?.json).toContain('"token"');
    
    // Check 400 response
    const badRequest = result.find(p => p.status === '400');
    expect(badRequest).toBeDefined();
    expect(badRequest?.json).toContain('"error"');
    
    // Check 401 response
    const unauthorized = result.find(p => p.status === '401');
    expect(unauthorized).toBeDefined();
    expect(unauthorized?.json).toContain('Invalid credentials');
  });

  it('should return empty array when no response payloads', () => {
    const result = extractResponsePayloads(responses.AI_RESPONSE_EXPLANATION_ONLY);
    
    expect(result).toEqual([]);
  });

  it('should handle various status codes', () => {
    const content = `Response Payload (201):
- Status: 201
- Content-Type: application/json
- JSON Example:
\`\`\`json
{"created": true}
\`\`\`

Response Payload (404):
- Status: 404
- Content-Type: application/json
- JSON Example:
\`\`\`json
{"error": "Not found"}
\`\`\`

Response Payload (500):
- Status: 500
- Content-Type: application/json
- JSON Example:
\`\`\`json
{"error": "Server error"}
\`\`\``;
    
    const result = extractResponsePayloads(content);
    
    expect(result).toHaveLength(3);
    expect(result.map(p => p.status)).toEqual(['201', '404', '500']);
  });

  it('should handle response without JSON example', () => {
    const content = `Response Payload (204):
- Status: 204
- Content-Type: application/json`;
    
    const result = extractResponsePayloads(content);
    
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe('204');
    expect(result[0].json).toBe('');
  });
});

describe('extractWorkflowActors', () => {
  it('should extract workflow actors from response', () => {
    const result = extractWorkflowActors(responses.AI_RESPONSE_WORKFLOW_WITH_ACTORS);
    
    expect(result).toBe('Patient, Front Desk Staff, Insurance Verification System, Registration System');
  });

  it('should return undefined when no actors present', () => {
    const result = extractWorkflowActors(responses.AI_RESPONSE_VALID_WORKFLOW);
    
    expect(result).toBeUndefined();
  });

  it('should handle actors with special characters', () => {
    const content = 'Workflow Actors: User (Customer), Admin, System/Database';
    const result = extractWorkflowActors(content);
    
    expect(result).toBe('User (Customer), Admin, System/Database');
  });

  it('should trim whitespace from actors', () => {
    const content = 'Workflow Actors:   User,  Admin,  System  ';
    const result = extractWorkflowActors(content);
    
    expect(result).toBe('User,  Admin,  System');
  });

  it('should extract actors with "Endpoint Actors" prefix as fallback', () => {
    const content = 'Endpoint Actors: User, Cart Service, Payment Gateway';
    const result = extractWorkflowActors(content);
    
    expect(result).toBe('User, Cart Service, Payment Gateway');
  });
});

describe('extractWorkflowTrigger', () => {
  it('should extract workflow trigger from response', () => {
    const result = extractWorkflowTrigger(responses.AI_RESPONSE_WORKFLOW_WITH_ACTORS);
    
    expect(result).toBe('Patient arrival at facility');
  });

  it('should return undefined when no trigger present', () => {
    const result = extractWorkflowTrigger(responses.AI_RESPONSE_VALID_WORKFLOW);
    
    expect(result).toBeUndefined();
  });

  it('should handle trigger with special characters', () => {
    const content = 'Workflow Trigger: User clicks "Submit Order" button';
    const result = extractWorkflowTrigger(content);
    
    expect(result).toBe('User clicks "Submit Order" button');
  });

  it('should handle multi-word trigger', () => {
    const content = 'Workflow Trigger: Scheduled daily batch process at midnight';
    const result = extractWorkflowTrigger(content);
    
    expect(result).toBe('Scheduled daily batch process at midnight');
  });

  it('should extract trigger with "Endpoint Trigger" prefix as fallback', () => {
    const content = 'Endpoint Trigger: User sends checkout initiation request via frontend';
    const result = extractWorkflowTrigger(content);
    
    expect(result).toBe('User sends checkout initiation request via frontend');
  });
});
