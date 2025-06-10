
export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">📧 Postfully</div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              Support
            </button>
            <button className="text-gray-600 hover:text-gray-900 transition-colors">
              All Tools
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
