import React from 'react';
import { StyleSheet, View, useColorScheme, Dimensions } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

// src/screens/VehicleDetailScreen.tsx

const VehicleDetailScreen = () => {
  const params = useLocalSearchParams();
  const vehicle = JSON.parse(params.vehicle as string);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const theme = useTheme();

  // Generate random coordinates within a reasonable range
  const randomCoordinates = {
    latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
    longitude: -74.006 + (Math.random() - 0.5) * 0.1,
  };

  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.darkContainer : styles.lightContainer,
      ]}
    >
      <MapView
        style={styles.map}
        initialRegion={{
          ...randomCoordinates,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        customMapStyle={isDarkMode ? darkMapStyle : []}
      >
        <Marker coordinate={randomCoordinates}>
          <Icon
            name={vehicle.icon}
            size={30}
            color={isDarkMode ? '#fff' : '#374151'}
          />
        </Marker>
      </MapView>

      <Surface
        style={[
          styles.infoCard,
          isDarkMode ? styles.darkCard : styles.lightCard,
        ]}
      >
        <View style={styles.cardContent}>
          <View
            style={[
              styles.iconContainer,
              isDarkMode ? styles.darkIconContainer : styles.lightIconContainer,
            ]}
          >
            <Icon
              name={vehicle.icon}
              size={34}
              color={isDarkMode ? '#fff' : '#374151'}
            />
            <View
              style={[
                styles.statusIconContainer,
                isDarkMode
                  ? styles.darkStatusIconContainer
                  : styles.lightStatusIconContainer,
              ]}
            >
              {vehicle.status === 'active' && (
                <Icon
                  name='navigation-variant-outline'
                  size={15}
                  color='#4CAF50'
                />
              )}
              {vehicle.status === 'inactive' && (
                <Ionicons
                  name='cloud-offline-outline'
                  size={15}
                  color='#F44336'
                />
              )}
              {vehicle.status === 'warning' && (
                <AntDesign name='minuscircleo' size={15} color='#FFC107' />
              )}
            </View>
          </View>

          <View style={styles.textContainer}>
            <Text
              style={[
                styles.title,
                isDarkMode ? styles.darkText : styles.lightText,
              ]}
            >
              {vehicle.title}
            </Text>
            <Text
              style={[
                styles.weight,
                isDarkMode ? styles.darkSubText : styles.lightSubText,
              ]}
            >
              {vehicle.weight}
            </Text>
            <Text
              style={[
                styles.coordinates,
                isDarkMode ? styles.darkSubText : styles.lightSubText,
              ]}
            >
              {`${randomCoordinates.latitude.toFixed(6)}, ${randomCoordinates.longitude.toFixed(6)}`}
            </Text>
            {vehicle.lastSeen && (
              <Text style={styles.lastSeen}>{vehicle.lastSeen}</Text>
            )}
          </View>

          {vehicle.hasNotification && (
            <View style={styles.notificationContainer}>
              <Icon name='bell-ring-outline' size={20} color='#FFC107' />
            </View>
          )}
        </View>
      </Surface>
    </View>
  );
};

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#1F2937',
  },
  lightContainer: {
    backgroundColor: '#F3F4F6',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 4,
  },
  darkCard: {
    backgroundColor: '#374151',
  },
  lightCard: {
    backgroundColor: '#FFFFFF',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 78,
    height: 78,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  darkIconContainer: {
    backgroundColor: '#4B5563',
  },
  lightIconContainer: {
    backgroundColor: '#E5E7EB',
  },
  statusIconContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    borderRadius: 6,
    padding: 2,
  },
  darkStatusIconContainer: {
    backgroundColor: '#374151',
  },
  lightStatusIconContainer: {
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkText: {
    color: '#FFFFFF',
  },
  lightText: {
    color: '#1F2937',
  },
  weight: {
    fontSize: 14,
    marginVertical: 4,
  },
  coordinates: {
    fontSize: 14,
  },
  darkSubText: {
    color: '#9CA3AF',
  },
  lightSubText: {
    color: '#6B7280',
  },
  lastSeen: {
    fontSize: 12,
    color: '#D97706',
    marginTop: 4,
  },
  notificationContainer: {
    marginLeft: 10,
  },
});

export default VehicleDetailScreen;
