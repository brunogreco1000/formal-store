interface LoaderProps {
  small?: boolean; 
}

const Loader: React.FC<LoaderProps> = ({ small }) => (
  <div className={`flex justify-center items-center ${small ? 'p-2' : 'p-8'}`}>
    <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
  </div>
);

export default Loader;
