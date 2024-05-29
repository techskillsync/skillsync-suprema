import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import PdfResumeUpload from '../arman/pdfResumeUpload';
import Spacer from '../Spacer';
import SimplicitySection from './SimplicitySection';

const LandingPage = () => {
    return (
        <div className='bg-gradient-to-b min-h-screen from-black to-[#123c6d]'>
            <Navbar></Navbar>
            <Hero></Hero>
            <Spacer></Spacer>
            <SimplicitySection />
        </div>
    );
};

export default LandingPage;