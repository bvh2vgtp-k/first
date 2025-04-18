import { StyleSheet } from 'react-native';
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import GuestModal from './GuestSelectorModal';

const BookingScreen = ({ route }) => {
  const navigation = useNavigation();
  const {
    apartmentId,
    startDate,
    endDate,
    guestCount: initialGuestCount,
    totalPrice,
    title,
    address,
    hasSelectedGuests: initialSelectedGuests,
    guestText: initialSelectedText
  } = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [guestCount, setGuestCount] = useState(initialGuestCount);
  const [comment, setComment] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const displayStartDate = moment(startDate).format("D MMM");
  const displayEndDate = moment(endDate).format("D MMM");
  const numberOfNights = moment(endDate).diff(moment(startDate), "days");
  const scrollViewRef = useRef(null);

  
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [guestText, setGuestText] = useState(initialSelectedText);
  const [hasSelectedGuests, setHasSelectedGuests] = useState(initialSelectedGuests);

  const handleConfirm = () => {
    const totalGuests = count1 + count2 + count3;
    let textParts = [];
    
    if (count1 > 0) textParts.push(`${count1} взросл${count1 === 1 ? "ый" : "ых"}`);
    if (count2 > 0) textParts.push(`${count2} питом${count2 === 1 ? "ец" : "цев"}`);
    if (count3 > 0) textParts.push(`${count3} ребён${count3 === 1 ? "ок" : count3 < 5 ? "ка" : "ок"}`);

    setGuestText(textParts.join(" + "));
    setGuestCount(totalGuests);
    setHasSelectedGuests(totalGuests > 0);
    setModalVisible(false);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  
  const handlePayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentModalVisible(false);
      navigation.navigate("MainScreen");
    }, 2000);
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.selectedDatesSection}>
            <Text style={styles.sectionTitle}>{title || "г. Тюмень, Мельникайте, д. 70"}</Text>
            
            <View style={styles.dateRange}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{displayStartDate}</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeTextValue}>00:50</Text>
                </View>
              </View>

              <View style={styles.centerContent}>
                <Image
                  source={require("./assets/dots.png")}
                  style={styles.separatorImage}
                />
                <Text style={styles.nightsText}>
                  {numberOfNights} {numberOfNights > 4 ? "ночей" : "ночи"}
                </Text>
              </View>

              <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{displayEndDate}</Text>
                <View style={styles.timeBox}>
                  <Text style={styles.timeTextValue}>00:50</Text>
                </View>
              </View>
            </View>

            <View style={styles.textColumn}>
              <Text style={styles.InOutText}>Заезд</Text>
              <Text style={styles.dateSubText}>
                {moment(startDate).format("D MMMM YYYY")} в 0:50
              </Text>
              <Text style={styles.InOutText}>Выезд</Text>
              <Text style={styles.dateSubText}>
                {moment(endDate).format("D MMMM YYYY")} в 0:50
              </Text>
            </View>
          </View>

          <View style={styles.warningContainer}>
            <Text style={styles.warningContainerTitle}>Обратите внимание:</Text>
            <Text style={styles.warningContainerMainText}>
              По договору аренды действует тариф «Всё включено»
            </Text>
            <Text style={styles.warningContainerMainText}>
              Контакты поддержки: 8(800)000-00-00 | @support
            </Text>
          </View>

          <View style={styles.warningContainer}>
            <Text style={styles.warningContainerTitle}>Комментарий</Text>
            <TextInput
              style={styles.input}
              placeholder="Ваши пожелания..."
              multiline
              value={comment}
              onChangeText={setComment}
            />
          </View>

          <View style={styles.guestSection}>
            <Text style={styles.guestText}>
              {hasSelectedGuests ? guestText : "Укажите количество гостей"}
            </Text>
            <TouchableOpacity 
              style={styles.addGuestButton} 
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.addGuestText}>
                + Добавить
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {!keyboardVisible && (
        <View style={styles.fixedContainer}>
          <Text style={styles.fixedContainerText}>К оплате {totalPrice}₽</Text>
          <View style={styles.rowContainer}>
            <Text style={styles.fixedContainerMainText}>Нажимая «Оплатить»,</Text>
            <TouchableOpacity 
              style={styles.payButton} 
              onPress={() => setPaymentModalVisible(true)}
            >
              <Text style={styles.payButtonText}>Оплатить</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.fixedContainerMainText}>
            вы принимаете условия:{" "}
          </Text>
          <Link href="/details" style={styles.Link}>
            <Text>Договора аренды</Text>
          </Link>
          <Link href="/details" style={styles.Link}>
            <Text>Согласие на сохранение данных</Text>
          </Link>
        </View>
      )}

      <GuestModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        count1={count1}
        setCount1={setCount1}
        count2={count2}
        setCount2={setCount2}
        count3={count3}
        setCount3={setCount3}
        handleConfirm={handleConfirm}
      />

      <Modal
        visible={paymentModalVisible}
        onRequestClose={() => setPaymentModalVisible(false)}
        transparent
      >
        <View style={styles.centeredView}>
          <View style={styles.modalOverlay} />
          <View style={styles.modalView}>
            <View style={styles.tinkoffLogoContainer}>
              <Image
                source={require("./assets/tinfoff.png")}
                style={styles.tinkoffLogo}
              />
            </View>
            {!paymentSuccess ? (
              <>
                <Text style={styles.paymentLabel}>К оплате</Text>
                <Text style={styles.paymentAmount}>{totalPrice}₽</Text>
                <TouchableOpacity 
                  style={styles.payWithCardButton} 
                  onPress={handlePayment}
                >
                  <Text style={styles.payWithCardText}>Оплатить картой</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.paymentSuccessText}>Оплата прошла</Text>
                <Text style={styles.paymentSuccessTitle}>Успешно!</Text>
                <Icon name="check-circle" size={60} color="#4CAF50" />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  mainContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  selectedDatesSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 9,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 0,
    textAlign: "left",
  },
  dateRange: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateContainer: {
    alignItems: "center",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  timeBox: {
    backgroundColor: "#FAF0E6",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginTop: 14,
  },
  timeTextValue: {
    fontSize: 14,
    color: "#777",
  },
  separatorImage: {
    width: 170,
    height: 60,
    resizeMode: "contain",
    marginTop: -1,
  },
  nightsText: {
    fontSize: 16,
    color: "#777",
    textAlign: "center",
  },
  guestSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  guestText: {
    fontSize: 16,
    color: "#333",
  },
  addGuestButton: {
    backgroundColor: "transparent",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addGuestText: {
    color: "rgb(230, 147, 51)",
    fontWeight: "bold",
  },
  InOutText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginTop: 4,
  },
  textColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  dateSubText: {
    fontSize: 14,
  },
  warningContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 9,
  },
  warningContainerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  warningContainerMainText: {
    fontSize: 15,
    paddingTop: 10,
  },
  input: {
    height: 100,
    width: "100%",
    backgroundColor: "#F6F6F8",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#333",
    borderWidth: 0,
    borderColor: "#ddd",
  },
  fixedContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FF852D",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    borderRadius: 25,
  },
  fixedContainerText: {
    color: "#FEFEFE",
    fontSize: 16,
    fontWeight: "bold",
  },
  fixedContainerMainText: {
    color: "#FEFEFE",
  },
  Link: {
    color: "#FEFEFE",
    textDecorationLine: "underline",
  },
  payButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 60,
  },
  payButtonText: {
    color: "#FF852D",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: -20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "115%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    maxHeight: '37%',
    justifyContent: "space-evenly",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  tinkoffLogo: {
    width: 91,
    height: 35,
    resizeMode: "contain",
    marginBottom: 20,
  },
  paymentAmount: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  paymentLabel: {
    fontSize: 15,
    color: "#a0a0a0",
    marginBottom: 10,
    textAlign: "center",
  },
  payWithCardButton: {
    backgroundColor: "#FFDA00",
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 50,
    elevation: 3,
  },
  payWithCardText: {
    color: "#000",
    textAlign: "center",
    fontSize: 16,
  },
  paymentSuccessText: {
    fontSize: 15,
    color: "#a0a0a0",
    marginBottom: 10,
    textAlign: "center",
  },
  paymentSuccessTitle: {
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
  },
  tinkoffLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  guestControls: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  guestButton: {
    backgroundColor: "#FF852D",
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  guestButtonText: {
    color: "white",
    fontSize: 24,
  },
  guestCount: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BookingScreen;