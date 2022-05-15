import React, {useEffect} from "react";
import {List, Datagrid, TextField,  TopToolbar,
    CreateButton,
    ExportButton,
    Button,
    EditButton,
    DeleteWithConfirmButton,
    ReferenceInput,
    SelectInput,
    TextInput,
    SimpleList,
    usePermissions,
    ReferenceArrayField,
    ImageField,
    SingleFieldList, 
    ChipField,
    DateField 
} from "react-admin"

import { makeStyles } from '@material-ui/core/styles';

import { useMediaQuery } from '@mui/material';
import IconEvent from '@mui/icons-material/Event';
const ListActions = () => {
    const { isLoading, permissions } = usePermissions();
    return <TopToolbar>
        <CreateButton/>
        <ExportButton/>
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



const useImageFieldStyles = makeStyles(theme => ({
    image: { // This will override the style of the <img> inside the <div>
        width: 50,
        height: 50,
    }
}));
    
export const UsersList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    const imageFieldClasses = useImageFieldStyles();
  
    return ( <List actions={<ListActions/>} filters={postFilters} >

        {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
                    // tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
        <Datagrid rowClick="show" >
            <ImageField classes={imageFieldClasses} source="image.0.base64" label={'Profile'} />
            <TextField source="displayName" label={'Username'} />
            <TextField source="email" label={'Email'} />

            <ReferenceArrayField
                        label="Roles"
                        reference="roles"
                        source="roles"
                        sortBy="roles.name"
                        sort={{ field: 'name', order: 'ASC' }}
                        // cellClassName={classes.hiddenOnSmallScreens}
                        // headerClassName={classes.hiddenOnSmallScreens}
                    >
                <SingleFieldList>
                    <ChipField source="name" size="small" />
                </SingleFieldList>
            </ReferenceArrayField>

            {/* RadioButtonGroupInput */}
            {/* <ReferenceField label="User" source="user_id" reference="users"> */}
                <TextField label={"Active"} source="isActive" />
            {/* </ReferenceField> */}

            <DateField source="lastAccess" label={'Last access'} showTime locales="th-TH"/>
            <EditButton />
            <DeleteWithConfirmButton />
        </Datagrid>)
    }
    </List>
    )
}
export default UsersList;