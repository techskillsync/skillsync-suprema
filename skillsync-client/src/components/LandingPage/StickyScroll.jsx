import React, { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import JobCard from "./JobCard"; // Assuming JobCard is a separate component

gsap.registerPlugin(ScrollTrigger);

function StickyScroll({ OBJECT }) {
  useEffect(() => {
    gsap.utils.toArray(".job-card").forEach((card, index) => {
      // Animate each job card to appear smoothly
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 100, // Start the card offscreen
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top center+=100", // Trigger when the card is near the center
            end: "bottom center", // Keep the animation until it's out of view
            scrub: true, // Smooth scrubbing while scrolling
            toggleActions: "play none none none", // No re-triggering
            markers: false, // Set to true if you want to debug
          },
        }
      );

      // Once a card has left the screen, it fades out and doesn't come back
      gsap.to(card, {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: card,
          start: "bottom center", // Fade out when the bottom of the card reaches the center
          end: "bottom center-=100",
          scrub: true,
          markers: false,
        },
      });
    });
  }, [OBJECT]);

  return (
    <div className="gallery flex w-full min-h-screen items-center justify-center relative">
      {/* Container to center content vertically */}
      <div className="center w-full">
        {OBJECT.map((job, index) => (
          <div
            key={index}
            className={`job-card flex flex-col gap-3 mb-10 md:w-full opacity-0 items-center justify-center`}
          >
            <JobCard job={job} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickyScroll;
