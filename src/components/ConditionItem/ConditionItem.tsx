// src/components/ConditionItem/ConditionItem.tsx

import React from 'react';
import ConditionItemSingle from '../ConditionItemSingle/ConditionItemSingle';
import { PlayerCondition } from '../../redux/reducers/player_condition.reducer';

interface ConditionItemProps {
  player: PlayerCondition;
}

const ConditionItem: React.FC<ConditionItemProps> = ({ player }) => {
  return (
    <div>
      <ConditionItemSingle 
        key={player.id} 
        condition={player}
      />
    </div>
  );
};

export default ConditionItem;