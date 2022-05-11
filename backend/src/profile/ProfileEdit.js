import React, {useMemo, useState} from 'react';
import {
    TextInput,
    ImageInput,
    ImageField,
    SimpleForm,
    required,
    useDataProvider,
    useNotify,
    SaveContextProvider,
    DateInput,
    useGetOne,
    ReferenceArrayInput,
    AutocompleteArrayInput,
    ArrayInput, 
    SimpleFormIterator, 
    RadioButtonGroupInput,
    useUpdate
  } from "react-admin";

const phonesDefaultValue = [
    {
        number: '0988264820',
    },
];

// https://marmelab.com/react-admin/doc/4.0/EditTutorial.html
const ProfileEdit = ({ staticContext, ...props }) => {
    const [saving, setSaving] = useState();
    const { data, isLoading } = useGetOne('users', { id: "62715a96a9a70e05eaed7e42" });

    const handleSave = (ev) => {
        console.log("handleSave : ", data, isLoading);

        // useUpdate
    }

    if (isLoading) return <span>Loading</span>; 

    return (
        <SaveContextProvider>
            <SimpleForm record={data} onSubmit={handleSave}>
                <ImageInput source="avatar" label="Pictures" accept="image/*">
                    <ImageField source="src" title="title" />
                </ImageInput>
                <TextInput source={"displayName"}  validate={required()} />
                <TextInput source={"email"}  validate={required()} />
                <TextInput source={"username"} />

                <DateInput label={"Birthday"} source="publication_date" showTime />
                
                <ArrayInput
                    source="phones"
                    defaultValue={phonesDefaultValue}
                    validate={[required()]}
                >
                    <SimpleFormIterator disableReordering>
                        <TextInput label={"Phone"} source="number" />
                    </SimpleFormIterator>
                </ArrayInput>

                <ReferenceArrayInput source="roles" reference="roles">
                    <AutocompleteArrayInput />
                </ReferenceArrayInput>
                <RadioButtonGroupInput defaultValue="other" source="sex" choices={[
                    { id: 'male', name: 'Male' },
                    { id: 'female', name: 'Female ' },
                    { id: 'other', name: 'Other' },
                ]} />
            </SimpleForm>
        </SaveContextProvider>
    );
};

export default ProfileEdit;
