import { useState } from 'preact/hooks';
import './Login.css';
import axios from 'axios';
import { API_URL } from '../config';

export function Login({page, setPage}) {
    const [p, setP] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [success, setSuccess] = useState();
    const [loading, setLoading] = useState(false);

    async function handleLoginStep1() {
        setLoading(true);
        let response = await axios.post(API_URL + '/user/send-otp', {
            email
        });
        setSuccess(response.data.message);
        setP(1);
        setLoading(false);
    }

    async function handleLoginStep2() {
        setLoading(true);
        let response = await axios.post(API_URL + '/user/verify-otp', {
            email,
            otp
        });

        if(response.data.token) {
            setSuccess('Successfully Logged In');
            localStorage.setItem('token', response.data.token);
            setPage('home');
        }else{
            setSuccess('Invalid OTP');
        }
        setLoading(false);
    }

    return (
        <div className='login'>
            <div className='form'>
                <h2>Your Homework Partner !!</h2>
                <h1>Sign in to AIGini</h1>
                {success && <p className='success'>{success}</p>}
                {p == 0 ? 
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/> :
                    <input type='text' placeholder='Otp' value={otp} onChange={(e) => setOtp(e.target.value)}/>
                }
                <button onClick={loading || p == 0 ? handleLoginStep1 : handleLoginStep2} disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
            </div>
        </div>
    )
}