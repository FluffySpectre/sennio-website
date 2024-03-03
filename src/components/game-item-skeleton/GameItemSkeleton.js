import "./GameItemSkeleton.css";

function GameItemSkeleton() {
  return (
    <div className="GameItemSkeleton">
      <div className="GameIconSkeleton Skeleton" />
      <span className="GameNameSkeleton Skeleton">&nbsp;</span>
    </div>
  );
}

export default GameItemSkeleton;
