/* eslint react/jsx-key: off */
import * as React from 'react';
import { Edit, SimpleForm, TextField, TextInput, required, RadioButtonGroupInput } from 'react-admin';

import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';

const SocketsEdit = props => (
    <Edit title={"Edit role"} {...props}>
        <SimpleForm redirect="list">
            <TextInput source="name" validate={[required()]} />
            <RichTextInput label="Description" source="description" toolbar={<RichTextInputToolbar size="small" />}/>
       
            <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                { id: 0, name: 'Unpublish' },
                { id: 1, name: 'Publish' },
            ]} />
        </SimpleForm>
    </Edit>
);

export default SocketsEdit;
