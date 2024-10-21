import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TabIcon = ({ icon, color, name, focused }: any) => {
  return (
    <View style={styles.iconContainer}>
      <Icon
        name={icon}
        color={focused ? color : 'gray'} // Changing color based on focus state
        size={focused ? 28 : 24} // Slightly larger when focused
      />
      <Text style={[styles.iconText, { color: focused ? color : 'gray' }]}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarLabel: 'Nuthook',
          headerTitle: 'Nuthook',
        }}
      >
        <Tabs.Screen
          name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='home'
                color={color}
                focused={focused}
                name='Home'
              />
            ),
          }}
        />

        <Tabs.Screen
          name='vehicles'
          options={{
            title: 'Vehicles',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon='truck'
                color={color}
                focused={focused}
                name='Vehicles'
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center', // Centers the icon and text horizontally
    justifyContent: 'center', // Centers vertically
  },
  iconText: {
    fontSize: 12, // Small text under the icon
    marginTop: 4, // Space between the icon and text
  },
});

export default TabsLayout;
