/* eslint react/jsx-key: off */
import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextField,
    TextInput,
    required,
    RadioButtonGroupInput
} from 'react-admin';

import {    RichTextInput, 	
            RichTextInputToolbar,
            RichTextInputLevelSelect,
            FormatButtons,
            ListButtons,
            LinkButtons,
            QuoteButtons,
            ClearButtons, } from 'ra-input-rich-text';

const MailsCreate = props => (
    <Create {...props}>
        <SimpleForm redirect="list">
            <TextField source="id" />
            <TextInput source="name" validate={[required()]} />
            {/* <RichTextInput label="Description" source="description" toolbar={<RichTextInputToolbar size="small" />}/> */}
            <RichTextInput
                toolbar={
                    <RichTextInputToolbar>
                        {/* <RichTextInputLevelSelect size={10} /> */}
                        <FormatButtons size={10} />
                        <ListButtons size={10} />
                        <LinkButtons size={10} />
                        <QuoteButtons size={10} />
                        <ClearButtons size={10} />
                    </RichTextInputToolbar>
                }
                label="Description"
                source="description"
                {...props}
            />
            <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                { id: 0, name: 'Unpublish' },
                { id: 1, name: 'Publish' },
            ]} />
        </SimpleForm>
    </Create>
);

export default MailsCreate;
