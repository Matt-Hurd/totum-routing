import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectRouteData } from '../../store/routeSlice';
import { selectSelection, setLayer } from '../../store/selectionSlice';

const LayerToggle: React.FC = () => {
  const route = useSelector(selectRouteData);
  const selection = useSelector(selectSelection);
  const dispatch = useDispatch();

  // Guard clause in case route data is not yet available
  if (!route) return null;

  const handleLayerChange = (layerKey: string) => {
    dispatch(setLayer(layerKey));
  };

  return (
    <div>
      {Object.keys(route.game.layers).map((layerKey) => (
        <button
          key={layerKey}
          onClick={() => handleLayerChange(layerKey)}
          disabled={selection.layer === layerKey}
          style={selection.layer === layerKey ? { backgroundColor: 'red' } : {}}
        >
          {route.game.layers[layerKey].name}
        </button>
      ))}
    </div>
  );
};

export default LayerToggle;
