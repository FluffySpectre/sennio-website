import "./TechTag.css";

// TechTag displays a used programming language or engine in a project
function TechTag(props) {
  return (
    <div className="TechTag" style={props.style}>
      <span>{props.techName}</span>
    </div>
  );
}

export default TechTag;
