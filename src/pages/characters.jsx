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
  Checkbox,
  Tooltip,
  useDisclosure,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import avengerlogo from "../assets/avengers.svg";
import "../styles.css";
import api from "../services/api";
import { useEffect, useState } from "react";

export default function CharacterList() {
  const [characters, setCharacters] = useState([]);
  const [avengerOnly, setAvengerOnly] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [teams, setTeams] = useState([]);
  const [toAddTeam, setToAddTeam] = useState(null);
  const [toAddCharacter, setToAddCharacter] = useState(null);
  const loadCharacters = () => {
    api
      .get("/characters", {
        params: {
          name: searchValue,
          is_avenger: avengerOnly,
          skip: page * 100,
        },
      })
      .then((response) => {
        setCharacters(response.data);
      });
  };
  const loadTeams = () => {
    api
      .get("/teams", {
        params: {
          limit: -1,
        },
      })
      .then((response) => {
        setTeams(response.data);
      });
  };
  const addToTeam = () => {
    api
      .post(`/teams/${toAddTeam}/characters`, {
        character_id: toAddCharacter,
      })
      .then((response) => {
        loadTeams();
      });
  };

  const handleSearch = (event) => setSearchValue(event.target.value);

  const switchAvenger = (character) => {
    const isAvenger = !character.is_avenger;
    api
      .put(`/characters/${character.id}`, {
        ...character,
        is_avenger: isAvenger,
      })
      .then((response) => {
        loadCharacters(searchValue);
      });
  };

  const search = (searchValue) => {
    loadCharacters();
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadCharacters();
    loadTeams();
  }, [page, avengerOnly]);

  return (
    <>
      <InputGroup className="search-bar">
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
          onClick={() => {
            search(searchValue);
          }}
          ml="2"
          width={200}
        >
          Buscar
        </Button>
        <Checkbox
          size="lg"
          colorScheme="purple"
          ml="2"
          onChange={() => {
            setAvengerOnly(!avengerOnly);
          }}
        >
          <span style={{ color: "white" }}>Vingador?</span>
        </Checkbox>
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
            className={`page-button`}
            isDisabled={characters.length < 100}
            onClick={() => {
              if ((page >= 0) & (characters.length >= 100)) {
                setPage(page + 1);
              }
            }}
          />
        </div>

        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          {characters.map((character) => (
            <GridItem>
              <Card maxW="sm" className="card">
                <img
                  src={character.thumbnail}
                  alt={`Thumbnail of ${character.name}`}
                  className="thumbnail"
                />
                <CardBody>
                  <Stack mt="6" spacing="3" className="card-title">
                    <Heading size="md">{character.name}</Heading>
                    <Text overflow="hidden" noOfLines={7}>
                      {character.description}
                    </Text>
                  </Stack>
                </CardBody>

                <Divider />
                <CardFooter>
                  <ButtonGroup spacing="2">
                    <Tooltip
                      label={
                        character.is_avenger
                          ? "Membro dos Vingadores"
                          : "Não é membro dos Vingadores"
                      }
                    >
                      <Button
                        colorScheme={character.is_avenger ? "red" : "green"}
                        variant="solid"
                        leftIcon={
                          <img src={avengerlogo} className="avenger-logo" />
                        }
                        onClick={() => {
                          switchAvenger(character);
                        }}
                      >
                        {character.is_avenger ? "Remover" : "Adicionar"}
                      </Button>
                    </Tooltip>

                    <Button
                      leftIcon={<AddIcon />}
                      colorScheme="purple"
                      variant="solid"
                      onClick={() => {
                        setToAddCharacter(character.id);
                        onOpen();
                      }}
                    >
                      Adicionar à time
                    </Button>
                  </ButtonGroup>
                </CardFooter>
              </Card>
            </GridItem>
          ))}
        </Grid>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Adicionar ao time{toAddTeam}
            {toAddCharacter}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Select
              placeholder="Escolha um time"
              onChange={(event) => {
                setToAddTeam(event.target.value);
              }}
            >
              {teams.map((team) => (
                <option value={team.id}>{team.name}</option>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="purple"
              mr={3}
              onClick={() => {
                addToTeam();
                onClose();
              }}
            >
              Adicionar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
