import React from 'react';
import CustomCard from '../../Componte/CustomCard';
import cardsData from '../../Componte/cardData.json';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';  // Import only pagination CSS

const Admin = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <Swiper
        spaceBetween={30}  
        slidesPerView={1}  
        pagination={{ clickable: true }}  
        style={{ width: '80%', height: '400px' }}  
      >
        {cardsData.map((card, index) => (
          <SwiperSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CustomCard title={card.title} content={card.content} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Admin;
