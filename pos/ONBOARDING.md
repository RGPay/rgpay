# Onboarding Flow - RGPAY POS

## Overview

The RGPAY POS onboarding system manages the initial registration of devices (terminals) and establishment configuration.

## File Structure

### API Layer (`/api`)

- `maquineta.ts` - Mocked API services for device registration

### Library Layer (`/lib`)

- `maquineta.ts` - Service that manages device registration and serial reading
- `auth.ts` - Authentication service and local persistence
- `AuthContext.tsx` - React context for managing authentication state
- `logger.ts` - Global logger configuration using react-native-logs

### Components

- `OnboardingWrapper.tsx` - Component that manages navigation flow based on registration state

### Screens

- `onboarding.tsx` - Initial onboarding screen
- `registro.tsx` - Device configuration screen
- `(tabs)/_layout.tsx` - Tab layout with custom header
- `(tabs)/index.tsx` - Home screen with device information
- `(tabs)/explore.tsx` - System features

## Onboarding Flow

### 1. Initial Verification

- App checks if a valid registration exists in AsyncStorage
- If not found, redirects to `/onboarding`
- If found and verified, redirects to `/(tabs)`

### 2. Onboarding Screen (`/onboarding`)

- Presents RGPAY with logo and slogan
- "Começar" button starts registration process
- Calls `deviceService.registerDevice()` which:
  - Reads device serial via `expo-device`
  - Makes POST to `/device/{serialId}/registrations`
  - Saves registration to AsyncStorage
  - Redirects to `/registro`

### 3. Registration Screen (`/registro`)

- Shows fields to configure:
  - Unit (required)
  - Restaurant Name (required)
  - Device Name (optional)
- Displays device serial
- "Confirmar" button calls `deviceService.verifyDevice()` which:
  - Makes PATCH to `/device/{serialId}/registrations/{id}` with `verified: true`
  - Updates registration in AsyncStorage
  - Redirects to `/(tabs)`

### 4. Home Screen (`/(tabs)`)

- Custom header shows unit name and RGPAY logo
- Displays configured device information
- Tabs for navigation between features

## Error Handling

### Registration Error

- If POST fails, shows error alert
- User can try again

### Verification Error

- If PATCH fails, shows error alert
- Remains on registration screen for retry
- Serial field can be manually edited if needed

## Mock API

The API is mocked with:

- Simulated delay to simulate network latency
- 10% random error chance
- In-memory storage of registrations
- Endpoints:
  - `POST /device/{serialId}/registrations`
  - `PATCH /device/{serialId}/registrations/{id}`
  - `GET /device/{serialId}/registrations`

## Logging

Using [react-native-logs](https://www.npmjs.com/package/react-native-logs) for comprehensive logging:

### Logger Configuration

- Development: Shows debug level and above
- Production: Shows error level only
- Colored console output
- Namespaced loggers for different parts of the app

### Loggers Available

- `authLog` - Authentication operations
- `deviceLog` - Device management
- `apiLog` - API calls
- `uiLog` - UI interactions

### Log Levels

- `debug` - Detailed debugging information
- `info` - General information
- `warn` - Warning messages
- `error` - Error messages

## Persistence

- AsyncStorage saves complete registration
- `verified: true` check determines if device is configured
- Storage cleanup on logout

## Dependencies

- `expo-device` - Device serial reading
- `@react-native-async-storage/async-storage` - Local persistence
- `react-native-logs` - Logging system
- `expo-router` - Screen navigation
- `react-native-reanimated` - Animations

## Code Standards

- **Code**: Written in English
- **User-facing text**: Portuguese
- **Comments**: English
- **Variable names**: English
- **Function names**: English

## Next Steps

1. Implement real API in backend
2. Add unique serial validation
3. Implement password recovery/reauth
4. Add unit tests
5. Implement offline synchronization
6. Add more comprehensive error handling
7. Implement analytics tracking
