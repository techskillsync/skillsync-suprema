import React from 'react';
import Navbar from '../Navbar';
import Hero from './Hero';
import PdfResumeUpload from '../arman/pdfResumeUpload';

const LandingPage = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Hero></Hero>
            <PdfResumeUpload />
        </div>
    );
};

export default LandingPage;