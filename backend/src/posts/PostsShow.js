import * as React from 'react';
import {
    ArrayField,
    BooleanField,
    CloneButton,
    ChipField,
    Datagrid,
    DateField,
    EditButton,
    NumberField,
    ReferenceArrayField,
    ReferenceManyField,
    RichTextField,
    SelectField,
    ShowContextProvider,
    ShowView,
    SingleFieldList,
    Tab,
    TabbedShowLayout,
    TextField,
    UrlField,
    useShowController,
    useLocaleState,
    useRecordContext,
    required
} from 'react-admin';

const PostsShow = () => {
    const controllerProps = useShowController();
    const [locale] = useLocaleState();
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView >
                <TabbedShowLayout>
                    <Tab label="post.form.summary">
                        {/* <TextField source="id" />
                        <TextField source="title" />
                        {controllerProps.record &&
                            controllerProps.record.title ===
                                'Fusce massa lorem, pulvinar a posuere ut, accumsan ac nisi' && (
                                <TextField source="teaser" />
                            )}
                        <ArrayField source="backlinks">
                            <Datagrid bulkActionButtons={false}>
                                <DateField source="date" />
                                <UrlField source="url" />
                            </Datagrid>
                        </ArrayField> */}

                        <TextField source="title" validate={[required()]} />
                        <RichTextField label="Body" source="body" />

                        {/*
                        <FileInput source="files" label="Related files" multiple={true} maxSize={5000000} 
                                validateFileRemoval={(file, _record) => {
                                    console.log("validateFileRemoval :", file, _record)

                                }}>
                            
                            <ImageField sx={{
                                                    width: "100px",
                                                    color: 'success.main',
                                                }} source="src" title="title" />
                        </FileInput>  */}
                    </Tab>
                    {/* <Tab label="post.form.body">
                        <RichTextField
                            source="body"
                            stripTags={false}
                            label={false}
                        />
                    </Tab>
                    <Tab label="post.form.miscellaneous">
                        <ReferenceArrayField
                            reference="tags"
                            source="tags"
                            sort={{ field: `name.${locale}`, order: 'ASC' }}
                        >
                            <SingleFieldList>
                                <ChipField source={`name.${locale}`} />
                            </SingleFieldList>
                        </ReferenceArrayField>
                        <DateField source="published_at" />
                        <SelectField
                            source="category"
                            choices={[
                                { name: 'Tech', id: 'tech' },
                                { name: 'Lifestyle', id: 'lifestyle' },
                            ]}
                        />
                        <NumberField source="average_note" />
                        <BooleanField source="commentable" />
                        <TextField source="views" />
                        <CloneButton />
                    </Tab> */}
                    <Tab label="post.form.comments">
                        <ReferenceManyField
                            reference="comments"
                            target="id"
                            sort={{ field: 'created_at', order: 'DESC' }}
                        >
                            <Datagrid>
                                <DateField source="created_at" />
                                <TextField source="author.name" />
                                <TextField source="body" />
                                <EditButton />
                            </Datagrid>
                        </ReferenceManyField>
                        {/* <CreateRelatedComment /> */}
                    </Tab>
                </TabbedShowLayout>
            </ShowView>
        </ShowContextProvider>
    );
};

export default PostsShow;
