/**
 * Course card component
 * 
 * Environment Variables:
 * - None
 */

import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.name}</h3>
        <p className="text-gray-400 mb-4">{course.code}</p>
        <p className="text-gray-300 mb-4 line-clamp-3">{course.description}</p>
        <Link
          to={`/courses/${course._id}`}
          className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          View Questions
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;