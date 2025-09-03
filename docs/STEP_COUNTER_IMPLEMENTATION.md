# Step Counter Implementation

## Configuration

- **Android**: `ACTIVITY_RECOGNITION` permission in app.json
- **iOS**: `NSMotionUsageDescription` configured via expo-sensors plugin

## Implementation

- Uses `PermissionsAndroid` for Android permission requests
- AsyncStorage for step data persistence
- Daily step tracking with automatic reset
- Background app state handling
- Simple error handling

## Features

- ✅ Persists steps when app goes to background
- ✅ Daily step reset (new day = fresh start)
- ✅ Survives app restarts and device reboots
- ✅ Saves data periodically and on app background

## Known Limitations

- Requires physical device for testing
- Step counting accuracy depends on device sensors
- Background counting limited by OS restrictions
