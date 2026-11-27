import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabIcon } from '../../components/TabIcon';
import { useUser } from '../../context/UserContext';
import { colors, radius, spacing } from '../../theme';

export default function TabsLayout() {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 62,
          paddingTop: 0,
          paddingBottom: 0,
          marginHorizontal: spacing.md,
          marginBottom: Math.max(insets.bottom, spacing.md),
          borderTopWidth: 0,
          borderRadius: radius.pill,
          backgroundColor: colors.primary,
        },
        tabBarItemStyle: { justifyContent: 'center' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="chat" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="user" focused={focused} /> }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} /> }}
      />
    </Tabs>
  );
}
