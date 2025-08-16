/**
 * Course questions page component
 * 
 * Environment Variables:
 * - None
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import QuestionCard from '../components/QuestionCard.jsx';
import toast from 'react-hot-toast';

const CourseQuestions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    year: '',
    exam_type: '',
    question_type: '',
    difficulty: '',
    q: '',
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchCourse();
    fetchQuestions();
  }, [id, page, filters]);

  const fetchCourse = async () => {
    try {
      const response = await api.get(`/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      toast.error('Failed to fetch course');
      console.error(error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = { course: id, page, limit: 12, ...filters };
      
      const response = await api.get('/questions', { params });
      setQuestions(response.data.questions);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchQuestions();
  };

  if (!course) {
    return <div className="text-center py-12">Loading course...</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/courses')}
          className="text-blue-400 hover:text-blue-300 mb-4"
        >
          ← Back to Courses
        </button>
        <h1 className="text-3xl font-bold">{course.name}</h1>
        <p className="text-gray-400">{course.code}</p>
        <p className="mt-2">{course.description}</p>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Search questions..."
              className="flex-1 px-4 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm">Year</label>
            <select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm">Exam Type</label>
            <select
              name="exam_type"
              value={filters.exam_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="viva">Viva</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm">Question Type</label>
            <select
              name="question_type"
              value={filters.question_type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="MCQ">MCQ</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="problem">Problem</option>
            </select>
          </div>
          
          <div>
            <label className="block mb-1 text-sm">Difficulty</label>
            <select
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p>Loading questions...</p>
        </div>
      ) : (
        <>
          {questions.length === 0 ? (
            <div className="text-center py-12">
              <p>No questions found</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {questions.map((question) => (
                  <QuestionCard key={question._id} question={question} />
                ))}
              </div>
              
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CourseQuestions;