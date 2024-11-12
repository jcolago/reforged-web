import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container,  
  FormControl, 
  InputLabel, 
  CardHeader, 
  OutlinedInput, 
  Typography 
} from "@mui/material";
import { createGame } from '../../redux/reducers/game.reducer';
import type { RootState, AppDispatch } from '../../redux/store';
import GlobalCard from '../../global/components/GlobalCard';
import FormWrapper from '../../global/components/FormWrapper';
import ButtonContained from '../../global/components/ButtonContained';

interface Game {
  id: number;
  name: string;
  dm_id: number;
}

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // State for game creation
  const [gameName, setGameName] = useState<string>('');

  // Redux selectors with proper typing
  const games = useSelector((state: RootState) => state.game.games);
  const user = useSelector((state: RootState) => state.user.currentUser);
  console.log(user)
//   const gameStatus = useSelector((state: RootState) => state.game.status);

  // Handler for game creation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user?.id) {
      return;
    }

    const gameData = {
      name: gameName,
      dm_id: user.id
    };

    try {
      await dispatch(createGame(gameData));
      setGameName('');
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  if (!user) {
    return (
      <Typography variant="h6" color="error" align="center">
        Please log in to view this page
      </Typography>
    );
  }

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Typography 
          variant="h4" 
          style={{ textDecoration: "underline" }}
        >
          Welcome, {user.email}!
        </Typography>
      </div>

      <Container 
        style={{ 
          border: "2px double black",
          marginTop: "20px"
        }}
      >
        <div>
          <GlobalCard
            style={{ 
              margin: "5px", 
              marginTop: "20px", 
              backgroundColor: "rgb(226, 232, 243, .7)",
            }}
          >
            <div style={{ 
              display: "flex", 
              flexDirection: "row", 
              justifyContent: "space-around" 
            }}>
              <div>
                <CardHeader 
                  style={{ textDecoration: "underline" }} 
                  title="Create A Game"
                />

                <FormWrapper>
                  <form onSubmit={handleSubmit}>
                    <div style={{ margin: "5px" }}>
                      <FormControl>
                        <Typography>
                          <InputLabel>Enter Game Name</InputLabel>
                          <OutlinedInput 
                            style={{ width: "250px" }}
                            label="Enter Game Name"
                            onChange={(event) => setGameName(event.target.value)}
                            type="text"
                            placeholder="Game Name"
                            value={gameName}
                          />
                          <ButtonContained
                            title="Submit"
                            padding="5px"
                          />
                        </Typography>
                      </FormControl>
                    </div>
                  </form>
                </FormWrapper>
              </div>

              <div style={{ justifyContent: 'flex-end' }}>
                <Typography 
                  variant="h6" 
                  style={{ textDecoration: "underline" }}
                >
                  Your Games
                </Typography>
                {games.map((game: Game) => (
                  <Typography 
                    key={game.id}
                    variant="body1"
                  >
                    {game.name}
                  </Typography>
                ))}
              </div>
            </div>
          </GlobalCard>

          <GlobalCard
            style={{ 
              margin: "5px", 
              marginBottom: "20px", 
              backgroundColor: "rgb(226, 232, 243, .7)" 
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ margin: "5px" }}>
                <CardHeader 
                  style={{ textDecoration: "underline" }} 
                  title="Click To Navigate To An Entry Form or List" 
                />
                <ButtonContained
                  title="Player Entry Form"
                  padding="5px"
                  onClick={() => navigate('/playerinfo')}
                />
                <ButtonContained
                  title="Character List"
                  padding="5px"
                  onClick={() => navigate('/players')}
                />
                <ButtonContained
                  title="Monster Entry Form"
                  padding="5px"
                  onClick={() => navigate('/monsterentry')}
                />
              </div>
            </div>
          </GlobalCard>
        </div>
      </Container>
    </>
  );
};

export default UserDashboard;