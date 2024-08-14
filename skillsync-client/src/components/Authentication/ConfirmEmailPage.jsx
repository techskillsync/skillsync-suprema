import React from "react"
import { FaMailBulk, FaUser } from "react-icons/fa"

function ConfirmEmailPage() {
    return (
        <div className="h-screen flex flex-col w-1/2 mx-auto justify-center items-center ">
            <h1 className="font-sans text-[32px]">Please confirm your email 😄</h1>
            <div className="flex justify-center items-center mt-3">
                <FaMailBulk className="text-white text-9xl" />
            </div>
            <p className="text-white text-center mt-3">
                We have sent a confirmation email to your email address. Please
                click on the link in the email to confirm your email address. If you
                don't see the email, please check your spam folder.
            </p>
        </div>
    );
}

export default ConfirmEmailPage