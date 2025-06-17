import { FileUpload } from 'primereact/fileupload';
import React, { useState } from 'react';

const InputField = ({ validation, selectImage }: any) => {
  return (
    <React.Fragment>
      <div>
        <FileUpload
          name="image"
          accept="image/*"
          maxFileSize={5000000}
          chooseLabel={selectImage}
          onSelect={(e: any) => {
            const file = e.files[0];

            validation.setFieldValue('image', file);
            e.files[0].status = 'completed';
          }}
          mode="advanced"
          cancelLabel="Cancelar"
          uploadLabel="Cargar"
          previewWidth={100}
        />

        {/* Imagen local    src={`http://localhost:3010${validation.values.image}`} */}

        {validation.values.image != null ? (
          <div>
            {' '}
            <img
              style={{ width: 150, marginBottom: 10 }}
              src={`${validation.values.image}` || 'img/no-image.png'}
              alt=""
            />
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default InputField;
