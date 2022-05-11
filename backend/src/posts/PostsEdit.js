import React from "react";
import {
    Edit,
    TextInput,
    useRecordContext,
    FileInput,
    ImageField,
    SimpleForm,
    required,
    NumberInput,   
    ArrayInput,
    SimpleFormIterator,
    AutocompleteInput,
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    ReferenceInput,
    RadioButtonGroupInput,
    SelectInput,
    DateInput
} from "react-admin"

import { RichTextInput } from 'ra-input-rich-text';

const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

const PostsEdit = props => (
    <Edit title={<PostTitle/>}>
        <SimpleForm>
            <TextInput label="Title" source="title" helperText={"helperText"} validate={[required()]} />
            <TextInput label="Name subname" source="nameSubname" helperText={"helperText"} validate={[required()]} />
                <TextInput label="ID card" source="idCard" helperText={"helperText"} />
                {/* เลขบัตรประชาชน */}
                <NumberInput label="Number" source="number" helperText={"helperText"} validate={[required()]} />
                {/* Date Tranfer */}
                <DateInput source="dateTranfer" helperText={"helperText"} validate={[required()]}/>


                <ArrayInput source="banks" >
                    <SimpleFormIterator disableReordering>
                        <NumberInput label={"Bank Id"} source="user_bank" validate={[required()]} />
                        {/* <AutocompleteInput label={"Bank"} source="bank" validate={[required()]} choices={[
                            { id: 'programming', name: 'Programming' },
                            { id: 'lifestyle', name: 'Lifestyle' },
                            { id: 'photography', name: 'Photography' },
                        ]} /> */}
    
                        {/* <ReferenceInput label={"Bank"} source="banks" reference="banks" validate={[required()]} /> */}
                    
                        <ReferenceInput label="Bank" source="banks" reference="banks">
                            <SelectInput label="Bank" optionText="name" validate={[required()]} />
                        </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
     
                <RichTextInput label="Body" source="body" helperText={"helperText"} />
    
                <FileInput source="files" label="Files & VDO" multiple={true} maxSize={5000000} helperText={"helperText"}>
                    <ImageField source="base64" title="title" />
                </FileInput> 
                
                <ReferenceArrayInput  source="follows" reference="users" >
                    <AutocompleteArrayInput optionText="displayName" label="Follow" helperText={"helperText"} />
                </ReferenceArrayInput>

                <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                    { id: 0, name: 'Draft' },
                    { id: 1, name: 'Publish' },
                ]} />

        </SimpleForm>
    </Edit>
);

export default PostsEdit;
