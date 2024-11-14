// src/components/GameAccordion/GameAccordion.tsx
import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { Game } from '../../redux/reducers/game.reducer';
import { PlayerState } from '../../redux/reducers/player.reducer';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import PlayerEntryModal from '../PlayerEntryModal/PlayerEntryModal';
import ButtonContained from '../../global/components/ButtonContained';

interface GameAccordionProps {
  game: Game;
}

const GameAccordion: React.FC<GameAccordionProps> = ({ game }) => {
  const [expanded, setExpanded] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const players = useSelector((state: RootState) =>
    state.player.players.filter((player) => player.game_id === game.id)
  );
  console.log(players);

  return (
    <Accordion
      sx={{
        backgroundColor: 'rgb(226, 232, 243, .7)',
        margin: '8px 0',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      }}
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
    >
      <AccordionSummary
        expandIcon={
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path
              fill="currentColor"
              d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
            />
          </svg>
        }
      >
        <Typography
          variant="h6"
          sx={{
            color: '#2c3e50',
            fontWeight: 500,
          }}
        >
          {game.name}
        </Typography>
      </AccordionSummary>

      <AccordionDetails>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <ButtonContained
            title="Add Player"
            onClick={() => setModalOpen(true)}
          />
        </Box>
        {players.length > 0 ? (
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: 'transparent' }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(128, 150, 191, 0.3)',
                    }}
                  >
                    Player Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(128, 150, 191, 0.3)',
                    }}
                  >
                    Character
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(128, 150, 191, 0.3)',
                    }}
                  >
                    Class
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(128, 150, 191, 0.3)',
                    }}
                  >
                    Level
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player: PlayerState) => (
                  <TableRow
                    key={player.id}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'rgba(128, 150, 191, 0.1)',
                      },
                      '&:nth-of-type(even)': {
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.character}</TableCell>
                    <TableCell>{player.class}</TableCell>
                    <TableCell>{player.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography
            variant="body1"
            sx={{
              fontStyle: 'italic',
              color: '#666',
              textAlign: 'center',
              padding: '16px',
            }}
          >
            No players added to this game yet
          </Typography>
        )}
        <PlayerEntryModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          gameId={game.id}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default GameAccordion;
