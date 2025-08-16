/**
 * Admin panel page component
 * 
 * Environment Variables:
 * - None
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../services/api.js';
import QuestionCard from '../components/QuestionCard.jsx';
import CSVUploader from '../components/CSVUploader.jsx';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    
    fetchQuestions();
  }, [user, activeTab]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 20,
      };
      
      if (activeTab === 'pending') {
        params.approved = false;
      }
      
      const response = await api.get('/questions', { params });
      setQuestions(response.data.questions);
    } catch (error) {
      toast.error('Failed to fetch questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/questions/${id}/approve`);
      toast.success('Question approved');
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to approve question');
      console.error(error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      const pendingIds = questions.filter(q => !q.approved).map(q => q._id);
      
      if (pendingIds.length === 0) {
        toast.error('No pending questions to approve');
        return;
      }
      
      // In a real implementation, you would create a bulk approve endpoint
      // For now, we'll approve each question individually
      for (const id of pendingIds) {
        await api.post(`/questions/${id}/approve`);
      }
      
      toast.success(`${pendingIds.length} questions approved`);
      fetchQuestions();
    } catch (error) {
      toast.error('Failed to bulk approve questions');
      console.error(error);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <p>Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-2 font-medium ${
              activeTab === 'pending'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Pending Approval
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-2 font-medium ${
              activeTab === 'all'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-2 font-medium ${
              activeTab === 'import'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Bulk Import
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-2 font-medium ${
              activeTab === 'export'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Export Data
          </button>
        </nav>
      </div>
      
      {activeTab === 'pending' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Questions Pending Approval</h2>
            <button
              onClick={handleBulkApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
            >
              Bulk Approve All
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <p>Loading questions...</p>
            </div>
          ) : (
            <>
              {questions.length === 0 ? (
                <div className="text-center py-12">
                  <p>No questions pending approval</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.map((question) => (
                    <div key={question._id} className="bg-gray-800 p-6 rounded-lg">
                      <QuestionCard question={question} />
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleApprove(question._id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {activeTab === 'all' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">All Questions</h2>
          
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
                <div className="space-y-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {activeTab === 'import' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Bulk Import Questions</h2>
          <CSVUploader />
        </div>
      )}
      
      {activeTab === 'export' && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Export Data</h2>
          <div className="bg-gray-800 p-6 rounded-lg">
            <p className="mb-4">Export questions data in CSV or JSON format.</p>
            <div className="flex gap-4">
              <a
                href="/api/questions/export?format=csv"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Export as CSV
              </a>
              <a
                href="/api/questions/export?format=json"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
              >
                Export as JSON
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;