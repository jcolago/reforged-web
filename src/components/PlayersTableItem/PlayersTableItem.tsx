import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TableRow, TableCell, Box } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import {
  PlayerState,
  deletePlayer,
  togglePlayerDisplay,
} from '../../redux/reducers/player.reducer';
import ButtonContained from '../../global/components/ButtonContained';
import { tableStyles } from '../styles';

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
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePlayer(player.id))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Character has been removed.',
              icon: 'success',
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete character.',
              icon: 'error',
            });
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
    <TableRow hover>
      <TableCell sx={tableStyles.cell}>{player.name}</TableCell>
      <TableCell sx={tableStyles.cell}>{player.character}</TableCell>
      <TableCell sx={tableStyles.cell}>{player.level}</TableCell>
      <TableCell sx={tableStyles.cell}>{player.character_class}</TableCell>
      <TableCell sx={tableStyles.cell}>{player.game_id}</TableCell>
      <TableCell sx={tableStyles.cell}>
        <Box display="flex" justifyContent="center" gap={1}>
          <ButtonContained
            onClick={() => navigate(`/details/${player.id}`)}
            style={tableStyles.actionButton}
          >
            Details
          </ButtonContained>
          <ButtonContained
            onClick={handleDelete}
            style={{
              ...tableStyles.actionButton,
              backgroundColor: '#d32f2f',
              color: 'white',
            }}
            sx={{
              '&:hover': {
                backgroundColor: '#9a0007',
              },
            }}
          >
            Delete
          </ButtonContained>
          {!player.displayed ? (
            <ButtonContained
              onClick={handleToggleDisplay}
              style={tableStyles.actionButton}
            >
              Display
            </ButtonContained>
          ) : (
            <ButtonContained
              onClick={() => navigate('/gameview')}
              style={tableStyles.actionButton}
            >
              Game View
            </ButtonContained>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default PlayerTableItem;
