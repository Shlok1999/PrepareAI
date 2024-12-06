import React, {useEffect, useState} from 'react';
import { Modal } from './Modal';
import {  useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Building2 } from 'lucide-react';

export function LoginModal({ isOpen, onClose }) {
    const [user, setUser] = useState(null);

    const navigate = useNavigate();
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            sessionStorage.setItem("user", JSON.stringify(codeResponse));
            fetchUserProfile(codeResponse.access_token);
        },
        onError: (error) => console.log("Login Failed:", error),
    });
    const fetchUserProfile = async (accessToken) => {
        try {
            const res = await axios.get(
                `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: "application/json",
                    },
                }
            );
            sessionStorage.setItem("profile", JSON.stringify(res.data));
            navigate("/dashboard"); // Redirect to dashboard after successful login
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          fetchUserProfile(JSON.parse(storedUser).access_token);
        }
      }, []);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Welcome to PrepareAI</h2>
                <p className="text-gray-600 mt-2">Choose how you want to continue</p>
            </div>

            {/* Login Buttons */}
            <div className="space-y-4">
                {/* Login as Student */}
                <button
                    className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white p-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={ login}
                >
                    <GraduationCap className="h-6 w-6" />
                    <span className="font-semibold">Login as Student</span>
                </button>

                {/* Login as School */}
                <button
                    className="w-full flex items-center justify-center gap-3 border-2 border-indigo-600 text-indigo-600 p-4 rounded-lg hover:bg-indigo-50 transition-colors"
                    onClick={() => console.log('School login clicked')}
                >
                    <Building2 className="h-6 w-6" />
                    <span className="font-semibold">Login as School</span>
                </button>
            </div>

            {/* Footer */}
            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{' '}
                <button
                    className="text-indigo-600 font-semibold hover:text-indigo-800"
                    onClick={() => console.log('Sign-up clicked')}
                >
                    Sign up now
                </button>
            </p>
        </Modal>
    );
}
