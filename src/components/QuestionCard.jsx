/**
 * Question card component
 * 
 * Environment Variables:
 * - None
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

const QuestionCard = ({ question }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);
  
  const isOwner = user && question.uploadedBy._id === user._id;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner && !question.approved;
  const canDelete = (isOwner && !question.approved) || isAdmin;
  
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    
    setDeleting(true);
    
    try {
      await api.delete(`/questions/${question._id}`);
      toast.success('Question deleted');
      // In a real app, you would update the state or refresh the list
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete question');
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{question.title}</h3>
        <div className="flex gap-2">
          {canEdit && (
            <Link
              to={`/questions/${question._id}/edit`}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
            >
              Edit
            </Link>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm disabled:opacity-50 transition"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <p className="whitespace-pre-line">{question.body}</p>
      </div>
      
      {question.images.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Images</h4>
          <div className="flex flex-wrap gap-2">
            {question.images.map((image, index) => (
              <a
                key={index}
                href={image}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={image}
                  alt={`Question image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              </a>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-2 py-1 bg-gray-700 rounded text-sm">
          {question.course_id.name} ({question.course_id.code})
        </span>
        <span className="px-2 py-1 bg-gray-700 rounded text-sm">
          {question.year}
        </span>
        <span className="px-2 py-1 bg-gray-700 rounded text-sm capitalize">
          {question.exam_type}
        </span>
        <span className="px-2 py-1 bg-gray-700 rounded text-sm capitalize">
          {question.question_type}
        </span>
        <span className={`px-2 py-1 rounded text-sm capitalize ${
          question.difficulty === 'easy' ? 'bg-green-700' :
          question.difficulty === 'medium' ? 'bg-yellow-700' : 'bg-red-700'
        }`}>
          {question.difficulty}
        </span>
        {!question.approved && (
          <span className="px-2 py-1 bg-orange-700 rounded text-sm">
            Pending Approval
          </span>
        )}
      </div>
      
      {question.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-blue-700 rounded text-sm">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="text-sm text-gray-400">
        Uploaded by {question.uploadedBy.name} on {new Date(question.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default QuestionCard;