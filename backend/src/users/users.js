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
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    ReferenceArrayField, SingleFieldList, ChipField,
    DateField 
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
    
export const UsersList = () => {
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    // const { permissions } = usePermissions();

    useEffect(()=>{
        // authProvider
        // console.log("useEffect PostList : ", permissions)
    }, [])
  
    return ( <List actions={<ListActions/>} filters={postFilters} >

        {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.views} views`}
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
            <TextField source="username" label={'Username'} />
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

            {/* lastAccess */}
            <DateField source="lastAccess" label={'Last access'} showTime locales="th-TH"/>

            {/* <ShowButton /> */}
            <EditButton />
            <DeleteWithConfirmButton />
        </Datagrid>)
    }
    </List>
    )
}

/*
 username
                            password
                            email
                            displayName
*/
// const emailValidation = (value, allValues) => {

//     console.log("emailValidation :", value, allValues)
//     if (!value) {
//         return 'The age is required';
//     }
//     if (value < 18) {
//         return 'Must be over 18';
//     }
//     return undefined;
// };
// const validateEmail = [required(), emailValidation];

const passwordValidation = (value, allValues) => {

    // password: 'sdddd', confirm_password
    // console.log("passwordValidation :", value, allValues)

    if (value.length < 5) {
        return 'Must be over 5 length';
    }

    if ( allValues.password !==  allValues.confirm_password) {
        return 'Password and Confirm password not match';
    }
    return undefined;
};
const validatePassword = [required(), passwordValidation];

export const UsersCreate = props => (
    <Create {...props}>
        <SimpleForm>
            {/* <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
            <TextInput label="Username" source="username"  validate={[required()]}/>
            <TextInput label="Email" source="email" type="email"  validate={[required()]}/>
            <PasswordInput label="Password" source="password" validate={validatePassword}/>
            <PasswordInput label="Confirm password" source="confirm_password"  validate={validatePassword}/>
            

            <ReferenceArrayInput source="roles" reference="roles">
                <AutocompleteArrayInput />
            </ReferenceArrayInput>
            {/* <TextInput multiline source="user_id" />
            <FileInput source="files" label="Related files" multiple={true} maxSize={5000000} 
                    validateFileRemoval={(file, _record) => {
                        console.log("validateFileRemoval :", file, _record)

                    }}>
                
                <ImageField sx={{
                                        width: "100px",
                                        color: 'success.main',
                                    }} source="src" title="title" />
            </FileInput>  */}
        </SimpleForm>
    </Create>
);

const PostTitle = () => {
    const record = useRecordContext();
    return <span>User {record ? `"${record.username}"` : ''}</span>;
};

export const UsersEdit = () => {
    // const [mutate] = useMutation(MUTATION);
    const record = useRecordContext();
    useEffect(()=>{
        console.log("useEffect > PostEdit : ", record)
    }, [])

    return  <Edit title={<PostTitle/>}>
                <SimpleForm>
                    <TextInput label="Username" source="username"  validate={[required()]}/>
                    <TextInput label="Email" source="email" type="email"  validate={[required()]}/>

                    

                    <ReferenceArrayInput source="roles" reference="roles">
                        <AutocompleteArrayInput />
                    </ReferenceArrayInput>
                    {/* <ReferenceInput source="userId" reference="users">
                        <SelectInput optionText="id" />
                    </ReferenceInput> */}
                    {/* <TextInput source="id" /> */}
                    {/* <TextInput source="title" />
                    <RichTextInput label="Body" source="title" /> */}
                    {/* <TextInput multiline source="body" /> */}
                    {/* <FileInput source="files" label="Related files" multiple={true} maxSize={5000000} 
                    validateFileRemoval={(file, _record) => {
                        console.log("validateFileRemoval :", file, _record)

                        // const promise = new Promise((_resolve, reject) => {
                        //     setRemoveImage({
                        //         fileName: `Image ID: ${file.id}`,
                        //         delete: async (result) => {
                        //             await mutate(
                        //                 ['deleteImages', { ids: [file.id] }],
                        //                 () => dataProvider.deleteImages({ ids: [file.id] })
                        //             );
                        //             return _resolve(result);
                        //         },
                        //         cancel: reject,
                        //     });
                        // });
                        // setShowModal(true);

                        // return promise.then((result) => {
                        //     console.log('Image removed!');
                        // });
                    }}>
                        {/* <FileField source="base64" target="base64" title="fileName" /> */}
{/* 
                        <ImageField sx={{
                                        width: "100px",
                                        color: 'success.main',
                                    }} source="base64" title="fileName" />
                    </FileInput> */}

                    {/* <input type="file" multiple required onChange={onChange} /> */}

                    {/* <ReferenceManyField label="Comments" reference="files" target="post_id">
                        <Datagrid>
                            <TextField source="body" />
                            <DateField source="created_at" />
                            <EditButton />
                        </Datagrid>
                    </ReferenceManyField> */}
                </SimpleForm>
            </Edit>
};