import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  Image, 
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PhoneNumberScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigation = useNavigation();
  
    const handleSendSMS = () => {
      console.log('Sending SMS to:', phoneNumber);
      navigation.navigate('VerificationCode', { 
        phoneNumber: phoneNumber 
      });
    };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Image 
            source={require('./assets/close.png')}
            style={styles.closeIcon}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Введите номер телефона</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="+7XXXXXXXXXX"
            placeholderTextColor="#BDBDBD"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            selectionColor="#FF852D"
          />
          <View style={styles.underline} />
        </View>

        <TouchableOpacity 
          style={styles.bottomButton} 
          onPress={handleSendSMS}
        >
          <Text style={styles.buttonText}>Отправить СМС с кодом</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 27,
    padding: 10,
    zIndex: 1,
  },
  closeIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    marginTop: height * 0.2,
    width: 301,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 35,
    lineHeight: 36,
    textAlign: 'center',
    color: '#FF852D',
  },
  inputContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  input: {
    width: 301,
    fontSize: 20,
    textAlign: 'center',
    color: '#000000', 
    paddingBottom: 5,
    fontWeight: '400',
  },
  underline: {
    width: 154,
    height: 2,
    backgroundColor: '#FF852D',
    marginTop: 5,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 62,
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 20,
    color: 'white',
  },
});

export default PhoneNumberScreen;