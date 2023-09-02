import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectRouteData } from "../../store/routeSlice";
import { selectThingVisibility, setThingVisibility, toggleHideThingsInBranch } from "../../store/thingVisibilitySlice";

const ThingVisibilityToggle: React.FC = () => {
  const dispatch = useDispatch();
  const route = useSelector(selectRouteData);
  const { thingVisibility, hideThingsInBranch } = useSelector(selectThingVisibility);
  const [unusedThingCounts, setUnusedThingCounts] = useState<Record<string, number>>({});

  const uniqueThingTypes = Array.from(new Set(Object.values(route.things).map((thing) => thing.type)));

  const handleCheckboxChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setThingVisibility({ type, visible: event.target.checked }));
  };

  // Create a set of thing IDs that are used in branches.
  const usedThingIds = useRef(new Set());
  useEffect(() => {
    const newUsedThingIds = new Set();
    route.branches.forEach((branch) => {
      branch.points.forEach((point) => {
        newUsedThingIds.add(point.thingId);
      });
    });
    usedThingIds.current = newUsedThingIds;
  }, [route]);

  useEffect(() => {
    const counts: Record<string, number> = {};

    uniqueThingTypes.forEach((type) => {
      counts[type] = Object.values(route.things).filter((thing) => {
        return thing.type === type && !usedThingIds.current.has(thing.uid);
      }).length;
    });

    // Only update the state if the counts actually changed
    const hasCountsChanged = Object.keys(counts).some((key) => counts[key] !== unusedThingCounts[key]);
    if (hasCountsChanged) {
      setUnusedThingCounts(counts);
    }
  }, [route, uniqueThingTypes, unusedThingCounts]);

  return (
    <div>
      <div className="hide-things-in-branches">
        <label>
          <input type="checkbox" checked={hideThingsInBranch} onChange={() => dispatch(toggleHideThingsInBranch())} />
          Hide Things in Branches
        </label>
      </div>
      <hr />
      <div className="thing-types" style={{ height: "100%", overflowY: "auto" }}>
        {uniqueThingTypes.map((type) => (
          <div key={type}>
            <label>
              <input type="checkbox" checked={thingVisibility[type]} onChange={handleCheckboxChange(type)} />[
              {unusedThingCounts[type]}] {type}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThingVisibilityToggle;
