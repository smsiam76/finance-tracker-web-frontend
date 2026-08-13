
const Button = ({text, className, onClick, ...props}) => {
    return (
        <button 
        onClick={onClick}
        {...props}
        className={`bg-primary border-2 text-white px-6 py-3 font-semibold rounded-md hover:bg-base-100 hover:border-primary/40 hover:text-primary transition-all duration-300 ease-in-out cursor-pointer shadow ${className}`}>
            {text}
        </button>
    );
};

export default Button;