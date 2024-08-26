const CustomButton = ({
  title = "",
  containerStyles = "",
  iconRight = null,
  type = "button",
  onClick,
  isComponent = false,
  Component = null,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`inline-flex items-center text-base ${containerStyles}`}
    >
      {title}
      {isComponent && Component && <Component />}
      {iconRight && <div className="ml-2">{iconRight}</div>}
    </button>
  );
};

export default CustomButton;
