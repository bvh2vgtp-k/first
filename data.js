export const apartmentsData = [
    {
      id: 1,
      type: 'бесконтактная',
      title: 'Студия',
      address: 'г. Тюмень, Мельникайте, д. 70',
      price: '1 578 ₽',
      rating: 4.6,
      photos: Array(7).fill(require('./assets/apartment.png')),
      availableNow: true,      // Доступна прямо сейчас
      availableToday: true,    // Доступна сегодня
      availableTomorrow: false // Недоступна завтра
    },
    {
      id: 2,
      type: 'бесконтактная',
      title: '1-комнатная',
      address: 'г. Тюмень, Республики, д. 15',
      price: '2 100 ₽',
      rating: 4.7,
      photos: Array(5).fill(require('./assets/apartment2.png')),
      availableNow: false,      // Доступна прямо сейчас
      availableToday: true,    // Доступна сегодня
      availableTomorrow: false // Недоступна завтра
    },
    {
      id: 3,
      type: 'классическая',
      title: 'Дом',
      address: 'г. Тюмень, Лесобазовская, д. 25',
      price: '2 900 ₽',
      rating: 5,
      photos: [
        require('./assets/apartment3_1.png'),
        require('./assets/apartment3_2.png'),
        require('./assets/apartment3_3.png'),
        require('./assets/apartment3_4.png'),
      ],
      availableNow: false,      // Доступна прямо сейчас
      availableToday: false,    // Доступна сегодня
      availableTomorrow: false // Недоступна завтра
    },    
    
    {
      id: 4,
      type: 'бесконтактная',
      title: '2-комнатная',
      address: 'г. Тюмень, Комсомольская, д. 7',
      price: '3 000 ₽',
      rating: 4.8,
      photos: Array(5).fill(require('./assets/apartment4.png')),
      availableNow: false,      // Доступна прямо сейчас
      availableToday: false,    // Доступна сегодня
      availableTomorrow: true // Недоступна завтра    
    },
    {
      id: 5,
      type: 'классическая',
      title: 'Студия',
      address: 'г. Тюмень, Удальцова, д. 78',
      price: '1 980 ₽',
      rating: 4.2,
      photos: Array(7).fill(require('./assets/apartment5.png')),
      availableNow: false,      // Доступна прямо сейчас
      availableToday: false,    // Доступна сегодня
      availableTomorrow: true // Недоступна завтра    
    },
  ];