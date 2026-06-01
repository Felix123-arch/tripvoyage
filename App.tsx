import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ItineraryScreen, MapScreen, SavedScreen, ProfileScreen, GuidesScreen } from './src/screens';
import { colors, typography } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={tabStyles.item}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{emoji}</Text>
    </View>
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outline,
          borderTopWidth: 1,
          height: 56,
          paddingBottom: 4,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceMuted,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily,
          fontSize: typography.caption.fontSize,
          fontWeight: '500',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />, tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Itinerary"
        component={ItineraryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Itinerary" focused={focused} />, tabBarLabel: 'Itinerary' }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" label="Map" focused={focused} />, tabBarLabel: 'Map' }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔖" label="Saved" focused={focused} />, tabBarLabel: 'Saved' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />, tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="Guides" component={GuidesScreen} />
      </Stack.Navigator>
      <StatusBar style="dark" />
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  item: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
