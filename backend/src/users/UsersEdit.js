/* eslint react/jsx-key: off */
import React, {useEffect} from "react";
import {
    Edit,
    SimpleForm,
    TextInput,
    useRecordContext,
    required,
    ReferenceArrayInput, 
    AutocompleteArrayInput,
    FileInput,
    ImageField,
    TextField,
    RadioButtonGroupInput
} from "react-admin"

const PostTitle = () => {
    const record = useRecordContext();
    return <span>User {record ? `"${record.username}"` : ''}</span>;
};

const PreviewImage = ({ record, source }) => {
    console.log("PreviewImage : ",  record, source)

    if(record.base64 === null){
        console.log("PreviewImage : null")
        return <ImageField record={null} source={null} />
    }

    console.log("PreviewImage : null nullnullnull")
    if (typeof (record) == "string") {
        record = {
            [source]: record
        }
    }
    return <ImageField record={record} source={source} />
}

export const UsersEdit = () => {
    // const [mutate] = useMutation(MUTATION);
    const record = useRecordContext();
    useEffect(()=>{
        console.log("useEffect > PostEdit : ", record)
    }, [])

    return  <Edit title={<PostTitle/>}>
                <SimpleForm>
                    <FileInput source="image" label="Profile" multiple={false} maxSize={5000000} helperText={"helperText"}>
                        {/* <ImageField source="base64" title="title" /> */}
                        <ImageField source="base64" />
                    </FileInput> 
                    <TextInput label="Display name" source="displayName"  validate={[required()]}/>
                    <TextField label="Username" source="username" />
                    <TextField label="Email" source="email" type="email"/>
                    <ReferenceArrayInput source="roles" reference="roles">
                        <AutocompleteArrayInput />
                    </ReferenceArrayInput>
                    <RadioButtonGroupInput source="isActive" defaultValue={"Unactive"} choices={[
                        { id: "Unactive", name: 'Unactive' },
                        { id: "Active", name: 'Active' },
                    ]} />
                </SimpleForm>
            </Edit>
};

export default UsersEdit;
