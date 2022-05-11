import React, {useEffect} from "react";
import {List, Datagrid, TextField, ReferenceField,  TopToolbar,
    FilterButton,
    PasswordInput,
    CreateButton,
    ExportButton,
    Button,
    EditButton,
    DeleteWithConfirmButton,
    Edit,
    Create,
    SimpleForm,
    ReferenceInput,
    SelectInput,
    TextInput,
    useRecordContext,
    FileInput,
    FileField,
    ImageField,
    SimpleList,
    usePermissions,
    ShowButton,
    required,
    RichTextField
} from "react-admin"

import { useMediaQuery } from '@mui/material';
import IconEvent from '@mui/icons-material/Event';
import { RichTextInput } from 'ra-input-rich-text';
import { gql, useMutation } from "@apollo/client";

const ListActions = () => {
    const { isLoading, permissions } = usePermissions();
    return <TopToolbar>
        {/* <FilterButton filters={ [
                                   <TextInput source="q" label="Search" alwaysOn />,
                                   <ReferenceInput source="userId" label="User" reference="users">
                                       <SelectInput optionText="name" />
                                   </ReferenceInput>
                                ] 
                              }/> */}
        <CreateButton/>
        <ExportButton/>
        {/* Add your custom actions */}
        <Button
            onClick={() => { console.log( permissions, isLoading); }}
            label="Show calendar"
        >
            <IconEvent/>
        </Button>
    </TopToolbar>
};

const postFilters = [
    <TextInput source="q" label="Search" alwaysOn />,
    <ReferenceInput source="title" label="User" reference="users">
        <SelectInput optionText="name" />
    </ReferenceInput>,
];

const SocketsList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    // const { permissions } = usePermissions();

    useEffect(()=>{
        // authProvider
        // console.log("useEffect PostList : ", permissions)
    }, [])
  
    return ( <List actions={<ListActions/>} filters={postFilters} >

        {isSmall ? (
                <SimpleList
                    primaryText={record => record.name}
                    // secondaryText={record => `${record.views} views`}
                    // tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
        <Datagrid rowClick="show" >
            {/* <ReferenceField source="userId" reference="users">
                <TextField source="id" />
            </ReferenceField> */}

            {/* <ReferenceField source="userId" reference="users" label={'==NAME=='}>
                <TextField source="name"  />
            </ReferenceField> */}
            {/* <ReferenceField source="userId" reference="users" label={'==EMAIL=='} >
                <TextField source="email" />
            </ReferenceField> */}
            {/* <TextField source="id" label={'==ID=='} /> */}
            <TextField source="name" label={'name'} />
            <RichTextField source="description" label={'Description'} />

            {/* <ShowButton /> */}
            <EditButton />
            <DeleteWithConfirmButton />
        </Datagrid>)
    }
    </List>
    )
}

export default SocketsList;