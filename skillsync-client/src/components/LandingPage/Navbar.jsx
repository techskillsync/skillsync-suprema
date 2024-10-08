import React from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';

const Navbar = ({openNav, setOpenNav}) => {

    return (
        <nav className={`flex flex-col items-center justify-center gap-16 fixed md:absolute ${openNav ? 'top-0': 'top-[-150%]'} left-0 h-[100vh] w-full bg-[#161616] font-bold tracking-wide transition-all duration-500 ease-in-out md:flex-row md:justify-between md:p-4 md:h-[unset] md:top-0 md:gap-0 z-50 md:px-10`}>
            <div className='md:hidden'>
                <button className='text-4xl text-[white] absolute top-6 right-4' onClick={() => setOpenNav(!openNav)}>
                    <IoCloseSharp />
                </button>
            </div>
            <div className='w-[150px] mr-[162px]'>
                <Link to={'/'} onClick={() => setOpenNav(!openNav)}>
                    <img src="https://skillsync.work/assets/LogoDark-CavYDmXP.png" alt="allotrix" className='max-h-full max-w-full' />
                </Link>
            </div>
            {/* <ul className='flex flex-col items-center gap-4 font-allotrix-font px-6 py-4 rounded-xl md:flex-row md:gap-10 md:py-3 md:px-8 md:h-[55px]'>
                <li className='hover:pb-2 transition-all duration-300 ease-out hover:text-allotrix-std underline decoration-[#36B7FE]'>
                    <a target="_blank" href="https://chromewebstore.google.com/detail/skillsync/lboeblhlbmaefeiehpifgiceemiledcg">Get the Extension</a>
                </li>
            </ul> */}
            <div className='flex flex-col md:flex-row gap-4 items-center'>
                    <Link to='/login' onClick={() => setOpenNav(!openNav)}>
                <div className='bg-allotrix-std font-light py-2 px-8 rounded-lg font-allotrix-font-secondary text-[white] transition-all duration-300 ease-out hover:bg-[#161616] border-allotrix-std border-[1px] hover:border-solid hover:border-allotrix-std'>
                        Log In
                </div>
                    </Link>
                    <Link to='/signup' onClick={() => setOpenNav(!openNav)}>
                <div className='bg-allotrix-std font-light py-2 px-8 rounded-lg font-allotrix-font-secondary text-[white] transition-all duration-300 ease-out hover:bg-[#161616] border-allotrix-std border-[1px] hover:border-solid hover:border-allotrix-std'>
                        Sign Up
                </div>
                    </Link>
            </div>
        </nav>
    )
}

export default Navbar;