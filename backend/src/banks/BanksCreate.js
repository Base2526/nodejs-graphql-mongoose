/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextField,
    TextInput,
    required,
    RadioButtonGroupInput,
    SelectField
} from 'react-admin';

import { RichTextInput, RichTextInputToolbar } from 'ra-input-rich-text';

const BanksCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextField source="id" />
            <TextInput source="name" validate={[required()]} />
            <RichTextInput label="Description" source="description" toolbar={<RichTextInputToolbar size="small" />}/>

            <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                { id: 0, name: 'Unpublish' },
                { id: 1, name: 'Publish' },
            ]} />


        </SimpleForm>
    </Create>
);

export default BanksCreate;
