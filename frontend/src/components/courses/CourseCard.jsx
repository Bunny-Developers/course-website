const CourseCard = ({course, isAdmin = false, onEdit, onDelete}) => {
  return (
    <div className="bg-white rounded-1g shadow-md overflow-hidden hover:shadow-1g transition">
      {course.thumbnail_url && (
        <img
        src = {course.thumbnail_url}
        alt = {course.title}
        className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-indigo-600 font-bold">${course.price.toFixed(2)}</span>
          <span className="text-sm text-grey-500">By {course.instructor}</span>
        </div>
        {isAdmin && (
          <div className="my-4 flex space-x-2">
            <button
            onClick={onEdit}
            className="text-sm big-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button
            onClick={onDelete}
            className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CourseCard;