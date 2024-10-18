import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function StickyScrollTut() {
  const images = [
    "", 
    "https://i.postimg.cc/26fr1tCL/tut7.png",
    "https://i.postimg.cc/QdHXw56C/tut1.png",
    "https://i.postimg.cc/c4DxFTBP/tut2.png",
    "https://i.postimg.cc/QdwX3tPb/tut3.png",
    "https://i.postimg.cc/JhXR48CW/tut4.png",
    "https://i.postimg.cc/j5QKPhjg/tut5.png",
    "https://i.postimg.cc/rsVTJt08/tut6.png",
    "https://i.postimg.cc/T1t6HYgn/tut8.png",
    ""
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0); // State to track the current image

  useEffect(() => {
    const sections = images.length; 

    ScrollTrigger.create({
      trigger: ".gallery",
      start: "top top",
      end: `+=${sections * window.innerHeight}`, 
      scrub: true,
      onUpdate: (self) => {
        const scrollPosition = self.progress * (sections - 1); 
        const index = Math.floor(scrollPosition); 
        setCurrentImageIndex(index);
      },
    });
  }, [images.length]);

  return (
    <div className="gallery flex flex-col w-full min-h-screen items-center justify-center relative">
      <div className="sticky top-0 p-5 w-full h-screen flex items-start justify-center">
        <img
          src={images[currentImageIndex]} 
          className="w-full h-auto object-cover mt-20"
        />
      </div>

      <div style={{ height: `${images.length * 70}vh` }}></div>
    </div>
  );
}

export default StickyScrollTut;
