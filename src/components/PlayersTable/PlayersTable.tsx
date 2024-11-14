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
import { tableStyles } from '../styles';

const PlayersTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const players = useSelector((state: RootState) => state.player.players);
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
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (players.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="textSecondary">
          No players found. Add some players to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={tableStyles.title}>
        Player Characters
      </Typography>
      <Paper sx={tableStyles.container}>
        <TableContainer component={Paper} sx={tableStyles.tableWrapper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.headerCell}>Player Name</TableCell>
                <TableCell sx={tableStyles.headerCell}>
                  Character Name
                </TableCell>
                <TableCell sx={tableStyles.headerCell}>Level</TableCell>
                <TableCell sx={tableStyles.headerCell}>Class</TableCell>
                <TableCell sx={tableStyles.headerCell}>Game</TableCell>
                <TableCell sx={tableStyles.headerCell}>Actions</TableCell>
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
    </Box>
  );
};

export default PlayersTable;
