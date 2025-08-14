# Environment Configuration

## Development Setup

Create a `.env.local` file in the project root with the following variables:

```bash
# Environment Configuration
NODE_ENV=development

# Application
VITE_APP_NAME=Papawis
VITE_APP_VERSION=1.0.0

# API Configuration (will be used in later phases)
VITE_API_BASE_URL=http://localhost:3001
VITE_API_TIMEOUT=10000

# Authentication (will be used in later phases)
VITE_JWT_SECRET=your-jwt-secret-here
VITE_SESSION_TIMEOUT=3600000

# External Services (will be used in later phases)
VITE_STORAGE_BUCKET=your-storage-bucket
VITE_EMAIL_SERVICE_API_KEY=your-email-api-key
VITE_SMS_SERVICE_API_KEY=your-sms-api-key

# Development
VITE_DEBUG=true
VITE_MOCK_API=true
```

## Environment-Specific Configurations

### Development (`.env.local`)

- Use mock API endpoints
- Enable debug logging
- Local development servers

### Staging (`.env.staging`)

- Connect to staging API
- Reduced logging
- Test data

### Production (`.env.production`)

- Production API endpoints
- Error logging only
- Real data and services

## Usage in Code

Access environment variables using:

```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG === "true";
```
