import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableContainer,
  TableCell,
  Paper,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchPlayers } from '../../redux/reducers/player.reducer';
import PlayerTableItem from '../PlayersTableItem/PlayersTableItem';

const PlayersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => {
    console.log('Full Redux State:', state);
    console.log('Players State:', state.player);
    return state.player.players;
  });
  const status = useSelector((state: RootState) => state.player.status);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPlayers());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography color="error">Error: </Typography>
      </Box>
    );
  }

  if (!players.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Typography>No players found</Typography>
      </Box>
    );
  }

  return (
    <Paper
      style={{
        border: '2px double black',
        padding: '10px',
        margin: 'auto',
        backgroundColor: 'rgb(128, 150, 191, .5)',
        width: '90%',
      }}
    >
      <TableContainer
        style={{
          maxWidth: '90%',
          margin: 'auto',
          marginTop: '15px',
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: 'rgb(226, 232, 243, .7)',
        }}
      >
        <Table style={{ border: '2px solid black' }}>
          <TableHead style={{ border: '2px solid black' }}>
            <TableRow style={{ border: '2px solid black' }}>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  Player Name
                </Typography>
              </TableCell>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  Character Name
                </Typography>
              </TableCell>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  Character Level
                </Typography>
              </TableCell>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  Character Class
                </Typography>
              </TableCell>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>
                  Game Name
                </Typography>
              </TableCell>
              <TableCell
                style={{ border: '2px solid black', textAlign: 'center' }}
              >
                <Typography style={{ fontWeight: 'bold' }}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {players.map((player) => (
              <PlayerTableItem key={player.id} player={player} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlayersTable;
