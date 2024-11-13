// src/components/MonsterTable/MonsterTable.tsx

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
  Typography 
} from '@mui/material';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchMonsters, MonsterState } from '../../redux/reducers/monster.reducer';
import MonsterTableItem from '../MonsterTableItem/MonsterTableItem';

const MonsterTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const monsters = useSelector((state: RootState) => state.monster.monsters);

  useEffect(() => {
    dispatch(fetchMonsters());
  }, [dispatch]);

  return (
    <Paper style={{ 
      border: "2px double black", 
      padding: "10px", 
      margin: "auto", 
      backgroundColor: "rgb(128, 150, 191, .5)", 
      width: "90%"
    }}>
      <TableContainer style={{ 
        maxWidth: "90%", 
        margin: "auto", 
        marginTop: "15px", 
        marginBottom: "15px", 
        padding: "10px", 
        backgroundColor: "rgb(226, 232, 243, .7)"
      }}>
        <Table style={{ border: "2px solid black" }}>
          <TableHead style={{ border: "2px solid black" }}>
            <TableRow style={{ border: "2px solid black" }}>
              <TableCell style={{ border: "2px solid black", textAlign: "center" }}>
                <Typography style={{ fontWeight: "bold" }}>Monster Name</Typography>
              </TableCell>
              <TableCell style={{ border: "2px solid black", textAlign: "center" }}>
                <Typography style={{ fontWeight: "bold" }}>Size</Typography>
              </TableCell>
              <TableCell style={{ border: "2px solid black", textAlign: "center" }}>
                <Typography style={{ fontWeight: "bold" }}>Hit Points</Typography>
              </TableCell>
              <TableCell style={{ border: "2px solid black", textAlign: "center" }}>
                <Typography style={{ fontWeight: "bold" }}>Game Name</Typography>
              </TableCell>
              <TableCell style={{ border: "2px solid black", textAlign: "center" }}>
                <Typography style={{ fontWeight: "bold" }}>Actions</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monsters.map((monster: MonsterState) => (
              <MonsterTableItem 
                key={monster.id} 
                monster={monster}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MonsterTable;