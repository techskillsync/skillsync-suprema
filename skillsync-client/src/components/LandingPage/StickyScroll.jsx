import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function StickyScroll({ OBJECT }) {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.set(".photo:not(:first-child)", { opacity: 0});

      const animation = gsap.to(".photo:not(:first-child)", {
        opacity: 1,
        duration: 1,
        stagger: 1,
      });

      ScrollTrigger.create({
        trigger: ".gallery",
        start: "top top",
        end: "bottom bottom",
        pin: ".rightblock",
        animation: animation,
        scrub: true,
        markers: false,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="gallery flex w-[90%] mx-auto pt-[150px]">
      <div className="left w-[90%] ml-auto">
        {OBJECT.map((element, index) => (
          <article
            key={index}
            className="flex flex-col gap-3 md:w-[70%] mb-[500px]"
          >
            <h5 className="text-xl font-bold gradient-text">
              {element.title}
            </h5>
            <h4 className="text-4xl font-bold text-[white]">{element.heading}</h4>

            <p className="text-xl text-justify text-[#cccaca]">{element.description}</p>
          </article>
        ))}
      </div>
      <div className="rightblock w-1/2 h-screen flex flex-col items-center">
        <div className="relative w-[30vw] h-[30vw]">
          {OBJECT.map((element, index) => (
            <div key={index} className="photo flex items-center justify-center absolute w-full h-full ">

              <img id='munVideo' className="w-[300px] h-[300px] rounded-full" src={element.video} />


            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StickyScroll;
