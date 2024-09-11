import React, { useState, useEffect } from "react";
import myImage from "../../assets/Screenshot_2024-08-15_191834-removebg-preview.png";
import BackgroundImage from "../../assets/annie-spratt-nNQP1LXMA0g-unsplash.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../../Redux/Actions/doctorActions";
import { AppDispatch } from "../../Redux/store";
import { toast } from "sonner";

const DoctorOtpPageComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [timer, setTimer] = useState<number>(() => {
    const savedTimer = localStorage.getItem("otp-timer");
    return savedTimer ? parseInt(savedTimer) : 60;
  });
  const [buttonText, setButtonText] = useState("Submit");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer - 1;
          localStorage.setItem("otp-timer", newTimer.toString());
          return newTimer;
        });
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setButtonText("Resend OTP");
      localStorage.removeItem("otp-timer");
    }
  }, [timer]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
          newOtp[index - 1] = "";
          setOtp(newOtp);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("hello from handlesubmit");
    e.preventDefault();
    const otpValue = otp.join("");
    if (
      buttonText === "Submit" &&
      (otpValue.trim() == "" || otpValue.length !== 4)
    ) {
      if (otpValue.length > 0) {
        toast.error("Please Fill all the fields");
      } else {
        toast.error("OTP Field Cannot be Empty");
      }
      return;
    }

    if (buttonText === "Resend OTP") {
      try {
        console.log("button resend otp");
        const resendOtpStatus = await dispatch(resendOtp()).unwrap();

        console.log(resendOtpStatus);
        if (resendOtpStatus) {
          toast.success("OTP Resent");
          setOtp(Array(4).fill(""));
          setTimer(60);
          setButtonText("Submit");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error("Failed to resend OTP");
        } else {
          toast.error("OTP resend Failed");
        }
      }
    } else {
      try {
        const otpVerification = await dispatch(verifyOtp(otpValue));

        if (otpVerification?.status) {
          toast.success("Success");
          navigate("/doctor/login");
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Unknown Error has occured");
        }
      }
    }
  };

  return (
    <main
      className="w-full h-screen flex flex-col items-center justify-center px-4 bg-cover"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="max-w-sm w-full text-gray-600 space-y-8">
        <div className="text-center">
          <img src={myImage} width={250} className="mx-auto" alt="Logo" />
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Verify your OTP
            </h3>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                name={`otp-${index}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-[60px] w-[60px] text-2xl text-center bg-transparent border border-gray-800 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block dark:border-gray-600 dark:placeholder-gray-500 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 shadow-xl"
              />
            ))}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="text-white bg-black hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-[160px]"
            >
              {buttonText}
            </button>
          </div>
          <div className="text-center text-black dark:text-white">
            {timer > 0 ? (
              <>
                Resend OTP in <span className="text-black">{timer}s</span>
              </>
            ) : (
              "OTP expired"
            )}
          </div>
        </form>
      </div>
    </main>
  );
};

export default DoctorOtpPageComponent;
