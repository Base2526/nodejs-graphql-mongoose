import React from "react";
import {
    Edit,
    TextInput,
    useRecordContext,
    FileInput,
    ImageField,
    TabbedForm,
    Create,
    SimpleForm,

    required,

    FormTab,

    Datagrid,
    TextField,
    DateField,
    ReferenceManyField,
    NumberInput,    
    DateInput,
    BooleanInput,
    EditButton,
    number,
    minValue,
    ArrayInput,
    ReferenceInput,
    AutocompleteInput
} from "react-admin"

import { RichTextInput } from 'ra-input-rich-text';

const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};

const CommentsEdit = props => (
    <Edit title={<PostTitle/>}>
        <SimpleForm>
            <ReferenceInput source="postId" reference="posts">
                <AutocompleteInput optionText="title" helperText={"helperText"} validate={[required()]} />
            </ReferenceInput>

            <RichTextInput label="Body" source="body" helperText={"helperText"} validate={[required()]} />
        </SimpleForm>
    </Edit>
);

export default CommentsEdit;
