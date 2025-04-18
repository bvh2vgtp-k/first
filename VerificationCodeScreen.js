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

const VerificationCodeScreen = ({ route }) => {
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const { phoneNumber } = route.params;

  const handleVerify = () => {
    console.log('Verifying code:', code);
    if (code === '1234') {
        navigation.navigate('MapScreen');
    }
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

        <Text style={styles.title}>Введите код</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="••••"
            placeholderTextColor="#BDBDBD"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
            maxLength={4}
            selectionColor="#FF852D"
          />
          <View style={styles.underline} />
        </View>

        <TouchableOpacity 
          style={styles.bottomButton} 
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>Продолжить</Text>
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
    marginTop: 169,
    fontFamily: 'Montserrat',
    fontWeight: '700',
    fontSize: 35,
    lineHeight: 42.67,
    textAlign: 'center',
    color: '#FF852D',
    width: '100%',
  },
  inputContainer: {
    position: 'absolute',
    top: 301,
    left: 0,
    right: 0,
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
    width: 92,
    height: 2,
    backgroundColor: '#FF852D',
    marginTop: 1,
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

export default VerificationCodeScreen;
