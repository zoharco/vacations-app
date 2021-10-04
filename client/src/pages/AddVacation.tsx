import React, { useContext } from 'react';
import './AddVacation.css';
import Input from '../components/FormElements/Input' ;
import Button from '../components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_NUMBER, VALIDATOR_MINLENGTH, VALIDATOR_MIN } from '../shared/util/validatiors';
import { useForm } from '../shared/hooks/form-hook';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { AuthContext } from '../shared/context/auth-context';
import { useHistory } from 'react-router-dom';

const AddVacation = () => {
    const auth = useContext(AuthContext);
    const history = useHistory();
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            price: {
                value: '',
                isValid: false
            },
            imageUrl: {
                value: '',
                isValid: false
            },
            countInStock: {
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
                'http://localhost:5000/api/vacations/', 
                'POST', 
                JSON.stringify({
                    title: formState.inputs.title.value,
                    price: formState.inputs.price.value,
                    countInStock: formState.inputs.countInStock.value,
                    imageUrl: formState.inputs.imageUrl.value || null,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/');
        } catch(err) {

        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <section className="addVacation-container">
                <h1>Add a new Vacation</h1>
                <form  className="addVacationForm" onSubmit={submitHandler}>
                {isLoading && <LoadingSpinner asOverlay />}
                    <div>
                        <Input 
                            name="title" 
                            element="input"
                            type="text"
                            id="title"
                            label="title"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(5)]}
                            errorText="Please enter a valid title, at least 5 characters."
                            onInput={inputHandler}
                            />
                    </div>
                    <div>
                        <Input 
                            name="price"
                            element="input"
                            type="text"
                            id="price"
                            label="price"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER()]}
                            errorText="Please enter a valid price, number value."
                            onInput={inputHandler}
                            />
                    </div>
                    <div>
                        <Input 
                            name="countInStock"
                            id="countInStock"
                            element="input"
                            type="number" 
                            label="countInStock"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_NUMBER(), VALIDATOR_MIN(0)]}
                            errorText="Please enter a valid amount, at least 6 characters."
                            onInput={inputHandler}
                            />
                    </div>
                    <div>
                        <Input 
                            name="imageUrl"
                            element="input"
                            id="imageUrl"
                            validators={[]}
                            type="file" 
                            label="imageUrl"
                            onInput={inputHandler}
                            />
                    </div>
                    <div>
                        <Input 
                            name="description"
                            element="textarea"
                            id="description"
                            label="description"
                            validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(30)]}
                            errorText="Please enter a valid description, at least 30 characters."
                            onInput={inputHandler}
                            />
                    </div>

                    <div>
                        <Button type="submit" disabled={!formState.isValid} >Add Vacation</Button>
                    </div>

                </form>
            </section>
        </React.Fragment>
    );
};

export default AddVacation;