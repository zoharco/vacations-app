import React, { useEffect, useState, useContext } from 'react';
import './EditVacation.css';
import Input from '../components/FormElements/Input' ;
import Button from '../components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_NUMBER, VALIDATOR_MINLENGTH, VALIDATOR_MIN } from '../shared/util/validatiors';
import { useForm } from '../shared/hooks/form-hook';
import ErrorModal from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHttpClient } from '../shared/hooks/http-hook';
import { useParams, useHistory } from 'react-router-dom';
import { VacationI } from '../components/VacationCard';
import { AuthContext } from '../shared/context/auth-context';

const EditVacation: React.FC = () => {
    const auth = useContext(AuthContext);
    type ParamsType = {
        vacationId: string;
    };
    const vacationId = useParams<ParamsType>().vacationId;
    const history = useHistory();
    const [loadedVacation, setLoadedVacation] = useState<VacationI>();
    const { isLoading, error, sendRequest, clearError} = useHttpClient();
    const [formState, inputHandler, setFormData ] = useForm(
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

    useEffect(() => {
        const fetchVacation = async () => {
            try{
                const responeData = await sendRequest(
                        `http://localhost:5000/api/vacations/${vacationId}`
                        );
                setLoadedVacation(responeData.vacation);
                setFormData(
                    {
                        title: {
                            value: loadedVacation?.title,
                            isValid: true
                        },
                        description: {
                            value: loadedVacation?.description,
                            isValid: true
                        },
                        price: {
                            value: loadedVacation?.price,
                            isValid: true
                        },
                        imageUrl: {
                            value: loadedVacation?.imageUrl,
                            isValid: true
                        },
                        countInStock: {
                            value: loadedVacation?.countInStock,
                            isValid: true
                        }
                    },
                    true
                );
            } catch (err) {
            }
        };
        fetchVacation();
    }, [sendRequest, vacationId]);

    const submitHandler = async (event: React.SyntheticEvent) => {
        event.preventDefault();
        
        try{
            const responseData = await sendRequest(
                `http://localhost:5000/api/vacations/${vacationId}`, 
                'PATCH', 
                JSON.stringify({
                    title: formState.inputs.title.value,
                    price: formState.inputs.price.value,
                    countInStock: formState.inputs.countInStock.value,
                    description: formState.inputs.description.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );
            history.push('/vacations');
        } catch(err) {

        }
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <section className="editVacation-container">
                {isLoading && <LoadingSpinner asOverlay />}
                {!isLoading && loadedVacation &&  
                <div>
                    <h1>Edit Vacation: {loadedVacation.title}</h1>
                    <form  className="editVacationForm" onSubmit={submitHandler}>
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
                                initialValue={loadedVacation.title}
                                initialValid={true}
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
                                initialValue={loadedVacation.price}
                                initialValid={true}
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
                                initialValue={loadedVacation.countInStock}
                                initialValid={true}
                                />
                        </div>
                        <div>
                            
                            {/* TODO:: images
                            <Input 
                                name="imageUrl"
                                element="input"
                                id="imageUrl"
                                validators={[]}
                                type="file" 
                                label="imageUrl"
                                onInput={inputHandler}
                                initialValue={loadedVacation.imageUrl}
                                initialValid={true}
                                /> */}
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
                                initialValue={loadedVacation.description}
                                initialValid={true}
                                />
                        </div>

                        <div>
                            <Button type="submit">Save</Button>
                        </div>

                    </form>
                </div>
}
            </section>
        </React.Fragment>
    );
};

export default EditVacation;