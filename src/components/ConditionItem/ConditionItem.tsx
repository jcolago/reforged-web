import React from 'react';
import { PlayerCondition } from '../../redux/reducers/player_condition.reducer';
import ConditionItemSingle from '../ConditionItemSingle/ConditionItemSingle';

interface ConditionItemProps {
  condition: PlayerCondition;
}

const ConditionItem: React.FC<ConditionItemProps> = ({ condition }) => {
  return <ConditionItemSingle condition={condition} />;
};

export default ConditionItem;
