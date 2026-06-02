import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ItineraryScreen, MapScreen, SavedScreen, ProfileScreen, GuidesScreen, LoginScreen, RegisterScreen, QuestionnaireScreen, DestinationDetailScreen } from './src/screens';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { LanguageProvider, useLang } from './src/contexts/LanguageContext';
import { colors, typography } from './src/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return (
    <View style={tabStyles.item}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconActive]}>{emoji}</Text>
    </View>
  );
}

function HomeTabs() {
  const { t } = useLang();
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
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />, tabBarLabel: t('home') }} />
      <Tab.Screen name="Itinerary" component={ItineraryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" focused={focused} />, tabBarLabel: t('itinerary') }} />
      <Tab.Screen name="Map" component={MapScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🗺️" focused={focused} />, tabBarLabel: t('map') }} />
      <Tab.Screen name="Saved" component={SavedScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔖" focused={focused} />, tabBarLabel: t('saved') }} />
      <Tab.Screen name="Profile" component={ProfileScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />, tabBarLabel: t('profile') }} />
    </Tab.Navigator>
  );
}

function AuthGate() {
  const { isAuthenticated, isLoading, isGuest } = useAuth();

  if (isLoading) {
    return (
      <View style={[tabStyles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Authenticated users & guests see the main app
  // Only unauthenticated non-guests see the login screen
  const showMain = isAuthenticated || isGuest;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showMain ? (
        <>
          <Stack.Screen name="Main" component={HomeTabs} />
          <Stack.Screen name="Guides" component={GuidesScreen} />
          <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
          <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Main" component={HomeTabs} />
          <Stack.Screen name="Guides" component={GuidesScreen} />
          <Stack.Screen name="Questionnaire" component={QuestionnaireScreen} />
          <Stack.Screen name="DestinationDetail" component={DestinationDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AuthGate />
          <StatusBar style="dark" />
        </NavigationContainer>
      </LanguageProvider>
    </AuthProvider>
  );
}

const tabStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 22, opacity: 0.5 },
  iconActive: { opacity: 1 },
});
