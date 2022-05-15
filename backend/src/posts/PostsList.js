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
    RichTextField,
    useGetIdentity,
    useResourceContext ,
    ChipField
} from "react-admin"

import { makeStyles } from '@material-ui/core/styles';

import { useMediaQuery } from '@mui/material';
import IconEvent from '@mui/icons-material/Event';
import { RichTextInput } from 'ra-input-rich-text';

// import authProvider from '../authProvider';

const ListActions = () => {
    const { isLoading, permissions } = usePermissions();
    const { loaded, identity } = useGetIdentity();
    const resource = useResourceContext();
    return <TopToolbar>
                {console.log("identity :", identity)}
                {console.log("resource :", resource)}
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


const MyImageField = ({source, record = {}, ...rest}) => {
    let clonedRecord = JSON.parse(JSON.stringify(record));
    // clonedRecord[source] = process.env.REACT_APP_BASE_PATH + clonedRecord[source];
    // return <ImageField source={source} record={clonedRecord} {...rest}/>;

    console.log("MyImageField ")
    console.log(clonedRecord)
};
    
export const PostsList = () => {
    const classes = useStyles();
    const isSmall = useMediaQuery(theme => theme.breakpoints.down('sm'));

    useEffect(()=>{
        // console.log("useEffect authProvider.getPermissions()  : ", authProvider.getPermissions() )
    }, [])


    return ( <List actions={<ListActions/>} filters={postFilters} >
        {isSmall ? (
                <SimpleList
                    primaryText={record => record.title}
                    secondaryText={record => `${record.body} body`}
                    // tertiaryText={record => new Date(record.published_at).toLocaleDateString()}
                />
            ) : (
        <Datagrid rowClick="show">
            <TextField source="title" label={'Title'} />
            <RichTextField source="body" label={'Body'} />
            <DateField source="createdAt" label={'Created at'} showTime locales="th-TH"/>
             

            {/* <ReferenceArrayField
                        label="Follows"
                        reference="users"
                        source="follows"
                        // sortBy="roles.name"
                        // sort={{ field: 'name', order: 'ASC' }}
                        // cellClassName={classes.hiddenOnSmallScreens}
                        // headerClassName={classes.hiddenOnSmallScreens}
                    >
                <SingleFieldList>
                    <ChipField source="name" size="small" />
                </SingleFieldList>
            </ReferenceArrayField> */}

            <ShowButton />
            <EditButton />
            {/* <MyImageField source="title"></MyImageField> */}
            <DeleteWithConfirmButton />
        </Datagrid>)
    }
    </List>
    )
}

export default PostsList;