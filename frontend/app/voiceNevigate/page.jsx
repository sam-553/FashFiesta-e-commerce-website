"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from 'app/features/user/userSlice';
import { getproduct } from 'app/features/products/productSlice';
import { toast } from 'react-toastify';

const Ai = () => {
    const router = useRouter();
    const recognitionRef = useRef(null);
    const [listening, setListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const voicesRef = useRef([]);
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.user);

    const speak = useCallback((message) => {
        if (typeof window !== 'undefined') {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = "en-IN";
            const voices = window.speechSynthesis.getVoices();
            const femaleVoice = voices.find(v => v.lang.startsWith("en") && /female|zira|lekha|raveena/i.test(v.name)) || voices.find(v => v.lang.startsWith("en"));
            if (femaleVoice) utterance.voice = femaleVoice;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const voiceRoutes = [
        { keywords: ['cart', 'card'], path: '/cartItem', message: 'Opening cart' },
        { keywords: ['order'], path: '/orders', message: 'Opening orders' },
        { keywords: ['profile'], path: '/userProfile', message: 'Opening profile' },
        { keywords: ['products', 'product'], path: '/products', message: 'Opening products' },
        { keywords: ['home'], path: '/home', message: 'Opening home' },
        { keywords: ['login', 'sign in'], path: '/login', message: 'Opening login' },
        { keywords: ['signup', 'register'], path: '/signup', message: 'Opening signup' },
        { keywords: ['payment'], path: '/addPayment', message: 'Opening payment' },
        { keywords: ['confirmorder'], path: '/confirmOrder', message: 'Opening confirm order' },
        { keywords: ['success'], path: '/paymentSuccess', message: 'Opening payment success' },
        { keywords: ['update', 'password', 'changepassword'], path: '/updatePassword', message: 'Opening update password' },
        { keywords: ['forgot', 'password'], path: '/forgotPassword', message: 'Opening forgot password' },
    ];

    if (user?.role === 'admin') {
        voiceRoutes.push(
            { keywords: ['admin', 'dashboard'], path: '/adminDashboard', message: 'Opening admin dashboard' },
            { keywords: ['reviews'], path: '/reviewList', message: 'Opening reviews' },
            { keywords: ['upload', 'product'], path: '/uploadProduct', message: 'Opening upload product' },
            { keywords: ['product', 'list'], path: '/productList', message: 'Opening product list' },
            { keywords: ['all users'], path: '/allUsers', message: 'Opening all users' },
            { keywords: ['all orders', 'orders'], path: '/allOrders', message: 'Opening all orders' }
        );
    }

    const faqCommands = [
        { keywords: ['who created', 'who made', 'developer'], response: 'This website was created by Sameer Tiwari as a portfolio e-commerce project.' },
        { keywords: ['what can you do', 'help'], response: 'I can help you navigate the website using your voice, including opening cart, orders, profile, and more.' },
        { keywords: ['payment methods', 'how to pay'], response: 'We support Razorpay, credit cards, debit cards, and UPI for payments.' },
        { keywords: ['contact', 'support'], response: 'You can contact our support via the contact page or the email provided in the footer.' },
        { keywords: ['return policy', 'policy'], response: 'Our return policy allows returns within 7 days of delivery if the product is unused and in original condition.' },
        { keywords: ['shipping'], response: 'We provide shipping across India with delivery within 5 to 7 business days.' },
    ];

    useEffect(() => {
        if (typeof window !== 'undefined') {
            voicesRef.current = window.speechSynthesis.getVoices();
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) { speak('Speech recognition is not supported in this browser.'); return; }

            const recognition = new SpeechRecognition();
            recognition.lang = 'en-IN';
            recognition.interimResults = false;
            recognition.continuous = false;

            recognition.onresult = (e) => {
                const transcriptRaw = e.results[0][0].transcript.trim().toLowerCase();
                setLastCommand(transcriptRaw);
                const transcriptWords = transcriptRaw.split(/\s+/);
                let matched = false;

                // Check route commands first
                for (let route of voiceRoutes) {
                    for (let keyword of route.keywords) {
                        for (let word of transcriptWords) {
                            if (keyword.toLowerCase().includes(word.toLowerCase()) || word.toLowerCase().includes(keyword.toLowerCase())) {
                                speak(route.message);
                                router.push(route.path);
                                matched = true;
                                break;
                            }
                        }
                        if (matched) break;
                    }
                    if (matched) break;
                }

                // Check FAQ commands if no route matched
                if (!matched) {
                    for (let faq of faqCommands) {
                        for (let keyword of faq.keywords) {
                            if (transcriptRaw.includes(keyword)) {
                                speak(faq.response);
                                matched = true;
                                break;
                            }
                        }
                        if (matched) break;
                    }
                }

                // Check logout command if no match
                if (!matched && transcriptRaw.includes('logout')) {
                    dispatch(logout());
                    speak('Logging you out now.');
                    router.push('/login');
                    matched = true;
                }

                // Perform search only if no match found
                if (!matched) {
                    let searchKeyword = transcriptRaw;
                    if (searchKeyword) {
                        speak(`Searching for ${searchKeyword}`);
                        dispatch(getproduct({ keyword: searchKeyword, page: 1, category: '' }));
                        router.push(`/products?keyword=${encodeURIComponent(searchKeyword)}&page=1`);
                        matched = true;
                    } else {
                        speak('Sorry, I did not understand that. Please try again.');
                    }
                }

                setListening(false);
            };

            recognition.onend = () => setListening(false);
            recognition.onerror = () => { speak('Sorry, there was an error. Please try again.'); setListening(false); };

            recognitionRef.current = recognition;
        }
    }, [router, speak, user, dispatch]);

    const handleClick = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
            speak('Listening for your command.');
            setListening(true);
        } else {
            speak('Speech recognition is not available in this browser.');
        }
    };

    return (
        <div className="fixed lg:bottom-[20px] md:bottom-[40px] bottom-[80px] left-[1%] flex flex-col items-center gap-2 z-50 mb-14" onClick={handleClick}>
            <Image src={listening ? '/images/assest/listening.webp' : '/images/assest/ai.jpeg'} alt="AI Voice Assistant" width={80} height={80} className="cursor-pointer rounded-full border-4 border-blue-500 shadow-lg transition-transform hover:scale-105" />
            {lastCommand && (
                <div className="text-xs text-gray-800 bg-white px-2 py-1 rounded shadow border">Heard: "{lastCommand}"</div>
            )}
        </div>
    );
};

export default Ai;