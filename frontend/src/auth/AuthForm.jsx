import { useState } from "react";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import PasswordStrengthMeter from "../util/PasswordStrengthMeter";
import { useAuthStore } from "../store/authStore";
import voa_logo1 from "../assets/as.png"

const AuthForm = () => {
    const [state, setState] = useState('Login')
    const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const { login, signup,  isLoading, error } = useAuthStore();

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const payload = { email, password };
      
        try {
          if (state === "Sign Up") {
            await signup({
              ...payload,
              userName,
              firstName,
              lastName,
            });
            navigate("/verify-email");
          } else {
            await login(payload);
            navigate("/");
          }
        } catch (error) {
          console.error("Auth error:", error);
        }
      };

	return (
		<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='w-full max-w-lg p-8 mx-auto mt-10 bg-gray-900 border border-gray-800 shadow-2xl bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl'>

    {/* Logo */}
    <div className="hidden px-3 lg:block">
        <a href="#" className="flex items-center justify-center block transition-colors rounded-full hover:bg-gray-900">
            <img src={voa_logo1} className="w-full rounded-xl" alt="logo" />
        </a>
    </div>

    <div className='px-8 py-2'>
        <h2 className='mb-6 text-2xl font-Semi-bold text-[#5eeccc] bg-clip-text'>
            {state === 'Sign Up' ? 'Create and verify your Account' : 'Login to your Account'}
        </h2>

        <form onSubmit={handleSubmit}>
            {state === 'Sign Up' && (
                <Input
                    icon={User}
                    type='text'
                    placeholder='UserName'
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            )}

            {state === 'Sign Up' && (
                <div className='flex gap-4'>
                    <div className='flex-1'>
                        <Input
                            icon={User}
                            type='text'
                            placeholder='FirstName'
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className='flex-1'>
                        <Input
                            icon={User}
                            type='text'
                            placeholder='LastName'
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                icon={Lock}
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className='mt-2 font-semibold text-red-500'>{error}</p>}
			{/* <PasswordStrengthMeter password={password} /> */}


            <div className='flex items-center mb-6'>
                <Link to='/forgot-password' className='text-sm text-[#5eeccc] hover:underline'>
                    Forgot password?
                </Link>
            </div>
            {error && <p className='mb-2 font-semibold text-red-500'>{error}</p>}

            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full px-4 py-3 font-bold text-black transition duration-200 rounded shadow-lg bg-gradient-to-r bg-[#5eeccc] hover:bg-[#1be415] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900'
                type='submit'
                disabled={isLoading}>
                {isLoading ? <Loader className='w-6 h-6 mx-auto animate-spin' /> : state}
            </motion.button>
        </form>
    </div>
    <div className='px-8 py-4 text-center bg-gray-900 bg-opacity-50'>
        {state === 'Sign Up' ? (
            <p className='text-sm text-gray-400'>
                Already have an account?{" "}
                <span onClick={() => setState('Login')} className='cursor-pointer ml-2 text-[#5eeccc] hover:underline'>
                    Login
                </span>
            </p>
        ) : (
            <p className='text-sm text-gray-400'>
                Don't have an account?{" "}
                <span onClick={() => setState('Sign Up')} className='cursor-pointer ml-2 text-[#5eeccc] hover:underline'>
                    Sign Up
                </span>
            </p>
        )}
    </div>
</motion.div>
	);
};
export default AuthForm;
