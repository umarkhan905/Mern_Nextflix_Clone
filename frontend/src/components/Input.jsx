const Input = ({ type, placeholder, id, label, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-300 block">
        {label}
      </label>
      <input
        type={type}
        id={id}
        className="w-full px-3 py-2 mt-1 border border-gray-700 rounded-md bg-transparent text-white focus:outline-none focus:ring"
        placeholder={placeholder}
        required
        {...props}
      />
    </div>
  );
};

export default Input;
