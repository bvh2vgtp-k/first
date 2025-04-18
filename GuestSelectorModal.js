
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


const GuestModal = ({ modalVisible, closeModal, count1, setCount1, count2, setCount2, count3, setCount3, handleConfirm }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalView}>
        <View style={styles.head}>
          <Text style={styles.modalText}>Количество гостей</Text>
          <TouchableOpacity style={styles.close} onPress={closeModal}>
            <AntDesign name="close" size={25} />
          </TouchableOpacity>
        </View>

        <View style={styles.touchable}>
          <Text style={styles.touchableText}>Взрослые</Text>
          <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count1 > 0) setCount1(count1 - 1); }}>
            <Text style={styles.squareButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{count1}</Text>
          <TouchableOpacity style={styles.squareButton} onPress={() => setCount1(count1 + 1)}>
            <Text style={styles.squareButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.touchable}>
          <Text style={styles.touchableText}>Питомец</Text>
          <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count2 > 0) setCount2(count2 - 1); }}>
            <Text style={styles.squareButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{count2}</Text>
          <TouchableOpacity style={styles.squareButton} onPress={() => setCount2(count2 + 1)}>
            <Text style={styles.squareButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.touchable}>
          <Text style={styles.touchableText}>Дети</Text>
          <TouchableOpacity style={styles.squareButtonl} onPress={() => { if (count3 > 0) setCount3(count3 - 1); }}>
            <Text style={styles.squareButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterText}>{count3}</Text>
          <TouchableOpacity style={styles.squareButton} onPress={() => setCount3(count3 + 1)}>
            <Text style={styles.squareButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.confirm} onPress={handleConfirm}>
          <Image source={require("./assets/confirm.png")} />
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        margin: 0,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        height: '80%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
  
    },
    head: {
        flexDirection: 'row'
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'left',
        fontSize: 18,
        fontWeight: 'bold',
    },
    close: {
        marginLeft: 110
    },
    touchable: {
        width: '100%',
        paddingVertical: 10,
        paddingHorizontal: 2,
        backgroundColor: 'white',
        borderRadius: 8,
        marginVertical: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.5,
        elevation: 10,
      },
      touchableText: {
        color: 'Black',
        fontSize: 16,
        marginLeft: 20,
        alignSelf: 'flex-start',
      },
      squareButtonl: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FF852D',
        marginRight: 67,
        alignSelf: 'flex-end',
        marginTop: -25,
      },
      squareButtonText: {
        fontSize: 17,
    },
    counterText: {
        fontSize: 15,
        marginHorizontal: 50,
        marginRight: -180,
        marginTop: -25
    },
    squareButton: {
        width: 30,
        height: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#FF852D',
        marginRight: 12,
        alignSelf: 'flex-end',
        marginTop: -25,
      } ,
      confirm: {
        width: '50%',
        padding: 15,
  
        borderRadius: 10,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 100,
    }
});

export default GuestModal;