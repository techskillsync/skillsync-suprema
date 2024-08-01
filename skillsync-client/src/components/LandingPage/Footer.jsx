import React from 'react';
import { Link } from 'react-router-dom';
import { FaXTwitter, FaInstagram, FaLinkedin } from "react-icons/fa6";
import { IoMdCall, IoMdMail } from "react-icons/io";

const Footer = () => {
    return (
        <footer className='mt-10 flex flex-col px-4 py-6 bg-dark-grey text-[white] font-mamun-font-secondary'>
            <div className='flex flex-col justify-between gap-6 md:flex-row md:mx-32 md:py-10'>
                <article className='flex flex-col items-center gap-4'>
                    <h3 className='text-allotrix-std text-sm'>
                        Socials
                    </h3>
                    <div className='flex items-center gap-3 text-2xl'>
                        {/* <a href="https://twitter.com/skillsync" target='blank'>
                            <FaXTwitter />
                        </a> */}
                        <a href="https://www.instagram.com/skillsync.work/" target='blank'>
                            <FaInstagram />
                        </a>
                        <a href="https://www.linkedin.com/company/skillsync1/" target='blank'>
                            <FaLinkedin />
                        </a>
                    </div>
                </article>
                <aside className='flex flex-wrap gap-6 px-10 justify-center my-10 md:my-[unset] md:gap-14'>
                    <article className='flex flex-col gap-3'>
                        <h3 className='text-sm'>
                            <Link to="/contact">
                                Contact
                            </Link>
                        </h3>
                        <ul className='text-sm'>
                            <li>
                                <a className='flex gap-1 items-center' href="mailto:allotrixapp@gmail.com?subject=Meeting%20Request">
                                    <IoMdMail />
                                    info@skillsync.work
                                </a>
                            </li>
                            <li>
                                <a className='flex gap-1 items-center' href="tel:+91 90923 83240">
                                    <IoMdCall />
                                    +1 (604) 902-5985
                                </a>


                            </li>
                            <li>
                                <a className='flex gap-1 items-center' href="tel:+91 90923 83240">
                                    <IoMdCall />
                                    +1 (778) 872-4596
                                </a>
                            </li>
                            
                        </ul>
                    </article>
                </aside>
            </div>
            <aside className='flex justify-between items-center border-t-2 border-solid border-t-mamun-blue pt-6 md:mx-32'>
                <div className='w-[140px] gradient-text font-bold text-xl'>
                    SKILL SYNC.
                </div>
                <div className='bg-[#161617] text-[13px] font-light py-1 px-4 rounded-2xl text-[white] transition-all duration-300 ease-out border-[1px] border-solid hover:border-mamun-blue'>
                    <a href='/'>
                        Signup
                    </a>
                </div>
            </aside>
        </footer>
    )
}

export default Footer;