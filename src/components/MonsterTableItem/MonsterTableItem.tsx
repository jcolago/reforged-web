import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { TableRow, TableCell, Box } from '@mui/material';
import { AppDispatch } from '../../redux/store';
import {
  MonsterState,
  removeMonster,
  toggleMonsterDisplay,
} from '../../redux/reducers/monster.reducer';
import ButtonContained from '../../global/components/ButtonContained';
import { tableStyles } from '../styles';

interface MonsterTableItemProps {
  monster: MonsterState;
}

const MonsterTableItem: React.FC<MonsterTableItemProps> = ({ monster }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This monster will be deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeMonster(monster.id))
          .unwrap()
          .then(() => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Monster has been removed.',
              icon: 'success',
              timer: 1500,
            });
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete monster.',
              icon: 'error',
            });
          });
      }
    });
  };

  const handleToggleDisplay = async () => {
    try {
      await dispatch(
        toggleMonsterDisplay({
          id: monster.id,
          displayed: !monster.displayed,
        })
      ).unwrap();

      if (!monster.displayed) {
        Swal.fire({
          title: 'Success!',
          text: 'Monster is now displayed in game view',
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
      <TableCell sx={tableStyles.cell}>{monster.name}</TableCell>
      <TableCell sx={tableStyles.cell}>{monster.size}</TableCell>
      <TableCell sx={tableStyles.cell}>{monster.hit_points}</TableCell>
      <TableCell sx={tableStyles.cell}>{monster.game_id}</TableCell>
      <TableCell sx={tableStyles.cell}>
        <Box display="flex" justifyContent="center" gap={1}>
          <ButtonContained
            onClick={() => navigate(`/monsterdetails/${monster.id}`)}
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

          {!monster.displayed ? (
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

export default MonsterTableItem;
