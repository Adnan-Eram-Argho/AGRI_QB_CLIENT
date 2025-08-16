/**
 * Upload question page component
 * 
 * Environment Variables:
 * - VITE_IMAGEKIT_PUBLIC_KEY: ImageKit public key
 * - VITE_IMAGEKIT_URL_ENDPOINT: ImageKit URL endpoint
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../services/api.js';
import ImageUploader from '../components/ImageUploader.jsx';
import toast from 'react-hot-toast';

const UploadQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    course_id: '',
    year: new Date().getFullYear(),
    exam_type: 'final',
    question_type: 'short',
    difficulty: 'medium',
    images: [],
    attachments: [],
    tags: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchCourses();
  }, [user, navigate]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data.courses);
    } catch (error) {
      toast.error('Failed to fetch courses');
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImagesChange = (images) => {
    setFormData({
      ...formData,
      images,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.course_id) {
      toast.error('Please select a course');
      return;
    }
    
    setLoading(true);
    
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await api.post('/questions', {
        ...formData,
        tags,
      });
      
      toast.success('Question uploaded successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload question');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Upload Question</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="body" className="block mb-2">Question</label>
          <textarea
            id="body"
            name="body"
            value={formData.body}
            onChange={handleChange}
            rows={6}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="course_id" className="block mb-2">Course</label>
            <select
              id="course_id"
              name="course_id"
              value={formData.course_id}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name} ({course.code})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="year" className="block mb-2">Year</label>
            <select
              id="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="exam_type" className="block mb-2">Exam Type</label>
            <select
              id="exam_type"
              name="exam_type"
              value={formData.exam_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="viva">Viva</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="question_type" className="block mb-2">Question Type</label>
            <select
              id="question_type"
              name="question_type"
              value={formData.question_type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="MCQ">MCQ</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="problem">Problem</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="difficulty" className="block mb-2">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="tags" className="block mb-2">Tags (comma separated)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., macroeconomics, supply-demand"
          />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2">Images</label>
          <ImageUploader onImagesChange={handleImagesChange} />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 transition"
        >
          {loading ? 'Uploading...' : 'Upload Question'}
        </button>
      </form>
    </div>
  );
};

export default UploadQuestion;