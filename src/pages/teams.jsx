import {
  Card,
  CardBody,
  Stack,
  Heading,
  Text,
  Divider,
  CardFooter,
  ButtonGroup,
  Button,
  IconButton,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Input,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import {
  SearchIcon,
  AddIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

import avengerlogo from "../assets/avengers.svg";
import "../styles.css";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function TeamsList() {
  const [teams, setTeams] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const loadTeams = () => {
    api
      .get("/teams", {
        params: {
          name: searchValue,
          skip: page * 100,
        },
      })
      .then((response) => {
        setTeams(response.data);
      });
  };
  const removeFromTeam = (team, character) => {
    api
      .delete(`/teams/${team.id}/characters/${character.id}`)
      .then((response) => {
        loadTeams();
      });
  };

  const handleSearch = (event) => setSearchValue(event.target.value);

  const search = (searchValue) => {
    loadTeams();
  };

  useEffect(() => {
    loadTeams();
  }, [page]);

  return (
    <>
      <InputGroup className="search-bar">
        <InputLeftElement
          pointerEvents="none"
          children={<SearchIcon color="gray.300" />}
        />
        <Input
          type="text"
          placeholder="Pesquise"
          color="purple.500"
          colorScheme="green"
          onChange={handleSearch}
        />
        <Button
          colorScheme="purple"
          variant="solid"
          leftIcon={<SearchIcon />}
          onClick={() => {
            search(searchValue);
          }}
          ml="2"
        >
          Buscar
        </Button>
      </InputGroup>
      <div className="container">
        <div className="pagination">
          <IconButton
            icon={<ChevronLeftIcon />}
            colorScheme="purple"
            variant="outline"
            className={`page-button`}
            isDisabled={page === 0}
            onClick={() => {
              if (page > 0) {
                setPage(page - 1);
              }
            }}
          />
          <Heading className="page-number">{page + 1}</Heading>
          <IconButton
            icon={<ChevronRightIcon />}
            colorScheme="purple"
            variant="outline"
            className={`page-button `}
            isDisabled={teams.length < 100}
            onClick={() => {
              if ((page >= 0) & (teams.length >= 100)) {
                setPage(page + 1);
              }
            }}
          />
        </div>
        {teams.map((team) => (
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
            maxW="8xl"
            style={{ margin: "auto", marginTop: "20px" }}
          >
            <Stack>
              <CardBody>
                <Heading size="md">{team.name}</Heading>

                <Text py="2">{team.description}</Text>
              </CardBody>
              <CardFooter>
                {team.characters.length ? (
                  team.characters.map((character) => (
                    <Card>
                      <img
                        src={character.thumbnail}
                        alt={character.name}
                        style={{
                          width: "200px",
                          height: "250px",
                          objectFit: "cover",
                        }}
                      />
                      <Stack>
                        <Heading style={{ textAlign: "center" }} size="lg">
                          {character.name}
                        </Heading>
                        <Button
                          leftIcon={<DeleteIcon />}
                          colorScheme="red"
                          onClick={() => removeFromTeam(team, character)}
                        >
                          Remover
                        </Button>
                      </Stack>
                    </Card>
                  ))
                ) : (
                  <Text py="2">Nenhum personagem encontrado</Text>
                )}
              </CardFooter>
            </Stack>
          </Card>
        ))}
      </div>
    </>
  );
}
