import React, {useEffect} from "react";
import {
        TabbedForm,
        Create,
        SimpleForm,
        TextInput,
        FileInput,
        ImageField,
        required,

        FormTab,
        Edit,
        Datagrid,
        TextField,
        DateField,
        ReferenceManyField,
        NumberInput,    
        DateInput,
        BooleanInput,
        EditButton,
        number,
        SimpleFormIterator,
        ArrayInput,
        RadioButtonGroupInput,
        ReferenceArrayInput,
        AutocompleteArrayInput,
        ReferenceInput,
        AutocompleteInput
        } from "react-admin"

import { RichTextInput } from 'ra-input-rich-text';

const phonesDefaultValue = [
    {
        bank: '',
    },
];

const CommentsCreate = props => (
    <Create {...props}>
        <SimpleForm> 

            <ReferenceInput source="postId" reference="posts">
                <AutocompleteInput optionText="title" helperText={"helperText"} validate={[required()]} />
            </ReferenceInput>

            <RichTextInput label="Body" source="body" helperText={"helperText"} validate={[required()]} />

            {/* <RadioButtonGroupInput source="isFollow" defaultValue={'0'} choices={[
                { id: '0', name: 'Not follow' },
                { id: '1', name: 'Follow' },
            ]} /> */}
        </SimpleForm>
    </Create>
    );

export default CommentsCreate;
