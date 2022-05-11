import * as React from 'react';
import { Show, SimpleShowLayout, TextField, RichTextField } from 'react-admin'; // eslint-disable-line import/no-unresolved

const RoleShow = props => (
    <Show {...props}>
        <SimpleShowLayout>
            {/* <TextField source="id" /> */}
            <TextField source="name" />
            <RichTextField source="description" label={'Description'} />
        </SimpleShowLayout>
    </Show>
);

export default RoleShow;
