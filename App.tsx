import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Library as LibraryIcon } from 'lucide-react-native';

// Telas
import { Home } from './src/screens/Home';
import { Library } from './src/screens/Library';
import { Details } from './src/screens/Details';
import { Player } from './src/screens/Player';

// Contexto e Componentes Globais
import { AudioProvider } from './src/context/AudioContext';
import { MiniPlayer } from './src/components/MiniPlayer';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { 
            backgroundColor: '#121214', 
            borderTopWidth: 0, 
            height: 60, 
            paddingBottom: 8 
          },
          tabBarActiveTintColor: '#A855F7',
          tabBarInactiveTintColor: '#71717A',
        }}
      >
        <Tab.Screen 
          name="Início" 
          component={Home} 
          options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} size={24} /> }}
        />
        <Tab.Screen 
          name="Biblioteca" 
          component={Library} 
          options={{ tabBarIcon: ({ color }) => <LibraryIcon color={color} size={24} /> }}
        />
      </Tab.Navigator>

      {/* O MiniPlayer inserido aqui aparece apenas nas telas das Tabs */}
      <MiniPlayer />
    </View>
  );
}

export default function App() {
  return (
    // O Provider envolve TODO o app para gerenciar o som globalmente
    <AudioProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabRoutes} />
          
          <Stack.Screen 
            name="Details" 
            component={Details} 
            options={{ 
              headerShown: true, 
              headerStyle: { backgroundColor: '#09090B' }, 
              headerTintColor: '#FFF',
              title: 'Detalhes'
            }} 
          />
          
          <Stack.Screen 
            name="Player" 
            component={Player} 
            options={{ 
              animation: 'slide_from_bottom',
              gestureEnabled: true // Permite fechar arrastando para baixo
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AudioProvider>
  );
}