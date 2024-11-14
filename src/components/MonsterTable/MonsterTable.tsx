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
import { fetchMonsters } from '../../redux/reducers/monster.reducer';
import MonsterTableItem from '../MonsterTableItem/MonsterTableItem';
import { tableStyles } from '../styles';

const MonsterTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const monsters = useSelector((state: RootState) => state.monster.monsters);
  const status = useSelector((state: RootState) => state.monster.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMonsters());
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

  if (monsters.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography variant="h6" color="textSecondary">
          No monsters found. Add some monsters to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={tableStyles.title}>
        Monster List
      </Typography>
      <Paper sx={tableStyles.container}>
        <TableContainer component={Paper} sx={tableStyles.tableWrapper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.headerCell}>Monster Name</TableCell>
                <TableCell sx={tableStyles.headerCell}>Size</TableCell>
                <TableCell sx={tableStyles.headerCell}>Hit Points</TableCell>
                <TableCell sx={tableStyles.headerCell}>Game</TableCell>
                <TableCell sx={tableStyles.headerCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monsters.map((monster) => (
                <MonsterTableItem key={monster.id} monster={monster} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default MonsterTable;
