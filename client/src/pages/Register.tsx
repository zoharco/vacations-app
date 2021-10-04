import React, { useContext } from 'react';
import Input from '../components/FormElements/Input';
import Button from '../components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL, VALIDATOR_MINLENGTH } from '../shared/util/validatiors';
import { useForm } from '../shared/hooks/form-hook';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorModal from '../components/ErrorModal';
import { useHttpClient } from '../shared/hooks/http-hook';
import { useHistory } from 'react-router-dom';
import  './Register.css';
import { AuthContext } from '../shared/context/auth-context';

const Register = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    
    const [formState, inputHandler] = useForm(
        {
            username: {
                value: '',
                isValid: false
            },
            email: {
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
    

    const submitHandler = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        try{
            const responseData = await sendRequest(
                'http://localhost:5000/api/users/signup', 
                'POST', 
                JSON.stringify({
                    username: formState.inputs.username.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }),
                {'Content-Type': 'application/json'}
            );
            auth.login(responseData.userData, responseData.token);
            history.push('/login');
        } catch(err) {

        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <section className="registerContainer">
                {isLoading && <LoadingSpinner asOverlay />}
                <h1>Create an Account</h1>
                <div className="userAccuntExits">
                    Already have an account? <Button to={'/login'}>Login </Button>
                </div>
                <form  className="registerForm" onSubmit={submitHandler}>
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
                            name="email"
                            element="input"
                            type="email"
                            id="email"
                            label="Email"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
                            errorText="Please enter a valid email."
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
                        <Button type="submit" disabled={!formState.isValid} >Register</Button>
                    </div>

                </form>
            </section>
        </React.Fragment>
    );
};

export default Register;