import { Box, Heading, Link, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { GoMarkGithub } from 'react-icons/go';

const About = () => (
  <Box py="10%" px="20%">
    <Stack
      spacing="10"
      align="center"
      bg="green.600"
      color="white"
      p="10"
      h="20em"
      borderRadius="lg"
      boxShadow="xl"
    >
      <Heading as="h2" size="lg">
        Om prosjektet
      </Heading>
      <Text fontSize="md">
        Dette er en prototype laget for Trondheim kommune i forbindelse med bacheloroppgave i
        informatikk. Applikasjonen gir mulighet til å utforske bærekraftsmålene og finne
        sammenhenger og relasjoner til ulike perspektiver satt av Trondheim kommune. Dataen i
        applikasjonen er lagret og hentet fra en ontologi, som også definerer relasjonene mellom
        disse.
      </Text>
      <Link
        href="https://github.com/ntnu-informatikk-2021/SDG-ontology-visualizer"
        isExternal
        color="white"
        _hover={{ opacity: '75%' }}
      >
        <GoMarkGithub size="40" />
      </Link>
    </Stack>
  </Box>
);

export default About;
