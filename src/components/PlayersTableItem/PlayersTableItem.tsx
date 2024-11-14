import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TableRow, TableCell, Typography } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import {
  PlayerState,
  deletePlayer,
  togglePlayerDisplay,
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
      title: 'Are you sure?',
      text: 'This character will be deleted.',
      icon: 'warning',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlayer(player.id))
          .unwrap()
          .then(() => {
            Swal.fire('Deleted!', 'The character has been removed', 'success');
          })
          .catch((error) => {
            Swal.fire(
              'Error!',
              'Failed to delete character: ' + error,
              'error'
            );
          });
      }
    });
  };

  const handleToggleDisplay = async () => {
    try {
      await dispatch(
        togglePlayerDisplay({
          id: player.id,
          displayed: !player.displayed,
        })
      ).unwrap();

      if (!player.displayed) {
        Swal.fire({
          title: 'Success!',
          text: 'Character is now displayed in game view',
          icon: 'success',
          timer: 1500,
        });
      }
    } catch {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to toggle display status',
        icon: 'error',
      });
    }
  };

  return (
    <TableRow style={{ border: '2px solid black' }}>
      <TableCell style={{ borderRight: '2px solid black' }}>
        <Typography>{player.name}</Typography>
      </TableCell>
      <TableCell style={{ borderRight: '2px solid black' }}>
        <Typography>{player.character}</Typography>
      </TableCell>
      <TableCell style={{ borderRight: '2px solid black' }}>
        <Typography>{player.level}</Typography>
      </TableCell>
      <TableCell style={{ borderRight: '2px solid black' }}>
        <Typography>{player.class}</Typography>
      </TableCell>
      <TableCell style={{ borderRight: '2px solid black' }}>
        <Typography>{player.game_id}</Typography>
      </TableCell>
      <TableCell style={{ textAlign: 'center' }}>
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
        {!player.displayed ? (
          <ButtonContained
            width="55px"
            height="25px"
            onClick={handleToggleDisplay}
          >
            Display
          </ButtonContained>
        ) : (
          <ButtonContained height="25px" onClick={() => navigate('/gameview')}>
            Game View
          </ButtonContained>
        )}
      </TableCell>
    </TableRow>
  );
};

export default PlayerTableItem;
