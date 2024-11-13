import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Button, Icon, IconButton, Snackbar } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'New Notification',
    body: 'You have a new message!',
    data: { someData: 'Additional information here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError(
        'Permission not granted to get push token for push notification!',
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError('Must use physical device for push notifications');
  }
}

export default function Home() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
        setIsSnackbarVisible(true);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  const { logout } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#1F2937' : '#F3F4F6',
    },
    button: {
      backgroundColor: isDarkMode ? '#3B82F6' : '#2563EB',
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      elevation: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalView: {
      margin: 20,
      backgroundColor: isDarkMode ? '#374151' : 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
      color: isDarkMode ? '#FFFFFF' : '#1F2937',
    },
    closeButton: {
      backgroundColor: isDarkMode ? '#EF4444' : '#DC2626',
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    closeButtonText: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <Button
          buttonColor={isDarkMode ? '#3B82F6' : '#2563EB'}
          textColor='#FFFFFF'
          icon={'bell'}
          mode='elevated'
          onPress={async () => {
            await sendPushNotification(expoPushToken);
          }}
        >
          Send Notification
        </Button>
        <View style={{ padding: 10 }}></View>
        <Button
          buttonColor={isDarkMode ? '#3B82F6' : '#2563EB'}
          textColor='#FFFFFF'
          icon={'logout'}
          mode='contained'
          onPress={() => {
            logout;
            router.replace('/(auth)/login');
          }}
        >
          Logout
        </Button>
        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={() => setIsSnackbarVisible(false)}
          action={{
            label: 'View',
            onPress: () => {
              setIsModalVisible(true);
              setIsSnackbarVisible(false);
            },
          }}
        >
          You have a new notification
        </Snackbar>
        <Modal
          animationType='slide'
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Notification Details</Text>
            <Text style={styles.modalText}>
              Title: {notification?.request.content.title}
            </Text>
            <Text style={styles.modalText}>
              Body: {notification?.request.content.body}
            </Text>
            <Text style={styles.modalText}>
              Data: {JSON.stringify(notification?.request.content.data)}
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ThemeProvider>
  );
}
