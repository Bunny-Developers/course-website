import {useState, useEffect, use } from 'react';
import axios from 'axios';
import {useAuth} from '../../context/AuthContext';
import CourseForm from '../../components/admin/CourseForm';
import CourseCard from '../../components/courses/CourseCard';

const CoursesManagement = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/courses', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
   if (user?.isadmin) {
     fetchCourses();
   }
  }, [user]);

  const handleCourseCreated = () => {
    setShowForm(false);
    // Refresh the courses list
    const fetchCourses = async () => {
      const response = await axios.get('/courses', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setCourses(response.data);
    };
    fetchCourses();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between items-center mb-8'>
        <h1 className="text-3xl font-bold text-gray-900">Management Courses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
          {showForm ? 'Cancel' : 'Create New Course'}
        </button>
      </div>
      {showForm && (
        <div className='bg-white p-6 rounded-lg shadow-md mb-8'>
          <h2 className="text-xl font-semibold mb-4">Create New Course</h2>
          <CourseForm onSuccess={handleCourseCreated} />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
           key={course._id} 
            course={course}
            isAdmin={true}
            onEdit={() => {/* Implement Edit*/}}
            onDelete={() => {/* Implement Delete */}}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesManagement;