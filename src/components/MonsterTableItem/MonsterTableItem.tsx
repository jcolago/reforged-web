// src/components/MonsterTableItem/MonsterTableItem.tsx

import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TableRow, TableCell, Typography } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import { 
  MonsterState,
  removeMonster, 
  toggleMonsterDisplay 
} from '../../redux/reducers/monster.reducer';
import ButtonContained from '../../global/components/ButtonContained';

interface MonsterTableItemProps {
  monster: MonsterState;
}

const MonsterTableItem: React.FC<MonsterTableItemProps> = ({ monster }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This monster will be deleted.",
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'The monster has been removed',
          'success'
        );
        dispatch(removeMonster(monster.id));
      }
    });
  };

  return (
    <TableRow style={{border: "2px solid black"}}>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{monster.name}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{monster.size}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{monster.hit_points}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{monster.game_id}</Typography>
      </TableCell>
      <TableCell style={{textAlign: "center"}}>
        <ButtonContained
          width="55px"
          height="25px"
          onClick={() => navigate(`/monsterdetails/${monster.id}`)}
        >
          Details
        </ButtonContained>
        <ButtonContained
          width="55px"
          height="25px"
          backgroundColor="red" 
          color= "white"
          onClick={handleDelete}
        >
          Delete
        </ButtonContained>
        {!monster.displayed ? (
          <ButtonContained
            width="55px"
            height="25px"
            onClick={() => dispatch(toggleMonsterDisplay(monster.id))}
          >
            Display
          </ButtonContained>
        ) : (
          <ButtonContained
            height="25px"
            onClick={() => navigate("/gameview")}
          >
            Game View
          </ButtonContained>
        )}
      </TableCell>
    </TableRow>
  );
};

export default MonsterTableItem;