import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./RouteListDisplay.scss";
import { selectRouteData, updateBranch, updateBranches, deletePoint, addBranch } from "../../store/routeSlice";
import { setBranchIndex, setPointIndex } from "../../store/selectionSlice";
import { Icon } from "@blueprintjs/core";
import { Branch } from "../../models";

const RouteListDisplay: React.FC = () => {
  const route = useSelector(selectRouteData);
  const dispatch = useDispatch();
  const [expandedBranchIndex, setExpandedBranchIndex] = useState<number | null>(null);
  const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<number[]>([]);
  const [dragging, setDragging] = useState(false);
  const [editingBranchIndex, setEditingBranchIndex] = useState<number | null>(null);
  const [tempBranchName, setTempBranchName] = useState<string>("");

  const wasMultiSelectKeyUsed = (event: MouseEvent | KeyboardEvent) => event.shiftKey;

  const performAction = (pointIndex: number, event: MouseEvent | KeyboardEvent) => {
    if (expandedBranchIndex === null) return;

    if (wasMultiSelectKeyUsed(event)) {
      const firstSelected = selectedPoints[0];
      const lastSelected = selectedPoints[selectedPoints.length - 1];

      const first = Math.min(firstSelected, lastSelected, pointIndex);
      const last = Math.max(firstSelected, lastSelected, pointIndex);
      const size = last - first + 1;

      setSelectedPoints(Array.from(new Array(size), (_x, i) => i + first));
      return;
    }

    setSelectedPoints([pointIndex]);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onClick = (pointIndex: number, event: any) => {
    if (event.defaultPrevented) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    performAction(pointIndex, event);
  };

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
    setDragging(false);

    const currentPoints = Array.from(route.branches[branchIdx].points);
    const lastSelected = selectedPoints[selectedPoints.length - 1];
    const isMultiDrag = selectedPoints.length > 1;
    let destinationIndex = result.destination.index;

    if (isMultiDrag) {
      if (selectedPoints.includes(destinationIndex)) return;

      const pointsToMove = selectedPoints.map((idx) => currentPoints[idx]);

      if (destinationIndex > lastSelected) destinationIndex -= pointsToMove.length - 1;

      for (let i = selectedPoints.length - 1; i >= 0; i--) {
        currentPoints.splice(selectedPoints[i], 1);
      }

      currentPoints.splice(destinationIndex, 0, ...pointsToMove);

      setSelectedPoints([]);
    } else {
      const [movedPoint] = currentPoints.splice(result.source.index, 1);
      currentPoints.splice(destinationIndex, 0, movedPoint);
    }

    const updatedBranch = {
      ...route.branches[branchIdx],
      points: currentPoints,
    };
    dispatch(updateBranch({ branch: updatedBranch, index: branchIdx }));
  };

  const handleEditBranchName = (branchName: string, index: number) => {
    setEditingBranchIndex(index);
    setTempBranchName(branchName);
  };

  const handleSaveBranchName = (index: number) => {
    dispatch(updateBranch({ branch: { ...route.branches[index], name: tempBranchName }, index }));
    setEditingBranchIndex(null);
  };

  const handleAddBranch = () => {
    const newBranch = new Branch("New Branch");
    dispatch(addBranch(newBranch));
  };

  return (
    <div className="routeList no-select">
      <label>
        Enable Dragging
        <input type="checkbox" checked={isDraggingEnabled} onChange={(e) => setIsDraggingEnabled(e.target.checked)} />
      </label>
      <button onClick={handleAddBranch}>Add Branch</button>

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
                      onDoubleClick={() => handleSelect(bIndex, -1)}
                      onClick={() => handleRowClick(bIndex)}
                    >
                      <div className="routeList__branchName">
                        <input
                          type="checkbox"
                          checked={branch.enabled || false}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleCheckboxChange(bIndex, e.target.checked)}
                        />
                        {editingBranchIndex === bIndex ? (
                          <>
                            <input
                              value={tempBranchName}
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              onChange={(e) => setTempBranchName(e.target.value)}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSaveBranchName(bIndex);
                              }}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <strong>{branch.name}</strong>
                            <Icon
                              icon="edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditBranchName(branch.name, bIndex);
                              }}
                            />
                          </>
                        )}
                      </div>

                      {expandedBranchIndex === bIndex && (
                        <DragDropContext onDragStart={() => setDragging(true)} onDragEnd={handlePointDragEnd(bIndex)}>
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
                                    {(provided, snapshot) => (
                                      <div
                                        className={`pointRow ${selectedPoints.includes(pointIndex) ? "selected" : ""} ${
                                          dragging && selectedPoints.includes(pointIndex) ? "dragging" : ""
                                        }`}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        onClick={(e) => onClick(pointIndex, e)}
                                      >
                                        {snapshot.isDragging && (
                                          <span className="drag-count">{selectedPoints.length}</span>
                                        )}
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
