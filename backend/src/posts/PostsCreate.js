import React, {useEffect} from "react";
import {
        Create,
        SimpleForm,
        TextInput,
        FileInput,
        ImageField,
        required,
        NumberInput, 
        SimpleFormIterator,
        ArrayInput,
        RadioButtonGroupInput,
        ReferenceArrayInput, 
        AutocompleteArrayInput,
        ReferenceInput,
        SelectInput,
        useNotify,
        useRedirect,
        useFormContext,
        Toolbar,
        SaveButton,
        useCreate,
        DateInput,
        FileField
        } from "react-admin"

import { RichTextInput } from 'ra-input-rich-text';

const phonesDefaultValue = [
    {
        bank: '',
    },
];





const PostsCreate = props =>{
    const notify = useNotify();
    const redirect = useRedirect();
    const [create, { isLoading, error }] = useCreate();

    const handleSave = async(params) => {
        let result = await  create("posts", {data: params})
        console.log("handleSave : ",params, result);
    }

    const PostCreateToolbar = props => {
        const notify = useNotify();
        const redirect = useRedirect();
        // const { reset } = useFormContext();
    
        return (
            <Toolbar>
                <SaveButton label="SAVE" type="submit" />
                <SaveButton type="button" label="Draft" variant="text" onClick={()=>{
                    console.log("Draft")
                }} />
    
                
                {/* <SaveButton
                    label="post.action.save_and_show"
                    type="button"
                    variant="text"
                    mutationOptions={{
                        onSuccess: data => {
                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });
                            redirect('show', 'posts', data.id);
                        },
                    }}
                />
                <SaveButton
                    label="post.action.save_and_add"
                    type="button"
                    variant="text"
                    mutationOptions={{
                        onSuccess: () => {
                            reset();
                            window.scrollTo(0, 0);
                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });
                        },
                    }}
                />
                <SaveButton
                    label="post.action.save_with_average_note"
                    type="button"
                    variant="text"
                    mutationOptions={{
                        onSuccess: data => {
                            notify('ra.notification.created', {
                                type: 'info',
                                messageArgs: { smart_count: 1 },
                            });
                            redirect('show', 'posts', data.id);
                        },
                    }}
                    transform={data => ({ ...data, average_note: 10 })}
                /> */}
            </Toolbar>
        );
    };

    return (
        <Create {...props}  mutationOptions={(data)=>{
            notify(`Changes saved`);
            redirect(`/posts/${data.id}`);
        }}>
            <SimpleForm /*toolbar={<PostCreateToolbar />}  onSubmit={handleSave}*/ >
                <TextInput label="Title" source="title" helperText={"helperText"} validate={[required()]} />
                <TextInput label="Name subname" source="nameSubname" helperText={"helperText"} validate={[required()]} />
                <TextInput label="ID card" source="idCard" helperText={"helperText"} />
                {/* เลขบัตรประชาชน */}
                <NumberInput label="Number" source="number" helperText={"helperText"} validate={[required()]} />
                {/* Date Tranfer */}
                <DateInput source="dateTranfer" helperText={"helperText"} validate={[required()]}/>


                <ArrayInput source="banks" >
                    <SimpleFormIterator disableReordering>
                        <NumberInput label={"Bank Id"} source="user_bank" validate={[required()]} />
                        {/* <AutocompleteInput label={"Bank"} source="bank" validate={[required()]} choices={[
                            { id: 'programming', name: 'Programming' },
                            { id: 'lifestyle', name: 'Lifestyle' },
                            { id: 'photography', name: 'Photography' },
                        ]} /> */}
    
                        {/* <ReferenceInput label={"Bank"} source="banks" reference="banks" validate={[required()]} /> */}
                    
                        <ReferenceInput label="Bank" source="banks" reference="banks">
                            <SelectInput label="Bank" optionText="name" validate={[required()]} />
                        </ReferenceInput>
                    </SimpleFormIterator>
                </ArrayInput>
     
                {/* <RichTextInput label="Body" source="body" helperText={"helperText"} /> */}
                <RichTextInput label="Body" source="body" fullWidth validate={required()}  css={{'.ql-editor': {minHeight: 300}}}/>
    
                <FileInput source="files" accept="image/png, image/jpg, image/jpeg" label="Files" multiple={true} maxSize={5000000} helperText={"helperText"}>
                    <ImageField source="src" title="title" />
                    {/* <FileField source="src" title="title" /> */}
                </FileInput> 
                
                <ReferenceArrayInput  source="follows" reference="users" >
                    <AutocompleteArrayInput optionText="displayName" label="Follow" helperText={"helperText"} />
                </ReferenceArrayInput>

                <RadioButtonGroupInput source="isPublish" defaultValue={0} choices={[
                    { id: 0, name: 'Draft' },
                    { id: 1, name: 'Publish' },
                ]} />
    
            </SimpleForm>
        </Create>
        )
} ;

export default PostsCreate;
