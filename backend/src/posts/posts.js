import React, {useEffect} from "react";
import {List, Datagrid, TextField, ReferenceField,  TopToolbar,
    FilterButton,
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
    ArrayInput, 
    SimpleFormIterator,
    required,
    DateInput,
    AutocompleteInput,
    ReferenceArrayInput, 
    SelectArrayInput, 
    AutocompleteArrayInput ,
    ReferenceArrayField, 
    SingleFieldList, 
    DateField,
    RichTextField
} from "react-admin"

import { makeStyles } from '@material-ui/core/styles';

import { useMediaQuery } from '@mui/material';
import IconEvent from '@mui/icons-material/Event';
import { RichTextInput } from 'ra-input-rich-text';

import authProvider from './authProvider';

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

const useStyles = makeStyles(theme => ({
    title: {
        maxWidth: '20em',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    hiddenOnSmallScreens: {
        [theme.breakpoints.down('md')]: {
            display: 'none',
        },
    },
    publishedAt: { fontStyle: 'italic' },
}));
    
export const PostList = () => {
    const classes = useStyles();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    // const { permissions } = usePermissions();

  useEffect(()=>{
    // authProvider
    // console.log("useEffect PostList : ", permissions)

    console.log("useEffect authProvider.getPermissions()  : ", authProvider.getPermissions() )
  }, [])
  
    
    /*
     "title": "x",
          "views": 122,
          "user_id": "1"
    */

    return ( <List actions={<ListActions/>} filters={postFilters} >

        {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.body} body`}
                    // tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
        <Datagrid rowClick="show">
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
            <TextField source="title" label={'Title'} />
            <RichTextField source="body" label={'Body'} />

            <DateField source="createdAt" label={'Created at'} showTime locales="th-TH"/>
             {/* // createdAt */}
            {/* <ReferenceArrayField
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
            </ReferenceArrayField> */}

            {/* <ReferenceField label="Owner" source="user_id" reference="users">
                <TextField source="displayName"/>
            </ReferenceField> */}

            <ShowButton />
            <EditButton />
            <DeleteWithConfirmButton />
        </Datagrid>)
    }
    </List>
    )
}


export const PostCreate = props => (
    <Create {...props}>
        <SimpleForm>
            {/* <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput> */}
            <TextInput source="title" validate={[required()]} />
            {/* <TextInput source="views" validate={[required()]}/> */}
            {/* <TextInput multiline source="user_id" validate={[required()]} /> */}
            <RichTextInput label="Body" source="body" />

            <FileInput source="files" label="Related files" multiple={true} maxSize={5000000} 
                    validateFileRemoval={(file, _record) => {
                        console.log("validateFileRemoval :", file, _record)

                    }}>
                
                {/* <FileField source="src" title="title" /> */}
                <ImageField sx={{
                                        width: "100px",
                                        color: 'success.main',
                                    }} source="src" title="title" />
            </FileInput> 
            
            {/* <ArrayInput
                    source="backlinks"
                    // defaultValue={backlinksDefaultValue}
                    validate={[required()]}
                >
                    <SimpleFormIterator disableReordering >
                        <DateInput source="date" />
                        <TextInput source="url" />
                    </SimpleFormIterator>
            </ArrayInput>
            <AutocompleteInput source="category" choices={[
                { id: 'programming', name: 'Programming' },
                { id: 'lifestyle', name: 'Lifestyle' },
                { id: 'photography', name: 'Photography' },
            ]} /> */}

            {/* <ReferenceInput  source="user_id"  reference="users" >
                <SelectInput optionText="username" label="User" validate={[required()]} helperText="helperText" />
            </ReferenceInput> */}

            {/* <ReferenceArrayInput label="Roles" source="roles" reference="roles">
                <AutocompleteArrayInput />
            </ReferenceArrayInput> */}
        </SimpleForm>
    </Create>
);

const PostTitle = () => {
    const record = useRecordContext();
    return <span>Post {record ? `"${record.title}"` : ''}</span>;
};


// https://github.com/jaydenseric/apollo-upload-client
// const [mutate] = useMutation(MUTATION);
export const PostEdit = (props) => {
    return  <Edit title={<PostTitle/>}>
                <SimpleForm>
                    {/* <ReferenceInput source="userId" reference="users">
                        <SelectInput optionText="id" />
                    </ReferenceInput> */}
                    {/* <TextInput source="id" /> */}
                    <TextInput source="title" />
                    <RichTextInput label="Body" source="body" />
                    {/* <TextInput multiline source="body" /> */}
                    <FileInput source="files" label="Related files" multiple={true} maxSize={5000000} 
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

                        <ImageField sx={{
                                        width: "100px",
                                        color: 'success.main',
                                    }} source="base64" title="fileName" />
                    </FileInput> 

                    {/* <input type="file" multiple required onChange={onChange} /> */}

                    {/* <ReferenceManyField label="Comments" reference="files" target="post_id">
                        <Datagrid>
                            <TextField source="body" />
                            <DateField source="created_at" />
                            <EditButton />
                        </Datagrid>
                    </ReferenceManyField> */}
                    {/* <ReferenceInput  source="user_id"  reference="users" >
                        <SelectInput optionText="username" label="User" validate={[required()]} helperText="helperText" />
                    </ReferenceInput>

                    <ReferenceArrayInput source="roles" reference="roles">
                        <AutocompleteArrayInput />
                    </ReferenceArrayInput> */}
                </SimpleForm>
            </Edit>
};