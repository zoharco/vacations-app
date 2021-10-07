import React, { useContext }  from 'react';
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../shared/util/validatiors';
import { AuthContext } from '../shared/context/auth-context';
import { useForm } from '../shared/hooks/form-hook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import { useHttpClient } from '../shared/hooks/http-hook';
import './Login.css';

const Login = () => {
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            username: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );
    const auth = useContext(AuthContext); 

    const submitHandler = async (event: React.SyntheticEvent) => {
        event.preventDefault();

        try{
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/login', 
                "POST",
                JSON.stringify({
                    username: formState.inputs.username.value,
                    password: formState.inputs.password.value
                }),
                {
                    'Content-Type': 'application/json'
                },
            );
            
            auth.login(responseData.userId, responseData.token, null, responseData.userRole);
        } catch(err: any) {
        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <section className="loginContainer">
                {isLoading && <LoadingSpinner asOverlay />}
                <h1>Login</h1>
                <div className="userAccuntExits">
                    To Create new Acount - <Button to="/register">Register</Button>
                </div>
                <form  className="loginForm" onSubmit={submitHandler}>
                    <div>
                        <Input 
                            name="username" 
                            element="input"
                            type="text"
                            id="username"
                            label="Username"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter a valid username, at least 5 characters."
                            onInput={inputHandler}
                            />
                    </div>
                    <div>
                        <Input 
                            name="password"
                            element="input"
                            id="password"
                            type="password" 
                            label="Password"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(6)]}
                            errorText="Please enter a valid password, at least 6 characters."
                            onInput={inputHandler}
                            />
                    </div>
                    
                    <div>
                        <Button type="submit" disabled={!formState.isValid} >Login</Button>
                    </div>

                </form>
            </section>
        </React.Fragment>
    );
};

export default Login;