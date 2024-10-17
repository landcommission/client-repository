import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Image as ImageIcon } from 'lucide-react';

const EventForm = ({ isEdit, onSubmit, onClose, initialData }) => {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isEdit && initialData) {
      const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '';
      const formattedTime = initialData.time || '';
      setEventData({
        title: initialData.title || '',
        description: initialData.description || '',
        date: formattedDate,
        time: formattedTime,
        location: initialData.location || '',
        organizer: initialData.organizer || '',
      });
      setImagePreview(initialData.imagePath ? `${process.env.REACT_APP_BACKEND_URL}${initialData.imagePath}` : null);
    }
  }, [isEdit, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEventData({ ...eventData, description: data });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      if (eventData[key] !== undefined && eventData[key] !== null && eventData[key] !== '') {
        formData.append(key, eventData[key]);
      }
    });
    if (image) {
      formData.append('image', image);
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="title"
        value={eventData.title}
        onChange={handleInputChange}
        placeholder="Event Title"
        className="w-full p-2 border rounded"
        required
      />
      <div className="w-full">
        <CKEditor
          editor={ClassicEditor}
          data={eventData.description}
          onChange={handleEditorChange}
          config={{
            toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'insertTable', 'mediaEmbed', '|', 'undo', 'redo'],
            heading: {
              options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
              ]
            },
            image: {
              toolbar: ['imageTextAlternative', '|', 'imageStyle:alignLeft', 'imageStyle:full', 'imageStyle:alignRight'],
              styles: ['full', 'alignLeft', 'alignRight']
            },
            table: {
              contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
            },
            mediaEmbed: {
              previewsInData: true
            },
          }}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="time"
          name="time"
          value={eventData.time}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <input
        type="text"
        name="location"
        value={eventData.location}
        onChange={handleInputChange}
        placeholder="Event Location"
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="text"
        name="organizer"
        value={eventData.organizer}
        onChange={handleInputChange}
        placeholder="Event Organizer"
        className="w-full p-2 border rounded"
        required
      />
      <div className="relative">
        <input
          type="file"
          onChange={handleImageChange}
          className="hidden"
          id="image-upload"
          accept="image/*"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center w-full p-2 border border-dashed rounded text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <ImageIcon size={20} className="mr-2" />
          {imagePreview ? 'Change Image' : 'Upload Image'}
        </label>
        {imagePreview && (
          <div className="mt-2">
            <img src={imagePreview} alt="Preview" className="max-w-full h-auto rounded" />
          </div>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          {isEdit ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default EventForm;