import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TableRow, TableCell, Typography } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import { 
  PlayerState, 
  deletePlayer,
  togglePlayerDisplay 
} from '../../redux/reducers/player.reducer';
import ButtonContained from '../../global/components/ButtonContained';

interface PlayerTableItemProps {
  player: PlayerState;
}

const PlayerTableItem: React.FC<PlayerTableItemProps> = ({ player }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This character will be deleted.",
      icon: 'warning',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Deleted!',
          'The character has been removed',
          'success'
        );
        dispatch(deletePlayer(player.id));
      }
    });
  };

  const handleToggleDisplay = async () => {
    try {
      await dispatch(togglePlayerDisplay(player.id)).unwrap();
      if (!player.displayed) {
        navigate("/gameview");
      }
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to toggle player display status',
        icon: 'error'
      });
    }
  };

  return (
    <TableRow style={{border: "2px solid black"}}>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{player.name}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{player.character}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{player.level}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{player.class}</Typography>
      </TableCell>
      <TableCell style={{borderRight: "2px solid black"}}>
        <Typography>{player.game}</Typography>
      </TableCell>
      <TableCell style={{textAlign: "center"}}>
        <ButtonContained
          width="55px"
          height="25px"
          onClick={() => navigate(`/details/${player.id}`)}
        >
          Details
        </ButtonContained>
        <ButtonContained
          width="55px"
          height="25px"
          backgroundColor="red"
          color="white"
          onClick={handleDelete}
        >
          Delete
        </ButtonContained>
        <ButtonContained
          width="55px"
          height="25px"
          onClick={handleToggleDisplay}
        >
          {player.displayed ? 'Game View' : 'Display'}
        </ButtonContained>
      </TableCell>
    </TableRow>
  );
};

export default PlayerTableItem;