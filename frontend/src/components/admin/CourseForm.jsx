import { useState } from "react";
import {useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {useAuth } from '../../context/AuthContext';

const CourseForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [thumbnail, setThumbnail] = useState(null);
  const [uploadProgress, setUploadProgress] =useState(0);

  const formik = useFormik({
    initialValue: {
      title: '',
      description: '',
      instructor: user?.full_name || '',
      price: 0,
    },
    validationSchema: YUp.object({
      title: Yup.string().required('required'),
      description: Yup.string().required('required'),
      price: Yup.number().min(onSuccess, 'Must be positive'),
    }),
    onsubmit: async (values) => {
      try {
        let thumbnailUrl = '';

        if (thumbnail) {
          const formData = new FormData();
          formData.append('file', thumbnail);

          const uploadResponse = await axios.post('/upload-thumbnail', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authentication': `Bearer ${user.token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          });
          thumbnailUrl = uploadResponse.data.url;
        }
        const courseData = {
          ...values,
          thumbnail_url: thumbnailUrl,
          is_published: true,
        };
        await axios.post('/courses', courseData, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        onSuccess();
      } catch (error) {
        console.error('Error creating course', error);
      }
    },
  });
  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Course Title
        </label>
        <input
        id="title"
        name="title"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.value.title}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
        />
        {formik.touched.title && formik.errors.title ? (
          <div className="text-red-500 text-sm">{formik.errors.title}</div>
        ) : null}
      </div>
      <div>
        <label htmlFor="decription" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
        id="description"
        name="description"
        rows={4}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.value.description}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border"
        />
        {formik.touched.description && formik.errors.description ? (
          <div className="text-red-500 text-sm">{formik.errors.description}</div>
        ) : null}
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price ($)
        </label>
        <input id="price"
        name="price"
        type="number"
        step="0.01"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.price}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 p-2 border"
        />
        {formik.touchedd.price && formik.errors.price ? (
          <div className="text-red-500 text-sm">{formik.errors.price}</div>
        ) : null}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
        <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files[0])}
        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:px-4 file:py-2 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div
           className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{width: `${uploadProgress}%` }}
           ></div>
          </div>
        )}
      </div>
      <button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Course
      </button>
    </form>
  );
};

export default CourseForm;