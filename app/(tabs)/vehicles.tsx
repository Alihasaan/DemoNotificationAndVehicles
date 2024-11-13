import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  StatusBar,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

type ItemData = {
  id: string;
  title: string;
  weight: string;
  icon: string;
  status: 'active' | 'inactive' | 'warning';
  lastSeen?: string;
  hasNotification: boolean;
};

const DATA: ItemData[] = [
  {
    id: '1',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'truck',
    status: 'active',
    hasNotification: false,
  },
  {
    id: '2',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'truck',
    status: 'active',
    hasNotification: true,
  },
  {
    id: '3',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'excavator',
    status: 'warning',
    lastSeen: 'Last seen 3 hours ago',
    hasNotification: true,
  },
  {
    id: '4',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'truck',
    status: 'inactive',
    hasNotification: false,
  },
  {
    id: '5',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'truck',
    status: 'active',
    hasNotification: true,
  },
  {
    id: '6',
    title: 'S0783WS SOBRE SERATI',
    weight: '100 T',
    icon: 'truck',
    status: 'inactive',
    lastSeen: 'No data',
    hasNotification: false,
  },
];

const ListItem: React.FC<{
  item: ItemData;
  isDarkMode: boolean;
  onPress: () => void;
}> = ({ item, isDarkMode, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={[styles.item, isDarkMode ? styles.darkItem : styles.lightItem]}
    >
      <View
        style={[
          styles.iconContainer,
          isDarkMode ? styles.darkIconContainer : styles.lightIconContainer,
        ]}
      >
        <Icon
          name={item.icon}
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
          {item.status === 'active' && (
            <Icon name='navigation-variant-outline' size={15} color='#4CAF50' />
          )}
          {item.status === 'inactive' && (
            <Ionicons name='cloud-offline-outline' size={15} color='#F44336' />
          )}
          {item.status === 'warning' && (
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
          {item.title}
        </Text>
        <Text
          style={[
            styles.weight,
            isDarkMode ? styles.darkSubText : styles.lightSubText,
          ]}
        >
          {item.weight}
        </Text>
        {item.lastSeen && <Text style={styles.lastSeen}>{item.lastSeen}</Text>}
      </View>
      <View style={styles.rightContainer}>
        {item.hasNotification && (
          <View style={styles.notificationContainer}>
            <Icon name='bell-ring-outline' size={20} color='#FFC107' />
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const Vehicles = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const router = useRouter();

  const handleVehiclePress = (vehicle: ItemData) => {
    router.push({
      pathname: '/screens/vehicleMapView',
      params: { id: vehicle.id, vehicle: JSON.stringify(vehicle) },
    });
  };

  return (
    <SafeAreaView
      style={[isDarkMode ? styles.darkContainer : styles.lightContainer]}
    >
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        data={DATA}
        renderItem={({ item }) => (
          <ListItem
            item={item}
            isDarkMode={isDarkMode}
            onPress={() => handleVehiclePress(item)}
          />
        )}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Vehicles;

const styles = StyleSheet.create({
  darkContainer: {
    backgroundColor: '#1F2937',
    flex: 1,
  },
  lightContainer: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  darkItem: {
    backgroundColor: '#374151',
  },
  lightItem: {
    backgroundColor: '#FFFFFF',
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
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationContainer: {
    marginRight: 10,
    marginTop: -50,
  },
});
