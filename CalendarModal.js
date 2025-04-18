import React, { useMemo } from "react";
import { View, StyleSheet, Modal, TouchableOpacity, Text, Image } from "react-native";
import { CalendarList } from "react-native-calendars";
import AntDesign from "react-native-vector-icons/AntDesign";


const CalendarModal = ({
  visible,
  onClose,
  startDate,
  endDate,
  onDayPress,
  onConfirm,
}) => {
  const markedDates = useMemo(() => {
    const dates = {};
    if (startDate) {
      dates[startDate] = {
        selected: true,
        marked: true,
        selectedColor: "#2980b9",
      };
    }
    if (endDate) {
      dates[endDate] = {
        selected: true,
        marked: true,
        selectedColor: "#2980b9",
      };
    }
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let currentDate = start;
      while (currentDate <= end) {
        dates[currentDate.toISOString().split("T")[0]] = {
          selected: true,
          color: "#FF852D",
        };
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return dates;
  }, [startDate, endDate]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.head}>
          <Text style={styles.modalText}>Выберите даты</Text>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <AntDesign name="close" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.calendarContainer}>
          <CalendarList
            pastScrollRange={12}
            futureScrollRange={12}
            scrollEnabled={true}
            showScrollIndicator={true}
            onDayPress={onDayPress}
            markedDates={markedDates}
            markingType={"period"}
          />
        </View>

        <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
           <Image source={require("./assets/confirm.png")}></Image>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    margin: 0,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: "80%",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
  },
  close: {
    marginLeft: 110,
  },
  head: {
    flexDirection: "row",
  },
  calendarContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    marginBottom: 80,
    marginRight: 20,
  },
  confirm: {
    width: "50%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 100,
  },
});

export default CalendarModal;