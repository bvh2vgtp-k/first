import React, { useRef, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ImageBackground, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  Animated,
  FlatList,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Easing,
  SafeAreaView,
  PixelRatio
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { apartmentsData } from './data'; 
import CalendarModal from "./CalendarModal";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


const scale = SCREEN_WIDTH / 414;
const verticalScale = (size) => (SCREEN_HEIGHT / 896) * size;
const moderateScale = (size, factor = 0.5) => size + (scale * size - size) * factor;

const ApartmentCard = ({ apartment, navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const flatListRef = useRef(null);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(contentOffset / viewSize);
    setCurrentSlide(index);
  };

  return (
    <TouchableOpacity 
      style={styles.cardContainer}
      onPress={() => navigation.navigate('ApartmentDetail', { apartmentId: apartment.id })}
      activeOpacity={0.8}
    >
      <View style={styles.photoContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled = {false}
          data={apartment.photos}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsHorizontalScrollIndicator={false}
          decelerationRate="normal"
          snapToInterval={SCREEN_WIDTH - moderateScale(32)}
          snapToAlignment="start"
          disableIntervalMomentum={true}
          contentContainerStyle={styles.listContent} 
          
          renderItem={({ item }) => (
            <View style={styles.slide}>
              <Image 
                source={item} 
                style={styles.apartmentPhoto} 
                resizeMode="cover"
              />
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(data, index) => ({
            length: SCREEN_WIDTH - moderateScale(32),
            offset: (SCREEN_WIDTH - moderateScale(32)) * index,
            index,
          })}
        />
        

        <TouchableOpacity style={styles.wifiButton}>
          <Image 
            source={require('./assets/wifi.png')} 
            style={styles.wifiIcon} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.priceButton}>
          <Text style={styles.priceText}>{apartment.price} сутки</Text>
        </TouchableOpacity>

        <View style={styles.sliderIndicator}>
          {apartment.photos.map((_, index) => (
            <View 
              key={index}
              style={[
                styles.sliderDot,
                index === currentSlide && styles.activeDot
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.apartmentTitle}>{apartment.title}</Text>
          <Text style={styles.apartmentAddress}>{apartment.address}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Image
              source={isFavorite 
                ? require('./assets/star_filled.png') 
                : require('./assets/star_empty.png')}
              style={styles.starIcon}
            />
          </TouchableOpacity>
          <Text style={styles.ratingText}>{apartment.rating}</Text>
        </View>
      </View>

      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const MapScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRentalType, setSelectedRentalType] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [tempSelection, setTempSelection] = useState(null);
  const animation = useRef(new Animated.Value(0)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = useRef(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [timeFilter, setTimeFilter] = useState('now'); // 'now', 'today', 'tomorrow'

  

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const toggleMenu = () => {
    Animated.parallel([
      Animated.timing(animation, {
        toValue: isExpanded ? 0 : 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false
      }),
      Animated.timing(overlayAnimation, {
        toValue: isExpanded ? 0 : 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      })
    ]).start(() => setIsExpanded(!isExpanded));
  };

  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [verticalScale(90), verticalScale(150)]
  });

  const menuOpacityInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1]
  });

  const overlayOpacity = overlayAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.8]
  });

  const filteredApartments = apartmentsData.filter(ap => {
    
    const typeMatch = !selectedRentalType || ap.type === selectedRentalType;
    
    
    let timeMatch = true;
    if (timeFilter === 'now') {
      
      timeMatch = ap.availableNow;
    } else if (timeFilter === 'today') {
      
      timeMatch = ap.availableToday;
    } else if (timeFilter === 'tomorrow') {
      
      timeMatch = ap.availableTomorrow;
    }
    
    return typeMatch && timeMatch;
  });

  const handleNowPress = () => {
    setTimeFilter('now');
    
  };

  const handleTodayPress = () => {
    setTimeFilter('today');
    
  };

  const handleTomorrowPress = () => {
    setTimeFilter('tomorrow');
    
  };

  const handleShowResults = () => {
    setSelectedRentalType(tempSelection);
    setShowRentalModal(false);
  };

  const handleReset = () => {
    setTempSelection(null);
    setSelectedRentalType(null);
    setShowRentalModal(false);
  };

  // логика календаря
  const handleDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (day.dateString >= startDate) {
      setEndDate(day.dateString);
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
    }
  };

  const handleConfirmDates = () => {
    setCalendarVisible(false);
    // проверить щас
    console.log('Выбранные даты:', startDate, endDate);
  };

  const RentalTypeModal = () => (
    <Modal transparent visible={showRentalModal} animationType="none">
      <TouchableWithoutFeedback onPress={() => setShowRentalModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.rentalModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Выберите тип аренды</Text>
              <TouchableOpacity 
                onPress={() => setShowRentalModal(false)}
                style={styles.closeButton}
              >
                <View style={styles.closeContainer}>
                  <View style={[styles.closeLine, { transform: [{ rotate: '45deg' }] }]} />
                  <View style={[styles.closeLine, { transform: [{ rotate: '-45deg' }] }]} />
                </View>
              </TouchableOpacity>
            </View>
  
            <View style={styles.modalBody}>
              <TouchableOpacity 
                style={[
                  styles.rentalCard,
                  tempSelection === 'бесконтактная' && styles.selectedCard
                ]}
                onPress={() => setTempSelection('бесконтактная')}
              >
                <Text style={styles.rentalTitle}>Бесконтактная аренда</Text>
                <Text style={styles.rentalDescription}>
                  Заселение автоматизировано: открытие и закрытие дверей через приложение
                </Text>
                
                <View style={styles.cardBottomRow}>
                  <View style={styles.foundContainer}>
                    <Text style={styles.foundText}>Найдено</Text>
                    <View style={styles.counterCircle}>
                      <Text style={styles.counterText}>
                        {apartmentsData.filter(ap => ap.type === 'бесконтактная').length}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timeText}>Время заселения выбираете сами</Text>
                </View>
              </TouchableOpacity>
  
              <TouchableOpacity 
                style={[
                  styles.rentalCard,
                  tempSelection === 'классическая' && styles.selectedCard
                ]}
                onPress={() => setTempSelection('классическая')}
              >
                <Text style={styles.rentalTitle}>Классическая аренда</Text>
                <Text style={styles.rentalDescription}>
                  Контакт с принимающей стороной и инструкции для заселения
                </Text>
                
                <View style={styles.cardBottomRow}>
                  <View style={styles.foundContainer}>
                    <Text style={styles.foundText}>Найдено</Text>
                    <View style={styles.counterCircle}>
                      <Text style={styles.counterText}>
                        {apartmentsData.filter(ap => ap.type === 'классическая').length}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timeText}>Время по договоренности</Text>
                </View>
              </TouchableOpacity>
            </View>
  
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>Сбросить</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.showButton}
                onPress={handleShowResults}
              >
                <Text style={styles.showButtonText}>Показать</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <GestureHandlerRootView style={styles.flex}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <ImageBackground
            source={require('./assets/map.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <TouchableWithoutFeedback onPress={toggleMenu}>
              <Animated.View style={[
                styles.overlay,
                { opacity: overlayOpacity }
              ]}/>
            </TouchableWithoutFeedback>

            <Animated.View style={[styles.topButton, {
              height: heightInterpolation,
              borderBottomLeftRadius: moderateScale(25), 
              borderBottomRightRadius: moderateScale(25),
            }]}>
              <View style={styles.bottomFixedContainer}>
                <TouchableOpacity 
                  style={styles.burgerButton} 
                  onPress={toggleMenu}
                  activeOpacity={0.8}
                >
                  <View style={styles.burgerLineTop} />
                  <View style={styles.burgerLineBottom} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rightButton}
                  activeOpacity={0.8}
                  onPress={() => setShowRentalModal(true)}
                >
                  <Image
                    source={require('./assets/home-button.png')}
                    style={styles.locationIcon}
                  />
                  <Text style={styles.cityText}>Тюмень</Text>
                  <View style={styles.separator} />
                  <Text style={styles.rentTypeText}>Тип аренды</Text>
                  <View style={styles.checkMark} />
                  
                </TouchableOpacity>
              </View>

              <Animated.View style={[styles.menuContainer, { opacity: menuOpacityInterpolation }]}>
                <TouchableOpacity style={styles.currentRentButton}>
                  <Text style={styles.buttonText}>Текущие аренды</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.myApartmentsButton}>
                  <Text style={styles.buttonText}>Мои квартиры</Text>
                </TouchableOpacity>

                <View style={styles.onlineIconContainer}>
                  <Image 
                    source={require('./assets/shrek.png')} 
                    style={styles.onlineIcon} 
                  />
                  <View style={styles.onlineIndicator} />
                </View>
              </Animated.View>
            </Animated.View>
          </ImageBackground>

          <RentalTypeModal />

          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={[verticalScale(150), SCREEN_HEIGHT * 0.82]}
            enablePanDownToClose={false}
            style={styles.bottomSheet}
            backgroundStyle={styles.sheetBackground}
            handleComponent={() => (
              <View style={styles.dragHandleContainer}>
                <View style={styles.dragHandle} />
              </View>
            )}
          >
            <BottomSheetView style={styles.sheetContent}>
              <View style={styles.filterRow}>
                <TouchableOpacity style={styles.editButton}>
                  <Image
                    source={require('./assets/edit-icon.png')}
                    style={styles.editIcon}
                  />
                  <View style={styles.editButtonBadge} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setCalendarVisible(true)}
                >
                  <Text style={styles.filterText}>Выбрать даты</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.timeButton} onPress={handleNowPress}>
                  <Text style={styles.filterText}>Сейчас</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dayButton} onPress={handleTodayPress}>
                  <Text style={styles.filterText}>Сегодня</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.dayButton} onPress={handleTomorrowPress}>
                  <Text style={styles.filterText}>Завтра</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.labelsRow}>
                <Text style={styles.objectsLabel}>Найдено {filteredApartments.length} объектов</Text>
                <Text style={styles.filterLabel}>Улица, район, остановка</Text>
              </View>

              <FlatList
                data={filteredApartments}
                renderItem={({ item }) => (
                  <ApartmentCard 
                    apartment={item} 
                    navigation={navigation} 
                  />
                )}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            </BottomSheetView>
          </BottomSheetModal>
          <CalendarModal
            visible={calendarVisible}
            onClose={() => setCalendarVisible(false)}
            startDate={startDate}
            endDate={endDate}
            onDayPress={handleDayPress}
            onConfirm={handleConfirmDates}
          />
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};


const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  topButton: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: 'white',
    overflow: 'hidden',
    paddingBottom: verticalScale(20),
  },
  bottomFixedContainer: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(24),
    right: moderateScale(24),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  burgerButton: {
    width: moderateScale(46),
    height: verticalScale(15),
    justifyContent: 'space-between',
  },
  burgerLineTop: {
    width: '100%',
    height: verticalScale(5),
    borderRadius: moderateScale(10),
    backgroundColor: '#FF852D',
    marginBottom: verticalScale(4),
  },
  burgerLineBottom: {
    width: moderateScale(33),
    height: verticalScale(5),
    borderRadius: moderateScale(10),
    backgroundColor: '#FF852D',
  },
  rightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    height: verticalScale(31),
    paddingHorizontal: moderateScale(10),
    backgroundColor: '#F6F6F8',
    borderRadius: moderateScale(7),
    flex: 1,
    marginLeft: moderateScale(20),
  },
  locationIcon: {
    width: moderateScale(11),
    height: verticalScale(13),
  },
  cityText: {
    fontSize: moderateScale(10),
    marginLeft: moderateScale(12),
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  separator: {
    width: 1,
    height: verticalScale(20),
    backgroundColor: '#DCDCDC',
    marginHorizontal: moderateScale(45),
  },
  rentTypeText: {
    fontSize: moderateScale(10),
    marginLeft: moderateScale(0),
    fontFamily: 'Montserrat-Medium',
    color: '#000',
  },
  checkMark: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderColor: '#FF852D',
    borderTopWidth: 2,
    borderRightWidth: 1.5,
    borderRadius: 1.1,
    transform: [{ rotate: '135deg' }],
    marginLeft: moderateScale(40),
  },
  
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(24),
    marginTop: verticalScale(40),
  },
  currentRentButton: {
    width: moderateScale(133),
    height: verticalScale(49),
    borderRadius: moderateScale(17),
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myApartmentsButton: {
    width: moderateScale(133),
    height: verticalScale(49),
    borderRadius: moderateScale(17),
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: moderateScale(12),
    color: 'white',
    fontFamily: 'Montserrat-SemiBold',
  },
  onlineIconContainer: {
    marginLeft: moderateScale(20),
    position: 'relative',
  },
  onlineIcon: {
    width: verticalScale(49),
    height: verticalScale(49),
    borderRadius: moderateScale(24.5),
  },
  onlineIndicator: {
    position: 'absolute',
    top: verticalScale(40),
    left: moderateScale(5),
    width: moderateScale(8),
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: '#FF852D',
    borderWidth: 1 / PixelRatio.get(),
    borderColor: 'white',
  },
  bottomSheet: {
    zIndex: 999,
    elevation: 999,
  },
  sheetBackground: {
    borderRadius: moderateScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(-5) },
    shadowOpacity: 0.1,
    shadowRadius: moderateScale(10),
  },
  sheetContent: {
    flex: 1,
    padding: moderateScale(16),
    paddingTop: verticalScale(20),
  },
  dragHandleContainer: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  dragHandle: {
    width: moderateScale(40),
    borderRadius: moderateScale(2),
    backgroundColor: '#D2D2D2',
    alignSelf: 'center',
    marginTop: verticalScale(8),
    borderWidth: moderateScale(2),
    borderColor: '#D2D2D2',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    paddingHorizontal: moderateScale(6),
  },
  editButton: {
    width: moderateScale(27),
    height: verticalScale(27),
    borderRadius: moderateScale(7),
    backgroundColor: '#F6F6F8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  editIcon: {
    width: moderateScale(13),
    height: verticalScale(13),
  },
  editButtonBadge: {
    position: 'absolute',
    width: moderateScale(7),
    height: verticalScale(7),
    backgroundColor: '#FF852D',
    borderRadius: moderateScale(3.5),
    top: verticalScale(-2),
    right: moderateScale(-2),
    zIndex: 2,
  },
  dateButton: {
    width: moderateScale(87),
    height: verticalScale(27),
    borderRadius: moderateScale(7),
    backgroundColor: '#F6F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeButton: {
    width: moderateScale(63),
    height: verticalScale(27),
    borderRadius: moderateScale(7),
    backgroundColor: '#F6F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButton: {
    width: moderateScale(63),
    height: verticalScale(27),
    borderRadius: moderateScale(7),
    backgroundColor: '#F6F6F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(10),
    color: '#6B6B6D',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#DCDCDC',
    paddingBottom: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  objectsLabel: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(10),
    color: '#000',
  },
  filterLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: moderateScale(10),
    color: '#FF852D',
  },
  cardContainer: {
    marginBottom: verticalScale(-10),
  },
  photoContainer: {
    height: verticalScale(198),
    marginVertical: verticalScale(16),
    position: 'relative',
    overflow: 'hidden',
  },
  apartmentPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: moderateScale(8),
  },
  wifiButton: {
    position: 'absolute',
    top: verticalScale(16),
    right: moderateScale(16),
    width: moderateScale(15),
    height: verticalScale(15),
    borderRadius: moderateScale(4),
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  wifiIcon: {
    width: moderateScale(9),
    height: verticalScale(7),
  },
  priceButton: {
    position: 'absolute',
    bottom: verticalScale(20),
    left: moderateScale(16),
    width: moderateScale(116),
    height: verticalScale(25),
    borderRadius: moderateScale(9),
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  priceText: {
    color: 'white',
    fontSize: moderateScale(11),
    fontFamily: 'Montserrat-Bold',
  },
  sliderIndicator: {
    position: 'absolute',
    bottom: verticalScale(8),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: moderateScale(24),
    zIndex: 2,
  },
  sliderDot: {
    width: moderateScale(5),
    height: verticalScale(5),
    borderRadius: moderateScale(2.5),
    backgroundColor: '#FFFFFF',
  },
  activeDot: {
    backgroundColor: '#FF852D',
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },
  textContainer: {
    flex: 1,
    marginRight: moderateScale(10),
  },
  apartmentTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: moderateScale(18),
    color: '#282828',
  },
  apartmentAddress: {
    fontFamily: 'Montserrat-Light',
    fontSize: moderateScale(13),
    color: '#282828',
    marginTop: verticalScale(4),
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  starIcon: {
    width: moderateScale(13),
    height: verticalScale(13),
  },
  ratingText: {
    fontFamily: 'Montserrat-Light',
    fontSize: moderateScale(13),
    color: '#282828',
  },
  divider: {
    height: 1 / PixelRatio.get(),
    backgroundColor: '#DCDCDC',
    marginVertical: verticalScale(16),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  rentalModalContent: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.85,
    backgroundColor: '#F3F3F3',
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(19),
    marginBottom: verticalScale(40),
    backgroundColor: 'white',
    paddingVertical: verticalScale(30),
    borderTopLeftRadius: moderateScale(20),
    borderTopRightRadius: moderateScale(20),
  },
  modalTitle: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: moderateScale(15),
    color: '#282828',
  },
  closeButton: {
    width: moderateScale(48),
    height: verticalScale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeContainer: {
    width: moderateScale(20),
    height: 0,
    position: 'relative',
  },
  closeLine: {
    position: 'absolute',
    width: moderateScale(15),
    height: verticalScale(1.5),
    backgroundColor: '#282828',
    borderRadius: moderateScale(1),
    left: 0,
  },
  rentalCard: {
    backgroundColor: 'white',
    borderRadius: moderateScale(12),
    width: SCREEN_WIDTH - moderateScale(40),
    height: verticalScale(123),
    padding: moderateScale(16),
    marginBottom: verticalScale(20),
    alignSelf: 'center',
  },
  selectedCard: {
    borderWidth: moderateScale(1),
    borderColor: '#FF852D',
  },
  rentalTitle: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: moderateScale(15),
    color: '#282828',
    marginBottom: verticalScale(8),
  },
  rentalDescription: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(10),
    color: '#6B6B6D',
    lineHeight: verticalScale(12),
    marginBottom: verticalScale(16),
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foundContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foundText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(10),
    color: '#6B6B6D',
    marginRight: moderateScale(8),
  },
  counterCircle: {
    width: moderateScale(24),
    height: verticalScale(24),
    borderRadius: moderateScale(12),
    backgroundColor: '#FFDCC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(12),
    color: '#FF852D',
  },
  timeText: {
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(10),
    color: '#6B6B6D',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(29),
    marginTop: verticalScale(20),
    backgroundColor: 'white',
    paddingVertical: verticalScale(20),
    borderBottomLeftRadius: moderateScale(20),
    borderBottomRightRadius: moderateScale(20),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  resetButton: {
    width: moderateScale(149),
    height: verticalScale(42),
    borderRadius: moderateScale(10),
    borderWidth: moderateScale(1),
    borderColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FF852D',
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(15),
  },
  showButton: {
    width: moderateScale(149),
    height: verticalScale(42),
    borderRadius: moderateScale(10),
    backgroundColor: '#FF852D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  showButtonText: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: moderateScale(15),
  },
  slide: {
    width: SCREEN_WIDTH - moderateScale(32),
    height: verticalScale(198),
  },
});

export default MapScreen;