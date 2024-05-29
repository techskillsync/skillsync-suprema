import React from "react";
import PdfResumeUpload from "./arman/pdfResumeUpload";
import SlideDisplay from "./HomePage/SlideDisplay";

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      <div className="container mx-auto mt-8">
        <h1 className="text-4xl font-bold text-center">Welcome Back</h1>
      </div>
      <SlideDisplay
        sections={[
          //   <div className="w-full">
          //     <PdfResumeUpload></PdfResumeUpload>
          //   </div>,
          {
            slide_heading: "Job Postings",
            heading: "Job Postings will go here",
            text: "The job market bewilders students with fierce competition and opaque application processes.",
            image: "https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg",
          },
          {
            slide_heading: "Groups",
            heading: "Groups will go here",
            text: "The job market bewilders students with fierce competition and opaque application processes.",
            image: "https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg",
          },
          {
            slide_heading: "Resume Builder",
            heading: "Resume Builder is 🔥",
            text: "The job market bewilders students with fierce competition and opaque application processes.",
            image: "https://cdn.photographylife.com/wp-content/uploads/2014/09/Nikon-D750-Image-Samples-2.jpg",
            children: [
                <PdfResumeUpload></PdfResumeUpload>,
            ]
        },
        ]}
        actions={[]}
      />
    </div>
  );
};

export default HomePage;
