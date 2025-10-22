# AI Services Test Suite

Comprehensive test coverage for the AI Assistant modules including code extraction, metadata parsing, sanitization, and validation.

## Test Structure

```
__tests__/
├── fixtures/
│   ├── valid-diagrams.ts       # Valid Mermaid diagram samples
│   ├── invalid-diagrams.ts     # Invalid diagram samples for error testing
│   └── ai-responses.ts         # Sample AI API responses
├── ai.utils.extraction.test.ts # Code and metadata extraction tests
├── ai.utils.metadata.test.ts   # Endpoint/workflow metadata extraction tests
├── ai.utils.sanitization.test.ts # Code sanitization tests
├── ai.utils.validation.test.ts # Mermaid syntax validation tests
└── README.md                   # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test ai.utils.extraction
```

### Run specific test suite
```bash
npm test -- --grep "extractMermaidCode"
```

## Test Coverage

### Code Extraction (`ai.utils.extraction.test.ts`)
- ✅ Extract Mermaid code from code blocks with language specifier
- ✅ Extract code from responses with multiple JSON blocks
- ✅ Reject markdown separators (`---`)
- ✅ Reject JSON code blocks
- ✅ Reject explanation-only responses
- ✅ Handle code blocks without language specifier
- ✅ Handle mixed case language specifiers
- ✅ Handle direction on separate line
- ✅ Extract title, description, and diagram type

**Total: 30+ test cases**

### Metadata Extraction (`ai.utils.metadata.test.ts`)
- ✅ Extract HTTP methods (GET, POST, PUT, PATCH, DELETE)
- ✅ Extract endpoint paths with parameters
- ✅ Extract request payloads with JSON examples
- ✅ Extract multiple response payloads (200, 400, 401, etc.)
- ✅ Extract workflow actors
- ✅ Extract workflow triggers
- ✅ Handle missing metadata gracefully

**Total: 25+ test cases**

### Code Sanitization (`ai.utils.sanitization.test.ts`)
- ✅ Remove HTML tags (`<br/>`, `<b>`, `<i>`)
- ✅ Remove special characters from labels (parentheses, quotes, brackets)
- ✅ Replace reserved keywords (end, else, alt, loop)
- ✅ Fix reverse arrows (`<--` to `-->`)
- ✅ Normalize whitespace
- ✅ Fix mixed node shapes
- ✅ Handle empty strings and edge cases

**Total: 30+ test cases**

### Syntax Validation (`ai.utils.validation.test.ts`)
- ✅ Validate all diagram types (workflow, sequence, state, architecture, etc.)
- ✅ Reject invalid syntax (missing arrows, unclosed brackets, wrong keywords)
- ✅ Reject YAML front-matter
- ✅ Reject empty diagrams
- ✅ Handle diagrams with comments
- ✅ Handle diagrams with styling
- ✅ Handle diagrams with subgraphs
- ✅ Performance test for large diagrams

**Total: 25+ test cases**

## Test Fixtures

### Valid Diagrams (`fixtures/valid-diagrams.ts`)
- Workflow diagrams
- Sequence diagrams
- State machines
- Architecture diagrams
- Endpoint diagrams
- Class diagrams
- ER diagrams
- Gantt charts

### Invalid Diagrams (`fixtures/invalid-diagrams.ts`)
- Syntax errors (missing arrows, unclosed brackets)
- Wrong keywords
- YAML front-matter
- HTML tags
- Reverse arrows
- Reserved keywords
- Mixed node shapes
- Empty/whitespace-only content

### AI Responses (`fixtures/ai-responses.ts`)
- Valid workflow responses
- Valid endpoint responses with payloads
- Explanation-only responses
- Responses with markdown separators
- Responses with multiple code blocks
- Responses with workflow actors/triggers
- Empty responses

## Coverage Goals

| Module | Target Coverage | Current Status |
|--------|----------------|----------------|
| Code Extraction | 90%+ | ✅ Implemented |
| Metadata Extraction | 85%+ | ✅ Implemented |
| Code Sanitization | 95%+ | ✅ Implemented |
| Syntax Validation | 80%+ | ✅ Implemented |

## Adding New Tests

### 1. Add test fixtures
```typescript
// fixtures/ai-responses.ts
export const AI_RESPONSE_NEW_FEATURE = `...`;
```

### 2. Write test cases
```typescript
// ai.utils.extraction.test.ts
describe('New Feature', () => {
  it('should handle new feature', () => {
    const result = extractMermaidCode(AI_RESPONSE_NEW_FEATURE);
    expect(result).toContain('expected output');
  });
});
```

### 3. Run tests
```bash
npm test
```

## Common Test Patterns

### Testing extraction
```typescript
it('should extract X from response', () => {
  const result = extractX(sampleResponse);
  expect(result).toBe('expected value');
});
```

### Testing rejection
```typescript
it('should reject invalid input', () => {
  const result = extractX(invalidInput);
  expect(result).toBeUndefined();
  // or
  expect(result).toBe('');
  // or
  expect(result).toEqual([]);
});
```

### Testing sanitization
```typescript
it('should remove/replace X', () => {
  const code = 'input with X';
  const result = sanitizeMermaidCode(code);
  expect(result).not.toContain('X');
  expect(result).toContain('sanitized output');
});
```

### Testing validation
```typescript
it('should validate valid diagram', async () => {
  const result = await validateMermaidSyntax(validDiagram);
  expect(result.isValid).toBe(true);
  expect(result.error).toBeUndefined();
});

it('should reject invalid diagram', async () => {
  const result = await validateMermaidSyntax(invalidDiagram);
  expect(result.isValid).toBe(false);
  expect(result.error).toBeDefined();
});
```

## Debugging Tests

### Enable verbose output
```bash
npm test -- --reporter=verbose
```

### Run single test
```bash
npm test -- --grep "specific test name"
```

### Debug in VS Code
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Vitest",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test:watch"],
  "console": "integratedTerminal"
}
```

## Best Practices

1. **Test one thing at a time** - Each test should verify a single behavior
2. **Use descriptive names** - Test names should clearly state what is being tested
3. **Arrange-Act-Assert** - Structure tests with setup, execution, and verification
4. **Use fixtures** - Reuse test data from fixtures instead of inline strings
5. **Test edge cases** - Include tests for empty strings, null, undefined, etc.
6. **Test error paths** - Verify error handling and rejection cases
7. **Keep tests fast** - Mock external dependencies, avoid real API calls
8. **Maintain independence** - Tests should not depend on each other

## Continuous Integration

Tests run automatically on:
- Every commit (pre-commit hook)
- Pull requests
- Main branch merges

CI will fail if:
- Any test fails
- Coverage drops below threshold
- Linting errors exist

## Troubleshooting

### Tests fail locally but pass in CI
- Check Node.js version (should match CI)
- Clear node_modules and reinstall
- Check for environment-specific issues

### Tests are slow
- Use `--bail` to stop on first failure
- Run specific test files instead of all
- Check for unnecessary async operations

### Coverage not updating
- Run `npm run test:coverage` to regenerate
- Clear coverage cache: `rm -rf coverage`

## Future Improvements

- [ ] Add integration tests for full AI flow
- [ ] Add performance benchmarks
- [ ] Add visual regression tests for rendered diagrams
- [ ] Add E2E tests for user interactions
- [ ] Add mutation testing
- [ ] Add property-based testing for edge cases

## Contributing

When adding new features to AI services:
1. Write tests first (TDD approach)
2. Ensure all tests pass
3. Maintain coverage above 85%
4. Update this README if adding new test files
5. Add fixtures for new response formats

## Questions?

For questions about tests, contact the development team or create an issue in the repository.
