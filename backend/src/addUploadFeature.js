var _ = require('lodash');

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadCapabilities = dataProvider => ({
    ...dataProvider,
    create: async(resource, params) => {
      

        switch (resource){
            case "users":{
                console.log(" >>> resource, params : ", resource, params)
                if( !_.isEmpty(params.data.image) ){
                    
                    if(params.data.image.rawFile){
                        let image =    await convertFileToBase64(params.data.image)
                        console.log(" >>> image : ", image)
                      
                        return dataProvider.create(resource, {
                            ...params,
                            data: {
                                ...params.data,
                                image //:[image]
                            },
                        })
                    }
                }

                return dataProvider.create(resource, params);
                
            }
        }

        console.log("#1", params.data)
        console.log("#2", _.isEmpty(params.data.files))
        if ( _.isEmpty(params.data.files) ) {
            // fallback to the default implementation
            return dataProvider.create(resource, params);
        }


        // The posts edition form uses a file upload widget for the pictures field.
        // Freshly dropped pictures are File objects
        // and must be converted to base64 strings
        const newPictures = params.data.files.filter(
            p => p.rawFile instanceof File
        );
        const formerPictures = params.data.files.filter(
            p => !(p.rawFile instanceof File)
        );

        return Promise.all(newPictures.map(convertFileToBase64))
            .then(base64Pictures =>{
                return base64Pictures
            }
               
            )
            .then(transformedNewPictures =>
                dataProvider.create(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        files: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            );
    },
    update: async(resource, params) => {

        switch (resource){
            case "users":{

                console.log("update : ", params.data.image)
                if(params.data.image){

                    if(params.data.image.rawFile){
                        let image =    await convertFileToBase64(params.data.image)
                        console.log(" >>> image : ", image)
                      
                        return dataProvider.update(resource, {
                            ...params,
                            data: {
                                ...params.data,
                                image: [image]
                            },
                        })
                    }
                    
                }
                
            }
        }

        if (!params.data.files) {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }


        // The posts edition form uses a file upload widget for the pictures field.
        // Freshly dropped pictures are File objects
        // and must be converted to base64 strings
        const newPictures = params.data.files.filter(
            p => p.rawFile instanceof File
        );
        const formerPictures = params.data.files.filter(
            p => !(p.rawFile instanceof File)
        );

        return Promise.all(newPictures.map(convertFileToBase64))
            .then(base64Pictures =>{
                return base64Pictures
            }
               
            )
            .then(transformedNewPictures =>
                dataProvider.update(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        files: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            );
    },
});

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        console.log("convertFileToBase64 :", file)
        reader.onload = () => resolve({
            fileName:_.isEmpty(file.fileName) ? (_.isEmpty(file.title) ? file.name: "") : file.fileName,
            base64: reader.result,
            type: file.rawFile.type,
            size: file.rawFile.size,
            lastModified: file.rawFile.lastModified
        });
        reader.onerror = reject;
    });

export default addUploadCapabilities;
