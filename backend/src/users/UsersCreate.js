/* eslint react/jsx-key: off */
import React from "react";
import {
    PasswordInput,
    Create,
    SimpleForm,
    TextInput,
    required,
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    FileInput,
    ImageField,
    RadioButtonGroupInput
} from "react-admin"

import {dataProvider} from "../provider";

const passwordValidation = (value, allValues) => {
    if (value.length < 5) {
        return 'Must be over 5 length';
    }

    if ( allValues.password !==  allValues.confirm_password) {
        return 'Password and Confirm password not match';
    }
    return undefined;
};

const validatePassword = [required(), passwordValidation];

const emailValidation = async(value, allValues) => {
    console.log("emailValidation", value, allValues)

    let params = {
        filter: { q: JSON.stringify(`email=${value}`)}
    }

    let getL = await dataProvider.find("users", params)
    console.log("getL : ", getL)
    if (getL.total > 0) {
        return 'Email duplicate';
    }

    return undefined;
};

const validateEmail = [required(), emailValidation];


const userValidation = async(value, allValues) => {
    console.log("userValidation", value, allValues)


    var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if(format.test(value)){
        return 'Username cannot contain special characters.';
    } 

    let params = {
        filter: { q: JSON.stringify(`username=${value}`)}
    }

    let getL = await dataProvider.find("users", params)
    console.log("getL : ", getL)
    if (getL.total > 0) {
        return 'Username duplicate';
    }

    return undefined;
};

const validateUser = [required(), userValidation];


/*

https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string
var format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
//            ^                                       ^
console.log(format.test("My@string-with(some%text)"));
console.log(format.test("My string with spaces"));
console.log(format.test("MyStringContainingNoSpecialChars"));


*/


export const UsersCreate = props =>
{
    return (
        <Create {...props}>
            <SimpleForm>
                <FileInput source="image" label="Profile" multiple={false} maxSize={5000000} helperText={"helperText"}>
                    <ImageField source="src" title="title" />
                </FileInput> 
                <TextInput label="Username" source="username" validate={validateUser}/>
                <TextInput label="Email" source="email" type="email" validate={validateEmail}/>
                <PasswordInput label="Password" source="password" validate={validatePassword}/>
                <PasswordInput label="Confirm password" source="confirm_password"  validate={validatePassword}/>
                <ReferenceArrayInput source="roles" reference="roles">
                    <AutocompleteArrayInput optionText="name" label="Roles" defaultValue={['62761cb32541d10144d69e81']} validate={[required()]}/>
                </ReferenceArrayInput>

                <RadioButtonGroupInput source="isActive" defaultValue={"Unactive"} choices={[
                    { id: "Unactive", name: 'Unactive' },
                    { id: "Active", name: 'Active' },
                ]} />
            </SimpleForm>
        </Create>
    )

} ;

export default UsersCreate;
