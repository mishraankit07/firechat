import React, { useState, useEffect, useContext } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import './Styles/SignUp.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '@mui/material';
import { db } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from '../Context/AuthContext';
import { v4 as uuidv4 } from 'uuid';


const bull = (
    <Box
        component="span"
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
);

export default function Signup() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const { user } = useContext(AuthContext);

    let navigate = useNavigate();

    // if user exists then directly navigate to home
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [])

    let handleSignup = () => {

        setLoading(true);
        setError('');

        signup(email, password).then(async (userCredential) => {
            setError('');
            let userObj = userCredential.user;
            let userId = userObj.uid;
            let id = uuidv4();

            let userData = {
                name: userName,
                email: email,
                id: id
            }

            console.log("user object:", userObj);
            console.log("user data:", userData);

            await setDoc(doc(db, 'users', email), userData);
            navigate('/');
            setLoading(false);

        }).catch((error) => {
            setError(error.code);
            console.log(error.message);
            setInterval(() => {
                setError('');
                setLoading(false);
            }, 5000)
        })

        setError('');
    }

    return (
        <Box>
            <Card variant="outlined" className='signup-cont'>
                <CardContent>
                    <div className='signup-info'>
                        <TextField id="outlined-basic"
                            label="Email"
                            variant="outlined"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />

                        <TextField id="outlined-password-input"
                            label="Password"
                            type="password"
                            variant="outlined"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} />


                        <TextField id="outlined-basic"
                            label="Username"
                            variant="outlined"
                            placeholder="Enter Username"
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)} />

                        {
                            error != '' && <Alert severity='error'> Something Went Wrong! Please Try again </Alert>
                        }

                        <Button variant="contained"
                            size="small"
                            onClick={handleSignup}
                            disabled={loading}> SignUp </Button>
                    </div>
                </CardContent>
                <Typography style={{ textAlign: "center", marginTop: '0.5rem',marginBottom:"0.5rem" }}> Already a user ? <Link to="/login"> Login </Link></Typography>
            </Card>
        </Box>
    );
}