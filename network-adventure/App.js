import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Silkscreen_700Bold } from '@expo-google-fonts/silkscreen';

import TabBar from './src/components/TabBar';
import SplashScreen from './src/screens/SplashScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import { LoginScreen, SignUpScreen } from './src/screens/AuthScreens';
import DashboardScreen from './src/screens/DashboardScreen';
import MapScreen from './src/screens/MapScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LabScreen from './src/screens/LabScreen';
import MissionBriefingScreen from './src/screens/MissionBriefingScreen';
import MicroLessonScreen from './src/screens/MicroLessonScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator tabBar={props => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Lab" component={LabScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Silkscreen_700Bold });
  if (!loaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Main" component={Tabs} />
        <Stack.Screen name="MissionBriefing" component={MissionBriefingScreen} />
        <Stack.Screen name="MicroLesson" component={MicroLessonScreen} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} />
        <Stack.Screen name="Quiz" component={QuizScreen} />
        <Stack.Screen name="ResultScreen" component={ResultScreen} />
        <Stack.Screen name="Lab" component={LabScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}