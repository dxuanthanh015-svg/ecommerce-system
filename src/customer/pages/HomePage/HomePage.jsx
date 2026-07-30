import React from 'react'
import MainCarousal from '../../components/HomeCarousel/MainCarousel'
import HomeSectionCarousel from '../../components/HomeSectionCarousel/HomeSectionCarousel'
import { mens_kurta } from '../../../Data/mens-kurta'
const HomePage = () => {
  return (
    <div>
        <MainCarousal/>
        <div className='space-y-10 py-20 flex flex-col justify-center px-5 lg:px-10'>
          <HomeSectionCarousel data={mens_kurta} sectionName="Men Kurta"/> 
          <HomeSectionCarousel data={mens_kurta} sectionName="Men Kurta"/>
          <HomeSectionCarousel data={mens_kurta} sectionName="Men Kurta"/>
          <HomeSectionCarousel data={mens_kurta} sectionName="Men Kurta"/>
          <HomeSectionCarousel data={mens_kurta} sectionName="Men Kurta"/>
        </div>
    </div>
  )
}

export default HomePage