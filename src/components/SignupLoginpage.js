import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import OnOffRampApp from './OnOff';


export default function AuthPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState('login');
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', address: '' });
    const [message, setMessage] = useState('');
 const [userAddress,setUserAddress]=useState("")
   const [isAuthTrue,setIsAuthTrue]=useState(false)



    const styles = {
        body: {
            backgroundColor: '#21264d',
            height: '100vh',
            margin: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        },
        container: {
            backgroundColor: '#fff',
            padding: 30,
            borderRadius: 12,
            boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
            width: 400,
        },
        tabs: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 25,
        },
        tabButton: isActive => ({
            backgroundColor: isActive ? '#90ee90' : '#f0f0f0',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: isActive ? 'bold' : 'normal',
            borderRadius: 6,
            marginRight: 10,
            flex: 1,
            color: isActive ? '#004d00' : '#333',
        }),
        input: {
            fontSize: 16,
            padding: 10,
            width: '100%',
            marginBottom: 20,
            borderRadius: 6,
            border: '2px solid #000',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: 14,
            backgroundColor: '#ffa500',
            color: '#000',
            borderRadius: 6,
            border: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
        },
        heading: {
            textAlign: 'center',
            marginBottom: 20,
            fontWeight: 'bold',
            fontSize: 22,
            color: '#000',
        },
        message: isSuccess => ({
            color: isSuccess ? 'green' : 'red',
            textAlign: 'center',
            marginTop: 20,
        }),
    };

    const handleLoginChange = (e) => setLoginData({ ...loginData, [e.target.name]: e.target.value });
    const handleSignupChange = (e) => setSignupData({ ...signupData, [e.target.name]: e.target.value });

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); 
        try {
            const res = await fetch('http://localhost:3008/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });
            const data = await res.json();
            if (data.success) {
                console.log("User address:", data.user.address);
                setIsAuthTrue(true)
                setUserAddress(data.user.address);  
                setMessage({ text: "Login successful!", success: true });
            } else {
                setMessage({ text: data.error || "Login failed.", success: false });
            }
        } catch {
            setMessage({ text: "Network error", success: false });
        }
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await fetch('http://localhost:3008/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });
            const data = await res.json();
            if (data.success) {
                console.log("data?.user?.address", data?.user?.address)
                setUserAddress(data.user.address)
                 setIsAuthTrue(true)
                setMessage({ text: "Signup successful!", success: true });
            } else {
                setMessage({ text: data.error || "Signup failed.", success: false });
            }
        } catch {
            setMessage({ text: "Network error", success: false });
        }
    };

   return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#21264d', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
            {!isAuthTrue && (
                <div style={{ backgroundColor: '#fff', padding: 30, borderRadius: 12, boxShadow: '0 10px 20px rgba(0,0,0,0.15)', width: 400 }}>
                    <h2 style={{ textAlign: 'center', marginBottom: 20, fontWeight: 'bold', fontSize: 22, color: '#000' }}>On-Ramp / Off-Ramp Auth</h2>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 25 }}>
                        <button
                            style={{ backgroundColor: tab === 'login' ? '#90ee90' : '#f0f0f0', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: tab === 'login' ? 'bold' : 'normal', borderRadius: 6, marginRight: 10, flex: 1, color: tab === 'login' ? '#004d00' : '#333' }}
                            onClick={() => setTab('login')}
                        >
                            Login
                        </button>
                        <button
                            style={{ backgroundColor: tab === 'signup' ? '#90ee90' : '#f0f0f0', border: 'none', padding: '10px 20px', cursor: 'pointer', fontWeight: tab === 'signup' ? 'bold' : 'normal', borderRadius: 6, marginRight: 10, flex: 1, color: tab === 'signup' ? '#004d00' : '#333' }}
                            onClick={() => setTab('signup')}
                        >
                            Signup
                        </button>
                    </div>

                    {tab === 'login' && (
                        <form onSubmit={handleLoginSubmit}>
                            <input type="email" name="email" placeholder="Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <input type="password" name="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <button type="submit" style={{ width: '100%', padding: 14, backgroundColor: '#ffa500', color: '#000', borderRadius: 6, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Log In</button>

                        </form>
                    )}

                    {tab === 'signup' && (
                        <form onSubmit={handleSignupSubmit}>
                            <input type="text" name="name" placeholder="Name" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <input type="email" name="email" placeholder="Email" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <input type="text" name="address" placeholder="Ethereum Address" value={signupData.address} onChange={(e) => setSignupData({ ...signupData, address: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <input type="password" name="password" placeholder="Password" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} required style={{ fontSize: 16, padding: 10, width: '100%', marginBottom: 20, borderRadius: 6, border: '2px solid #000', boxSizing: 'border-box' }} />
                            <button type="submit" style={{ width: '100%', padding: 14, backgroundColor: '#ffa500', color: '#000', borderRadius: 6, border: 'none', fontWeight: 'bold', fontSize: 16, cursor: 'pointer' }}>Sign Up</button>
                        </form>
                    )}

                    {message && <p style={{ color: message.success ? 'green' : 'red', textAlign: 'center', marginTop: 20 }}>{message.text}</p>}
                </div>
            )}

            {isAuthTrue && <OnOffRampApp userAddress={userAddress} />}
        </div>
    );
}
