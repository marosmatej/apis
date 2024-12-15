import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import axios from 'axios';
import getBaseUrl from '../utils/baseURL'; // Adjust the path as necessary

const Register = () => {
    const [message, setMessage] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Register user using API endpoint
    const onSubmit = async (data) => {
        try {
            const baseUrl = getBaseUrl(); // Get the base URL dynamically
            const response = await axios.post(`${baseUrl}/api/auth/register`, {
                username: data.username,
                password: data.password,
                role: "user",
            });
            if (response.status === 200) {
                alert("User registered successfully!");
            } else {
                setMessage(response.data.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "An error occurred. Please try again.";
            setMessage(errorMessage);
            console.error(error);
        }
    };

    return (
        <div className='h-[calc(100vh-120px)] flex justify-center items-center '>
            <div className='w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
                <h2 className='text-xl font-semibold mb-4'>Please Register</h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="username">Username</label>
                        <input
                            {...register("username", { required: true })}
                            type="text"
                            name="username"
                            id="username"
                            placeholder='Username'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        {errors.username && <p className='text-red-500 text-xs italic'>Username is required.</p>}
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor="password">Password</label>
                        <input
                            {...register("password", { required: true })}
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Password'
                            className='shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow'
                        />
                        {errors.password && <p className='text-red-500 text-xs italic'>Password is required.</p>}
                    </div>
                    {message && <p className='text-red-500 text-xs italic mb-3'>{message}</p>}
                    <div>
                        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded focus:outline-none'>Register</button>
                    </div>
                </form>
                <p className='align-baseline font-medium mt-4 text-sm'>Have an account? Please <Link to="/login" className='text-blue-500 hover:text-blue-700'>Login</Link></p>

                <p className='mt-5 text-center text-gray-500 text-xs'>©2025 Book Store. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Register;
