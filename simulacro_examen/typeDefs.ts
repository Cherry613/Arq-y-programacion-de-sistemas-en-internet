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
    character(id:ID!): Character #devuelve un personaje segun su id
    charactersByIds(ids: [ID!]!): [Character] #devuelve un array de personajes segun sus ids
  }
`;

export default typeDefs;