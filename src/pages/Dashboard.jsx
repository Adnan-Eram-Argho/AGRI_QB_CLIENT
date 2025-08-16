/**
 * User dashboard page component
 * 
 * Environment Variables:
 * - None
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../services/api.js';
import QuestionCard from '../components/QuestionCard.jsx';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchUserQuestions();
  }, [user]);

  const fetchUserQuestions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/questions', {
        params: {
          uploadedBy: user._id,
          limit: 10,
        },
      });
      setQuestions(response.data.questions);
    } catch (error) {
      toast.error('Failed to fetch your questions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="text-center py-12">Loading user data...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400">Name</p>
            <p>{user.name}</p>
          </div>
          <div>
            <p className="text-gray-400">Email</p>
            <p>{user.email}</p>
          </div>
          {user.blood_group && (
            <div>
              <p className="text-gray-400">Blood Group</p>
              <p>{user.blood_group}</p>
            </div>
          )}
          {user.phone_number && (
            <div>
              <p className="text-gray-400">Phone Number</p>
              <p>{user.phone_number}</p>
            </div>
          )}
          {user.university_reg_no && (
            <div>
              <p className="text-gray-400">University Registration Number</p>
              <p>{user.university_reg_no}</p>
            </div>
          )}
          <div>
            <p className="text-gray-400">Role</p>
            <p className="capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Questions</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p>Loading your questions...</p>
          </div>
        ) : (
          <>
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <p>You haven't uploaded any questions yet.</p>
                <a href="/upload" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
                  Upload your first question
                </a>
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
    </div>
  );
};

export default Dashboard;