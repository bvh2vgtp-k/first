import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import { TouchableOpacity, Image } from 'react-native';

const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat': require('./assets/fonts/Montserrat-VariableFont_wght.ttf'), 
  });
};

const Start = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require("./assets/background.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image source={require("./assets/logo.png")} style={styles.logo} />
      </View>
      <View style={styles.container_1}>
        <View style={[styles.textContainer, { width: width - 62 }]}>
          <Text style={styles.description}>
            Хоумшеринг ANNI - это автоматизированная система аренды жилья посуточно, которая позволяет не тратить время на встречи с хозяевами и переплачивать посредникам. Теперь можно быстро снять квартиру и заехать тогда, когда удобно именно вам!
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, { width: width - 62 }]} 
          onPress={() => navigation.navigate("Login")} 
        >
          <Text style={styles.buttonText}>Вход и регистрация</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 111,
  },
  container: {
    alignItems: "center",
  },
  logo: {
    width: 153,
    height: 207.4064483642578,
  },
  container_1: {
    position: "absolute",
    bottom: 83,
    width: "90%",
    alignItems: "center",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  description: {
    fontFamily: "Montserrat",
    fontWeight: "400",
    fontSize: 12,
    lineHeight: 14.63,
    letterSpacing: 0,
    textAlign: "center",
    color: "#FFFFFF",
  },
  button: {
    backgroundColor: "#FF852D",
    height: 53,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: 'Montserrat',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18.29,
    letterSpacing: 0,
    textAlign: 'center',
    color: "#FFFFFF",
  },
});

export default Start;
