import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
//import typeDefs from "./typeDefs.ts";
import { Character } from "./types.ts";
import { Episode } from "./types.ts";

// The GraphQL schema
const typeDefs = `#graphql
  type Character {
    id: ID!
    name: String!
    episode: [Episode!]!
  }

  type Episode {
    id: ID!
    name: String!
    characters: [Character!]!
  }

  type Query {
    character(id: ID!): Character #devuelve un personaje segun su id
    charactersByIds(ids: [ID!]!): [Character] #devuelve un array de personajes segun sus ids
  }
`;

const resolvers = {
  Query: {
    character: async(_: unknown, args: {id: string}): Promise<Character> => {
      try{
        const response = await fetch(`https://rickandmortyapi.com/api/character/${args.id}`);
        
        if(!response){
          throw new Error ("No se ha podido encontrar el personaje");
        } 
    
        const character = await response.json();

        await Promise.all(await character.episode.map(async (elem: string) => {
          const episodios = await fetch (elem);
          const episodio_real = await episodios.json();

          return {
            id: episodio_real.id,
            name: episodio_real.name,
            characters: episodio_real.character
          };
        }));
        
        return {
          id: character.id,
          name: character.name,
          episode: character.episode,
        };
    
      }catch(error){
        console.log(error);
        return error;
      }
      
    },
    //characterByIds  //importar cuando los haga xd
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers
});


const { url } = await startStandaloneServer(server);
console.log(`Server ready at ${url}`);