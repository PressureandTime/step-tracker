# Step Counter Implementation

## Configuration

- **Android**: `ACTIVITY_RECOGNITION` permission in app.json
- **iOS**: `NSMotionUsageDescription` configured via expo-sensors plugin

## Implementation

- Uses `PermissionsAndroid` for Android permission requests
- Simple error handling
- Shows cumulative steps (not daily steps)

## Known Issues

- Shows cumulative steps since device boot, not daily steps
- No daily reset at midnight
- Requires physical device for testing
