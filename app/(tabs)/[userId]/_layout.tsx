import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: false, presentation: 'modal' }} />
    </Stack>
  );
}
