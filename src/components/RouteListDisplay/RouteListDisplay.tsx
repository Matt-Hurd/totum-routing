import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./RouteListDisplay.scss";
import { selectRouteData, updateBranch, updateBranches, deletePoint } from "../../store/routeSlice";
import { setBranchIndex, setPointIndex } from "../../store/selectionSlice";

const RouteListDisplay: React.FC = () => {
  const route = useSelector(selectRouteData);
  const dispatch = useDispatch();
  const [expandedBranchIndex, setExpandedBranchIndex] = useState<number | null>(null);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);

  if (!route) return null;

  const handleCheckboxChange = (bIndex: number, isChecked: boolean) => {
    const updatedBranch = { ...route.branches[bIndex], enabled: isChecked };
    dispatch(updateBranch({ branch: updatedBranch, index: bIndex }));
  };

  const handleRowClick = (bIndex: number) => {
    if (expandedBranchIndex === bIndex) {
      setExpandedBranchIndex(null);
    } else {
      setExpandedBranchIndex(bIndex);
    }
  };

  const handleSelect = (bIndex: number, pIndex: number) => {
    dispatch(setBranchIndex(bIndex));
    dispatch(setPointIndex(pIndex));
  };

  const handleDelete = (bIndex: number, pIndex: number) => {
    dispatch(deletePoint({ branchIndex: bIndex, pointIndex: pIndex }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedBranches = Array.from(route.branches);
    const [movedBranch] = reorderedBranches.splice(result.source.index, 1);
    reorderedBranches.splice(result.destination.index, 0, movedBranch);
    dispatch(updateBranches({ branches: reorderedBranches }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePointDragEnd = (branchIdx: number) => (result: any) => {
    if (!result.destination) return;

    const reorderedPoints = Array.from(route.branches[branchIdx].points);
    const [movedPoint] = reorderedPoints.splice(result.source.index, 1);
    reorderedPoints.splice(result.destination.index, 0, movedPoint);
    const updatedBranch = {
      ...route.branches[branchIdx],
      points: reorderedPoints,
    };
    dispatch(updateBranch({ branch: updatedBranch, index: branchIdx }));
  };

  return (
    <div className="routeList">
      <label>
        Enable Dragging
        <input type="checkbox" checked={isDraggingEnabled} onChange={(e) => setIsDraggingEnabled(e.target.checked)} />
      </label>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable-branches" key={route.branches.length}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {route.branches.map((branch, bIndex) => (
                <Draggable
                  key={branch.name}
                  draggableId={branch.name}
                  index={bIndex}
                  isDragDisabled={!isDraggingEnabled}
                >
                  {(provided) => (
                    <div
                      className="routeList__branch"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => handleRowClick(bIndex)}
                    >
                      <div className="routeList__branchName">
                        <input
                          type="checkbox"
                          checked={branch.enabled}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleCheckboxChange(bIndex, e.target.checked)}
                        />
                        <strong>{branch.name}</strong>
                      </div>

                      {expandedBranchIndex === bIndex && (
                        <DragDropContext onDragEnd={handlePointDragEnd(bIndex)}>
                          <Droppable droppableId={`branch-${bIndex}-points`} key={branch.points.length}>
                            {(provided) => (
                              <div
                                className="pointsList"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {branch.points.map((point, pointIndex) => (
                                  <Draggable
                                    key={`${branch.name}-${pointIndex}`}
                                    draggableId={`${branch.name}-${pointIndex}`}
                                    index={pointIndex}
                                  >
                                    {(provided) => (
                                      <div
                                        className="pointRow"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <span className="pointIndex">{pointIndex}</span>
                                        <span className="pointName">{route.things[point.thingId].name}</span>
                                        <div className="pointActions">
                                          <button onClick={() => handleSelect(bIndex, pointIndex)}>Select</button>
                                          <button onClick={() => handleDelete(bIndex, pointIndex)}>Delete</button>
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default RouteListDisplay;
