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
    ReferenceField,
    required
} from 'react-admin';

const CommentsShow = () => {
    const controllerProps = useShowController();
    const [locale] = useLocaleState();
    return (
        <ShowContextProvider value={controllerProps}>
            <ShowView >
                <ReferenceField label="postId" source="postId" reference="posts">
                    <TextField source="title" />
                </ReferenceField>
                <RichTextField label="Body" source="body" />
            </ShowView>
        </ShowContextProvider>
    );
};

export default CommentsShow;
