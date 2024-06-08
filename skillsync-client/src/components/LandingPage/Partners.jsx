import React from "react";
import AllotrixLogo from "../../assets/LandingPage/allotrix.svg";
import AmazonLogo from "../../assets/LandingPage/amazon.svg";
import GoogleLogo from "../../assets/LandingPage/google.svg";
import ZapierLogo from "../../assets/LandingPage/zapier.svg";
import AstrapiLogo from "../../assets/LandingPage/astrapi.svg";

const Partners = () => {
  const partners = [
    { title: "Allotrix", image: AllotrixLogo },
    { title: "Zapier", image: ZapierLogo },
    { title: "Google", image: GoogleLogo },
    { title: "Astrapi", image: AstrapiLogo },
    { title: "Amazon", image: AmazonLogo },
  ];
  const byLine = "Helping you get the opportunities you deserve";
  const byLineChars = byLine.split("");
return (
    <div className="md:max-w-[70%] mx-auto mt-12">
        <h4 className="md:max-w-[70%] mx-auto px-12 flex justify-between text-sm text-white font-semibold">
            {byLineChars.map((char, index) => (
                <span key={index}>{char}</span>
            ))}
        </h4>
        <div className="partners-container flex flex-wrap justify-around items-center mt-6">
            {partners.map((partner, index) => (
                <div key={index} className="partner-item">
                    <img src={partner.image} alt={partner.title} />
                </div>
            ))}
        </div>
    </div>
);
};

export default Partners;
